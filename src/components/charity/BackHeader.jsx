import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

const ROOT_TABS = ["/", "/impact", "/stories", "/donate", "/more"];

export default function BackHeader({ title }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isRoot = ROOT_TABS.includes(location.pathname);
  return (
    <header className="back-header">
      {isRoot ? (
        <span style={{ width: 44, flex: "none" }} aria-hidden="true" />
      ) : (
        <button
          type="button"
          className="back-header__btn"
          onClick={() => navigate(-1)}
          aria-label="Go back"
        >
          <ChevronLeft size={24} />
        </button>
      )}
      <h1 className="back-header__title">{title}</h1>
    </header>
  );
}