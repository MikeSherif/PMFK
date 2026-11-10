import type { WsConnectionStatus } from './ws-client';

type StatusListener = (status: WsConnectionStatus) => void;

const listeners = new Set<StatusListener>();
let current: WsConnectionStatus = 'idle';

export function publishWsStatus(status: WsConnectionStatus) {
  current = status;
  listeners.forEach((listener) => listener(status));
}

export function subscribeWsStatus(listener: StatusListener) {
  listeners.add(listener);
  listener(current);
  return () => {
    listeners.delete(listener);
  };
}

export function getWsStatus() {
  return current;
}
