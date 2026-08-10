import React from "react";
import BackHeader from "@/components/charity/BackHeader";
import PullToRefresh from "@/components/charity/PullToRefresh";
import Donate from "@/components/charity/Donate";
import { useReveal } from "@/hooks/useReveal";

export default function DonatePage() {
  useReveal();
  return (
    <div className="charity-site">
      <BackHeader title="Donate" />
      <PullToRefresh>
        <main>
          <Donate />
        </main>
      </PullToRefresh>
    </div>
  );
}