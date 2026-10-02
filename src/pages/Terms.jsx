import React from "react";
import BackHeader from "@/components/charity/BackHeader";
import { CONFIG } from "@/lib/charityConfig";

const SECTIONS = [
  ["Using this app", `This app is run by ${CONFIG.orgName} so people can learn about our old age home and donate to it. You can browse it without an account.`],
  ["Donations", "All donations are voluntary gifts to a charitable organisation. Nothing is sold, and donations do not unlock goods, perks or app features. Card and PayPal payments are processed by PayPal. UPI and bank transfers go directly to the foundation's bank account."],
  ["Refunds", `If you donated by mistake, contact us within 7 days at ${CONFIG.phone} and we will review your request.`],
  ["Content", "Stories and photos show real residents and activities of the home. Please do not reuse them without permission."],
  ["Changes", "We may update these terms. The latest version is always in the app and on our website."],
  ["Contact", `${CONFIG.orgName}, ${CONFIG.location}. Phone: ${CONFIG.phone}.`],
];

export default function Terms() {
  return (
    <div className="charity-site">
      <BackHeader title="Terms of Use" />
      <main className="wrap" style={{ maxWidth: 680, paddingBlock: "1.2rem 2rem" }}>
        {SECTIONS.map(([h, t]) => (
          <section key={h} style={{ marginBottom: "1.2rem" }}>
            <h3 style={{ fontSize: "1.15rem", marginBottom: ".3rem" }}>{h}</h3>
            <p style={{ color: "var(--ink-soft)", margin: 0 }}>{t}</p>
          </section>
        ))}
      </main>
    </div>
  );
}