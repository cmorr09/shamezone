import * as Notifications from 'expo-notifications';

export async function setupNotificationPermissions() {
  const { status } = await Notifications.getPermissionsAsync();
  if (status !== 'granted') {
    await Notifications.requestPermissionsAsync();
  }
}

export async function scheduleNotification(content: string, triggerDate: Date) {
  return await Notifications.scheduleNotificationAsync({
    content: {
      title: 'ShameZone Reminder',
      body: content,
      sound: true,
    },
    trigger: triggerDate,
  });
}

export async function cancelAllScheduledNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
