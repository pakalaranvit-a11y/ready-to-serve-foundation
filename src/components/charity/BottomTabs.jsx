import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home as HomeIcon, Heart, Users, Settings as SettingsIcon } from "lucide-react";

const TABS = [
  { key: "home", label: "Home", path: "/", icon: HomeIcon },
  { key: "donate", label: "Donate", path: "/donate", icon: Heart },
  { key: "donors", label: "Donor Wall", path: "/donors", icon: Users },
  { key: "settings", label: "Settings", path: "/settings", icon: SettingsIcon },
];

export default function BottomTabs() {
  const location = useLocation();
  return (
    <nav className="bottom-tabs" aria-label="Mobile navigation">
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const active = location.pathname === tab.path;
        return (
          <Link
            key={tab.key}
            to={tab.path}
            replace
            className={`bottom-tab ${active ? "is-active" : ""}`}
            aria-current={active ? "page" : undefined}
            onClick={(e) => {
              if (tab.path === location.pathname) {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
          >
            <Icon size={22} strokeWidth={active ? 2.4 : 1.8} />
            <span>{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}