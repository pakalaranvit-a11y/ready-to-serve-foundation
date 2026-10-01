import React from "react";

const CHECKOUT_URL = "https://www.paypal.com/ncp/payment/BFG5MHU7NGRDC";

// Card / PayPal donations via PayPal's secure hosted checkout page.
export default function PayPalPanel() {
  return (
    <div className="bank-panel">
      <a className="btn btn--primary btn--lg btn--block" href={CHECKOUT_URL} target="_blank" rel="noopener">
        Checkout with card <span aria-hidden="true">→</span>
      </a>
      <p className="hint" style={{ fontWeight: 600 }}>
        Opens PayPal's secure checkout. Enter your amount, then tap <strong>"Debit or Credit Card"</strong> to type in your card details. No PayPal account is needed.
      </p>
      <p className="hint">Also accepts PayPal, Venmo and Apple Pay. Amounts are in USD.</p>
    </div>
  );
}