import React from "react";
import { LogoMark } from "@/components/charity/Logo";
import { CONFIG } from "@/lib/charityConfig";

export default function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="wrap footer__grid">
        <div>
          <a className="brand brand--footer" href="#top">
            <span className="brand__mark" aria-hidden="true">
              <LogoMark size={26} />
            </span>
            <span className="brand__text">
              Ready To Serve<small>Foundation</small>
            </span>
          </a>
          <p className="footer__tag">“{CONFIG.motto}”</p>
          <p className="footer__blurb">{CONFIG.tagline}</p>
        </div>
        <div className="footer__col">
          <h4>Contact</h4>
          <p>{CONFIG.location}</p>
          <p>
            <a href={`tel:${CONFIG.phone}`} className="link-strong">📞 {CONFIG.phone}</a>
          </p>
          {CONFIG.email && (
            <p><a href={`mailto:${CONFIG.email}`}>{CONFIG.email}</a></p>
          )}
          <p><a href={CONFIG.instagramReel} target="_blank" rel="noopener" className="link-strong">Instagram →</a></p>
        </div>
        <div className="footer__col">
          <h4>Give</h4>
          <p><a href="#donate" className="link-strong">Donate by UPI →</a></p>
          {CONFIG.website && <p><a href={`https://${CONFIG.website}`} target="_blank" rel="noopener" className="link-strong">{CONFIG.website} ↗</a></p>}
          {CONFIG.societyRegNo && <p>Reg. No. {CONFIG.societyRegNo}</p>}
          {CONFIG.regNo && <p>{CONFIG.regNo}</p>}
          <p className="footer__note">100% of your gift reaches the home.</p>
        </div>
      </div>
      <div className="wrap footer__base">
        <span>© {new Date().getFullYear()} Ready To Serve Foundation. Made with care.</span>
        <a href="#top">Back to top ↑</a>
      </div>
    </footer>
  );
}