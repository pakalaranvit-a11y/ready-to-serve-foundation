import React from "react";
import { Link } from "react-router-dom";
import { CONFIG } from "@/lib/charityConfig";
import BackHeader from "@/components/charity/BackHeader";

export default function Support() {
  return (
    <div className="charity-site">
      <BackHeader title="Support" />
      <div className="wrap section" style={{ maxWidth: 760 }}>
        <h1 style={{ fontSize: "clamp(1.8rem, 5vw, 2.6rem)", marginBottom: ".6rem" }}>
          Support &amp; Contact
        </h1>
        <p style={{ color: "var(--ink-soft)", marginBottom: "2rem" }}>
          We're here to help. Reach us any of the ways below — a real person from{" "}
          {CONFIG.orgName} will respond.
        </p>

        <div style={{ display: "grid", gap: "1.2rem" }}>
          <div style={{
            background: "var(--white)",
            border: "1px solid var(--line)",
            borderRadius: "var(--radius-c)",
            padding: "1.4rem 1.5rem",
            boxShadow: "var(--shadow-sm)",
          }}>
            <h2 style={{ fontSize: "1.1rem", marginBottom: ".8rem" }}>Call or WhatsApp</h2>
            <p style={{ margin: ".3rem 0" }}>
              <a href={`tel:${CONFIG.phone}`} className="link-strong">📞 {CONFIG.phone}</a>
            </p>
          </div>

          <div style={{
            background: "var(--white)",
            border: "1px solid var(--line)",
            borderRadius: "var(--radius-c)",
            padding: "1.4rem 1.5rem",
            boxShadow: "var(--shadow-sm)",
          }}>
            <h2 style={{ fontSize: "1.1rem", marginBottom: ".8rem" }}>Visit us</h2>
            <p style={{ margin: ".3rem 0", color: "var(--ink)" }}>{CONFIG.location}</p>
            <a
              href={CONFIG.mapsLink}
              target="_blank"
              rel="noopener"
              className="link-strong"
            >
              Open in Google Maps ↗
            </a>
          </div>

          <div style={{
            background: "var(--white)",
            border: "1px solid var(--line)",
            borderRadius: "var(--radius-c)",
            padding: "1.4rem 1.5rem",
            boxShadow: "var(--shadow-sm)",
          }}>
            <h2 style={{ fontSize: "1.1rem", marginBottom: ".8rem" }}>Online</h2>
            <p style={{ margin: ".3rem 0" }}>
              <a href={CONFIG.instagramReel} target="_blank" rel="noopener" className="link-strong">
                Instagram →
              </a>
            </p>
            {CONFIG.website && (
              <p style={{ margin: ".3rem 0" }}>
                <a href={`https://${CONFIG.website}`} target="_blank" rel="noopener" className="link-strong">
                  {CONFIG.website} ↗
                </a>
              </p>
            )}
          </div>

          <div style={{
            background: "var(--white)",
            border: "1px solid var(--line)",
            borderRadius: "var(--radius-c)",
            padding: "1.4rem 1.5rem",
            boxShadow: "var(--shadow-sm)",
          }}>
            <h2 style={{ fontSize: "1.1rem", marginBottom: ".8rem" }}>Donations &amp; receipts</h2>
            <p style={{ color: "var(--ink-soft)", margin: 0 }}>
              All donations are made directly via UPI to our {CONFIG.bank.bankName} account and
              are eligible for 80G tax exemption. For a receipt or any donation-related question,
              call us at the number above.
            </p>
          </div>
        </div>

        <p style={{ marginTop: "2.4rem", color: "var(--ink-soft)", fontSize: ".9rem" }}>
          See our{" "}
          <Link to="/privacy-policy" className="link-strong">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}