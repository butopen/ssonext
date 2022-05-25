import { loggable, mergeable } from '../../shared/store.util';
import { requestRegistration } from '../../services/api.service';

export interface Notification {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

export const notificationStore = loggable(
  mergeable<{ notifications: Notification[] }>({
    notifications: []
  })
);

export async function notifyOnError(action: () => void, message: string) {
  try {
    const result = await action();
    if ((result as any)?.error) {
      showNotification(message, 'error');
    } else return result;
  } catch (e) {
    showNotification(message, 'error');
  }
}

export function showNotification(
  message: string,
  type: Notification['type'] = 'info',
  timeout = 2500
) {
  notificationStore.update((ns) => {
    ns.notifications.push({ message, type });
    return ns;
  });
  setTimeout(() => {
    discardNotification();
  }, timeout);
}

export function discardNotification(at = 0) {
  notificationStore.update((ns) => {
    ns.notifications.splice(at, 1);
    return ns;
  });
}
