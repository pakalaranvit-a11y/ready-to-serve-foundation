import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";
import { CONFIG, fmt } from "@/lib/charityConfig";

/**
 * Inline (embedded) Razorpay card checkout — the card fields render right inside
 * the page instead of a popup window. Accepts Indian and international cards.
 */
export default function CardCheckout({ amount, donorName, frequency, onPaid }) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const containerRef = useRef(null);
  const rzpRef = useRef(null);

  useEffect(() => () => { try { rzpRef.current?.close?.(); } catch {} }, []);

  const start = async () => {
    if (!open) setOpen(true);
    if (!amount) return;
    if (!window.Razorpay) {
      toast({ title: "Card checkout is still loading…", description: "Please try again in a moment.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const res = await base44.functions.invoke("createRazorpayOrder", { amount });
      const orderId = res?.data?.order_id;
      if (!orderId) throw new Error("no order");
      if (containerRef.current) containerRef.current.innerHTML = "";
      const rzp = new window.Razorpay({
        key: res?.data?.key_id || CONFIG.razorpay?.keyId,
        order_id: orderId,
        amount: amount * 100,
        currency: "INR",
        name: CONFIG.orgName,
        description: frequency === "monthly" ? "Monthly donation" : "Donation",
        // Donors never see or type a phone number: we prefill the foundation's own
        // contact details and hide those fields entirely.
        prefill: {
          name: donorName || "",
          contact: (CONFIG.phone || "").replace(/[^\d+]/g, ""),
          email: CONFIG.email || "",
        },
        hidden: { contact: true, email: true },
        readonly: { contact: true, email: true },
        notes: { source: "rtsf_app_card" },
        theme: { color: "#0f5132" },
        parent: "#rzp-card-embed",
        method: { card: true, upi: false, netbanking: false, wallet: false, emi: false, paylater: false },
        config: {
          display: {
            blocks: { cards: { name: "Pay by credit / debit card", instruments: [{ method: "card" }] } },
            sequence: ["block.cards"],
            preferences: { show_default_blocks: false },
          },
        },
        handler: async (response) => {
          try {
            const v = await base44.functions.invoke("verifyRazorpayPayment", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            if (!v?.data?.verified) throw new Error("unverified");
            setDone(true);
            toast({ title: "Card payment successful 🙏", description: `₹${fmt(amount)} received — thank you!` });
            onPaid?.();
          } catch {
            toast({
              title: "We couldn't verify the payment",
              description: "If money left your account, contact us with your payment ID.",
              variant: "destructive",
            });
          }
        },
      });
      rzpRef.current = rzp;
      rzp.open();
    } catch {
      toast({ title: "Could not open card checkout", description: "Please try again or use UPI.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card-checkout">
      <button
        type="button"
        className="card-checkout__toggle"
        onClick={() => setOpen((o) => !o)}
        disabled={!amount || loading}
        aria-expanded={open}
      >
        <span>
          {done
            ? "✓ Card payment complete"
            : loading
            ? "Opening secure card form…"
            : `Pay ₹${fmt(amount || 0)} by credit / debit card`}
        </span>
        <ChevronDown size={18} style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
      </button>

      {open && (
        <div className="card-checkout__body">
          <p className="hint" style={{ textAlign: "left", margin: "0 0 .6rem" }}>
            Visa, Mastercard, RuPay and Amex — Indian or international cards welcome.
          </p>
          <div id="rzp-card-embed" ref={containerRef} className="card-checkout__frame" />
          {!done && (
            <button type="button" className="btn btn--primary btn--block" onClick={start} disabled={loading || !amount}>
              {loading ? "Loading…" : "Continue to secure card form"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}