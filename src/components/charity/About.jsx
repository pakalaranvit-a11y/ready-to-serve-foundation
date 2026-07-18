import React from "react";
import { CONFIG } from "@/lib/charityConfig";

export default function About() {
  return (
    <section className="section about" id="about">
      <div className="wrap about__grid">
        <div className="about__media" data-reveal="">
          <img
            className="media-card"
            src="https://media.base44.com/images/public/6a4bf7eda7bc99837f34a772/9ea11f2fb_image.png"
            alt="Residents of the Ready To Serve Foundation old age home celebrating a birthday together"
          />
          <span className="media-card__tag">A resident shares his thanks</span>
        </div>
        <div className="about__copy" data-reveal="">
          <span className="kicker">Who we are</span>
          <h2>A real home, run on kindness since {CONFIG.sinceYear}.</h2>
          <p>
            The Ready&nbsp;To&nbsp;Serve Foundation runs a <strong>free old age home</strong> in Vanasthalipuram, Hyderabad for elders who have been left with no family, no income and nowhere to go.
          </p>
          <p>
            We started in {CONFIG.startYear} with just <strong>{CONFIG.startMembers} members</strong> — and today, in {CONFIG.currentYear}, we care for <strong>{CONFIG.currentMembers} full-time residents</strong>. Every elder here gets a bed, a name, and a family that won't forget them.
          </p>
          <ul className="ticks" role="list">
            <li>Three nutritious meals, every single day</li>
            <li>Medicines &amp; regular health check-ups</li>
            <li>Birthday celebrations so no elder feels forgotten</li>
            <li>Run by volunteers — donations reach the home, not overheads</li>
          </ul>
          <a href="#donate" className="btn btn--primary">Help us keep the lights on</a>
        </div>
      </div>
    </section>
  );
}