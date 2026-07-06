import React from "react";
import { Heart } from "lucide-react";
import { CONFIG } from "@/lib/charityConfig";

export default function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="wrap footer__grid">
        <div>
          <div className="brand brand--footer">
            <span className="brand__mark" aria-hidden="true">
              <Heart size={22} />
            </span>
            <span className="brand__text">
              Ready To Serve<small>Foundation</small>
            </span>
          </div>
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
        </div>
        <div className="footer__col">
          <h4>Give</h4>
          <p><a href="#donate" className="link-strong">Donate by UPI →</a></p>
          {CONFIG.regNo && <p>Reg: {CONFIG.regNo}</p>}
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