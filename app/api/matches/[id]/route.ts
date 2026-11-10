import { jsonError, jsonUnauthenticated } from '../../_lib/json-error';
import { requireViewer } from '../../_lib/require-viewer';
import { getMatch } from '@/shared/api/mock/db';
import { NextResponse } from 'next/server';

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const viewer = await requireViewer();
  if (!viewer) {
    return jsonUnauthenticated();
  }
  const { id } = await context.params;
  const match = getMatch(viewer.id, id);
  if (!match) {
    return jsonError(404, 'NOT_FOUND', 'Мэтч не найден');
  }
  return NextResponse.json(match);
}
