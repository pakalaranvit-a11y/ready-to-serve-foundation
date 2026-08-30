import React from "react";
import { useNavigate } from "react-router-dom";

// Scrolls to the donate section when it's on the current page,
// otherwise navigates to the dedicated donate page.
export default function DonateNowButton({ className = "btn btn--primary btn--lg", children }) {
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    const target = document.getElementById("donate");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      navigate("/donate");
    }
  };

  return (
    <a href="#donate" onClick={handleClick} className={className}>
      {children || (
        <>
          Donate now <span aria-hidden="true">→</span>
        </>
      )}
    </a>
  );
}