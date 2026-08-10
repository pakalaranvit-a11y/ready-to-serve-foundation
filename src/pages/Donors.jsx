import React from "react";
import BackHeader from "@/components/charity/BackHeader";
import PullToRefresh from "@/components/charity/PullToRefresh";
import DonorWall from "@/components/charity/DonorWall";
import { useReveal } from "@/hooks/useReveal";

export default function DonorsPage() {
  useReveal();
  return (
    <div className="charity-site">
      <BackHeader title="Donor Wall" />
      <PullToRefresh>
        <main>
          <DonorWall />
        </main>
      </PullToRefresh>
    </div>
  );
}