import { http, HttpResponse } from 'msw';
import { SESSION_COOKIE } from '@/shared/config';
import { handleMockRequest } from '../mock/handle-request';

export const handlers = [
  http.all(/\/api(\/|\?|$)/, async ({ request, cookies }) => {
    let body: unknown;
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      body = await request.json().catch(() => null);
    }
    const url = new URL(request.url);
    const result = handleMockRequest({
      method: request.method,
      path: `${url.pathname}${url.search}`,
      body,
      token: cookies[SESSION_COOKIE],
    });
    return new HttpResponse(JSON.stringify(result.body), {
      status: result.status,
      headers: result.headers,
    });
  }),
];
