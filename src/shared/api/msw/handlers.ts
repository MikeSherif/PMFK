import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('*/me', () => HttpResponse.json({ error: { code: 'UNAUTHENTICATED' } }, { status: 401 })),
];
