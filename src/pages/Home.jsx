import React from "react";
import { useReveal } from "@/hooks/useReveal";
import Navbar from "@/components/charity/Navbar";
import Hero from "@/components/charity/Hero";
import About from "@/components/charity/About";
import Impact from "@/components/charity/Impact";
import Stories from "@/components/charity/Stories";
import NotableSupporters from "@/components/charity/NotableSupporters";
import Videos from "@/components/charity/Videos";
import Journey from "@/components/charity/Journey";
import DonorWall from "@/components/charity/DonorWall";
import Location from "@/components/charity/Location";
import FinalCTA from "@/components/charity/FinalCTA";
import Footer from "@/components/charity/Footer";
import SocialLinks from "@/components/charity/SocialLinks";
import PullToRefresh from "@/components/charity/PullToRefresh";


export default function Home() {
  useReveal();

  return (
    <div className="charity-site">
      <Navbar />
      <PullToRefresh>
        <main id="top">
          <Hero />
          <About />
          <Journey />
          <Impact />
          <DonorWall />
          <Stories />
          <NotableSupporters />
          <Videos />
          <SocialLinks />
          <Location />
          <FinalCTA />
        </main>
        <Footer />
      </PullToRefresh>
    </div>
  );
}