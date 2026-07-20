import React, { useEffect } from "react";
import Navbar from "@/components/charity/Navbar";
import Hero from "@/components/charity/Hero";
import About from "@/components/charity/About";
import Impact from "@/components/charity/Impact";
import Donate from "@/components/charity/Donate";
import Stories from "@/components/charity/Stories";
import Videos from "@/components/charity/Videos";
import Journey from "@/components/charity/Journey";
import DonorWall from "@/components/charity/DonorWall";
import Location from "@/components/charity/Location";
import FinalCTA from "@/components/charity/FinalCTA";
import Footer from "@/components/charity/Footer";
import StickyDonate from "@/components/charity/StickyDonate";

export default function Home() {
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

  return (
    <div className="charity-site">
      <Navbar />
      <main id="top">
        <Hero />
        <About />
        <Journey />
        <Impact />
        <Donate />
        <DonorWall />
        <Stories />
        <Videos />
        <Location />
        <FinalCTA />
      </main>
      <Footer />
      <StickyDonate />
    </div>
  );
}