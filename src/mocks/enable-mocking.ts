import { environment } from '../environments/environment';

export async function enableMocking(): Promise<void> {
  if (!environment.useMocks) {
    return;
  }
  const { worker } = await import('./browser');
  await worker.start({ onUnhandledFrame: 'bypass' });
}
