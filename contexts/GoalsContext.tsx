import React, { createContext, ReactNode, useContext, useState } from 'react';
import { handleError } from '../lib/errorHandling';

export type GoalCategory = 'Work' | 'Health' | 'Personal';

export type Goal = {
  id: string;
  title: string;
  category: GoalCategory;
  target: number;
  progress: number;
  time: Date;
  deadline?: Date | null;
  milestones?: string[];
  lastLogged?: Date | null;
  createdAt: Date;
  archived?: boolean;
  progressLog?: string[];
};

type GoalsContextType = {
  goals: Goal[];
  setGoals: (goals: Goal[]) => void;
  addGoal: (goal: Goal) => void;
  clearGoals: () => void;
  updateGoalProgress: (id: string, amount: number) => boolean;
  archiveGoal: (id: string) => void;
};

const GoalsContext = createContext<GoalsContextType | undefined>(undefined);

export const GoalsProvider = ({ children }: { children: ReactNode }) => {
  const [goals, setGoals] = useState<Goal[]>([]);

  const addGoal = (goal: Goal) => {
    try {
      setGoals((prev) => [...prev, { ...goal, archived: false }]);
    } catch (error) {
      handleError(error, 'Failed to add goal');
    }
  };

  const clearGoals = () => {
    setGoals([]);
  };

  const updateGoalProgress = (id: string, amount: number): boolean => {
    try {
      const today = new Date().toISOString().split('T')[0];
      let goalCompleted = false;

      setGoals((prev) =>
        prev.map((goal) => {
          if (goal.id !== id) return goal;

          const alreadyLoggedToday = goal.progressLog?.includes(today);
          if (alreadyLoggedToday) return goal;

          const newProgress = Math.min(goal.progress + amount, goal.target);
          if (newProgress >= goal.target) {
            goalCompleted = true;
          }

          return {
            ...goal,
            progress: newProgress,
            lastLogged: new Date(),
            progressLog: [...(goal.progressLog || []), today],
          };
        })
      );

      return goalCompleted;
    } catch (error) {
      handleError(error, 'Failed to update goal progress');
      return false;
    }
  };

  const archiveGoal = (id: string) => {
    setGoals((prev) =>
      prev.map((goal) =>
        goal.id === id ? { ...goal, archived: true } : goal
      )
    );
  };

  return (
    <GoalsContext.Provider
      value={{ goals, setGoals, addGoal, clearGoals, updateGoalProgress, archiveGoal }}
    >
      {children}
    </GoalsContext.Provider>
  );
};

export const useGoals = () => {
  const context = useContext(GoalsContext);
  if (!context) {
    throw new Error('useGoals must be used within a GoalsProvider');
  }
  return context;
};

