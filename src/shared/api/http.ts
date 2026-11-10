import { env, SESSION_COOKIE } from '@/shared/config';
import { apiErrorFromResponse, ApiError } from './errors';
import { emitRateLimit, emitServerError, emitTicketRequired, emitUnauthorized } from './events';
import { handleMockRequest, isStaticDemoApi, mockResultToResponse } from './mock/handle-request';

const TIMEOUT_MS = 15_000;

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type RequestOptions = {
  method?: HttpMethod;
  body?: unknown;
  signal?: AbortSignal;
  skipAuthReaction?: boolean;
};

function mergeSignals(external: AbortSignal | undefined, timeoutSignal: AbortSignal) {
  if (!external) {
    return timeoutSignal;
  }
  if (typeof AbortSignal.any === 'function') {
    return AbortSignal.any([external, timeoutSignal]);
  }
  return timeoutSignal;
}

function readBrowserSession() {
  if (typeof document === 'undefined') {
    return undefined;
  }
  const prefix = `${SESSION_COOKIE}=`;
  const part = document.cookie.split('; ').find((item) => item.startsWith(prefix));
  if (!part) {
    return undefined;
  }
  return decodeURIComponent(part.slice(prefix.length));
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const method = options.method ?? 'GET';

  if (isStaticDemoApi()) {
    const response = mockResultToResponse(
      handleMockRequest({
        method,
        path,
        body: options.body,
        token: readBrowserSession(),
      }),
    );
    persistBrowserSession(path.split('?')[0] ?? path, response);
    return parseResponse<T>(response, options);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  const signal = mergeSignals(options.signal, controller.signal);
  const init: RequestInit = {
    method,
    credentials: 'include',
    headers:
      options.body === undefined
        ? { Accept: 'application/json' }
        : { Accept: 'application/json', 'Content-Type': 'application/json' },
    signal,
  };
  if (options.body !== undefined) {
    init.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(`${env.NEXT_PUBLIC_API_URL}${path}`, init);
    persistBrowserSession(path.split('?')[0] ?? path, response);
    return await parseResponse<T>(response, options);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ApiError({ status: 0, code: 'TIMEOUT', message: 'Превышено время ожидания' });
    }
    throw new ApiError({ status: 0, code: 'NETWORK', message: 'Нет соединения. Проверьте сеть.' });
  } finally {
    clearTimeout(timeout);
  }
}

async function parseResponse<T>(response: Response, options: RequestOptions): Promise<T> {
  const retryAfter = response.headers.get('Retry-After');
  const isJson = response.headers.get('content-type')?.includes('application/json');
  const payload: unknown = isJson ? await response.json() : null;

  if (!response.ok) {
    const error = apiErrorFromResponse(response.status, payload, retryAfter);
    if (!options.skipAuthReaction) {
      reactToError(error);
    }
    throw error;
  }

  return payload as T;
}

function cookiePath() {
  return env.NEXT_PUBLIC_BASE_PATH || '/';
}

function persistBrowserSession(path: string, response: Response) {
  if (typeof document === 'undefined') {
    return;
  }
  if (path === '/auth/logout' && response.ok) {
    document.cookie = `${SESSION_COOKIE}=; Path=${cookiePath()}; Max-Age=0`;
    return;
  }
  const token = response.headers.get('x-pmfk-session');
  if (token) {
    document.cookie = `${SESSION_COOKIE}=${encodeURIComponent(token)}; Path=${cookiePath()}; SameSite=Lax`;
  }
}

function reactToError(error: ApiError) {
  if (error.status === 401) {
    emitUnauthorized();
    return;
  }
  if (error.status === 403 && error.code === 'TICKET_REQUIRED') {
    emitTicketRequired();
    return;
  }
  if (error.status === 429) {
    emitRateLimit(error.retryAfterSec ?? 30);
    return;
  }
  if (error.status >= 500) {
    emitServerError();
  }
}

function withBody(method: HttpMethod, body: unknown | undefined, options?: Omit<RequestOptions, 'method' | 'body'>): RequestOptions {
  const next: RequestOptions = { ...options, method };
  if (body !== undefined) {
    next.body = body;
  }
  return next;
}

export const http = {
  get: <T>(path: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<T>(path, { ...options, method: 'GET' }),
  post: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<T>(path, withBody('POST', body, options)),
  put: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<T>(path, withBody('PUT', body, options)),
  delete: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<T>(path, withBody('DELETE', body, options)),
};
