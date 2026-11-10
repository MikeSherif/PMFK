type ApiListeners = {
  onUnauthorized: () => void;
  onTicketRequired: () => void;
  onRateLimit: (retryAfterSec: number) => void;
  onServerError: () => void;
};

let listeners: ApiListeners | null = null;
let unauthorizedQueued = false;

export function registerApiListeners(next: ApiListeners): () => void {
  listeners = next;
  return () => {
    if (listeners === next) {
      listeners = null;
    }
  };
}

export function emitUnauthorized() {
  if (unauthorizedQueued) {
    return;
  }
  unauthorizedQueued = true;
  // Defer so React Query can settle the 401 before navigation unmounts the observer.
  // Sync replace() cancels the in-flight query and remounts it in a tight loop.
  setTimeout(() => {
    unauthorizedQueued = false;
    listeners?.onUnauthorized();
  }, 0);
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
