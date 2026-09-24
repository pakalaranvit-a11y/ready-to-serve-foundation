import React from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";

export default function AuthLayout({ icon: Icon, title, subtitle, footer, children }) {
  const navigate = useNavigate();
  const close = () => {
    if ((window.history.state?.idx ?? 0) > 0) navigate(-1);
    else navigate("/", { replace: true });
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background px-4">
      <button
        type="button"
        onClick={close}
        aria-label="Close"
        className="absolute right-3 top-[calc(env(safe-area-inset-top)+0.75rem)] w-11 h-11 grid place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
      >
        <X className="w-5 h-5" />
      </button>
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary mb-4">
            <Icon className="w-7 h-7 text-primary-foreground" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{title}</h1>
          {subtitle && <p className="text-muted-foreground mt-2">{subtitle}</p>}
        </div>
        <div className="bg-card rounded-2xl shadow-sm border border-border p-8">
          {children}
        </div>
        {footer && (
          <p className="text-center text-sm text-muted-foreground mt-6">{footer}</p>
        )}
      </div>
    </div>
  );
}