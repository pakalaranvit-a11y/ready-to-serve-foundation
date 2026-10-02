// Donations happen only on the website, opened in the device's external browser (Safari).
export const DONATE_URL = "https://ready-to-serve.base44.app/donate";

export function openDonate(e) {
  e?.preventDefault?.();
  e?.stopPropagation?.();
  const w = window.open(DONATE_URL, "_blank", "noopener");
  if (!w) window.location.href = DONATE_URL;
}