export const CONFIG = {
  orgName: "Ready To Serve Foundation",
  tagline: "A loving home for elders who have no one. Your gift becomes their next warm meal.",
  project: "Free Old Age Home — Vanasthalipuram, Hyderabad",
  location: "Vanasthalipuram, Hyderabad, Telangana, India",
  phone: "8790815527",
  email: "",
  regNo: "80G URN: AABTR1258HE2024-2025-2027",
  societyRegNo: "46/IV/2011",
  website: "www.readytoservefoundation.com",
  motto: "We Serve the Needy",
  campaign: {
    title: "Build a home for 300 elders",
    sqFtPrice: 3500,
    capacity: 300,
    body: "You can contribute by donating at least 1 sq ft (or more) at ₹3,500 per sq ft. Together, we can construct a caring shelter for 300 people in need. Your small step can become a lifelong support for them.",
    cta: "Sponsor 1 sq ft",
  },
  taxExemption: "Donations are eligible for tax exemption u/s 80G of the Income Tax Act, 1961.",
  upiId: "rsfoundation@icici",
  upiPayeeName: "Ready To Serve Foundation",
  bank: { accountName: "M/s. Ready To Serve Foundation", accountNumber: "030405003401", ifsc: "ICIC0000304", bankName: "ICICI Bank", branch: "Vanasthalipuram" },
  cardDonateUrl: "",
  // ─────────────────────────────────────────────────────────────────────
  // RAZORPAY — no-code Donations Button (no secret API key needed)
  // ─────────────────────────────────────────────────────────────────────
  // Steps:
  //  1. Log in to https://dashboard.razorpay.com
  //  2. Left menu → "Donations" → create/enable your donation page
  //  3. Click "Embed" / "Get embed code"
  //  4. In the generated HTML find: <button data-key="rzp_live_XXXX" data-button_id="pl_YYYY" ...>
  //  5. Copy the rzp_live_XXXX value → paste below as `key`
  //  6. Copy the pl_YYYY value → paste below as `buttonId`
  // Both values are PUBLIC (safe to ship in the app). No secret key is used.
  razorpay: { key: "", buttonId: "" },
  // ─────────────────────────────────────────────────────────────────────
  // PAYU — hosted payment link (no API key needed)
  // ─────────────────────────────────────────────────────────────────────
  // Steps:
  //  1. Log in to https://onetpl.payu.in
  //  2. Left menu → "Payment Links" → "Create Link"
  //  3. Set amount to "Customer decides" (lets donors enter any amount)
  //  4. Save and copy the shareable URL, e.g. https://payu.in/pay/abcdef123
  //  5. Paste that URL below as `paymentLink`
  payu: { paymentLink: "" },
  foundedYear: 2011,
  membersStart: 5,
  membersNow: 100,
  mapsQuery: "Vanasthalipuram, Hyderabad, Telangana",
  mapsEmbed: "https://www.google.com/maps?q=Vanasthalipuram%2CHyderabad%2CTelangana&output=embed",
  mapsLink: "https://www.google.com/maps/search/?api=1&query=Vanasthalipuram%2CHyderabad%2CTelangana",
  presets: [
    { amount: 101, label: "A day's meals for an elder" },
    { amount: 501, label: "A few days of nourishment" },
    { amount: 1001, label: "A week of meals & care" },
    { amount: 2000, label: "Medicine for one elder / month" },
    { amount: 3500, label: "Food, groceries & medicine / month" },
    { amount: 5000, label: "Sponsor a birthday celebration" },
    { amount: 10001, label: "Sponsor an elder for a month" },
    { amount: 50001, label: "Sponsor an elder for half a year" },
    { amount: 100001, label: "Sponsor an elder for a full year" },
  ],
  defaultAmount: 2000,
  instagramReel: "https://www.instagram.com/reel/DX4B9sgsQLS/",
};

export function fmt(n) {
  return Number(n).toLocaleString("en-IN");
}

// Shared UPI query string (pa, pn, tn, am, cu). '@' kept literal — many UPI apps
// fail to decode %40 and reject the payment.
export function upiQuery(amount, note) {
  const enc = (s) => encodeURIComponent(String(s)).replace(/%40/g, "@");
  const tn = (note || ("Donation to " + CONFIG.orgName)).slice(0, 50);
  let q = `pa=${enc(CONFIG.upiId)}&pn=${enc(CONFIG.upiPayeeName || CONFIG.orgName)}&tn=${enc(tn)}`;
  if (amount && amount > 0) {
    const a = Number(amount);
    if (!isNaN(a) && a > 0) q += `&am=${a.toFixed(2).replace(/\.00$/, "")}`;
  }
  q += "&cu=INR";
  return q;
}

export function upiLink(amount, note) {
  return "upi://pay?" + upiQuery(amount, note);
}

// iOS has no system UPI intent, so the generic upi:// scheme fails. Individual UPI
// apps register their own URL schemes on iOS — use those to open the app with the
// payment details prefilled. (Schemes per shambu2k/upi-intent registry.)
export function upiAppLink(appId, amount, note) {
  const q = upiQuery(amount, note);
  const map = {
    gpay: `gpay://upi/pay?${q}`,
    phonepe: `phonepe://pay?${q}`,
    paytm: `paytmmp://pay?${q}`,
    bhim: `bhim://upi/pay?${q}`,
  };
  return map[appId] || `upi://pay?${q}`;
}