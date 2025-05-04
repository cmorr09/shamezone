// contexts/GoalsContext.tsx
import React, { createContext, ReactNode, useContext, useState } from 'react';

export type GoalCategory = 'Work' | 'Health' | 'Personal';

export type Goal = {
  id: string;
  title: string;
  category: GoalCategory;
  target: number;
  progress: number;
  time: Date; // when user should log each day
  deadline?: Date | null;
  milestones?: string[];
  lastLogged?: Date | null;
  createdAt: Date;
};

type GoalsContextType = {
  goals: Goal[];
  setGoals: (goals: Goal[]) => void;
  addGoal: (goal: Goal) => void;
  clearGoals: () => void;
  updateGoalProgress: (id: string, amount: number) => void;
};

const GoalsContext = createContext<GoalsContextType | undefined>(undefined);

export const GoalsProvider = ({ children }: { children: ReactNode }) => {
  const [goals, setGoals] = useState<Goal[]>([]);

  const addGoal = (goal: Goal) => {
    setGoals((prev) => [...prev, goal]);
  };

  const clearGoals = () => {
    setGoals([]);
  };

  const updateGoalProgress = (id: string, amount: number) => {
    setGoals((prev) =>
      prev.map((goal) =>
        goal.id === id
          ? {
              ...goal,
              progress: Math.min(goal.progress + amount, goal.target),
              lastLogged: new Date(),
            }
          : goal
      )
    );
  };

  return (
    <GoalsContext.Provider
      value={{ goals, setGoals, addGoal, clearGoals, updateGoalProgress }}
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
