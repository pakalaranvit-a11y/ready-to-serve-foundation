import React from "react";
import { CONFIG } from "@/lib/charityConfig";

function StoryCard({ caption, emoji }) {
  return (
    <figure className="story" data-reveal="">
      <div style={{ width: "100%", aspectRatio: "9/12", background: "linear-gradient(135deg, #0b3d2e, #157347)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
        <div style={{ textAlign: "center", padding: "1.5rem" }}>
          <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>{emoji}</div>
          <p style={{ margin: 0, fontSize: "0.95rem", opacity: 0.9 }}>{caption}</p>
        </div>
      </div>
      <figcaption>{caption}</figcaption>
    </figure>
  );
}

export default function Stories() {
  return (
    <section className="section stories" id="stories">
      <div className="wrap">
        <div className="section__head" data-reveal="">
          <span className="kicker">From inside the home</span>
          <h2>The people you're helping</h2>
          <p className="section__sub">
            Real moments from our home — gratitude, prayer, and a birthday no one will forget.
          </p>
        </div>
        <div className="stories__grid">
          <StoryCard caption="అన్నదాత! సుఖీభవ! — Blessings to every giver. A sponsored birthday at the home." emoji="🎂" />
          <StoryCard caption="Our residents, together as a family." emoji="👨‍👩‍👧‍👦" />
          <StoryCard caption="Everyday life and care inside the foundation." emoji="🏠" />
        </div>
        <p className="stories__reel" data-reveal="">
          See more on our{" "}
          <a href={CONFIG.instagramReel} target="_blank" rel="noopener">
            Instagram reel →
          </a>
        </p>
      </div>
    </section>
  );
}