import React from "react";
import { CONFIG, mapsLink, mapsEmbed } from "@/lib/charityConfig";

export default function MapEmbed() {
  return (
    <section className="section map" id="visit">
      <div className="wrap">
        <div className="section__head" data-reveal="">
          <span className="kicker">Visit us</span>
          <h2>Come see the home</h2>
          <p className="section__sub">
            Our doors are always open in {CONFIG.location}. Tap the map to open it in Google Maps and find your way.
          </p>
        </div>
        <a
          className="map-embed"
          href={mapsLink()}
          target="_blank"
          rel="noopener"
          aria-label={`Open ${CONFIG.location} in Google Maps`}
          data-reveal=""
        >
          <iframe
            src={mapsEmbed()}
            title={`Map of ${CONFIG.location}`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            style={{ pointerEvents: "none" }}
          />
          <span className="map-embed__overlay">
            <span className="map-embed__pill">Open in Google Maps →</span>
          </span>
        </a>
      </div>
    </section>
  );
}