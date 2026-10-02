import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import BackHeader from "@/components/charity/BackHeader";

const LINKS = [
  ["My Giving", "/my-giving"],
  ["Donor Wall", "/donors"],
  ["About Us", "/about"],
  ["Where your money goes", "/impact"],
  ["Contact & Support", "/support"],
  ["Privacy Policy", "/privacy"],
  ["Terms of Use", "/terms"],
  ["Account & Settings", "/settings"],
];

export default function More() {
  return (
    <div className="charity-site">
      <BackHeader title="More" />
      <main className="wrap" style={{ maxWidth: 640, paddingBlock: "1.2rem 2rem" }}>
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          {LINKS.map(([label, to]) => (
            <Link key={to} to={to} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", minHeight: 52, padding: "0 1.1rem", borderBottom: "1px solid var(--line)", fontWeight: 600 }}>
              {label} <ChevronRight size={18} />
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}