import React from "react";

export default function About() {
  return (
    <section className="section about" id="about">
      <div className="wrap about__grid">
        <div className="about__media" data-reveal="">
          <img
            className="media-card"
            src="https://media.base44.com/images/public/6a4bf7eda7bc99837f34a772/3b289d61d_PHOTO-2026-07-18-13-10-21.jpg"
            alt="Residents and staff of the Ready To Serve Foundation standing together inside the home"
          />
          <span className="media-card__tag">Inside our home, Vanasthalipuram</span>
        </div>
        <div className="about__copy" data-reveal="">
          <span className="kicker">Who we are</span>
          <h2>A real home, run on kindness.</h2>
          <p>
            The Ready&nbsp;To&nbsp;Serve Foundation runs a <strong>free old age home</strong> in Vanasthalipuram, Hyderabad for elders who have been left with no family, no income and nowhere to go. Since 2011 we've grown from 5 residents to a full-time family of 100 — but our promise has never changed.
          </p>
          <p>
            Every rupee you give buys real things our residents need today — hot meals, medicines, clothes, a clean bed, and the joy of being remembered on their birthday.
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