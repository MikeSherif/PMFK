import { afterEach, describe, expect, it, vi } from 'vitest';
import { emitUnauthorized, registerApiListeners } from './events';

describe('api events', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('coalesces unauthorized emissions until the deferred handler runs', () => {
    vi.useFakeTimers();
    const onUnauthorized = vi.fn();
    const stop = registerApiListeners({
      onUnauthorized,
      onTicketRequired: vi.fn(),
      onRateLimit: vi.fn(),
      onServerError: vi.fn(),
    });

    emitUnauthorized();
    emitUnauthorized();
    emitUnauthorized();
    expect(onUnauthorized).not.toHaveBeenCalled();

    vi.runAllTimers();
    expect(onUnauthorized).toHaveBeenCalledTimes(1);
    stop();
  });
});
