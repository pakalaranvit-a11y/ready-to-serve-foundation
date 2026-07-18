import React from "react";
import { CONFIG } from "@/lib/charityConfig";

export default function Location() {
  return (
    <section className="section" id="visit" style={{ background: "var(--cream-2)" }}>
      <div className="wrap">
        <div className="section__head" data-reveal="">
          <span className="kicker">Come visit</span>
          <h2>Find us in Hyderabad</h2>
          <p className="section__sub">
            {CONFIG.project}. You're always welcome to visit, share a meal, or volunteer your time.
          </p>
        </div>
        <div data-reveal="" style={{ position: "relative", borderRadius: "var(--radius-lg)", overflow: "hidden", boxShadow: "var(--shadow-lg)", border: "1px solid var(--line)" }}>
          <iframe
            title="Ready To Serve Foundation on Google Maps"
            src={CONFIG.mapsEmbed}
            style={{ width: "100%", height: "420px", border: 0, display: "block" }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
          <a href={CONFIG.mapsLink} target="_blank" rel="noopener" className="btn btn--primary btn--sm" style={{ position: "absolute", right: "14px", bottom: "14px" }}>
            Open in Google Maps <span aria-hidden="true">↗</span>
          </a>
        </div>
        <p style={{ marginTop: "1rem", color: "var(--ink-soft)", textAlign: "center" }}>{CONFIG.location}</p>
      </div>
    </section>
  );
}