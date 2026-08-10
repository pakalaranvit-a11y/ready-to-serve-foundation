import React from "react";
import BackHeader from "@/components/charity/BackHeader";
import PullToRefresh from "@/components/charity/PullToRefresh";
import Donate from "@/components/charity/Donate";

export default function DonatePage() {
  return (
    <div className="charity-site">
      <PullToRefresh>
        <BackHeader title="Donate" />
        <main>
          <Donate />
        </main>
      </PullToRefresh>
    </div>
  );
}