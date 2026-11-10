export type WsConnectionStatus = 'idle' | 'connecting' | 'open' | 'reconnecting' | 'closed';

export type WsClient = {
  connect: () => void;
  disconnect: () => void;
  subscribe: (type: string, handler: (payload: unknown) => void) => () => void;
  getStatus: () => WsConnectionStatus;
};

type WsClientOptions = {
  getUrl: () => Promise<string>;
  socket?: typeof WebSocket;
  heartbeatMs?: number;
  maxAttempts?: number;
  baseDelayMs?: number;
  jitterMs?: number;
};

const CLOSED_CODES_STOP = new Set([1000, 1001]);

export function createWsClient(options: WsClientOptions): WsClient {
  const Socket = options.socket ?? (typeof WebSocket === 'undefined' ? undefined : WebSocket);
  const heartbeatMs = options.heartbeatMs ?? 15_000;
  const maxAttempts = options.maxAttempts ?? 6;
  const baseDelayMs = options.baseDelayMs ?? 1000;
  const jitterMs = options.jitterMs ?? 250;
  const listeners = new Map<string, Set<(payload: unknown) => void>>();
  let status: WsConnectionStatus = 'idle';
  let socket: WebSocket | null = null;
  let attempts = 0;
  let heartbeat: ReturnType<typeof setInterval> | undefined;
  let reconnectTimer: ReturnType<typeof setTimeout> | undefined;
  let awaitingPong = false;
  let stopped = true;
  let visibilityHandler: (() => void) | undefined;
  let onlineHandler: (() => void) | undefined;
  let offlineHandler: (() => void) | undefined;

  function setStatus(next: WsConnectionStatus) {
    status = next;
  }

  function emit(type: string, payload: unknown) {
    listeners.get(type)?.forEach((handler) => handler(payload));
  }

  function clearTimers() {
    if (heartbeat) {
      clearInterval(heartbeat);
      heartbeat = undefined;
    }
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = undefined;
    }
  }

  function startHeartbeat() {
    awaitingPong = false;
    heartbeat = setInterval(() => {
      if (!socket || socket.readyState !== 1) {
        return;
      }
      if (awaitingPong) {
        socket.close();
        return;
      }
      awaitingPong = true;
      socket.send(JSON.stringify({ type: 'ping' }));
    }, heartbeatMs);
  }

  function scheduleReconnect() {
    if (stopped || attempts >= maxAttempts) {
      setStatus('closed');
      return;
    }
    setStatus('reconnecting');
    const delay = Math.min(baseDelayMs * 2 ** attempts, 15_000) + Math.floor(Math.random() * jitterMs);
    attempts += 1;
    reconnectTimer = setTimeout(() => {
      void open();
    }, delay);
  }

  async function open() {
    if (stopped || !Socket) {
      setStatus('closed');
      return;
    }
    setStatus(attempts === 0 ? 'connecting' : 'reconnecting');
    try {
      const url = await options.getUrl();
      socket = new Socket(url);
    } catch {
      scheduleReconnect();
      return;
    }
    socket.addEventListener('open', () => {
      attempts = 0;
      setStatus('open');
      startHeartbeat();
    });
    socket.addEventListener('message', (event) => {
      let parsed: unknown = event.data;
      if (typeof event.data === 'string') {
        try {
          parsed = JSON.parse(event.data) as unknown;
        } catch {
          return;
        }
      }
      const record = parsed as { type?: unknown; payload?: unknown };
      if (record.type === 'pong') {
        awaitingPong = false;
        return;
      }
      if (typeof record.type === 'string') {
        emit(record.type, record.payload);
      }
    });
    socket.addEventListener('close', (event) => {
      clearTimers();
      socket = null;
      if (stopped || CLOSED_CODES_STOP.has(event.code)) {
        setStatus('closed');
        return;
      }
      scheduleReconnect();
    });
    socket.addEventListener('error', () => {
      socket?.close();
    });
  }

  function attachWindow() {
    if (typeof window === 'undefined') {
      return;
    }
    visibilityHandler = () => {
      if (document.visibilityState === 'hidden') {
        socket?.close();
        return;
      }
      if (!stopped && status !== 'open') {
        void open();
      }
    };
    onlineHandler = () => {
      if (!stopped && status !== 'open') {
        void open();
      }
    };
    offlineHandler = () => {
      socket?.close();
    };
    document.addEventListener('visibilitychange', visibilityHandler);
    window.addEventListener('online', onlineHandler);
    window.addEventListener('offline', offlineHandler);
  }

  function detachWindow() {
    if (typeof window === 'undefined') {
      return;
    }
    if (visibilityHandler) {
      document.removeEventListener('visibilitychange', visibilityHandler);
    }
    if (onlineHandler) {
      window.removeEventListener('online', onlineHandler);
    }
    if (offlineHandler) {
      window.removeEventListener('offline', offlineHandler);
    }
  }

  return {
    connect: () => {
      stopped = false;
      attempts = 0;
      attachWindow();
      void open();
    },
    disconnect: () => {
      stopped = true;
      detachWindow();
      clearTimers();
      socket?.close(1000, 'client-disconnect');
      socket = null;
      setStatus('closed');
    },
    subscribe: (type, handler) => {
      const bucket = listeners.get(type) ?? new Set<(payload: unknown) => void>();
      bucket.add(handler);
      listeners.set(type, bucket);
      return () => {
        bucket.delete(handler);
      };
    },
    getStatus: () => status,
  };
}
