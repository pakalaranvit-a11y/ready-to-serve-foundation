// App Store (Guideline 3.2.1): inside the native app, donations must hand off to the
// system browser. On the web, checkout stays inline.
export const DONATE_URL = "https://ready-to-serve.base44.app/donate";

export function isNativeApp() {
  if (typeof window === "undefined") return false;
  // Only our real native app — not WhatsApp/Instagram/Facebook in-app browsers.
  return !!window.Capacitor?.isNativePlatform?.() || /ReadyToServeApp/.test(navigator.userAgent);
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
  // Never fall back to loading the page inside the app.
  window.open(DONATE_URL, "_system");
}