import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import QRCode from "qrcode";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { CONFIG, fmt, upiLink, upiAppLink } from "@/lib/charityConfig";
import BankTransferPanel from "@/components/charity/BankTransferPanel";
import PayPalPanel from "@/components/charity/PayPalPanel";
import PaymentClaimForm from "@/components/charity/PaymentClaimForm";

const noteFor = (frequency) =>
  frequency === "monthly" ? `Monthly donation to ${CONFIG.orgName}` : `Donation to ${CONFIG.orgName}`;

const PAY_APPS = [
  { id: "gpay", label: "GPay", store: "https://apps.apple.com/in/app/google-pay-save-pay-manage/id1193357041" },
  { id: "phonepe", label: "PhonePe", store: "https://apps.apple.com/in/app/phonepe-upi-payments-recharge/id1170055821" },
  { id: "paytm", label: "Paytm", store: "https://apps.apple.com/in/app/paytm-secure-upi-payments/id473941634" },
];

// UPI app deep links are blocked by GPay/PhonePe/Paytm for this account, so UPI is
// offered only as scan-the-QR / copy-the-UPI-ID, which works in every UPI app.
const METHODS = ["phonepe", "gpay", "paytm", "paypal", "bank"];
const METHOD_LABELS = {
  upi: "UPI (PhonePe / Google Pay / Paytm)",
  gpay: "Google Pay",
  phonepe: "PhonePe",
  paytm: "Paytm",
  paypal: "Card / PayPal / Venmo",
  bank: "Bank transfer",
};
const isAppMethod = (m) => ["gpay", "phonepe", "paytm"].includes(m);

