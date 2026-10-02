import React from "react";
import BackHeader from "@/components/charity/BackHeader";
import { CONFIG } from "@/lib/charityConfig";

const ROWS = [
  ["Legal name", CONFIG.bank.accountName.replace(/^M\/s\.\s*/, "")],
  ["Society registration no.", CONFIG.societyRegNo],
  ["Tax exemption", CONFIG.regNo],
  ["Country of registration", "India (Telangana)"],
  ["Founded", String(CONFIG.foundedYear)],
  ["Address", CONFIG.location],
  ["Phone", CONFIG.phone],
  ["Email", CONFIG.email],
  ["Website", CONFIG.website],
];

export default function About() {
  return (
    <div className="charity-site">
      <BackHeader title="About Us" />
      <main className="wrap" style={{ maxWidth: 640, paddingBlock: "1.2rem 2rem" }}>
        <h2 style={{ fontSize: "1.8rem", marginBottom: ".6rem" }}>{CONFIG.orgName}</h2>
        <p style={{ color: "var(--ink-soft)" }}>
          Since {CONFIG.foundedYear} we have run a free old age home in {CONFIG.location}, giving shelter, meals and medical care to elders with no one to look after them.
        </p>
        <dl className="bank__list card">
          {ROWS.filter(([, v]) => v).map(([k, v]) => (
            <React.Fragment key={k}><dt>{k}</dt><dd>{v}</dd></React.Fragment>
          ))}
        </dl>
        <p className="hint">{CONFIG.taxExemption}</p>
      </main>
    </div>
  );
}