import { createClientFromRequest } from "npm:@base44/sdk@0.8.52";
import { requireAdmin } from "../../shared/requireAdmin.ts";

const DAY = 24 * 60 * 60 * 1000;

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const denied = await requireAdmin(base44);
    if (denied) return denied;

    const sr = base44.asServiceRole;
    const BT = sr.entities.BankTransfer;
    const now = Date.now();

    // Cleanup: rejected after 30 days, never-verified pending after 90 days.
    await BT.deleteMany({ status: "rejected", created_date: { $lt: new Date(now - 30 * DAY).toISOString() } });
    await BT.deleteMany({ status: "pending", created_date: { $lt: new Date(now - 90 * DAY).toISOString() } });

    const page = await BT.filter(
      { created_date: { $gte: new Date(now - DAY).toISOString() } },
      { sort: "-created_date", limit: 100 }
    );
    const items = page.items || [];
    const pending = await BT.count({ status: "pending" });
    if (!items.length) return Response.json({ sent: false, new: 0, pending });

    const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
    const rows = items
      .map((r) => `<li><b>${esc(r.donor_name)}</b> — ₹${esc(r.amount)}${r.reference ? ` (ref ${esc(r.reference)})` : ""}${r.message ? ` — ${esc(r.message)}` : ""}</li>`)
      .join("");
    const html = `<h2>${items.length} new payment report(s) in the last 24 hours</h2><ul>${rows}</ul><p>${pending} report(s) are waiting to be checked against your bank / UPI statement.</p><p><a href="https://ready-to-serve.base44.app">Open the app</a></p>`;

    const users = await sr.entities.User.list();
    const admins = users.filter((u) => u.role === "admin" && u.email);
    await Promise.allSettled(
      admins.map((a) =>
        sr.integrations.Core.SendEmail({ to: a.email, subject: `Daily donation reports: ${items.length} new`, body: html })
      )
    );
    return Response.json({ sent: true, new: items.length, pending, admins: admins.length });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}