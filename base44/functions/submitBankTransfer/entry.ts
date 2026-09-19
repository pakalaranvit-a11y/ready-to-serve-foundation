import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const donorName = String(body?.donor_name || '').trim().slice(0, 60);
    const amount = Number(body?.amount);
    const reference = String(body?.reference || '').trim().slice(0, 40);
    const contact = String(body?.contact || '').trim().slice(0, 60);
    const message = String(body?.message || '').trim().slice(0, 160);

    if (!donorName) return Response.json({ error: 'Name is required' }, { status: 400 });
    if (!amount || isNaN(amount) || amount <= 0) return Response.json({ error: 'A valid amount is required' }, { status: 400 });

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
    return Response.json({ error: error.message }, { status: 500 });
  }
}