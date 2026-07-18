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
  // Our journey
  sinceYear: 2011,
  startYear: 2011,
  startMembers: 5,
  currentYear: 2026,
  currentMembers: 100,
  // Donation presets
  presets: [
    { amount: 160, label: "A day of meals for one elder" },
    { amount: 2000, label: "Medicine for one elder for a month" },
    { amount: 4500, label: "Food, groceries & medicine for elders for a month" },
  ],
  defaultAmount: 160,
  // Map
  mapQuery: "Vanasthalipuram, Hyderabad, Telangana, India",
  // Thank-you messages (shown after a gift)
  thankYouMessages: [
    "Your kindness just became someone's warm meal. Thank you for serving with us. 🙏",
    "Because of you, an elder will sleep with a full stomach tonight. Thank you. ❤️",
    "You've shown that no elder is truly alone. We are grateful for your heart. 🌷",
    "Every rupee you gave reaches the home today. Thank you for being family. 🙏",
  ],
  // Elders in our care
  elders: [
    {
      name: "Lakshmi",
      age: 78,
      from: "Warangal, Telangana",
      photo: "https://images.unsplash.com/photo-1749189516333-168cfd97de0b?fm=jpg&q=60&w=900&auto=format&fit=crop",
      story: "Left with no family after her husband passed, Lakshmi amma found a home here in 2019. She leads the morning prayers and makes the best filter coffee for everyone.",
    },
    {
      name: "Ramaiah",
      age: 82,
      from: "Mahbubnagar, Telangana",
      photo: "https://images.unsplash.com/photo-1780504862873-5f4ff5c322e9?fm=jpg&q=60&w=900&auto=format&fit=crop",
      story: "A retired farm worker who once had no one to care for him. Today he's the home's storyteller, and every birthday begins with his blessings.",
    },
    {
      name: "Saraswathi",
      age: 71,
      from: "Nalgonda, Telangana",
      photo: "https://images.unsplash.com/photo-1764426381345-f33736598e42?fm=jpg&q=60&w=900&auto=format&fit=crop",
      story: "Saraswathi amma came to us after a long illness. With regular medicines and three meals a day, she now tends the small garden in our courtyard with pride.",
    },
    {
      name: "Venkat Rao",
      age: 76,
      from: "Hyderabad, Telangana",
      photo: "https://images.unsplash.com/photo-1780314501266-0158179ba545?fm=jpg&q=60&w=900&auto=format&fit=crop",
      story: "A grandfather abandoned by his own, Venkat now has a new family. He helps the younger volunteers and says every day here feels like a festival.",
    },
  ],
  instagramReel: "https://www.instagram.com/reel/DX4B9sgsQLS/",
};

export function fmt(n) {
  return Number(n).toLocaleString("en-IN");
}

export function upiLink(amount) {
  const p = new URLSearchParams();
  p.set("pa", CONFIG.upiId);
  p.set("pn", CONFIG.upiPayeeName || CONFIG.orgName);
  p.set("tn", "Donation to " + CONFIG.orgName);
  if (amount && amount > 0) {
    const a = Number(amount);
    if (!isNaN(a) && a > 0) p.set("am", a.toFixed(2).replace(/\.00$/, ""));
  }
  p.set("cu", "INR");
  // UPI apps decode %20 reliably; some misinterpret the '+' produced by URLSearchParams
  return "upi://pay?" + p.toString().replace(/\+/g, "%20");
}

export function mapsLink() {
  return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(CONFIG.mapQuery);
}

export function mapsEmbed() {
  return "https://www.google.com/maps?q=" + encodeURIComponent(CONFIG.mapQuery) + "&output=embed";
}