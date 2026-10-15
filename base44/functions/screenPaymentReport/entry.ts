import { createClientFromRequest } from "npm:@base44/sdk@0.8.52";
import { requireAdmin } from "../../shared/requireAdmin.ts";

const LINK = /(https?:\/\/|www\.|\.com|\.ru|\.xyz|<|>)/i;

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const denied = await requireAdmin(base44);
    if (denied) return denied;

    const { id } = await req.json();
    if (!id) return Response.json({ error: "id required" }, { status: 400 });
    const BT = base44.asServiceRole.entities.BankTransfer;
    const r = await BT.get(id);
    if (!r) return Response.json({ skipped: true });

    const text = `${r.donor_name} ${r.reference} ${r.contact} ${r.message}`;
    let reason = "";
    if (LINK.test(text)) reason = "contains links or code";

    if (!reason) {
      const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
      const sameName = await BT.count({ donor_name: r.donor_name, created_date: { $gte: since } });
      if (r.donor_name !== "Anonymous" && sameName > 3) reason = "repeat submissions";
    }
    if (!reason && r.reference) {
      const dupes = await BT.count({ reference: r.reference, amount: r.amount });
      if (dupes > 1) reason = "duplicate report";
    }

    if (reason) {
      await BT.delete(id);
      return Response.json({ removed: true, reason });
    }
    return Response.json({ removed: false });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}