import { NextResponse } from 'next/server';
import { listMeetings } from '@/shared/api/mock/db';
import { jsonUnauthenticated } from '../_lib/json-error';
import { requireViewer } from '../_lib/require-viewer';

export async function GET() {
  const viewer = await requireViewer();
  if (!viewer) {
    return jsonUnauthenticated();
  }
  return NextResponse.json({ items: listMeetings(viewer.id) });
}
