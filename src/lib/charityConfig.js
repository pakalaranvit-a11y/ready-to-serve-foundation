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
  presets: [
    { amount: 200, label: "A day of meals for one elder" },
    { amount: 500, label: "Medicines for a week" },
    { amount: 1000, label: "Feed an elder for a month" },
    { amount: 5000, label: "Sponsor a birthday celebration" },
  ],
  defaultAmount: 1000,
  instagramReel: "https://www.instagram.com/reel/DX4B9sgsQLS/",
};

export function fmt(n) {
  return Number(n).toLocaleString("en-IN");
}

export function upiLink(amount) {
  const p = new URLSearchParams();
  p.set("pa", CONFIG.upiId);
  p.set("pn", CONFIG.upiPayeeName || CONFIG.orgName);
  p.set("cu", "INR");
  if (amount && amount > 0) p.set("am", String(amount));
  p.set("tn", "Donation to " + CONFIG.orgName);
  return "upi://pay?" + p.toString();
}