export default function Donate() {
  const [amount, setAmountState] = useState(CONFIG.defaultAmount);
  const [frequency, setFrequency] = useState("one_time");
  const [copied, setCopied] = useState(false);
  const [modalCopied, setModalCopied] = useState(false);
  const [showPay, setShowPay] = useState(false);
  const [qrUrl, setQrUrl] = useState("");
  const [qrError, setQrError] = useState(false);
  const inputRef = useRef(null);
  const [payMethod, setPayMethod] = useState("phonepe");
  const [iosFailedApp, setIosFailedApp] = useState(null);

  const { isAndroid, isMobile } = useMemo(() => {
    const ua = (typeof navigator !== "undefined" ? navigator.userAgent : "") || "";
    return {
      isAndroid: /Android/i.test(ua),
      isMobile: /Android|iPhone|iPad|iPod/i.test(ua),
    };
  }, []);

  const matchLabel = CONFIG.presets.find((p) => p.amount === amount)?.label || "";

  const setAmount = useCallback((val, fromInput) => {
    setAmountState(val);
    if (!fromInput && inputRef.current) inputRef.current.value = val > 0 ? val : "";
  }, []);

  useEffect(() => {
    window.__setDonateAmount = setAmount;
    return () => { delete window.__setDonateAmount; };
  }, [setAmount]);

  useEffect(() => {
    let active = true;
    QRCode.toDataURL(upiLink(amount, noteFor(frequency)), { width: 300, margin: 2, errorCorrectionLevel: "M" })
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

  const watchAppOpen = (appId) => {
    setIosFailedApp(null);
    setTimeout(() => {
      // Android's "Pay with…" chooser takes focus without hiding the page.
      if (document.visibilityState !== "hidden" && document.hasFocus()) {
        setIosFailedApp(appId);
        setShowPay(true);
      }
    }, 2000);
  };

  const method = payMethod;

  return (
    <section className="section donate" id="donate">
      <div className="wrap donate__grid">
        <div className="donate__intro" data-reveal="">
          <span className="kicker kicker--light">Give in 30 seconds</span>
          <h2>Send your gift <em>directly</em> to the home</h2>
          <p>
            We use <strong>UPI (PhonePe, Google Pay, Paytm)</strong> so your money lands <strong>instantly and directly</strong> in the foundation's bank account — no fees, no middle-man, 100% reaches the elders. Giving from abroad? Use <strong>PayPal</strong>.
          </p>
          <ul className="donate__assure" role="list">
            <li><svg viewBox="0 0 24 24" className="i"><path d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="9" /></svg>Instant &amp; direct bank-to-bank</li>
            <li><svg viewBox="0 0 24 24" className="i"><path d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="9" /></svg>PayPal wallet, Venmo &amp; cards for international donors</li>
            <li><svg viewBox="0 0 24 24" className="i"><path d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="9" /></svg>One-time or monthly — your choice</li>
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

        <div className="card donate__card">
          <h3 className="card__title">Choose your gift</h3>

          <div className="seg" role="group" aria-label="Donation frequency">
            <button type="button" className={frequency === "one_time" ? "is-active" : ""} onClick={() => setFrequency("one_time")}>One-time</button>
            <button type="button" className={frequency === "monthly" ? "is-active" : ""} onClick={() => setFrequency("monthly")}>Monthly</button>
          </div>

          <div className="amount-grid" role="group" aria-label="Choose an amount">
            {CONFIG.presets.map((p) => (
              <button key={p.amount} className={`amount-btn ${amount === p.amount ? "is-active" : ""}`} type="button" onClick={() => setAmount(p.amount)}>
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

          <div className="seg seg--wrap" role="group" aria-label="Payment method" style={{ marginBottom: "1rem" }}>
            {METHODS.map((m) => (
              <button key={m} type="button" className={method === m ? "is-active" : ""} onClick={() => setPayMethod(m)}>
                {METHOD_LABELS[m]}
              </button>
            ))}
          </div>

          {method === "bank" ? (
            <BankTransferPanel amount={amount} donorName="" />
          ) : method === "paypal" ? (
            <PayPalPanel />
          ) : isAppMethod(method) ? (
            <button
              type="button"
              className="btn btn--primary btn--lg btn--block"
              disabled={!amount}
              onClick={() => {
                if (!amount) return;
                if (isMobile) copyUpi(setModalCopied);
                setShowPay(true);
              }}
            >
              {`Pay ₹${fmt(amount || 0)} with ${METHOD_LABELS[method]}`}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => amount && setShowPay(true)}
              className={`btn btn--primary btn--lg btn--block ${!amount ? "is-disabled" : ""}`}
              disabled={!amount}
            >
              {`${frequency === "monthly" ? "Set up " : "Pay "}₹${fmt(amount || 0)}${frequency === "monthly" ? " / month" : ""} via PhonePe / Google Pay / Paytm`}
            </button>
          )}

          {(method === "upi" || isAppMethod(method)) && (
            <p className="hint">
              {isAppMethod(method)
                ? isMobile
                  ? `Copies our UPI ID — then open ${METHOD_LABELS[method]}, choose "Pay to UPI ID", paste and enter the amount.`
                  : `${METHOD_LABELS[method]} only opens on a phone. On a laptop, scan the QR with ${METHOD_LABELS[method]} on your phone.`
                : "Shows a QR and UPI ID — scan or paste it in PhonePe, Google Pay, Paytm or any UPI app."}
            </p>
          )}
          {iosFailedApp && isAppMethod(method) && (
            <p className="hint">Didn't open? Scan the QR below or copy the UPI ID instead.</p>
          )}
          {frequency === "monthly" && method !== "bank" && (
            <p className="hint" style={{ color: "var(--green-600)", fontWeight: 600 }}>
              Monthly giving: this sends this month's gift now — please return each month to give again. 🙏
            </p>
          )}

          {false && (
            <div className="upi-apps">
              <p className="hint" style={{ marginBottom: ".5rem" }}>Or pay directly with an app:</p>
              <div className="upi-apps__row">
                {PAY_APPS.map((app) => (
                  <a key={app.id} className="upi-apps__btn" href={upiAppLink(app.id, amount, noteFor(frequency))}>
                    {app.label}
                  </a>
                ))}
              </div>
            </div>
          )}

          {method !== "bank" && <PaymentClaimForm amount={amount} method={METHOD_LABELS[method]} />}

          {isAppMethod(method) && (<div className="qr-block">
            <div className="qr-block__code" aria-label="UPI QR code">
              {qrUrl ? (
                <img src={qrUrl} alt="UPI QR code" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
              ) : (
                <span style={{ fontSize: "0.76rem", color: "#55604f" }}>{qrError ? "QR unavailable — copy the UPI ID →" : "Generating…"}</span>
              )}
            </div>
            <div className="qr-block__copy">
              <p className="qr-block__lead">On a laptop? <strong>Scan to pay</strong> with {METHOD_LABELS[method]}.</p>
              <button className="copy-row" type="button" onClick={() => copyUpi(setCopied)}>
                <span className="copy-row__label">UPI ID</span>
                <span className="copy-row__value">{CONFIG.upiId}</span>
                <span className="copy-row__btn" aria-hidden="true">Copy</span>
              </button>
              {copied && <p className="copied">Copied ✓</p>}
            </div>
          </div>)}

          <p className="card__foot">{CONFIG.taxExemption}<br />A receipt can be issued on request. Thank you for serving with us. 🙏</p>
        </div>
      </div>

      <Dialog open={showPay} onOpenChange={setShowPay}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>
              {frequency === "monthly" ? "Set up" : "Pay"} ₹{fmt(amount || 0)}{frequency === "monthly" ? " / month" : ""} via {METHOD_LABELS[method] || "UPI"}
            </DialogTitle>
            <DialogDescription>
              Scan this code with {METHOD_LABELS[method] || "any UPI app"} to complete your donation.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-2">
            <div className="rounded-xl border p-2 bg-white" style={{ width: 240, height: 240, display: "grid", placeItems: "center" }} aria-label="UPI QR code">
              {qrUrl ? (
                <img src={qrUrl} alt="UPI QR code" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
              ) : (
                <span style={{ fontSize: "0.8rem", color: "#55604f" }}>{qrError ? "QR unavailable — copy the UPI ID below" : "Generating…"}</span>
              )}
            </div>
            <button type="button" onClick={() => copyUpi(setModalCopied)} className="copy-row" style={{ width: "100%" }}>
              <span className="copy-row__label">UPI ID</span>
              <span className="copy-row__value">{CONFIG.upiId}</span>
              <span className="copy-row__btn" aria-hidden="true">Copy</span>
            </button>
            {modalCopied && <p className="copied text-center">Copied ✓ — paste it into your UPI app</p>}
            {isMobile && qrUrl && (
              <a href={qrUrl} download="ReadyToServe-UPI-QR.png" className="btn btn--ghost btn--sm btn--block">
                Save QR to photos (scan it from {METHOD_LABELS[method] || "your app"} → Upload QR)
              </a>
            )}
            <p className="text-sm text-center" style={{ color: "var(--ink-soft)" }}>
              Open {METHOD_LABELS[method] || "your UPI app"} → <strong>Scan QR</strong> (or <strong>Pay UPI ID</strong> and paste) → enter ₹{fmt(amount || 0)}.
            </p>
            {false && (
              <div className="flex flex-col gap-2 w-full">
                {PAY_APPS.map((app) => (
                  <a
                    key={app.id}
                    className="btn btn--primary btn--block"
                    href={upiAppLink(app.id, amount, noteFor(frequency))}
                    onClick={() => {
                      setIosFailedApp(null);
                      setTimeout(() => {
                        if (document.visibilityState !== "hidden" && document.hasFocus()) setIosFailedApp(app.id);
                      }, 2000);
                    }}
                  >
                    Pay ₹{fmt(amount || 0)} with {app.label} <span aria-hidden="true">→</span>
                  </a>
                ))}
                {iosFailedApp && (
                  <p className="text-xs text-center" style={{ color: "var(--ink-soft)" }}>
                    Didn't open {PAY_APPS.find((a) => a.id === iosFailedApp)?.label}?{" "}
                    <a href={PAY_APPS.find((a) => a.id === iosFailedApp)?.store} target="_blank" rel="noopener" style={{ color: "var(--green-600)", fontWeight: 700 }}>Install it</a>{" "}
                    — or scan the QR / copy the UPI ID above.
                  </p>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}