import React, { useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

const THRESHOLD = 70;

export default function PullToRefresh({ children }) {
  const queryClient = useQueryClient();
  const [pull, setPull] = useState(0);
  const [pulling, setPulling] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef(0);
  const active = useRef(false);

  const onTouchStart = (e) => {
    if (refreshing || window.scrollY > 0) {
      active.current = false;
      return;
    }
    startY.current = e.touches[0].clientY;
    active.current = true;
  };

  const onTouchMove = (e) => {
    if (!active.current || refreshing) return;
    const dy = e.touches[0].clientY - startY.current;
    if (dy > 0 && window.scrollY <= 0) {
      setPulling(true);
      setPull(Math.min(dy * 0.5, 110));
    } else if (dy <= 0 && pull !== 0) {
      setPull(0);
    }
  };

  const endPull = async () => {
    if (!active.current) return;
    active.current = false;
    setPulling(false);
    if (pull >= THRESHOLD) {
      setRefreshing(true);
      setPull(44);
      try {
        await queryClient.invalidateQueries();
        window.dispatchEvent(new Event("app-refresh"));
        await new Promise((r) => setTimeout(r, 650));
      } finally {
        setRefreshing(false);
        setPull(0);
      }
    } else {
      setPull(0);
    }
  };

  return (
    <div
      className="ptr"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={endPull}
      onTouchCancel={endPull}
    >
      <div
        className="ptr__indicator"
        style={{
          transform: `translate3d(0, ${pull}px, 0)`,
          opacity: pull > 0 ? 1 : 0,
          transition: pulling ? "none" : "transform .2s ease, opacity .2s ease",
        }}
        aria-hidden="true"
      >
        <span className={`ptr__icon ${refreshing ? "is-spinning" : ""}`}>⟳</span>
      </div>
      {children}
    </div>
  );
}