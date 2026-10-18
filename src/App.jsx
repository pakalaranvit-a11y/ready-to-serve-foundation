import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClientInstance } from "@/lib/query-client";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import PageNotFound from "./lib/PageNotFound";
import { AuthProvider, useAuth } from "@/lib/AuthContext";
import UserNotRegisteredError from "@/components/UserNotRegisteredError";
import ScrollToTop from "./components/ScrollToTop";
import PageTransition from "@/components/charity/PageTransition";
import BottomTabs from "@/components/charity/BottomTabs";
import Home from "@/pages/Home";
import DonatePage from "@/pages/Donate";
import DonorsPage from "@/pages/Donors";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import Support from "@/pages/Support";
import Settings from "@/pages/Settings";
import ImpactPage from "@/pages/ImpactPage";
import StoriesPage from "@/pages/StoriesPage";
import More from "@/pages/More";
import MyGiving from "@/pages/MyGiving";
import About from "@/pages/About";
import Terms from "@/pages/Terms";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";

const HIDE_TABS = ["/login", "/register", "/forgot-password", "/reset-password"];

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/donate" element={<PageTransition><DonatePage /></PageTransition>} />
        <Route path="/donors" element={<PageTransition><DonorsPage /></PageTransition>} />
        <Route path="/privacy" element={<PageTransition><PrivacyPolicy /></PageTransition>} />
        <Route path="/privacy-policy" element={<PageTransition><PrivacyPolicy /></PageTransition>} />
        <Route path="/support" element={<PageTransition><Support /></PageTransition>} />
        <Route path="/settings" element={<PageTransition><Settings /></PageTransition>} />
        <Route path="/impact" element={<PageTransition><ImpactPage /></PageTransition>} />
        <Route path="/stories" element={<PageTransition><StoriesPage /></PageTransition>} />
        <Route path="/more" element={<PageTransition><More /></PageTransition>} />
        <Route path="/my-giving" element={<PageTransition><MyGiving /></PageTransition>} />
        <Route path="/about" element={<PageTransition><About /></PageTransition>} />
        <Route path="/terms" element={<PageTransition><Terms /></PageTransition>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();
  const location = useLocation();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === "user_not_registered") {
      return <UserNotRegisteredError />;
    } else if (authError.type === "auth_required") {
      navigateToLogin();
      return null;
    }
  }

  const showTabs = !HIDE_TABS.includes(location.pathname);
  return (
    <>
      <AnimatedRoutes />
      {showTabs && <BottomTabs />}
    </>
  );
};

function App() {
  // External links (Instagram, Facebook, PayPal…) must always open, even inside the
  // mobile app shell where target="_blank" is sometimes silently blocked.
  useEffect(() => {
    const onClick = (e) => {
      const a = e.target.closest?.('a[target="_blank"]');
      if (!a || !a.href || a.origin === window.location.origin) return;
      e.preventDefault();
      const w = window.open(a.href, "_blank");
      if (w) w.opener = null;
      else window.location.href = a.href;
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);


  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;