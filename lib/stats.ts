import { Goal } from '../contexts/GoalsContext';

const getUniqueLogDates = (goals: Goal[]): Set<string> => {
  const dates = new Set<string>();
  goals.forEach(goal => {
    goal.progressLog?.forEach(date => dates.add(date));
  });
  return dates;
};

export const getGoalsCrushed = (goals: Goal[]): number => {
  return goals.filter(g => g.progress >= g.target).length;
};

export const getStreakCount = (goals: Goal[]): number => {
  const allDates = [...getUniqueLogDates(goals)];
  if (allDates.length === 0) return 0;

  const today = new Date();
  let streak = 0;

  for (let i = 0; i < 365; i++) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    const iso = date.toISOString().split('T')[0];
    if (allDates.includes(iso)) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
};

export const getDaysMissed = (goals: Goal[]): number => {
  if (!goals.length) return 0;

  const allDates = getUniqueLogDates(goals);
  const createdAt = goals
    .map(g => g.createdAt)
    .sort((a, b) => a.getTime() - b.getTime())[0];

  const today = new Date();
  let missed = 0;

  for (
    let d = new Date(createdAt);
    d <= today;
    d.setDate(d.getDate() + 1)
  ) {
    const iso = d.toISOString().split('T')[0];
    if (!allDates.has(iso)) missed++;
  }

  return missed;
};
