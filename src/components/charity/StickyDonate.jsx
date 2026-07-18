import React, { useState, useEffect } from "react";
import { CONFIG, fmt } from "@/lib/charityConfig";

export default function StickyDonate() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = () => {
      const donate = document.getElementById("donate");
      if (!donate) return;
      const r = donate.getBoundingClientRect();
      const past = window.scrollY > window.innerHeight * 0.6;
      const inDonate = r.top < window.innerHeight && r.bottom > 0;
      setVisible(past && !inDonate);
    };
    window.addEventListener("scroll", handler, { passive: true });
    handler();
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <a
      href="#donate"
      className={`sticky-donate ${visible ? "is-visible" : ""}`}
    >
      Donate ₹{fmt(CONFIG.defaultAmount)} →
    </a>
  );
}