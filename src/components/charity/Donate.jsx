import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import QRCode from "qrcode";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { CONFIG, fmt, upiLink, upiAppLink } from "@/lib/charityConfig";

const noteFor = (frequency) =>
  frequency === "monthly" ? `Monthly donation to ${CONFIG.orgName}` : `Donation to ${CONFIG.orgName}`;

// iOS UPI apps with their own URL schemes (the generic upi:// scheme doesn't work on iOS).
const IOS_UPI_APPS = [
  { id: "gpay", label: "Google Pay", store: "https://apps.apple.com/in/app/google-pay-save-pay-manage/id1193357041" },
  { id: "phonepe", label: "PhonePe", store: "https://apps.apple.com/in/app/phonepe-upi-payments-recharge/id1170055821" },
  { id: "paytm", label: "Paytm", store: "https://apps.apple.com/in/app/paytm-secure-upi-payments/id473941634" },
  { id: "bhim", label: "BHIM", store: "https://apps.apple.com/in/app/bhim-bharats-own-payments-app/id1200315258" },
];

export default function Donate() {
  const { toast } = useToast();
  const [amount, setAmountState] = useState(CONFIG.defaultAmount);
  const [frequency, setFrequency] = useState("one_time");
  const [copied, setCopied] = useState(false);
  const [modalCopied, setModalCopied] = useState(false);
  const [showPay, setShowPay] = useState(false);
  const [qrUrl, setQrUrl] = useState("");
  const [qrError, setQrError] = useState(false);
  const inputRef = useRef(null);
  const [payMethod, setPayMethod] = useState(() => (CONFIG.razorpay?.keyId ? "razorpay" : "upi"));
  const [rzpLoading, setRzpLoading] = useState(false);
  const [paid, setPaid] = useState(false);
  const [iosFailedApp, setIosFailedApp] = useState(null);

  const [donorName, setDonorName] = useState("");
  const [donorMsg, setDonorMsg] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [thankYou, setThankYou] = useState("");
  const [deepLinkHint, setDeepLinkHint] = useState(false);
  // upi:// deep links only work on Android. iOS has no UPI intent support, and
  // desktop has no UPI app — so the QR + copy-UPI-ID path must always be available.
  const { isAndroid, isIOS, isMobile } = useMemo(() => {
    const ua = (typeof navigator !== "undefined" ? navigator.userAgent : "") || "";
    return {
      isAndroid: /Android/i.test(ua),
      isIOS: /iPhone|iPad|iPod/i.test(ua),
      isMobile: /Android|iPhone|iPad|iPod/i.test(ua),
    };
  }, []);

  const queryClient = useQueryClient();
  const createDonation = useMutation({
    mutationFn: (payload) => base44.entities.Donation.create(payload),
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: ["donations"] });
      const previous = queryClient.getQueryData(["donations"]);
      const optimistic = {
        ...payload,
        id: `temp-${Date.now()}`,
        created_date: new Date().toISOString(),
      };
      queryClient.setQueryData(["donations"], (old) => [optimistic, ...(old || [])]);
      return { previous };
    },
    onError: (_err, _payload, context) => {
      if (context?.previous) queryClient.setQueryData(["donations"], context.previous);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["donations"] });
    },
  });

  const matchLabel = CONFIG.presets.find((p) => p.amount === amount)?.label || "";

  const setAmount = useCallback((val, fromInput) => {
    setAmountState(val);
    setThankYou("");
    if (!fromInput && inputRef.current) inputRef.current.value = val > 0 ? val : "";
  }, []);

  const changeFrequency = (f) => {
    setFrequency(f);
    setThankYou("");
  };

  useEffect(() => {
    window.__setDonateAmount = setAmount;
    return () => { delete window.__setDonateAmount; };
  }, [setAmount]);

  useEffect(() => {
    let active = true;
    QRCode.toDataURL(upiLink(amount, noteFor(frequency)), {
      width: 300,
      margin: 2,
      errorCorrectionLevel: "M",
    })
      .then((url) => { if (active) { setQrUrl(url); setQrError(false); } })
      .catch(() => { if (active) { setQrUrl(""); setQrError(true); } });
    return () => { active = false; };
  }, [amount, frequency]);

  const copyUpi = (setter) => {
    const val = CONFIG.upiId;
    const done = () => { setter(true); setTimeout(() => setter(false), 1800); };
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(val).then(done).catch(() => {});
    } else {
      const t = document.createElement("textarea");
      t.value = val;
      document.body.appendChild(t);
      t.select();
      try { document.execCommand("copy"); } catch {}
      document.body.removeChild(t);
      done();
    }
  };

  const handlePay = (e) => {
    if (!amount) { e.preventDefault(); return; }
    e.preventDefault();
    setShowPay(true);
  };

  const methods = useMemo(() => [
    "upi",
    ...(CONFIG.razorpay?.keyId ? ["razorpay"] : []),
  ], []);
  const effectiveMethod = methods.includes(payMethod) ? payMethod : "upi";

  // Load Razorpay Checkout SDK once.
  useEffect(() => {
    if (!CONFIG.razorpay?.keyId) return;
    if (document.querySelector('script[data-rzp-checkout]')) return;
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.async = true;
    s.setAttribute("data-rzp-checkout", "1");
    document.body.appendChild(s);
  }, []);

  const triggerRazorpay = async () => {
    if (!CONFIG.razorpay?.keyId) {
      toast({ title: "Razorpay not configured yet", description: "Add your Razorpay key in config.", variant: "destructive" });
      return;
    }
    if (!window.Razorpay) {
      toast({ title: "Payment gateway loading…", description: "Please try again in a moment.", variant: "destructive" });
      return;
    }
    try {
      setRzpLoading(true);
      const res = await base44.functions.invoke("createRazorpayOrder", { amount });
      const orderId = res?.data?.order_id;
      if (!orderId) throw new Error("No order id returned");
      const rzp = new window.Razorpay({
        key: CONFIG.razorpay.keyId,
        amount: (amount || 0) * 100,
        currency: "INR",
        name: CONFIG.orgName,
        description: frequency === "monthly" ? "Monthly donation" : "Donation",
        order_id: orderId,
        prefill: { name: anonymous ? "" : donorName },
        notes: { frequency, source: "rtsf_app" },
        theme: { color: "#0f5132" },
        handler: () => {
          toast({ title: "Payment successful 🙏", description: `₹${fmt(amount)} received via Razorpay.` });
          recordDonation();
        },
      });
      rzp.open();
    } catch (err) {
      toast({ title: "Could not start Razorpay", description: "Please try again or use UPI.", variant: "destructive" });
    } finally {
      setRzpLoading(false);
    }
  };

  // Only called from the Razorpay success handler — i.e. after a verified payment.
  const recordDonation = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const name = anonymous ? "Anonymous" : (donorName.trim() || "Anonymous");
      const payload = {
        donor_name: name,
        amount,
        frequency,
        message: donorMsg.trim(),
        is_anonymous: anonymous,
      };
      await createDonation.mutateAsync(payload);
      const who = anonymous ? "" : donorName.trim();
      setThankYou(
        `Thank you${who ? `, ${who}` : ""}! 🙏 Your ${frequency === "monthly" ? "monthly " : ""}gift of ₹${fmt(amount)} brings hot meals, medicine and dignity to our elders. The joy you've given will return to you many times over.`
      );
      setPaid(true);
      toast({
        title: "Thank you for your gift! 🙏",
        description: `₹${fmt(amount)} ${frequency === "monthly" ? "monthly " : ""}added to our donor wall.`,
      });
      base44.entities.Notification.create({
        title: "A new donor joined our family 🙏",
        body: `Someone just contributed ₹${fmt(amount)} to our elders — thank you for spreading the word.`,
        type: "donation",
      }).catch(() => {});
    } catch (err) {
      toast({
        title: "Payment succeeded but we couldn't save your wall entry",
        description: "Please contact us so we can add you manually.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="section donate" id="donate">
      <div className="wrap donate__grid">
        <div className="donate__intro" data-reveal="">
          <span className="kicker kicker--light">Give in 30 seconds</span>
          <h2>Send your gift <em>directly</em> to the home</h2>
          <p>
            We use <strong>UPI</strong> so your money lands <strong>instantly and directly</strong> in the foundation's bank account — no fees, no middle-man, 100% reaches the elders.
          </p>
          <ul className="donate__assure" role="list">
            <li>
              <svg viewBox="0 0 24 24" className="i"><path d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="9" /></svg>
              Instant &amp; direct bank-to-bank
            </li>
            <li>
              <svg viewBox="0 0 24 24" className="i"><path d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="9" /></svg>
              No platform or processing fees
            </li>
            <li>
              <svg viewBox="0 0 24 24" className="i"><path d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="9" /></svg>
              One-time or monthly — your choice
            </li>
          </ul>
          <p className="donate__call">
            Prefer to talk first? Call or WhatsApp{" "}
            <a href={`tel:${CONFIG.phone}`} className="link-strong">{CONFIG.phone}</a>
          </p>

          <div className="campaign">
            <span className="kicker kicker--light">Our big mission</span>
            <h3>{CONFIG.campaign.title}</h3>
            <p>{CONFIG.campaign.body}</p>
            <button type="button" className="btn btn--ghost btn--sm" onClick={() => setAmount(CONFIG.campaign.sqFtPrice)}>
              {CONFIG.campaign.cta} — ₹{fmt(CONFIG.campaign.sqFtPrice)} →
            </button>
          </div>
        </div>

        <div className="card donate__card" data-reveal="">
          <h3 className="card__title">Choose your gift</h3>

          <div className="seg" role="group" aria-label="Donation frequency">
            <button type="button" className={frequency === "one_time" ? "is-active" : ""} onClick={() => changeFrequency("one_time")}>One-time</button>
            <button type="button" className={frequency === "monthly" ? "is-active" : ""} onClick={() => changeFrequency("monthly")}>Monthly</button>
          </div>

          <div className="amount-grid" role="group" aria-label="Choose an amount">
            {CONFIG.presets.map((p) => (
              <button
                key={p.amount}
                className={`amount-btn ${amount === p.amount ? "is-active" : ""}`}
                type="button"
                onClick={() => setAmount(p.amount)}
              >
                <span className="amount-btn__amt">₹{fmt(p.amount)}</span>
                <span className="amount-btn__lbl">{p.label}</span>
              </button>
            ))}
          </div>

          <label className="custom-amount" htmlFor="customAmount">
            <span>Or enter your own amount</span>
            <div className="custom-amount__field">
              <span className="rupee">₹</span>
              <input
                ref={inputRef}
                id="customAmount"
                type="number"
                inputMode="numeric"
                min="1"
                step="1"
                placeholder="Amount"
                defaultValue={CONFIG.defaultAmount}
                onChange={(e) => {
                  const v = parseInt(e.target.value, 10);
                  setAmount(isNaN(v) ? 0 : v, true);
                }}
              />
            </div>
          </label>
          <p className="amount-note">
            {matchLabel ? `✨ ${matchLabel}` : amount > 0 ? "Thank you for your generosity ❤️" : ""}
          </p>

          {methods.length > 1 && (
            <div className="seg" role="group" aria-label="Payment method" style={{ marginBottom: "1rem" }}>
              {methods.map((m) => (
                <button key={m} type="button" className={effectiveMethod === m ? "is-active" : ""} onClick={() => setPayMethod(m)}>
                  {m === "upi" ? "UPI" : "Razorpay"}
                </button>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={effectiveMethod === "upi" ? handlePay : triggerRazorpay}
            className={`btn btn--primary btn--lg btn--block ${!amount || rzpLoading ? "is-disabled" : ""}`}
            disabled={!amount || rzpLoading}
          >
            {rzpLoading
              ? "Starting secure checkout…"
              : effectiveMethod === "upi"
              ? `${frequency === "monthly" ? "Set up " : "Pay "}₹${fmt(amount || 0)}${frequency === "monthly" ? " / month" : ""} via UPI`
              : `Donate ₹${fmt(amount || 0)} via Razorpay`}
          </button>
          <p className="hint">
            {effectiveMethod === "upi"
              ? "Tap pay to show a QR you can scan with any UPI app, or open the UPI app directly."
              : "Razorpay opens a secure checkout — pay by card, UPI, netbanking or wallet. Works on iPhone."}
          </p>
          {frequency === "monthly" && effectiveMethod === "upi" && (
            <p className="hint" style={{ color: "var(--green-600)", fontWeight: 600 }}>
              Monthly giving: approve a recurring UPI mandate in your app so your support reaches our elders every month. 🙏
            </p>
          )}
          {frequency === "monthly" && effectiveMethod !== "upi" && (
            <p className="hint" style={{ color: "var(--ink-soft)" }}>
              Note: this gateway processes a one-time payment. For monthly giving, use UPI and approve a recurring mandate.
            </p>
          )}

          {thankYou && <div className="thanks-box" role="status">{thankYou}</div>}

          <div className="recog">
            <h4>Your details for our donor wall</h4>
            <p>
              {effectiveMethod === "razorpay"
                ? "Enter your name — we'll add it to the donor wall automatically once your Razorpay payment is confirmed."
                : "Enter your name. For UPI, our team adds you to the donor wall after manually confirming your transfer."}
            </p>
            <label className="field">
              <input type="text" placeholder="Your name" value={donorName} onChange={(e) => setDonorName(e.target.value)} disabled={anonymous || paid} maxLength={60} />
            </label>
            <label className="field">
              <textarea rows={2} placeholder="A message for the elders (optional)" value={donorMsg} onChange={(e) => setDonorMsg(e.target.value)} maxLength={160} />
            </label>
            <div className="recog__row">
              <input type="checkbox" id="anon" checked={anonymous} onChange={(e) => setAnonymous(e.target.checked)} disabled={paid} />
              <label htmlFor="anon">Donate anonymously</label>
            </div>
            {paid && (
              <p className="hint" style={{ color: "var(--green-600)", fontWeight: 600 }}>
                ✓ Payment confirmed — your name is on the donor wall. Thank you! 🙏
              </p>
            )}
          </div>

          <div className="qr-block">
            <div className="qr-block__code" aria-label="UPI QR code">
              {qrUrl ? (
                <img src={qrUrl} alt="UPI QR code" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
              ) : (
                <span style={{ fontSize: "0.76rem", color: "#55604f" }}>{qrError ? "QR unavailable — copy the UPI ID →" : "Generating…"}</span>
              )}
            </div>
            <div className="qr-block__copy">
              <p className="qr-block__lead">On a laptop? <strong>Scan to pay</strong> with any UPI app.</p>
              <button className="copy-row" type="button" onClick={() => copyUpi(setCopied)}>
                <span className="copy-row__label">UPI ID</span>
                <span className="copy-row__value">{CONFIG.upiId}</span>
                <span className="copy-row__btn" aria-hidden="true">Copy</span>
              </button>
              {copied && <p className="copied">Copied ✓</p>}
            </div>
          </div>

          {CONFIG.cardDonateUrl && (
            <a className="btn btn--ghost btn--block" href={CONFIG.cardDonateUrl} target="_blank" rel="noopener">
              Donate by debit / credit card
            </a>
          )}

          {CONFIG.bank.accountNumber && CONFIG.bank.ifsc && (
            <div className="bank">
              <p className="bank__title">Bank transfer (NEFT / IMPS) — {CONFIG.bank.bankName}</p>
              <dl className="bank__list">
                {[
                  ["Account name", CONFIG.bank.accountName],
                  ["Account no.", CONFIG.bank.accountNumber],
                  ["IFSC", CONFIG.bank.ifsc],
                  ["Bank", CONFIG.bank.bankName],
                  ["Branch", CONFIG.bank.branch],
                ].filter(([, v]) => v).map(([k, v]) => (
                  <React.Fragment key={k}>
                    <dt>{k}</dt>
                    <dd>{v}</dd>
                  </React.Fragment>
                ))}
              </dl>
            </div>
          )}

          <p className="card__foot">{CONFIG.taxExemption}<br />A receipt can be issued on request. Thank you for serving with us. 🙏</p>
        </div>
      </div>

      <Dialog open={showPay} onOpenChange={setShowPay}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>
              {frequency === "monthly" ? "Set up" : "Pay"} ₹{fmt(amount || 0)}{frequency === "monthly" ? " / month" : ""} via UPI
            </DialogTitle>
            <DialogDescription>
              Scan this code with any UPI app{isAndroid ? " — or tap the button below to open your UPI app" : ""} to complete your {frequency === "monthly" ? "monthly " : ""}donation.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-2">
            <div
              className="rounded-xl border p-2 bg-white"
              style={{ width: 240, height: 240, display: "grid", placeItems: "center" }}
              aria-label="UPI QR code"
            >
              {qrUrl ? (
                <img src={qrUrl} alt="UPI QR code" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
              ) : (
                <span style={{ fontSize: "0.8rem", color: "#55604f" }}>{qrError ? "QR unavailable — copy the UPI ID below" : "Generating…"}</span>
              )}
            </div>
            <p className="text-xs text-center" style={{ color: "var(--ink-soft)", maxWidth: 280 }}>
              {isMobile
                ? "Open your UPI app (Google Pay, PhonePe, Paytm) and scan this code."
                : "Use your phone's UPI app to scan this code."}
            </p>
            <button type="button" onClick={() => copyUpi(setModalCopied)} className="copy-row" style={{ width: "100%" }}>
              <span className="copy-row__label">UPI ID</span>
              <span className="copy-row__value">{CONFIG.upiId}</span>
              <span className="copy-row__btn" aria-hidden="true">Copy</span>
            </button>
            {modalCopied && <p className="copied text-center">Copied ✓ — paste it into your UPI app</p>}
            {isAndroid && (
              <>
                <a
                  className="btn btn--primary btn--block"
                  href={upiLink(amount, noteFor(frequency))}
                  onClick={() => {
                    setDeepLinkHint(false);
                    setTimeout(() => {
                      if (document.visibilityState !== "hidden") setDeepLinkHint(true);
                    }, 2000);
                  }}
                >
                  Open in UPI app <span aria-hidden="true">→</span>
                </a>
                {deepLinkHint && (
                  <p className="text-xs text-center" style={{ color: "var(--ink-soft)" }}>
                    Didn't open? Copy the UPI ID above and paste it in your UPI app manually.
                  </p>
                )}
              </>
            )}
            {isIOS && (
              <div className="flex flex-col gap-2 w-full">
                <p className="text-xs text-center" style={{ color: "var(--ink-soft)" }}>
                  Open your UPI app with the details filled in:
                </p>
                {IOS_UPI_APPS.map((app) => (
                  <a
                    key={app.id}
                    className="btn btn--primary btn--block"
                    href={upiAppLink(app.id, amount, noteFor(frequency))}
                    onClick={() => {
                      setIosFailedApp(null);
                      setTimeout(() => {
                        if (document.visibilityState !== "hidden") setIosFailedApp(app.id);
                      }, 2000);
                    }}
                  >
                    Open in {app.label} <span aria-hidden="true">→</span>
                  </a>
                ))}
                {iosFailedApp && (
                  <p className="text-xs text-center" style={{ color: "var(--ink-soft)" }}>
                    Didn't open {IOS_UPI_APPS.find((a) => a.id === iosFailedApp)?.label}?{" "}
                    <a
                      href={IOS_UPI_APPS.find((a) => a.id === iosFailedApp)?.store}
                      target="_blank"
                      rel="noopener"
                      style={{ color: "var(--green-600)", fontWeight: 700 }}
                    >
                      Install it from the App Store
                    </a>{" "}
                    — or scan the QR / copy the UPI ID above.
                  </p>
                )}
              </div>
            )}
            {CONFIG.cardDonateUrl && (
              <a className="btn btn--ghost btn--block" href={CONFIG.cardDonateUrl} target="_blank" rel="noopener">
                Donate by debit / credit card
              </a>
            )}
            <p className="text-xs text-center text-[var(--ink-soft)]">
              Or send directly to <strong>{CONFIG.upiId}</strong> from your banking app.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}