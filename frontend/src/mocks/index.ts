export async function enableMocking() {
  if (process.env.NEXT_PUBLIC_API_MOCKING !== 'enabled') {
    return;
  }

  if (typeof window === 'undefined') {
    return;
  }

  const { worker } = await import('./browser');
  await worker.start();
}
