import React, { useEffect } from "react";
import { CONFIG } from "@/lib/charityConfig";

export default function Videos() {
  useEffect(() => {
    const loadAndEmbed = () => {
      if (window.instgrm?.Embeds?.process) window.instgrm.Embeds.process();
    };
    const existing = document.querySelector('script[data-ig-embed]');
    if (!existing) {
      const s = document.createElement("script");
      s.src = "https://www.instagram.com/embed.js";
      s.async = true;
      s.setAttribute("data-ig-embed", "1");
      s.onload = loadAndEmbed;
      document.body.appendChild(s);
    } else {
      loadAndEmbed();
    }
  }, []);

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
          <div style={{ borderRadius: "var(--radius-lg)", overflow: "hidden", boxShadow: "var(--shadow)", background: "#000" }}>
            <blockquote
              className="instagram-media"
              data-instgrm-captioned
              data-instgrm-permalink={CONFIG.instagramReel}
              data-instgrm-version="14"
              style={{
                background: "#FFF",
                border: 0,
                margin: 0,
                maxWidth: "100%",
                minWidth: "0",
                padding: 0,
                width: "100%",
              }}
            >
              <div style={{ padding: "16px 0", textAlign: "center" }}>
                <a
                  href={CONFIG.instagramReel}
                  target="_blank"
                  rel="noopener"
                  style={{
                    background: "#0f5132",
                    color: "#fff",
                    padding: "10px 18px",
                    borderRadius: 100,
                    display: "inline-block",
                    textDecoration: "none",
                    fontWeight: 700,
                    fontSize: ".9rem",
                  }}
                >
                  Watch this reel on Instagram →
                </a>
              </div>
            </blockquote>
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