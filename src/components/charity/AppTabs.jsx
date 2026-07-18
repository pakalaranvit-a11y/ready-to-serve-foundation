import React, { useEffect, useState } from "react";
import { Home, Heart, Users, Smile } from "lucide-react";

const TABS = [
  { id: "top", label: "Home", Icon: Home },
  { id: "donate", label: "Donate", Icon: Heart },
  { id: "donors", label: "Donors", Icon: Users },
  { id: "elders", label: "Our Elders", Icon: Smile },
];

export default function AppTabs() {
  const [active, setActive] = useState("top");

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const sections = TABS.map((t) => document.getElementById(t.id)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  const go = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav className="app-tabs" aria-label="Sections">
      {TABS.map(({ id, label, Icon }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            type="button"
            className={`app-tab ${isActive ? "is-active" : ""}`}
            onClick={() => go(id)}
            aria-current={isActive ? "page" : undefined}
          >
            <Icon size={22} />
            <span>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}