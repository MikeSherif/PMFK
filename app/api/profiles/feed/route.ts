import { NextResponse } from 'next/server';
import { getFeed } from '@/shared/api/mock/db';
import { jsonUnauthenticated } from '../../_lib/json-error';
import { requireViewer } from '../../_lib/require-viewer';

export async function GET(request: Request) {
  const viewer = await requireViewer();
  if (!viewer) {
    return jsonUnauthenticated();
  }
  const cursor = new URL(request.url).searchParams.get('cursor');
  return NextResponse.json(cursor ? getFeed(viewer.id, cursor) : getFeed(viewer.id));
}
