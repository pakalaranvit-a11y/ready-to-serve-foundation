import React from "react";
import { openDonate } from "@/lib/openDonate";

export default function NativeDonateHandoff() {
  return (
    <section className="section donate" id="donate">
      <div className="wrap">
        <div className="card" style={{ maxWidth: 560, marginInline: "auto", textAlign: "center" }}>
          <h2 className="card__title">Donate securely in Safari</h2>
          <p className="hint" style={{ fontSize: "1rem", marginBottom: "1.2rem" }}>
            Donations are completed on our website, outside the app. Tap below to open it in your browser.
          </p>
          <button type="button" className="btn btn--primary btn--lg btn--block" onClick={openDonate}>
            Open donation page <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </section>
  );
}