import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Logo from "@/components/charity/Logo";
import NotificationsBell from "@/components/charity/NotificationsBell";
import DonateNowButton from "@/components/charity/DonateNowButton";
import { CONFIG } from "@/lib/charityConfig";
import { Instagram, Facebook, Youtube } from "lucide-react";

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
          <span className="nav__social">
            {CONFIG.social?.instagram && <a href={CONFIG.social.instagram} target="_blank" rel="noopener" aria-label="Instagram"><Instagram size={18} /></a>}
            {CONFIG.social?.facebook && <a href={CONFIG.social.facebook} target="_blank" rel="noopener" aria-label="Facebook"><Facebook size={18} /></a>}
            {CONFIG.social?.youtube && <a href={CONFIG.social.youtube} target="_blank" rel="noopener" aria-label="YouTube"><Youtube size={18} /></a>}
          </span>
          <Link to="/settings">Settings</Link>
        </nav>
        <DonateNowButton className="btn btn--primary btn--sm nav__cta">Donate&nbsp;Now</DonateNowButton>
      </div>
    </header>
  );
}