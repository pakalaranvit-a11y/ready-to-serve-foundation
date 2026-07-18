import React, { useState, useEffect } from "react";
import { Heart } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    handler();
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header className={`nav ${scrolled ? "is-scrolled" : ""}`} id="nav">
      <div className="wrap nav__inner">
        <a className="brand" href="#top" aria-label="Ready To Serve Foundation home">
          <span className="brand__mark" aria-hidden="true">
            <Heart size={22} />
          </span>
          <span className="brand__text">
            Ready&nbsp;To&nbsp;Serve
            <small>Foundation</small>
          </span>
        </a>
        <nav className="nav__links" aria-label="Primary">
          <a href="#about">Our Home</a>
          <a href="#impact">Your Impact</a>
          <a href="#donors">Donors</a>
          <a href="#elders">Our Elders</a>
        </nav>
        <a href="#donate" className="btn btn--primary btn--sm nav__cta">Donate&nbsp;Now</a>
      </div>
    </header>
  );
}