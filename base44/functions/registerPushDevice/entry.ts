import { createClientFromRequest } from "npm:@base44/sdk@0.8.52";

// Public: called by the iOS app on launch to save its APNs device token.
const TOKEN = /^[0-9a-f]{64,200}$/i;

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const { token, platform } = await req.json().catch(() => ({}));
    if (typeof token !== "string" || !TOKEN.test(token)) {
      return Response.json({ error: "invalid token" }, { status: 400 });
    }
    if (platform !== "ios") return Response.json({ error: "unsupported platform" }, { status: 400 });

    const PD = base44.asServiceRole.entities.PushDevice;
    const now = new Date().toISOString();
    const page = await PD.filter({ token }, { limit: 1 });
    const existing = (Array.isArray(page) ? page : page.items || [])[0];
    if (existing) {
      await PD.update(existing.id, { last_seen: now });
      return Response.json({ saved: true, updated: true });
    }
    await PD.create({ token, platform, last_seen: now });
    return Response.json({ saved: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
