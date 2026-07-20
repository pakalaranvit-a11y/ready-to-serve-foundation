export const CONFIG = {
  orgName: "Ready To Serve Foundation",
  tagline: "A loving home for elders who have no one. Your gift becomes their next warm meal.",
  project: "Free Old Age Home — Vanasthalipuram, Hyderabad",
  location: "Vanasthalipuram, Hyderabad, Telangana, India",
  phone: "8790815527",
  email: "",
  regNo: "80G URN: AABTR1258HE2024-2025-2027",
  taxExemption: "Donations are eligible for tax exemption u/s 80G of the Income Tax Act, 1961.",
  upiId: "rsfoundation@icici",
  upiPayeeName: "Ready To Serve Foundation",
  bank: { accountName: "M/s. Ready To Serve Foundation", accountNumber: "030405003401", ifsc: "ICIC0000304", bankName: "ICICI Bank", branch: "Vanasthalipuram" },
  cardDonateUrl: "",
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
  const p = new URLSearchParams();
  p.set("pa", CONFIG.upiId);
  p.set("pn", CONFIG.upiPayeeName || CONFIG.orgName);
  p.set("tn", (note || ("Donation to " + CONFIG.orgName)).slice(0, 50));
  if (amount && amount > 0) {
    const a = Number(amount);
    if (!isNaN(a) && a > 0) p.set("am", a.toFixed(2).replace(/\.00$/, ""));
  }
  p.set("cu", "INR");
  // UPI apps decode %20 reliably; some misinterpret the '+' produced by URLSearchParams
  return "upi://pay?" + p.toString().replace(/\+/g, "%20");
}