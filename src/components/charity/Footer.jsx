import React from "react";
import { DONATE_URL, openDonate } from "@/lib/openDonate";
import { Link } from "react-router-dom";
import { LogoMark } from "@/components/charity/Logo";
import { CONFIG } from "@/lib/charityConfig";
import { Instagram, Facebook, Youtube } from "lucide-react";

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
          <div className="footer__social">
            {CONFIG.social?.instagram && (
              <a href={CONFIG.social.instagram} target="_blank" rel="noopener" aria-label="Instagram"><Instagram size={18} /></a>
            )}
            {CONFIG.social?.facebook && (
              <a href={CONFIG.social.facebook} target="_blank" rel="noopener" aria-label="Facebook"><Facebook size={18} /></a>
            )}
            {CONFIG.social?.youtube && (
              <a href={CONFIG.social.youtube} target="_blank" rel="noopener" aria-label="YouTube"><Youtube size={18} /></a>
            )}
          </div>
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
          {CONFIG.social?.instagram && (
            <p><a href={CONFIG.social.instagram} target="_blank" rel="noopener" className="link-strong">Instagram →</a></p>
          )}
          {CONFIG.social?.facebook && (
            <p><a href={CONFIG.social.facebook} target="_blank" rel="noopener" className="link-strong">Facebook →</a></p>
          )}
        </div>
        <div className="footer__col">
          <h4>Give</h4>
          <p><a href={DONATE_URL} onClick={openDonate} className="link-strong">Donate →</a></p>
          {CONFIG.website && <p><a href={`https://${CONFIG.website}`} target="_blank" rel="noopener" className="link-strong">{CONFIG.website} ↗</a></p>}
          {CONFIG.societyRegNo && <p>Reg. No. {CONFIG.societyRegNo}</p>}
          {CONFIG.regNo && <p>{CONFIG.regNo}</p>}
          <p className="footer__note">100% of your gift reaches the home.</p>
        </div>
      </div>
      <div className="wrap footer__base">
        <span>© {new Date().getFullYear()} Ready To Serve Foundation. Made with care.</span>
        <span>
          <Link to="/privacy" style={{ marginRight: "1rem" }}>Privacy Policy</Link>
          <Link to="/support">Support</Link>
        </span>
        <a href="#top">Back to top ↑</a>
      </div>
    </footer>
  );
}