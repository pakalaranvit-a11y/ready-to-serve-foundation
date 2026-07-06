import React from "react";

export default function FinalCTA() {
  return (
    <section className="section finalcta">
      <div className="wrap finalcta__inner" data-reveal="">
        <h2>One meal. One elder. Today.</h2>
        <p>It takes less than a minute, and it changes someone's whole day.</p>
        <a href="#donate" className="btn btn--primary btn--lg">
          Donate now <span aria-hidden="true">→</span>
        </a>
      </div>
    </section>
  );
}