export const CONFIG = {
  orgName: "Ready To Serve Foundation",
  tagline: "A loving home for elders who have no one. Your gift becomes their next warm meal.",
  project: "Free Old Age Home — Vanasthalipuram, Hyderabad",
  location: "Vanasthalipuram, Hyderabad, Telangana, India",
  phone: "8790815527",
  email: "",
  regNo: "",
  upiId: "8790815527@upi",
  upiPayeeName: "Ready To Serve Foundation",
  bank: { accountName: "", accountNumber: "", ifsc: "", bankName: "", branch: "" },
  cardDonateUrl: "",
  foundedYear: 2011,
  membersStart: 5,
  membersNow: 100,
  mapsQuery: "Vanasthalipuram, Hyderabad, Telangana",
  mapsEmbed: "https://www.google.com/maps?q=Vanasthalipuram%2CHyderabad%2CTelangana&output=embed",
  mapsLink: "https://www.google.com/maps/search/?api=1&query=Vanasthalipuram%2CHyderabad%2CTelangana",
  presets: [
    { amount: 160, label: "A day of meals for an elder" },
    { amount: 2000, label: "Medicine for one elder for a month" },
    { amount: 3500, label: "Food, groceries & medicine for a month" },
    { amount: 5000, label: "Sponsor a birthday celebration" },
  ],
  defaultAmount: 160,
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