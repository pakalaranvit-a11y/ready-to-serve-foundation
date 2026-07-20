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
            src="https://media.base44.com/images/public/6a4bf7eda7bc99837f34a772/fbd7abbf8_PHOTO-2026-07-18-13-10-22.jpg"
            alt="Elderly residents and caretakers of the Ready To Serve Foundation standing together, a visitor being honoured with a pink shawl"
            caption="Our residents, together as a family."
          />
          <StoryCard
            src="https://media.base44.com/images/public/6a4bf7eda7bc99837f34a772/f54da18fa_PHOTO-2026-07-18-13-10-23.jpg"
            alt="Residents eating meals from metal trays in the dormitory of the Ready To Serve Foundation old age home"
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