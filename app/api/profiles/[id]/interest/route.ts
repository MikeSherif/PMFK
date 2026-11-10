import { NextResponse } from 'next/server';
import { sendInterest } from '@/shared/api/mock/db';
import { jsonError, jsonTicketRequired, jsonUnauthenticated } from '../../../_lib/json-error';
import { requireViewer } from '../../../_lib/require-viewer';

export async function POST(_request: Request, context: { params: Promise<{ id: string }> }) {
  const viewer = await requireViewer();
  if (!viewer) {
    return jsonUnauthenticated();
  }
  const { id } = await context.params;
  const result = sendInterest(viewer.id, id, viewer.abilities.canSendInterest);
  if (!result.ok && result.code === 'TICKET_REQUIRED') {
    return jsonTicketRequired();
  }
  if (!result.ok) {
    return jsonError(404, 'NOT_FOUND', 'Профиль не найден');
  }
  return NextResponse.json({ ok: true });
}
