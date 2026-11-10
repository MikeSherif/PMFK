export type ApiFieldErrors = Record<string, string[]>;

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly fieldErrors: ApiFieldErrors | undefined;
  readonly requestId: string | undefined;
  readonly retryAfterSec: number | undefined;

  constructor(input: {
    status: number;
    code: string;
    message: string;
    fieldErrors?: ApiFieldErrors;
    requestId?: string;
    retryAfterSec?: number;
  }) {
    super(input.message);
    this.name = 'ApiError';
    this.status = input.status;
    this.code = input.code;
    this.fieldErrors = input.fieldErrors;
    this.requestId = input.requestId;
    this.retryAfterSec = input.retryAfterSec;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

type ErrorBody = {
  error?: {
    code?: string;
    message?: string;
    fieldErrors?: ApiFieldErrors;
    requestId?: string;
  };
};

export function apiErrorFromResponse(status: number, body: unknown, retryAfterHeader: string | null): ApiError {
  const parsed = (body ?? {}) as ErrorBody;
  const retryAfterSec = retryAfterHeader ? Number.parseInt(retryAfterHeader, 10) : Number.NaN;
  const input: ConstructorParameters<typeof ApiError>[0] = {
    status,
    code: parsed.error?.code ?? 'UNKNOWN',
    message: parsed.error?.message ?? 'Не удалось выполнить запрос',
  };
  if (parsed.error?.fieldErrors) {
    input.fieldErrors = parsed.error.fieldErrors;
  }
  if (parsed.error?.requestId) {
    input.requestId = parsed.error.requestId;
  }
  if (Number.isFinite(retryAfterSec)) {
    input.retryAfterSec = retryAfterSec;
  }
  return new ApiError(input);
}
