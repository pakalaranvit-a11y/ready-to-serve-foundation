import React from "react";
import { CONFIG } from "@/lib/charityConfig";

// PayPal hosted Donate link — donors can pay with PayPal balance (wallet), Venmo, Pay Later,
// or any Visa / Mastercard / Amex card, from any country.
export default function PayPalPanel() {
  const url = CONFIG.paypal?.donateUrl;
  if (!url) {
    return (
      <p className="hint" style={{ textAlign: "left" }}>
        PayPal donations are being set up — please use UPI or bank transfer for now.
      </p>
    );
  }
  return (
    <div className="bank-panel">
      <a className="btn btn--primary btn--lg btn--block" href={url} target="_blank" rel="noopener">
        Donate with PayPal, wallet or card <span aria-hidden="true">→</span>
      </a>
      <p className="hint">
        Opens PayPal's secure page. Pay with your PayPal wallet balance, Venmo, Pay Later or any debit / credit card — no PayPal account needed for cards. International donors welcome.
      </p>
    </div>
  );
}