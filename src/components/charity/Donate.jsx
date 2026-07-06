import React, { useState, useEffect, useRef, useCallback } from "react";
import { CONFIG, fmt, upiLink } from "@/lib/charityConfig";
import { CheckCircle } from "lucide-react";

export default function Donate() {
  const [amount, setAmountState] = useState(CONFIG.defaultAmount);
  const [copied, setCopied] = useState(false);
  const qrRef = useRef(null);
  const inputRef = useRef(null);

  const matchLabel = CONFIG.presets.find((p) => p.amount === amount)?.label || "";

  const setAmount = useCallback((val, fromInput) => {
    setAmountState(val);
    if (!fromInput && inputRef.current) inputRef.current.value = val > 0 ? val : "";
  }, []);

  // Expose globally so Impact cards can set it
  useEffect(() => {
    window.__setDonateAmount = setAmount;
    return () => { delete window.__setDonateAmount; };
  }, [setAmount]);

  // Render QR code
  useEffect(() => {
    if (!qrRef.current) return;
    qrRef.current.innerHTML = "";
    // Dynamic import of qrcode library — we'll use a canvas approach
    const link = upiLink(amount);
    const size = 240;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");

    // Simple QR placeholder with the UPI link text
    // We'll generate a proper QR using the data URL approach
    try {
      import("https://cdn.jsdelivr.net/npm/qrcode@1.5.3/+esm").then((QRCode) => {
        QRCode.toCanvas(canvas, link, {
          width: size,
          margin: 1,
          color: { dark: "#0b3d2e", light: "#ffffff" },
        }).then(() => {
          if (qrRef.current) {
            qrRef.current.innerHTML = "";
            qrRef.current.appendChild(canvas);
          }
        }).catch(() => {});
      }).catch(() => {
        // Fallback: show text
        if (qrRef.current) {
          qrRef.current.innerHTML = `<div style="padding:1rem;font-size:0.8rem;text-align:center;color:#55604f">Scan with any UPI app</div>`;
        }
      });
    } catch {
      // noop
    }
  }, [amount]);

  const handleCopy = () => {
    const val = CONFIG.upiId;
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(val).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      });
    } else {
      const t = document.createElement("textarea");
      t.value = val;
      document.body.appendChild(t);
      t.select();
      try { document.execCommand("copy"); } catch {}
      document.body.removeChild(t);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
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
              Works on any phone or laptop
            </li>
          </ul>
          <p className="donate__call">
            Prefer to talk first? Call or WhatsApp{" "}
            <a href={`tel:${CONFIG.phone}`} className="link-strong">{CONFIG.phone}</a>
          </p>
        </div>

        <div className="card donate__card" data-reveal="">
          <h3 className="card__title">Choose your gift</h3>

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

          <a
            href={upiLink(amount)}
            className={`btn btn--primary btn--lg btn--block ${!amount ? "is-disabled" : ""}`}
            style={{ marginTop: "0.2rem" }}
          >
            Pay ₹{fmt(amount || 0)} with UPI app
          </a>
          <p className="hint">Opens Google&nbsp;Pay, PhonePe, Paytm or any UPI app on your phone.</p>

          <div className="qr-block">
            <div className="qr-block__code" ref={qrRef} aria-label="UPI QR code" />
            <div className="qr-block__copy">
              <p className="qr-block__lead">On a laptop? <strong>Scan to pay</strong> with any UPI app.</p>
              <button className="copy-row" type="button" onClick={handleCopy}>
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
            <details className="bank">
              <summary>Bank transfer (NEFT / IMPS)</summary>
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
            </details>
          )}

          <p className="card__foot">A receipt can be issued on request. Thank you for serving with us. 🙏</p>
        </div>
      </div>
    </section>
  );
}