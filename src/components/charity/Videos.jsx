import React from "react";
import { CONFIG } from "@/lib/charityConfig";

export default function Videos() {
  const embed = CONFIG.instagramReel.replace(/\/$/, "") + "/embed/";
  return (
    <section className="section" id="videos" style={{ background: "var(--cream)" }}>
      <div className="wrap">
        <div className="section__head" data-reveal="">
          <span className="kicker">Watch & share</span>
          <h2>See the home in motion</h2>
          <p className="section__sub">
            Real moments from inside the foundation — prayers, meals, and a birthday no one will forget.
          </p>
        </div>
        <div data-reveal="" style={{ display: "grid", gap: "1.4rem", maxWidth: 420, marginInline: "auto" }}>
          <div style={{ position: "relative", borderRadius: "var(--radius-lg)", overflow: "hidden", boxShadow: "var(--shadow)", background: "#000", aspectRatio: "9 / 16" }}>
            <iframe
              src={embed}
              title="Inside the Ready To Serve Foundation"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
              loading="lazy"
              allowFullScreen
            />
          </div>
          <p style={{ textAlign: "center", color: "var(--ink-soft)" }}>
            Watch more on our{" "}
            <a href={CONFIG.instagramReel} target="_blank" rel="noopener" className="link-strong">Instagram →</a>
          </p>
        </div>
      </div>
    </section>
  );
}