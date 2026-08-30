import React from "react";
import { Instagram, Facebook, Youtube } from "lucide-react";
import { CONFIG } from "@/lib/charityConfig";

export default function SocialLinks() {
  const s = CONFIG.social || {};
  return (
    <section className="section social-strip" id="follow">
      <div className="wrap">
        <div className="section__head" data-reveal="" style={{ textAlign: "center", marginInline: "auto" }}>
          <span className="kicker">Follow our elders' journey</span>
          <h2>See the smiles you make possible</h2>
          <p className="section__sub">
            Daily photos, reels and updates from the home — follow, like and share to help more people find us.
          </p>
        </div>
        <div className="social-strip__row" data-reveal="">
          {s.instagram && (
            <a className="social-strip__card social-strip__card--ig" href={s.instagram} target="_blank" rel="noopener">
              <Instagram size={26} />
              <strong>Instagram</strong>
              <span>@readytoservefoundations</span>
            </a>
          )}
          {s.facebook && (
            <a className="social-strip__card social-strip__card--fb" href={s.facebook} target="_blank" rel="noopener">
              <Facebook size={26} />
              <strong>Facebook</strong>
              <span>Ready to Serve Foundation</span>
            </a>
          )}
          {CONFIG.instagramReel && (
            <a className="social-strip__card social-strip__card--reel" href={CONFIG.instagramReel} target="_blank" rel="noopener">
              <Instagram size={26} />
              <strong>Latest reel</strong>
              <span>Watch on Instagram</span>
            </a>
          )}
          {s.youtube && (
            <a className="social-strip__card social-strip__card--yt" href={s.youtube} target="_blank" rel="noopener">
              <Youtube size={26} />
              <strong>YouTube</strong>
              <span>Our videos</span>
            </a>
          )}
        </div>
      </div>
    </section>
  );
}