import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";
import { CONFIG, fmt } from "@/lib/charityConfig";

const copy = (value, done) => {
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(value).then(done).catch(() => {});
    return;
  }
  const t = document.createElement("textarea");
  t.value = value;
  document.body.appendChild(t);
  t.select();
  try { document.execCommand("copy"); } catch {}
  document.body.removeChild(t);
  done();
};

export default function BankTransferPanel({ amount, donorName }) {
  const { toast } = useToast();
  const [copiedKey, setCopiedKey] = useState("");
  const [name, setName] = useState(donorName || "");
  const [reference, setReference] = useState("");
  const [contact, setContact] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const rows = [
    ["Account name", CONFIG.bank.accountName],
    ["Account no.", CONFIG.bank.accountNumber],
    ["IFSC", CONFIG.bank.ifsc],
    ["Bank", CONFIG.bank.bankName],
    ["Branch", CONFIG.bank.branch],
  ].filter(([, v]) => v);

  const submit = async () => {
    if (!name.trim() || !amount) return;
    setSending(true);
    try {
      await base44.entities.BankTransfer.create({
        donor_name: name.trim(),
        amount,
        reference: reference.trim(),
        contact: contact.trim(),
      });
      setSent(true);
      toast({
        title: "Transfer details received 🙏",
        description: "Our team will verify it with the bank and add you to the donor wall.",
      });
    } catch (err) {
      toast({
        title: "Couldn't submit your transfer details",
        description: "Please try again, or call us so we can note it manually.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bank-panel">
      <p className="bank-panel__lead">
        Send <strong>₹{fmt(amount || 0)}</strong> by NEFT / IMPS / RTGS from your banking app using these details, then
        tell us below so we can match your transfer.
      </p>

      <div className="bank-panel__rows">
        {rows.map(([label, value]) => (
          <button
            key={label}
            type="button"
            className="copy-row"
            onClick={() => copy(value, () => { setCopiedKey(label); setTimeout(() => setCopiedKey(""), 1600); })}
          >
            <span className="copy-row__label">{label}</span>
            <span className="copy-row__value">{value}</span>
            <span className="copy-row__btn" aria-hidden="true">{copiedKey === label ? "Copied ✓" : "Copy"}</span>
          </button>
        ))}
      </div>

      <div className="bank-panel__form">
        <h4>I've made the transfer</h4>
        <label className="field">
          <input type="text" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} maxLength={60} disabled={sent} />
        </label>
        <label className="field">
          <input type="text" placeholder="UTR / reference number (optional)" value={reference} onChange={(e) => setReference(e.target.value)} maxLength={40} disabled={sent} />
        </label>
        <label className="field">
          <input type="text" placeholder="Phone or email (optional)" value={contact} onChange={(e) => setContact(e.target.value)} maxLength={60} disabled={sent} />
        </label>
        <button
          type="button"
          className="btn btn--primary btn--block"
          onClick={submit}
          disabled={sending || sent || !name.trim() || !amount}
        >
          {sent ? "✓ Details sent — thank you!" : sending ? "Sending…" : `Notify us about my ₹${fmt(amount || 0)} transfer`}
        </button>
        <p className="hint">
          We verify every bank transfer manually before adding it to the donor wall. {CONFIG.taxExemption}
        </p>
      </div>
    </div>
  );
}