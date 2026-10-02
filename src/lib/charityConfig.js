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
  // Merchant category code — 8398 = charitable & social service organisations.
  upiMerchantCode: "8398",
  bank: { accountName: "M/s. Ready To Serve Foundation", accountNumber: "030405003401", ifsc: "ICIC0000304", bankName: "ICICI Bank", branch: "Vanasthalipuram" },
  cardDonateUrl: "",
  // PAYPAL — paste your PayPal Donate button link here, e.g.
  // "https://www.paypal.com/donate/?hosted_button_id=XXXXXXXX"  (or a https://paypal.me/yourname link)
  paypal: {
    clientId: "BAAkLlq3IcTyIRxhwUtZmARB5nr24IdSISAl6kQPzboYoTVqLYTOkxDDGb31MbvglLvO3Y0NQFIeB-gypA",
    // From PayPal's button code: paypal.HostedButtons({ hostedButtonId: "XXXX" })
    hostedButtonId: "BFG5MHU7NGRDC",
  },
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
  // Edit these to your exact account URLs if they differ.
  social: {
    instagram: "https://www.instagram.com/readytoservefoundations/",
    facebook: "https://www.facebook.com/ready2servefoundation/",
    youtube: "",
  },
};

export function fmt(n) {
  return Number(n).toLocaleString("en-IN");
}

// Shared UPI query string (pa, pn, tn, am, cu). '@' kept literal — many UPI apps
// fail to decode %40 and reject the payment.
export function upiQuery(amount, note) {
  const enc = (s) => encodeURIComponent(String(s)).replace(/%40/g, "@");
  // Merchant (P2M) VPAs like rsfoundation@icici are declined by UPI apps unless the
  // request carries a merchant category code and a unique transaction reference.
  const tn = (note || ("Donation to " + CONFIG.orgName))
    .replace(/[^a-zA-Z0-9 .-]/g, " ")
    .slice(0, 50)
    .trim();
  // Keep the link minimal: unsigned merchant fields (mc/tr/mode) make GPay reject the payment.
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
  // On Android the system UPI intent is far more reliable than each app's own
  // scheme (PhonePe in particular often ignores phonepe://pay), so let Android
  // show its UPI app chooser instead.
  if (typeof navigator !== "undefined" && /Android/i.test(navigator.userAgent || "")) {
    return `upi://pay?${q}`;
  }
  const map = {
    gpay: `gpay://upi/pay?${q}`,
    phonepe: `phonepe://pay?${q}`,
    paytm: `paytmmp://pay?${q}`,
    bhim: `bhim://upi/pay?${q}`,
  };
  return map[appId] || `upi://pay?${q}`;
}