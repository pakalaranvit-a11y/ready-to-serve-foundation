import { Capacitor } from "@capacitor/core";
import { Haptics, ImpactStyle } from "@capacitor/haptics";
import { Share } from "@capacitor/share";

const native = () => Capacitor.isNativePlatform();

export function tap() {
  if (native()) Haptics.impact({ style: ImpactStyle.Light }).catch(() => {});
}

// Native iOS/Android share sheet in the app; Web Share API on the web.
// Returns false when no share sheet is available.
export async function shareContent({ title, text, url }) {
  if (native()) {
    await Share.share({ title, text, url, dialogTitle: title }).catch(() => {});
    return true;
  }
  if (navigator.share) {
    await navigator.share({ title, text, url }).catch(() => {});
    return true;
  }
  return false;
}