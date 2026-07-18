import React from "react";
import { CONFIG } from "@/lib/charityConfig";

export default function Elders() {
  return (
    <section className="section elders" id="elders">
      <div className="wrap">
        <div className="section__head" data-reveal="">
          <span className="kicker">Our family</span>
          <h2>The elders you're caring for</h2>
          <p className="section__sub">
            These are some of the {CONFIG.currentMembers} full-time residents who call the Ready To Serve Foundation home. Each has a story — and because of you, each has a future.
          </p>
        </div>
        <div className="elders__grid">
          {CONFIG.elders.map((e) => (
            <article className="elder" key={e.name} data-reveal="">
              <img className="elder__photo" src={e.photo} alt={`${e.name}, ${e.age}, from ${e.from}`} loading="lazy" />
              <div className="elder__copy">
                <h3>{e.name}</h3>
                <p className="elder__meta">{e.age} years · {e.from}</p>
                <p className="elder__story">{e.story}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}