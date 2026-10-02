import React from "react";
import { DONATE_URL, openDonate } from "@/lib/openDonate";

export default function DonateNowButton({ className = "btn btn--primary btn--lg", children, style }) {
  return (
    <a href={DONATE_URL} onClick={openDonate} className={className} style={style} rel="noopener">
      {children || <>Donate Now <span aria-hidden="true">→</span></>}
    </a>
  );
}