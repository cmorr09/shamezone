import { useEffect } from 'react';
import { useGoals } from '@/contexts/GoalsContext';
import { useSettings } from '@/contexts/SettingsContext';
import {
  scheduleGoalNotification,
  cancelAllScheduledNotifications,
  setupNotificationPermissions,
} from '@/lib/notifications';

export function useScheduleNotifications() {
  const { goals } = useGoals();
  const { tone, time } = useSettings();

  useEffect(() => {
    const run = async () => {
      await setupNotificationPermissions();
      await cancelAllScheduledNotifications();

      const activeGoals = goals.slice(0, 3); // Max 3 goals

      for (let dayOffset = 0; dayOffset < 3; dayOffset++) {
        const date = new Date();
        date.setDate(date.getDate() + dayOffset);
        const dayKey = date.toDateString();

        for (const goal of activeGoals) {
          const lastLogged = goal.lastLogged
            ? new Date(goal.lastLogged).toDateString()
            : null;

          if (lastLogged !== dayKey) {
            if (time instanceof Date && !isNaN(time.getTime())) {
              const hour = time.getHours();
              const minute = time.getMinutes();
              await scheduleGoalNotification(goal, tone, hour, minute, dayOffset);
            } else {
              // fallback to current time if time is invalid or null
              const now = new Date();
              await scheduleGoalNotification(goal, tone, now.getHours(), now.getMinutes(), dayOffset);
            }
          }
        }
      }
    };

    run();
  }, [goals, tone, time]);
}
