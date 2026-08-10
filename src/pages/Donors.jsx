import React from "react";
import BackHeader from "@/components/charity/BackHeader";
import PullToRefresh from "@/components/charity/PullToRefresh";
import DonorWall from "@/components/charity/DonorWall";

export default function DonorsPage() {
  return (
    <div className="charity-site">
      <PullToRefresh>
        <BackHeader title="Donor Wall" />
        <main>
          <DonorWall />
        </main>
      </PullToRefresh>
    </div>
  );
}