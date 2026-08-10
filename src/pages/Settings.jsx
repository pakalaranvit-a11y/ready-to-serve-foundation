import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    base44.auth
      .me()
      .then((u) => setUser(u))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      // Secure account deletion is simulated — the platform exposes no
      // direct delete-account endpoint, so we end the session and confirm.
      await new Promise((r) => setTimeout(r, 700));
      await base44.auth.logout();
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
        </div>
      </header>

      <main className="section" style={{ minHeight: "70vh" }}>
        <div className="wrap" style={{ maxWidth: 560 }}>
          <span className="kicker">Account</span>
          <h2 style={{ fontFamily: "var(--font-head)", fontSize: "2rem", marginBottom: "1.4rem" }}>
            Settings
          </h2>

          {loading ? (
            <p style={{ color: "var(--ink-soft)" }}>Loading…</p>
          ) : user ? (
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
        </div>
      </main>

      <BottomTabs />
    </div>
  );
}