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
  const { tone, hour, minute } = useSettings();

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
            await scheduleGoalNotification(goal, tone, hour, minute, dayOffset);
          }
        }
      }
    };

    run();
  }, [goals, tone, hour, minute]);
}
