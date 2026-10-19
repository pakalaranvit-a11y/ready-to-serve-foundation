import { createClientFromRequest } from "npm:@base44/sdk@0.8.52";
import { secrets } from "base44:runtime";
import { requireAdmin } from "../../shared/requireAdmin.ts";

// Sends a new Notification to every registered iPhone through Apple Push (APNs).
// Secrets: APNS_KEY_ID, APNS_TEAM_ID, APNS_PRIVATE_KEY (contents of the .p8 file),
// optional APNS_BUNDLE_ID (defaults to the app's bundle ID).
const DEFAULT_BUNDLE_ID = "org.readytoserve.foundation";
const HOSTS = ["https://api.push.apple.com", "https://api.sandbox.push.apple.com"];

const b64url = (bytes) =>
  btoa(String.fromCharCode(...new Uint8Array(bytes))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

async function apnsJwt(keyId, teamId, pem) {
  // Accepts the .p8 file as-is, flattened onto one line, or with literal "\n" escapes.
  const body = pem.replace(/\\n/g, "\n").replace(/-----[^-]+-----|\s/g, "");
  const der = Uint8Array.from(atob(body), (c) => c.charCodeAt(0));
  const key = await crypto.subtle.importKey("pkcs8", der, { name: "ECDSA", namedCurve: "P-256" }, false, ["sign"]);
  const enc = new TextEncoder();
  const head = b64url(enc.encode(JSON.stringify({ alg: "ES256", kid: keyId })));
  const claims = b64url(enc.encode(JSON.stringify({ iss: teamId, iat: Math.floor(Date.now() / 1000) })));
  const sig = await crypto.subtle.sign({ name: "ECDSA", hash: "SHA-256" }, key, enc.encode(`${head}.${claims}`));
  return `${head}.${claims}.${b64url(sig)}`;
}

// Tries production first, then sandbox (builds run straight from Xcode use sandbox tokens).
async function sendOne(jwt, bundleId, token, body) {
  let reason = "";
  for (const host of HOSTS) {
    const res = await fetch(`${host}/3/device/${token}`, {
      method: "POST",
      headers: {
        authorization: `bearer ${jwt}`,
        "apns-topic": bundleId,
        "apns-push-type": "alert",
        "apns-priority": "10",
      },
      body,
    });
    if (res.ok) return { ok: true };
    reason = (await res.json().catch(() => ({}))).reason || String(res.status);
    if (res.status === 410) return { ok: false, dead: true, reason };
    if (reason !== "BadDeviceToken") return { ok: false, reason };
  }
  return { ok: false, dead: true, reason };
}

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const denied = await requireAdmin(base44);
    if (denied) return denied;

    const keyId = secrets.get("APNS_KEY_ID");
    const teamId = secrets.get("APNS_TEAM_ID");
    const pem = secrets.get("APNS_PRIVATE_KEY");
    const bundleId = secrets.get("APNS_BUNDLE_ID") || DEFAULT_BUNDLE_ID;
    if (!keyId || !teamId || !pem) return Response.json({ error: "APNs secrets not set" }, { status: 500 });

    const { id } = await req.json();
    if (!id) return Response.json({ error: "id required" }, { status: 400 });
    const sr = base44.asServiceRole;
    const n = await sr.entities.Notification.get(id);
    if (!n || n.pushed_at) return Response.json({ skipped: true });
    await sr.entities.Notification.update(id, { pushed_at: new Date().toISOString() });

    const list = await sr.entities.PushDevice.list();
    const devices = Array.isArray(list) ? list : list.items || [];
    if (!devices.length) return Response.json({ sent: 0, devices: 0 });

    const jwt = await apnsJwt(keyId, teamId, pem);
    const body = JSON.stringify({
      aps: { alert: { title: n.title, body: n.body || "" }, sound: "default" },
      link: n.link || "",
    });

    let sent = 0;
    const errors = {};
    for (let i = 0; i < devices.length; i += 20) {
      const batch = devices.slice(i, i + 20);
      const results = await Promise.all(batch.map((d) => sendOne(jwt, bundleId, d.token, body).catch((e) => ({ ok: false, reason: e.message }))));
      await Promise.allSettled(
        results.map((r, j) => {
          if (r.ok) sent++;
          else errors[r.reason] = (errors[r.reason] || 0) + 1;
          return r.dead ? sr.entities.PushDevice.delete(batch[j].id) : null;
        })
      );
    }
    return Response.json({ sent, devices: devices.length, errors });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
