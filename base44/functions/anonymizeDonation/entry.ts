import { createClientFromRequest } from "npm:@base44/sdk@0.8.52";
import { requireAdmin } from "../../shared/requireAdmin.ts";

// Replaces the real name on anonymous donations so it is never stored publicly.
export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const denied = await requireAdmin(base44);
    if (denied) return denied;

    const { id } = await req.json();
    if (!id) return Response.json({ error: "id required" }, { status: 400 });
    const D = base44.asServiceRole.entities.Donation;
    const d = await D.get(id);
    if (!d || !d.is_anonymous || d.donor_name === "Anonymous") return Response.json({ skipped: true });
    await D.update(id, { donor_name: "Anonymous" });
    return Response.json({ anonymized: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}