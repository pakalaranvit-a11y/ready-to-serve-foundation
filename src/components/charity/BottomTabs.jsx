import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home as HomeIcon, Heart, Users, Settings as SettingsIcon } from "lucide-react";

const TABS = [
  { key: "home", label: "Home", icon: HomeIcon, kind: "section", id: "top" },
  { key: "donate", label: "Donate", icon: Heart, kind: "section", id: "donate" },
  { key: "donors", label: "Donor Wall", icon: Users, kind: "section", id: "donors" },
  { key: "settings", label: "Settings", icon: SettingsIcon, kind: "route", path: "/settings" },
];

export default function BottomTabs() {
  const navigate = useNavigate();
  const location = useLocation();

  const go = (tab) => {
    if (tab.kind === "route") {
      navigate(tab.path);
      return;
    }
    const scroll = () => {
      const el = document.getElementById(tab.id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    if (location.pathname === "/") {
      scroll();
    } else {
      navigate("/");
      setTimeout(scroll, 140);
    }
  };

  const isActive = (tab) => {
    if (tab.kind === "route") return location.pathname === tab.path;
    return location.pathname === "/" && tab.key === "home";
  };

  return (
    <nav className="bottom-tabs" aria-label="Mobile navigation">
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const active = isActive(tab);
        return (
          <button
            key={tab.key}
            type="button"
            className={`bottom-tab ${active ? "is-active" : ""}`}
            onClick={() => go(tab)}
            aria-label={tab.label}
            aria-current={active ? "page" : undefined}
          >
            <Icon size={22} strokeWidth={active ? 2.4 : 1.8} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}