import * as Notifications from 'expo-notifications';
import { getToneMessage } from './insults';

export async function setupNotificationPermissions() {
  const { status } = await Notifications.getPermissionsAsync();
  if (status !== 'granted') {
    await Notifications.requestPermissionsAsync();
  }
}

export async function cancelAllScheduledNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

function getRandomTimes(count: number): Date[] {
  const start = 7 * 60; // 7:00 AM in minutes
  const end = 23 * 60; // 11:00 PM in minutes
  const spacing = 30; // 30 min between notifications
  const times: number[] = [];

  while (times.length < count) {
    const candidate = Math.floor(Math.random() * (end - start)) + start;
    if (times.every(t => Math.abs(t - candidate) >= spacing)) {
      times.push(candidate);
    }
  }

  return times.sort().map(minutes => {
    const date = new Date();
    date.setHours(Math.floor(minutes / 60), minutes % 60, 0, 0);
    return date;
  });
}

function scheduleTrigger(secondsFromNow: number): Notifications.TimeIntervalTriggerInput {
  return {
    type: "timeInterval" as Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
    seconds: secondsFromNow,
    repeats: false,
  };
}

export async function scheduleGoalNotification(
  goal: { id: string; title: string },
  tone: string,
  hour: number,
  minute: number,
  dayOffset: number
) {
  if (tone === 'nuclear') {
    const times = getRandomTimes(3);
    for (const time of times) {
      const now = new Date();
      const triggerTime = new Date(now);
      triggerTime.setDate(triggerTime.getDate() + dayOffset);
      triggerTime.setHours(time.getHours(), time.getMinutes(), 0, 0);

      const secondsFromNow = Math.max(
        1,
        Math.floor((triggerTime.getTime() - now.getTime()) / 1000)
      );

      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'ShameZone says:',
          body: getToneMessage(tone, goal.title),
          sound: true,
        },
        trigger: scheduleTrigger(secondsFromNow),
      });
    }
  } else {
    const now = new Date();
    const triggerTime = new Date(now);
    triggerTime.setDate(triggerTime.getDate() + dayOffset);
    triggerTime.setHours(hour, minute, 0, 0);

    const secondsFromNow = Math.max(
      1,
      Math.floor((triggerTime.getTime() - now.getTime()) / 1000)
    );

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'ShameZone says:',
        body: getToneMessage(tone, goal.title),
        sound: true,
      },
      trigger: scheduleTrigger(secondsFromNow),
    });
  }
}
