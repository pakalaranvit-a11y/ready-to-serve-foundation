import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Capacitor } from "@capacitor/core";
import { PushNotifications } from "@capacitor/push-notifications";
import { base44 } from "@/api/base44Client";

// Registers the iOS app for push alerts and saves the device token in Base44.
// No-op on the website.
export function usePushNotifications() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;
    let cancelled = false;
    const handles = [];

    const setup = async () => {
      handles.push(
        await PushNotifications.addListener("registration", ({ value }) => {
          base44.functions
            .invoke("registerPushDevice", { token: value, platform: Capacitor.getPlatform() })
            .catch(() => {});
        }),
        await PushNotifications.addListener("pushNotificationActionPerformed", ({ notification }) => {
          const link = notification?.data?.link;
          if (link && link.startsWith("/")) navigate(link);
        })
      );
      if (cancelled) return;

      let { receive } = await PushNotifications.checkPermissions();
      if (receive === "prompt" || receive === "prompt-with-rationale") {
        ({ receive } = await PushNotifications.requestPermissions());
      }
      if (receive === "granted" && !cancelled) await PushNotifications.register();
    };

    setup().catch(() => {});
    return () => {
      cancelled = true;
      handles.forEach((h) => h.remove());
    };
  }, [navigate]);
}
