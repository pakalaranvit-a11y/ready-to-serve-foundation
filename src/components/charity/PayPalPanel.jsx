import React, { useEffect, useRef, useState } from "react";
import { CONFIG } from "@/lib/charityConfig";

const SDK_ID = "paypal-sdk";

function loadSdk(clientId) {
  if (window.paypal?.HostedButtons) return Promise.resolve(window.paypal);
  return new Promise((resolve, reject) => {
    let s = document.getElementById(SDK_ID);
    if (!s) {
      s = document.createElement("script");
      s.id = SDK_ID;
      s.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&components=hosted-buttons&enable-funding=venmo&currency=USD`;
      document.head.appendChild(s);
    }
    s.addEventListener("load", () => resolve(window.paypal));
    s.addEventListener("error", reject);
  });
}

// PayPal Hosted Buttons — PayPal wallet, Venmo, Pay Later and cards, paid into the foundation's PayPal account.
export default function PayPalPanel() {
  const { clientId, hostedButtonId } = CONFIG.paypal || {};
  const ref = useRef(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    if (!clientId || !hostedButtonId) return;
    let cancelled = false;
    loadSdk(clientId)
      .then((paypal) => {
        if (cancelled || !ref.current) return;
        ref.current.innerHTML = "";
        return paypal.HostedButtons({ hostedButtonId }).render(ref.current);
      })
      .then(() => !cancelled && setStatus("ready"))
      .catch(() => !cancelled && setStatus("error"));
    return () => { cancelled = true; };
  }, [clientId, hostedButtonId]);

  if (!clientId || !hostedButtonId) {
    return (
      <p className="hint" style={{ textAlign: "left" }}>
        PayPal donations are being set up — please use UPI or bank transfer for now.
      </p>
    );
  }

  return (
    <div className="bank-panel">
      <div ref={ref} style={{ background: "#fff", borderRadius: 12, padding: 8 }} />
      {status === "loading" && <p className="hint">Loading PayPal…</p>}
      {status === "error" && <p className="hint">PayPal couldn't load — please use UPI or bank transfer.</p>}
      <p className="hint">
        Pay with PayPal, Venmo, Pay Later or any debit / credit card. Amounts are in USD. International donors welcome.
      </p>
    </div>
  );
}