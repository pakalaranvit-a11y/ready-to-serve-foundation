import React from "react";
import { useNavigate } from "react-router-dom";
import BackHeader from "@/components/charity/BackHeader";
import WhereMoneyGoes from "@/components/charity/WhereMoneyGoes";
import { CONFIG, fmt } from "@/lib/charityConfig";

export default function ImpactPage() {
  const navigate = useNavigate();
  return (
    <div className="charity-site">
      <BackHeader title="Impact" />
      <section className="section impact">
        <div className="wrap">
          <div className="section__head">
            <span className="kicker">Your impact</span>
            <h2>What your gift provides</h2>
          </div>
          <div className="impact__grid">
            {CONFIG.presets.map((p) => (
              <button key={p.amount} type="button" className="impact-card" onClick={() => navigate("/donate")}>
                <div className="impact-card__amt">₹{fmt(p.amount)}</div>
                <div className="impact-card__lbl">{p.label}</div>
                <div className="impact-card__cta">Give →</div>
              </button>
            ))}
          </div>
        </div>
      </section>
      <WhereMoneyGoes />
    </div>
  );
}