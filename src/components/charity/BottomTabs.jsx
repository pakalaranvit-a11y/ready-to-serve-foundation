import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home as HomeIcon, Heart, BarChart3, BookOpen, Menu } from "lucide-react";
import { useIsKeyboardActive } from "@/hooks/use-mobile";
import { DONATE_URL, openDonate } from "@/lib/openDonate";

const TABS = [
  { key: "home", label: "Home", path: "/", icon: HomeIcon },
  { key: "impact", label: "Impact", path: "/impact", icon: BarChart3 },
  { key: "stories", label: "Stories", path: "/stories", icon: BookOpen },
  { key: "donate", label: "Donate", path: "/donate", icon: Heart },
  { key: "more", label: "More", path: "/more", icon: Menu },
];

// Map any pathname to the tab that owns it (child routes resolve to their parent tab).
function pathToTab(path) {
  if (path === "/") return "home";
  if (path === "/impact") return "impact";
  if (path === "/stories") return "stories";
  if (path === "/donate") return "donate";
  return "more";
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

  const keyboardActive = useIsKeyboardActive();
  if (keyboardActive) return null;

  return (
    <nav className="bottom-tabs" aria-label="Mobile navigation">
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentTab === tab.key;
        // Active tab resets to its root; inactive tabs restore their last sub-path.
        const target = isActive ? tab.path : (lastPaths[tab.key] || tab.path);
        if (tab.key === "donate") {
          return (
            <a key={tab.key} href={DONATE_URL} onClick={openDonate} className="bottom-tab">
              <Icon size={22} strokeWidth={1.8} />
              <span>{tab.label}</span>
            </a>
          );
        }
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