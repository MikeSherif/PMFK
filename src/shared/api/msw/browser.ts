export async function enableMocking() {
  if (process.env.NEXT_PUBLIC_API_MOCKING !== 'enabled') {
    return;
  }
  if (typeof window === 'undefined') {
    return;
  }
  const { setupWorker } = await import('msw/browser');
  const { handlers } = await import('./handlers');
  const worker = setupWorker(...handlers);
  await worker.start({ onUnhandledRequest: 'bypass' });
}
