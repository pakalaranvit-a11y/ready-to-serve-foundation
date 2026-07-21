import React, { useState, useEffect, useRef, useCallback } from "react";
import QRCode from "qrcode";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { CONFIG, fmt, upiLink } from "@/lib/charityConfig";

const isMobile = typeof navigator !== "undefined" &&
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

const noteFor = (frequency) =>
  frequency === "monthly" ? `Monthly donation to ${CONFIG.orgName}` : `Donation to ${CONFIG.orgName}`;

export default function Donate() {
  const { toast } = useToast();
  const [amount, setAmountState] = useState(CONFIG.defaultAmount);
  const [frequency, setFrequency] = useState("one_time");
  const [copied, setCopied] = useState(false);
  const [modalCopied, setModalCopied] = useState(false);
  const [showPay, setShowPay] = useState(false);
  const [qrUrl, setQrUrl] = useState("");
  const inputRef = useRef(null);

  const [donorName, setDonorName] = useState("");
  const [donorMsg, setDonorMsg] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [thankYou, setThankYou] = useState("");

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
      width: 400,
      margin: 4,
      errorCorrectionLevel: "Q",
      color: { dark: "#000000", light: "#ffffff" },
    })
      .then((url) => { if (active) setQrUrl(url); })
      .catch(() => { if (active) setQrUrl(""); });
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
    if (isMobile) {
      window.location.href = upiLink(amount, noteFor(frequency));
    } else {
      e.preventDefault();
      setShowPay(true);
    }
  };

  const submitRecognition = async (e) => {
    e.preventDefault();
    if (!amount || submitting) return;
    setSubmitting(true);
    try {
      const name = anonymous ? "Anonymous" : (donorName.trim() || "Anonymous");
      await base44.entities.Donation.create({
        donor_name: name,
        amount,
        frequency,
        message: donorMsg.trim(),
        is_anonymous: anonymous,
      });
      const who = anonymous ? "" : donorName.trim();
      setThankYou(
        `Thank you${who ? `, ${who}` : ""}! 🙏 Your ${frequency === "monthly" ? "monthly " : ""}gift of ₹${fmt(amount)} brings hot meals, medicine and dignity to our elders. The joy you've given will return to you many times over.`
      );
      toast({
        title: "Thank you for your gift! 🙏",
        description: `₹${fmt(amount)} ${frequency === "monthly" ? "monthly " : ""}recorded on our donor wall.`,
      });
      setDonorName(""); setDonorMsg(""); setAnonymous(false);
      window.dispatchEvent(new Event("donation-added"));
    } catch (err) {
      toast({
        title: "Could not save your recognition",
        description: "Your UPI payment still went through — please try adding your name again.",
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

          <button
            type="button"
            onClick={handlePay}
            className={`btn btn--primary btn--lg btn--block ${!amount ? "is-disabled" : ""}`}
            disabled={!amount}
          >
            {frequency === "monthly" ? "Set up " : "Pay "}₹{fmt(amount || 0)}{frequency === "monthly" ? " / month" : ""} via UPI
          </button>
          <p className="hint">{isMobile ? "Opens Google Pay, PhonePe, Paytm or any UPI app on your phone." : "Scan the QR with any UPI app on your phone to pay."}</p>
          {frequency === "monthly" && (
            <p className="hint" style={{ color: "var(--green-600)", fontWeight: 600 }}>
              Monthly giving: approve a recurring UPI mandate in your app so your support reaches our elders every month. 🙏
            </p>
          )}

          {thankYou && <div className="thanks-box" role="status">{thankYou}</div>}

          <form className="recog" onSubmit={submitRecognition}>
            <h4>Add your name to our donor wall</h4>
            <p>After you pay, enter your name so we can thank you publicly on our donor wall.</p>
            <label className="field">
              <input type="text" placeholder="Your name" value={donorName} onChange={(e) => setDonorName(e.target.value)} disabled={anonymous} maxLength={60} />
            </label>
            <label className="field">
              <textarea rows={2} placeholder="A message for the elders (optional)" value={donorMsg} onChange={(e) => setDonorMsg(e.target.value)} maxLength={160} />
            </label>
            <div className="recog__row">
              <input type="checkbox" id="anon" checked={anonymous} onChange={(e) => setAnonymous(e.target.checked)} />
              <label htmlFor="anon">Donate anonymously</label>
            </div>
            <button type="submit" className="btn btn--ghost btn--block" disabled={!amount || submitting}>
              {submitting ? "Saving…" : "Add my donation to the wall"}
            </button>
          </form>

          <div className="qr-block">
            <div className="qr-block__code" aria-label="UPI QR code">
              {qrUrl ? (
                <img src={qrUrl} alt="UPI QR code" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
              ) : (
                <span style={{ fontSize: "0.76rem", color: "#55604f" }}>Generating…</span>
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
              Open any UPI app on your phone (Google Pay, PhonePe, Paytm) and scan this code to complete your {frequency === "monthly" ? "monthly " : ""}donation.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-2">
            <div
              className="rounded-xl border p-2 bg-white"
              style={{ width: 220, height: 220, display: "grid", placeItems: "center" }}
              aria-label="UPI QR code"
            >
              {qrUrl ? (
                <img src={qrUrl} alt="UPI QR code" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
              ) : (
                <span style={{ fontSize: "0.8rem", color: "#55604f" }}>Generating…</span>
              )}
            </div>
            <button type="button" onClick={() => copyUpi(setModalCopied)} className="copy-row" style={{ width: "100%" }}>
              <span className="copy-row__label">UPI ID</span>
              <span className="copy-row__value">{CONFIG.upiId}</span>
              <span className="copy-row__btn" aria-hidden="true">Copy</span>
            </button>
            {modalCopied && <p className="copied text-center">Copied ✓ — paste it into your UPI app</p>}
            <p className="text-xs text-center text-[var(--ink-soft)]">
              Or send directly to <strong>{CONFIG.upiId}</strong> from your banking app.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}