import React from "react";

export function LogoMark({ size = 26 }) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} fill="none" aria-hidden="true">
      <circle cx="24" cy="10.5" r="4.6" fill="#ef6c2b" />
      <path d="M24 15.4v15" stroke="#1b9e5f" strokeWidth="3.6" strokeLinecap="round" />
      <path d="M24 21.5 13.5 11.5" stroke="#ef6c2b" strokeWidth="3.4" strokeLinecap="round" />
      <path d="M24 21.5 34.5 11.5" stroke="#ef6c2b" strokeWidth="3.4" strokeLinecap="round" />
      <path d="M24 30.5 17 41" stroke="#1b9e5f" strokeWidth="3.4" strokeLinecap="round" />
      <path d="M24 30.5 31 41" stroke="#1b9e5f" strokeWidth="3.4" strokeLinecap="round" />
    </svg>
  );
}

export default function Logo() {
  return (
    <a className="brand" href="#top" aria-label="Ready To Serve Foundation home">
      <span className="brand__mark" aria-hidden="true">
        <LogoMark size={26} />
      </span>
      <span className="brand__text">
        Ready&nbsp;To&nbsp;Serve
        <small>Foundation</small>
      </span>
    </a>
  );
}