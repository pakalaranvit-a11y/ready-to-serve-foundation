import React from "react";
import { CONFIG, fmt } from "@/lib/charityConfig";

const USES = [
  { title: "Daily meals", text: "Groceries, cooking gas and fresh food for every resident, every day." },
  { title: "Medicine & health", text: "Monthly medicines, check-ups and hospital visits for elders." },
  { title: "Shelter & upkeep", text: "Rent, electricity, water, bedding and repairs for the home." },
  { title: "Caretakers", text: "Support for the staff who cook, clean and care for residents." },
  { title: "New home", text: `Building a home for ${CONFIG.campaign.capacity} elders at ₹${fmt(CONFIG.campaign.sqFtPrice)} per sq ft.` },
];

export default function WhereMoneyGoes() {
  return (
    <section className="section about">
      <div className="wrap">
        <div className="section__head">
          <span className="kicker">Transparency</span>
          <h2>Where your money goes</h2>
          <p className="section__sub">Every donation goes to running the home and caring for its residents.</p>
        </div>
        <div className="impact__grid">
          {USES.map((u) => (
            <div key={u.title} className="impact-card" style={{ cursor: "default" }}>
              <div className="impact-card__amt" style={{ fontSize: "1.25rem" }}>{u.title}</div>
              <div className="impact-card__lbl">{u.text}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}