import { secrets } from "base44:runtime";

async function hmacSha256Hex(key: string, message: string) {
  const enc = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    enc.encode(key),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", cryptoKey, enc.encode(message));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export default async function (req) {
  try {
    const body = await req.json().catch(() => ({}));
    const orderId = body?.razorpay_order_id;
    const paymentId = body?.razorpay_payment_id;
    const signature = body?.razorpay_signature;
    if (!orderId || !paymentId || !signature) {
      return Response.json({ error: "Missing payment details" }, { status: 400 });
    }
    const keySecret = secrets.get("RAZORPAY_KEY_SECRET");
    if (!keySecret) {
      return Response.json({ error: "Razorpay keys not configured" }, { status: 500 });
    }
    const expected = await hmacSha256Hex(keySecret, `${orderId}|${paymentId}`);
    if (expected !== signature) {
      return Response.json({ verified: false, error: "Signature mismatch" }, { status: 400 });
    }
    return Response.json({ verified: true, payment_id: paymentId, order_id: orderId });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}