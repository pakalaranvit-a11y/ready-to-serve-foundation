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
  // Razorpay no-code Donations Button: paste the data-key and data-button_id from your Razorpay dashboard embed code.
  razorpay: { key: "", buttonId: "" },
  // PayU: paste a hosted payment link URL from your PayU dashboard (enable custom amount for donations).
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

export function upiLink(amount, note) {
  // Keep '@' literal in the VPA — many UPI apps fail to decode %40 and reject the payment.
  const enc = (s) => encodeURIComponent(String(s)).replace(/%40/g, "@");
  const tn = (note || ("Donation to " + CONFIG.orgName)).slice(0, 50);
  let q = `pa=${enc(CONFIG.upiId)}&pn=${enc(CONFIG.upiPayeeName || CONFIG.orgName)}&tn=${enc(tn)}`;
  if (amount && amount > 0) {
    const a = Number(amount);
    if (!isNaN(a) && a > 0) q += `&am=${a.toFixed(2).replace(/\.00$/, "")}`;
  }
  q += "&cu=INR";
  return "upi://pay?" + q;
}