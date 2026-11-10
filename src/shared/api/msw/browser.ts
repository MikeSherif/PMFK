import { getBasePath } from '@/shared/lib';

export async function enableMocking() {
  if (typeof window === 'undefined') {
    return;
  }
  const { setupWorker } = await import('msw/browser');
  const { handlers } = await import('./handlers');
  const worker = setupWorker(...handlers);
  const workerUrl = `${getBasePath()}/mockServiceWorker.js`;
  await worker.start({
    onUnhandledRequest: 'bypass',
    serviceWorker: { url: workerUrl },
  });
}
