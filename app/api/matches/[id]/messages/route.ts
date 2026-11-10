import { NextResponse } from 'next/server';
import { listMessages, postMessage } from '@/shared/api/mock/db';
import { jsonError, jsonTicketRequired, jsonUnauthenticated } from '../../../_lib/json-error';
import { requireViewer } from '../../../_lib/require-viewer';

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const viewer = await requireViewer();
  if (!viewer) {
    return jsonUnauthenticated();
  }
  const { id } = await context.params;
  const cursor = new URL(request.url).searchParams.get('cursor');
  const page = cursor ? listMessages(viewer.id, id, cursor) : listMessages(viewer.id, id);
  if (!page) {
    return jsonError(404, 'NOT_FOUND', 'Мэтч не найден');
  }
  return NextResponse.json(page);
}

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const viewer = await requireViewer();
  if (!viewer) {
    return jsonUnauthenticated();
  }
  const { id } = await context.params;
  const body = (await request.json().catch(() => null)) as { text?: unknown; clientId?: unknown } | null;
  const text = typeof body?.text === 'string' ? body.text : '';
  const clientId = typeof body?.clientId === 'string' ? body.clientId : '';
  if (!clientId) {
    return jsonError(422, 'VALIDATION', 'Проверьте поля формы', {
      fieldErrors: { clientId: ['Нужен идентификатор сообщения'] },
    });
  }
  const result = postMessage(viewer.id, id, { text, clientId }, viewer.abilities.canChat);
  if (!result.ok && result.code === 'TICKET_REQUIRED') {
    return jsonTicketRequired();
  }
  if (!result.ok && result.code === 'VALIDATION') {
    return jsonError(422, 'VALIDATION', 'Проверьте поля формы', {
      fieldErrors: { text: ['Введите текст сообщения'] },
    });
  }
  if (!result.ok) {
    return jsonError(404, 'NOT_FOUND', 'Мэтч не найден');
  }
  return NextResponse.json(result.message);
}
