import { useEffect } from "react";

/**
 * Reveals elements marked with [data-reveal] as they scroll into view.
 * Shared by every page that renders reveal-animated sections so that
 * standalone routes (e.g. /donate, /donors) don't leave content at opacity 0.
 */
export function useReveal() {
  useEffect(() => {
    const targets = document.querySelectorAll("[data-reveal]");
    if (!("IntersectionObserver" in window)) {
      targets.forEach((t) => t.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);
}