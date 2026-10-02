// App Store (Guideline 3.2.1): inside the native app, donations must hand off to the
// system browser. On the web, checkout stays inline.
export const DONATE_URL = "https://ready-to-serve.base44.app/donate";

export function isNativeApp() {
  if (typeof window === "undefined") return false;
  if (window.Capacitor?.isNativePlatform?.() || window.ReactNativeWebView || window.cordova) return true;
  const ua = navigator.userAgent || "";
  // iOS WKWebView (no "Safari" token) or Android WebView ("; wv)").
  return (/iPhone|iPad|iPod/.test(ua) && !/Safari/.test(ua)) || /; wv\)/.test(ua);
}

export function openDonate(e) {
  e?.preventDefault?.();
  e?.stopPropagation?.();
  if (!isNativeApp()) {
    const el = document.getElementById("donate");
    if (el) el.scrollIntoView({ behavior: "smooth" });
    else window.location.assign("/donate");
    return;
  }
  // "_system" asks the native shell to hand off to Safari / the default browser
  // as a separate app — not an in-app browser or SFSafariViewController.
  const w = window.open(DONATE_URL, "_system");
  if (!w) window.location.href = DONATE_URL;
}