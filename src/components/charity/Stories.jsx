import React from "react";
import { CONFIG } from "@/lib/charityConfig";

function StoryCard({ caption, src, alt }) {
  return (
    <figure className="story" data-reveal="">
      <img
        src={src}
        alt={alt}
        style={{ width: "100%", aspectRatio: "9/12", objectFit: "cover", display: "block" }}
      />
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
          <StoryCard
            src="https://media.base44.com/images/public/6a4bf7eda7bc99837f34a772/66b8544b3_image.png"
            alt="An elderly man and woman clapping joyfully at a birthday celebration in the home"
            caption="అన్నదాత! సుఖీభవ! — Blessings to every giver. A sponsored birthday at the home."
          />
          <StoryCard
            src="https://images.unsplash.com/photo-1542622475-904e18612fa1?fm=jpg&q=60&w=1200&auto=format&fit=crop"
            alt="Two residents sitting together in companionship"
            caption="Our residents, together as a family."
          />
          <StoryCard
            src="https://images.unsplash.com/photo-1584515933487-779824d29309?fm=jpg&q=60&w=1200&auto=format&fit=crop"
            alt="An elder's hands wearing a gold wedding band"
            caption="Everyday life and care inside the foundation."
          />
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