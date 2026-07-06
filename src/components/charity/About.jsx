import React from "react";

export default function About() {
  return (
    <section className="section about" id="about">
      <div className="wrap about__grid">
        <div className="about__media" data-reveal="">
          <div className="media-card" style={{ background: "linear-gradient(135deg, #0b3d2e 0%, #1b9e5f 100%)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "1.1rem", textAlign: "center", padding: "2rem" }}>
            <div>
              <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>🙏</div>
              <p style={{ margin: 0 }}>A resident shares his thanks</p>
            </div>
          </div>
          <span className="media-card__tag">A resident shares his thanks</span>
        </div>
        <div className="about__copy" data-reveal="">
          <span className="kicker">Who we are</span>
          <h2>A real home, run on kindness.</h2>
          <p>
            The Ready&nbsp;To&nbsp;Serve Foundation runs a <strong>free old age home</strong> in Vanasthalipuram, Hyderabad for elders who have been left with no family, no income and nowhere to go.
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