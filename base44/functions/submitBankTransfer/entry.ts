import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';

// Public on purpose: donors report their payment without signing in.
// Abuse is limited by strict validation and a global rate limit on new pending claims.
const MAX_AMOUNT = 10000000;
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 15;

export default async function (req) {
  try {
    if (req.method !== 'POST') return Response.json({ error: 'Method not allowed' }, { status: 405 });
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const clean = (v, n) => String(v ?? '').replace(/[<>]/g, '').trim().slice(0, n);
    const donorName = clean(body?.donor_name, 60);
    const amount = Number(body?.amount);
    const reference = clean(body?.reference, 40);
    const contact = clean(body?.contact, 60);
    const message = clean(body?.message, 160);

    if (!donorName) return Response.json({ error: 'Name is required' }, { status: 400 });
    if (!Number.isFinite(amount) || amount <= 0 || amount > MAX_AMOUNT) {
      return Response.json({ error: 'A valid amount is required' }, { status: 400 });
    }

    const since = new Date(Date.now() - WINDOW_MS).toISOString();
    const recent = await base44.asServiceRole.entities.BankTransfer.count({
      status: 'pending',
      created_date: { $gte: since },
    });
    if (recent >= MAX_PER_WINDOW) {
      return Response.json({ error: 'Too many submissions right now. Please try again shortly.' }, { status: 429 });
    }

    const record = await base44.asServiceRole.entities.BankTransfer.create({
      donor_name: donorName,
      amount,
      reference,
      contact,
      message,
      status: 'pending',
    });

    return Response.json({ ok: true, id: record.id });
  } catch (error) {
    return Response.json({ error: 'Something went wrong' }, { status: 500 });
  }
}