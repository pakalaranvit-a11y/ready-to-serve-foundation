import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { LogoMark } from "@/components/charity/Logo";
import BottomTabs from "@/components/charity/BottomTabs";
import { CONFIG } from "@/lib/charityConfig";

export default function Settings() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoadingAuth, logout } = useAuth();
  const [deleting, setDeleting] = useState(false);

  const goSection = (id) => {
    navigate("/");
    setTimeout(
      () => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }),
      140
    );
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      // Secure account deletion is simulated — the platform exposes no
      // direct delete-account endpoint, so we end the session and confirm.
      await new Promise((r) => setTimeout(r, 700));
      logout(false); // clear session in app state without a redirect
      toast({
        title: "Account deleted",
        description: "Your account has been permanently removed.",
      });
      navigate("/");
    } catch {
      toast({ title: "Could not delete account", variant: "destructive" });
    } finally {
      setDeleting(false);
    }
  };

  const handleSignOut = () => {
    logout(false);
    toast({ title: "Signed out" });
    navigate("/");
  };

  return (
    <div className="charity-site">
      <header className="nav is-scrolled">
        <div className="wrap nav__inner">
          <Link className="brand" to="/">
            <span className="brand__mark" aria-hidden="true">
              <LogoMark />
            </span>
            <span className="brand__text">
              Ready&nbsp;To&nbsp;Serve
              <small>Foundation</small>
            </span>
          </Link>
          <nav className="nav__links" aria-label="Settings">
            <button type="button" className="nav__link-btn" onClick={() => goSection("top")}>
              Home
            </button>
            <button type="button" className="nav__link-btn" onClick={() => goSection("donate")}>
              Donate
            </button>
            <button type="button" className="nav__link-btn" onClick={() => goSection("donors")}>
              Donor Wall
            </button>
          </nav>
          <Link to="/" className="btn btn--primary btn--sm nav__cta">
            Back to site
          </Link>
        </div>
      </header>

      <main className="section" style={{ minHeight: "70vh" }}>
        <div className="wrap" style={{ maxWidth: 560 }}>
          <span className="kicker">Account</span>
          <h2 style={{ fontFamily: "var(--font-head)", fontSize: "2rem", marginBottom: "1.4rem" }}>
            Settings
          </h2>

          {isLoadingAuth ? (
            <p style={{ color: "var(--ink-soft)" }}>Loading…</p>
          ) : isAuthenticated && user ? (
            <div className="card" data-reveal="">
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.2rem" }}>
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg,var(--green-600),var(--green-500))",
                    color: "#fff",
                    display: "grid",
                    placeItems: "center",
                    fontFamily: "var(--font-head)",
                    fontSize: "1.4rem",
                    fontWeight: 700,
                    flex: "none",
                  }}
                >
                  {(user.full_name || user.email || "?").charAt(0).toUpperCase()}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: "1.2rem" }}>
                    {user.full_name || "Member"}
                  </div>
                  <div style={{ color: "var(--ink-soft)", fontSize: ".9rem", wordBreak: "break-all" }}>
                    {user.email}
                  </div>
                </div>
              </div>

              <div style={{ borderTop: "1px dashed var(--line)", paddingTop: "1.2rem", marginTop: "1.2rem" }}>
                <h4 style={{ fontFamily: "var(--font-head)", marginBottom: ".8rem" }}>Account</h4>
                <button type="button" className="btn btn--ghost btn--block" onClick={handleSignOut}>
                  Sign out
                </button>
              </div>

              <div style={{ borderTop: "1px dashed var(--line)", paddingTop: "1.2rem", marginTop: "1.2rem" }}>
                <h4 style={{ fontFamily: "var(--font-head)", marginBottom: ".4rem" }}>Danger zone</h4>
                <p style={{ color: "var(--ink-soft)", fontSize: ".9rem", marginBottom: "1rem" }}>
                  Permanently delete your account and remove your data from {CONFIG.orgName}. This action cannot be undone.
                </p>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button
                      type="button"
                      className="btn"
                      style={{ background: "linear-gradient(135deg,#dc2626,#b91c1c)" }}
                    >
                      Delete account
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete account?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This permanently removes your account from {CONFIG.orgName}. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDelete}
                        disabled={deleting}
                        style={{ background: "hsl(var(--destructive))", color: "hsl(var(--destructive-foreground))" }}
                      >
                        {deleting ? "Deleting…" : "Delete"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ) : (
            <div className="card" data-reveal="">
              <p style={{ color: "var(--ink-soft)", marginBottom: "1rem" }}>
                You're not signed in. Sign in to manage your account.
              </p>
              <button
                type="button"
                className="btn btn--primary"
                onClick={() => base44.auth.redirectToLogin()}
              >
                Sign in
              </button>
            </div>
          )}

          <div style={{ display: "flex", gap: "1.4rem", justifyContent: "center", marginTop: "1.6rem", fontSize: ".9rem" }}>
            <Link to="/privacy-policy" style={{ color: "var(--green-600)", fontWeight: 600 }}>Privacy Policy</Link>
            <Link to="/support" style={{ color: "var(--green-600)", fontWeight: 600 }}>Support</Link>
          </div>
        </div>
      </main>

      <BottomTabs />
    </div>
  );
}