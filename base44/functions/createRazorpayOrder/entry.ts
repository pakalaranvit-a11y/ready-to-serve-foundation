import { secrets } from "base44:runtime";

export default async function(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const amount = Number(body?.amount);
    if (!amount || amount < 1) {
      return Response.json({ error: "Invalid amount" }, { status: 400 });
    }
    const keyId = secrets.get("RAZORPAY_KEY_ID");
    const keySecret = secrets.get("RAZORPAY_KEY_SECRET");
    if (!keyId || !keySecret) {
      return Response.json({ error: "Razorpay keys not configured" }, { status: 500 });
    }
    const auth = btoa(`${keyId}:${keySecret}`);
    const res = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100),
        currency: "INR",
        receipt: `donation_${Date.now()}`,
        notes: { source: "rtsf_app" },
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      return Response.json({ error: data?.error?.description || "Razorpay order failed" }, { status: 502 });
    }
    return Response.json({ order_id: data.id, amount: data.amount, currency: data.currency, key_id: keyId });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}