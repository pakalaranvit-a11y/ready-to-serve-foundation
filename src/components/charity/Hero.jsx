import React, { useEffect, useRef } from "react";

function AnimatedCounter({ target, duration = 1400 }) {
  const ref = useRef(null);
  const animated = useRef(false);

  useEffect(() => {
    if (!ref.current || animated.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting || animated.current) return;
          animated.current = true;
          observer.unobserve(e.target);
          let t0 = null;
          const step = (ts) => {
            if (!t0) t0 = ts;
            const p = Math.min((ts - t0) / duration, 1);
            const val = Math.floor((1 - Math.pow(1 - p, 3)) * target);
            if (ref.current) ref.current.textContent = val.toLocaleString("en-IN");
            if (p < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        });
      },
      { threshold: 0.6 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return <strong ref={ref}>0</strong>;
}

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero__bg" aria-hidden="true">
        <div className="hero__scrim" />
      </div>
      <div className="wrap hero__inner">
        <span className="eyebrow">Free Old Age Home · Vanasthalipuram, Hyderabad</span>
        <h1 className="hero__title">
          No elder should<br />face old age <em>alone.</em>
        </h1>
        <p className="hero__lede">
          At the Ready&nbsp;To&nbsp;Serve Foundation we give abandoned and destitute elders a home — meals, medicine, dignity and family. Your donation goes <strong>directly</strong> to the people who need it most.
        </p>
        <div className="hero__cta">
          <a href="#donate" className="btn btn--primary btn--lg">
            Donate now <span aria-hidden="true">→</span>
          </a>
          <a href="#stories" className="btn btn--ghost btn--lg">Watch their stories</a>
        </div>
        <ul className="hero__stats" role="list">
          <li>
            <AnimatedCounter target={40} />
            <span>Elders cared for</span>
          </li>
          <li>
            <AnimatedCounter target={1095} />
            <span>Meals served / month</span>
          </li>
          <li>
            <strong>100%</strong>
            <span>Goes to the home</span>
          </li>
        </ul>
      </div>
      <a href="#about" className="hero__scroll" aria-label="Scroll down">▾</a>
    </section>
  );
}