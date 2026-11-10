import { NextResponse } from 'next/server';
import { issueWsTicket } from '@/shared/api/mock/db';
import { jsonUnauthenticated } from '../_lib/json-error';
import { requireViewer } from '../_lib/require-viewer';

export async function POST() {
  const viewer = await requireViewer();
  if (!viewer) {
    return jsonUnauthenticated();
  }
  return NextResponse.json({ ticket: issueWsTicket(viewer.id) });
}
