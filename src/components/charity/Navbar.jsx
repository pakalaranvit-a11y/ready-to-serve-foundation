import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Logo from "@/components/charity/Logo";
import NotificationsBell from "@/components/charity/NotificationsBell";

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
        <Logo />
        <NotificationsBell />
        <nav className="nav__links" aria-label="Primary">
          <a href="#about">Our Home</a>
          <a href="#impact">Your Impact</a>
          <a href="#stories">Stories</a>
          <a href="#contact">Contact</a>
          <Link to="/settings">Settings</Link>
        </nav>
        <a href="#donate" className="btn btn--primary btn--sm nav__cta">Donate&nbsp;Now</a>
      </div>
    </header>
  );
}