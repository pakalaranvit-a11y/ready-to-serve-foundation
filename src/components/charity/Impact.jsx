import React from "react";
import { CONFIG, fmt } from "@/lib/charityConfig";

export default function Impact() {
  const scrollToDonate = () => {
    document.getElementById("donate")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="section impact" id="impact">
      <div className="wrap">
        <div className="section__head" data-reveal="">
          <span className="kicker">Your impact</span>
          <h2>See exactly what your gift does</h2>
          <p className="section__sub">
            Choose an amount on the donation card and you'll know precisely what it provides. Small or large, it arrives the same day.
          </p>
        </div>
        <div className="impact__grid">
          {CONFIG.presets.map((p) => (
            <button
              key={p.amount}
              className="impact-card"
              type="button"
              onClick={() => {
                window.__setDonateAmount?.(p.amount);
                scrollToDonate();
              }}
              data-reveal=""
            >
              <div className="impact-card__amt">₹{fmt(p.amount)}</div>
              <div className="impact-card__lbl">{p.label}</div>
              <div className="impact-card__cta">Give this →</div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}