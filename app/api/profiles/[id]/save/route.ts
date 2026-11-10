import { NextResponse } from 'next/server';
import { saveProfile, unsaveProfile } from '@/shared/api/mock/db';
import { jsonError, jsonUnauthenticated } from '../../../_lib/json-error';
import { requireViewer } from '../../../_lib/require-viewer';

export async function POST(_request: Request, context: { params: Promise<{ id: string }> }) {
  const viewer = await requireViewer();
  if (!viewer) {
    return jsonUnauthenticated();
  }
  const { id } = await context.params;
  const result = saveProfile(viewer.id, id);
  if (!result.ok) {
    return jsonError(404, 'NOT_FOUND', 'Профиль не найден');
  }
  return NextResponse.json(result.profile);
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const viewer = await requireViewer();
  if (!viewer) {
    return jsonUnauthenticated();
  }
  const { id } = await context.params;
  const result = unsaveProfile(viewer.id, id);
  if (!result.ok) {
    return jsonError(404, 'NOT_FOUND', 'Профиль не найден');
  }
  return NextResponse.json(result.profile);
}
