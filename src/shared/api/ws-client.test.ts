import { afterEach, describe, expect, it, vi } from 'vitest';
import { createWsClient } from './ws-client';

type FakeHandler = (event: { data?: string; code?: number }) => void;

class FakeSocket {
  static instances: FakeSocket[] = [];
  readyState = 0;
  url: string;
  listeners: { open: FakeHandler[]; message: FakeHandler[]; close: FakeHandler[]; error: FakeHandler[] } = {
    open: [],
    message: [],
    close: [],
    error: [],
  };

  constructor(url: string) {
    this.url = url;
    FakeSocket.instances.push(this);
    queueMicrotask(() => this.open());
  }

  addEventListener(type: keyof FakeSocket['listeners'], handler: FakeHandler) {
    this.listeners[type].push(handler);
  }

  send() {}

  close(code = 1000) {
    this.readyState = 3;
    this.listeners.close.forEach((handler) => handler({ code }));
  }

  open() {
    this.readyState = 1;
    this.listeners.open.forEach((handler) => handler({}));
  }

  push(data: string) {
    this.listeners.message.forEach((handler) => handler({ data }));
  }
}

describe('ws client', () => {
  afterEach(() => {
    FakeSocket.instances = [];
    vi.useRealTimers();
  });

  it('opens, delivers subscriptions and cleans them up', async () => {
    const client = createWsClient({
      getUrl: async () => 'ws://test',
      socket: FakeSocket as unknown as typeof WebSocket,
    });
    const received: unknown[] = [];
    const stop = client.subscribe('message.created', (payload) => received.push(payload));
    client.connect();
    await vi.waitFor(() => {
      expect(client.getStatus()).toBe('open');
    });
    FakeSocket.instances[0]?.push(JSON.stringify({ type: 'message.created', payload: { id: '1' } }));
    expect(received).toEqual([{ id: '1' }]);
    stop();
    FakeSocket.instances[0]?.push(JSON.stringify({ type: 'message.created', payload: { id: '2' } }));
    expect(received).toEqual([{ id: '1' }]);
    client.disconnect();
    expect(client.getStatus()).toBe('closed');
  });

  it('reconnects after a drop and closes after max attempts', async () => {
    vi.useFakeTimers();
    const client = createWsClient({
      getUrl: async () => 'ws://test',
      socket: FakeSocket as unknown as typeof WebSocket,
      maxAttempts: 2,
      baseDelayMs: 10,
      jitterMs: 0,
      heartbeatMs: 10_000,
    });
    client.connect();
    await Promise.resolve();
    await Promise.resolve();
    expect(client.getStatus()).toBe('open');
    FakeSocket.instances[0]?.close(1006);
    expect(client.getStatus()).toBe('reconnecting');
    await vi.advanceTimersByTimeAsync(30);
    expect(FakeSocket.instances.length).toBeGreaterThan(1);
    client.disconnect();
  });
});
