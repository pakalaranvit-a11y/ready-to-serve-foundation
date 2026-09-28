import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";
import { fmt } from "@/lib/charityConfig";

// After paying by UPI / PayPal, donors send their details so the team can match the
// payment in the bank / PayPal account and add them to the donor wall.
export default function PaymentClaimForm({ amount, method }) {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");
  const [ref, setRef] = useState("");
  const [anon, setAnon] = useState(false);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async () => {
    if (!amount || busy) return;
    setBusy(true);
    try {
      await base44.functions.invoke("submitBankTransfer", {
        donor_name: anon ? "Anonymous" : (name.trim() || "Anonymous"),
        amount,
        reference: ref.trim(),
        message: `[${method}] ${msg.trim()}`,
      });
      setDone(true);
      toast({ title: "Thank you! 🙏", description: `We'll confirm your ₹${fmt(amount)} gift and add you to the donor wall.` });
    } catch {
      toast({ title: "Couldn't send your details", description: "Please try again or call us.", variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    return <div className="thanks-box" role="status">Thank you for your gift! Our team will confirm your payment and add you to the donor wall shortly. 🙏</div>;
  }

  return (
    <div className="recog">
      <h4>Already paid? Join the donor wall</h4>
      <p>Send your details after paying. We match them with the payment we received, then add you to the wall.</p>
      <label className="field"><input type="text" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} disabled={anon} maxLength={60} /></label>
      <label className="field"><input type="text" placeholder="Transaction / UTR / PayPal ID (optional)" value={ref} onChange={(e) => setRef(e.target.value)} maxLength={40} /></label>
      <label className="field"><textarea rows={2} placeholder="A message for the elders (optional)" value={msg} onChange={(e) => setMsg(e.target.value)} maxLength={140} /></label>
      <div className="recog__row">
        <input type="checkbox" id="anon" checked={anon} onChange={(e) => setAnon(e.target.checked)} />
        <label htmlFor="anon">Donate anonymously</label>
      </div>
      <button type="button" className="btn btn--ghost btn--block" disabled={!amount || busy} onClick={submit}>
        {busy ? "Sending…" : `I've paid ₹${fmt(amount || 0)} — add me to the wall`}
      </button>
    </div>
  );
}