import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home as HomeIcon, Heart, Users, Settings as SettingsIcon } from "lucide-react";

const TABS = [
  { key: "home", label: "Home", path: "/", icon: HomeIcon },
  { key: "donate", label: "Donate", path: "/donate", icon: Heart },
  { key: "donors", label: "Donor Wall", path: "/donors", icon: Users },
  { key: "settings", label: "Settings", path: "/settings", icon: SettingsIcon },
];

// Map any pathname to the tab that owns it (child routes resolve to their parent tab).
function pathToTab(path) {
  if (path === "/donate") return "donate";
  if (path === "/donors") return "donors";
  if (path === "/settings" || path === "/support" || path === "/privacy" || path === "/privacy-policy") return "settings";
  return "home";
}

const storageKey = (key) => `last_tab_${key}`;

export default function BottomTabs() {
  const location = useLocation();
  const currentTab = pathToTab(location.pathname);

  const [lastPaths, setLastPaths] = useState(() => {
    const init = {};
    TABS.forEach((t) => {
      const v = sessionStorage.getItem(storageKey(t.key));
      if (v) init[t.key] = v;
    });
    return init;
  });

  useEffect(() => {
    sessionStorage.setItem(storageKey(currentTab), location.pathname);
    setLastPaths((prev) => (prev[currentTab] === location.pathname ? prev : { ...prev, [currentTab]: location.pathname }));
  }, [currentTab, location.pathname]);

  return (
    <nav className="bottom-tabs" aria-label="Mobile navigation">
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentTab === tab.key;
        // Active tab resets to its root; inactive tabs restore their last sub-path.
        const target = isActive ? tab.path : (lastPaths[tab.key] || tab.path);
        return (
          <Link
            key={tab.key}
            to={target}
            replace
            className={`bottom-tab ${isActive ? "is-active" : ""}`}
            aria-current={isActive ? "page" : undefined}
            onClick={(e) => {
              if (target === location.pathname) {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
          >
            <Icon size={22} strokeWidth={isActive ? 2.4 : 1.8} />
            <span>{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}