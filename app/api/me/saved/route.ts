import { NextResponse } from 'next/server';
import { getSaved } from '@/shared/api/mock/db';
import { jsonUnauthenticated } from '../../_lib/json-error';
import { requireViewer } from '../../_lib/require-viewer';

export async function GET() {
  const viewer = await requireViewer();
  if (!viewer) {
    return jsonUnauthenticated();
  }
  return NextResponse.json({ items: getSaved(viewer.id) });
}
