type ApiListeners = {
  onUnauthorized: () => void;
  onTicketRequired: () => void;
  onRateLimit: (retryAfterSec: number) => void;
  onServerError: () => void;
};

let listeners: ApiListeners | null = null;

export function registerApiListeners(next: ApiListeners): () => void {
  listeners = next;
  return () => {
    listeners = null;
  };
}

export function emitUnauthorized() {
  listeners?.onUnauthorized();
}

export function emitTicketRequired() {
  listeners?.onTicketRequired();
}

export function emitRateLimit(retryAfterSec: number) {
  listeners?.onRateLimit(retryAfterSec);
}

export function emitServerError() {
  listeners?.onServerError();
}
