import React, { createContext, ReactNode, useContext, useState } from 'react';
import { useRouter } from 'expo-router';

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
  archived?: boolean; // NEW
};

type GoalsContextType = {
  goals: Goal[];
  setGoals: (goals: Goal[]) => void;
  addGoal: (goal: Goal) => void;
  clearGoals: () => void;
  updateGoalProgress: (id: string, amount: number) => void;
  archiveGoal: (id: string) => void; // NEW
};

const GoalsContext = createContext<GoalsContextType | undefined>(undefined);

export const GoalsProvider = ({ children }: { children: ReactNode }) => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const router = useRouter();

  const addGoal = (goal: Goal) => {
    setGoals((prev) => [...prev, { ...goal, archived: false }]);
  };

  const clearGoals = () => {
    setGoals([]);
  };

  const updateGoalProgress = (id: string, amount: number) => {
    setGoals((prev) =>
      prev.map((goal) => {
        if (goal.id !== id) return goal;

        const newProgress = Math.min(goal.progress + amount, goal.target);
        const updatedGoal = {
          ...goal,
          progress: newProgress,
          lastLogged: new Date(),
        };

        if (newProgress >= goal.target) {
          router.push(`/celebrate/${goal.id}`);
        }

        return updatedGoal;
      })
    );
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

