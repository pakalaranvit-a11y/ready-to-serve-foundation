import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

export default function BackHeader({ title }) {
  const navigate = useNavigate();
  return (
    <header className="back-header">
      <button
        type="button"
        className="back-header__btn"
        onClick={() => navigate(-1)}
        aria-label="Go back"
      >
        <ChevronLeft size={24} />
      </button>
      <h1 className="back-header__title">{title}</h1>
    </header>
  );
}