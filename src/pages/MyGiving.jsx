import React from "react";
import { Link } from "react-router-dom";
import BackHeader from "@/components/charity/BackHeader";
import { getGifts } from "@/lib/localGiving";
import { fmt } from "@/lib/charityConfig";

export default function MyGiving() {
  const gifts = getGifts();
  const total = gifts.reduce((s, g) => s + (Number(g.amount) || 0), 0);
  const meals = Math.floor(total / 101);

  return (
    <div className="charity-site">
      <BackHeader title="My Giving" />
      <main className="wrap" style={{ maxWidth: 640, paddingBlock: "1.2rem 2rem" }}>
        <div className="card" style={{ marginBottom: "1.2rem" }}>
          <p className="kicker">Total given from this device</p>
          <h2 style={{ fontSize: "2.4rem", color: "var(--green-700)" }}>₹{fmt(total)}</h2>
          <p style={{ color: "var(--ink-soft)", margin: ".4rem 0 0" }}>
            {total > 0 ? `That's about ${fmt(meals)} days of meals for an elder. Thank you!` : "Your gifts will appear here after you donate."}
          </p>
        </div>
        {gifts.length === 0 ? (
          <div className="donorwall-empty">
            <p>No donations recorded on this device yet.</p>
            <Link to="/donate" className="btn btn--primary">Make a donation</Link>
          </div>
        ) : (
          gifts.map((g, i) => (
            <div key={i} className="copy-row" style={{ cursor: "default", marginBottom: ".5rem" }}>
              <span className="copy-row__value">₹{fmt(g.amount)}</span>
              <span className="copy-row__label">{g.method} · {new Date(g.date).toLocaleDateString()}</span>
            </div>
          ))
        )}
        <p className="hint">History is stored only on this device. No login needed.</p>
      </main>
    </div>
  );
}