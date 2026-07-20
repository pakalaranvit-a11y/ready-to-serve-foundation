import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { CONFIG, fmt } from "@/lib/charityConfig";

export default function DonorWall() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const list = await base44.entities.Donation.list("-created_date", 50);
      setDonations(list || []);
    } catch {
      setDonations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const unsub = base44.entities.Donation.subscribe(() => load());
    const handler = () => load();
    window.addEventListener("donation-added", handler);
    return () => {
      if (typeof unsub === "function") unsub();
      window.removeEventListener("donation-added", handler);
    };
  }, []);

  const total = donations.reduce((s, d) => s + (Number(d.amount) || 0), 0);

  return (
    <section className="section" id="donors" style={{ background: "var(--cream-2)" }}>
      <div className="wrap">
        <div className="section__head" data-reveal="">
          <span className="kicker">Faces of kindness</span>
          <h2>Our donor wall</h2>
          <p className="section__sub">
            Every name here is a meal served, a medicine bought, a birthday celebrated. Thank you for standing with our elders since {CONFIG.foundedYear}.
          </p>
        </div>

        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "1.6rem" }}>
          <div className="impact-card" style={{ flex: "1 1 220px" }} data-reveal="">
            <div className="impact-card__amt">₹{fmt(total)}</div>
            <div className="impact-card__lbl">Raised on this wall</div>
          </div>
          <div className="impact-card" style={{ flex: "1 1 220px" }} data-reveal="">
            <div className="impact-card__amt">{donations.length}</div>
            <div className="impact-card__lbl">Generous donors</div>
          </div>
        </div>

        {loading ? (
          <p style={{ color: "var(--ink-soft)" }}>Loading donors…</p>
        ) : donations.length === 0 ? (
          <p style={{ color: "var(--ink-soft)" }}>
            Be the first name on our donor wall — donate above and add your name to be recognised. 🙏
          </p>
        ) : (
          <div className="stories__grid">
            {donations.map((d) => (
              <figure className="story" key={d.id} data-reveal="">
                <div style={{ padding: "1.2rem 1.1rem" }}>
                  <div style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: "1.1rem", color: "var(--green-700)" }}>
                    {d.donor_name}
                  </div>
                  <div style={{ fontFamily: "var(--font-head)", fontSize: "1.6rem", fontWeight: 700, color: "var(--green-600)", margin: ".3rem 0" }}>
                    ₹{fmt(d.amount)}
                  </div>
                  <div style={{ fontSize: ".78rem", fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--ink-soft)" }}>
                    {d.frequency === "monthly" ? "Monthly giver" : "One-time gift"}
                  </div>
                  {d.message && (
                    <p style={{ fontSize: ".9rem", color: "var(--ink-soft)", marginTop: ".6rem", fontStyle: "italic" }}>
                      “{d.message}”
                    </p>
                  )}
                  <div style={{ fontSize: ".75rem", color: "var(--ink-soft)", marginTop: ".6rem" }}>
                    {new Date(d.created_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </div>
                </div>
              </figure>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}