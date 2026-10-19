import React, { useState } from "react";
import { Share2 } from "lucide-react";
import { CONFIG } from "@/lib/charityConfig";
import { shareContent, tap } from "@/lib/native";
import DonateNowButton from "@/components/charity/DonateNowButton";

export default function FinalCTA() {
  const [shared, setShared] = useState(false);

  const handleShare = async () => {
    const data = {
      title: `${CONFIG.orgName} — ${CONFIG.motto}`,
      text: `${CONFIG.tagline} Support our free old age home in Hyderabad.`,
      url: window.location.origin,
    };
    try {
      tap();
      if (await shareContent(data)) {
        /* shared via native or web share sheet */
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(`${data.text} ${data.url}`);
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      }
    } catch {
      /* user cancelled — no action needed */
    }
  };

  return (
    <section className="section finalcta">
      <div className="wrap finalcta__inner" data-reveal="">
        <h2>One meal. One elder. Today.</h2>
        <p>It takes less than a minute, and it changes someone's whole day.</p>
        <DonateNowButton />
        <div style={{ marginTop: "1.4rem", display: "flex", justifyContent: "center", gap: ".8rem", flexWrap: "wrap", alignItems: "center" }}>
          <button
            type="button"
            onClick={handleShare}
            className="btn btn--ghost btn--sm"
            style={{ "--fg": "var(--green-900)", borderColor: "rgba(11,61,46,.35)" }}
          >
            <Share2 size={18} /> Share this cause
          </button>
          {shared && <span style={{ fontSize: ".85rem", fontWeight: 700, color: "var(--green-900)" }}>Copied link ✓</span>}
        </div>
      </div>
    </section>
  );
}