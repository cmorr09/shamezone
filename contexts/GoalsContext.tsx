import React, { createContext, ReactNode, useContext, useState } from 'react';

export type Goal = {
  id: string;
  title: string;
  category: 'Work' | 'Health' | 'Personal';
  target: number;
  deadline?: Date | null;
  milestones?: string[];
  current?: number;
  lastLogged?: Date | null;
};

type GoalsContextType = {
  goals: Goal[];
  setGoals: (goals: Goal[]) => void;
  addGoal: (goal: Goal) => void;
  clearGoals: () => void;
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

  return (
    <GoalsContext.Provider value={{ goals, setGoals, addGoal, clearGoals }}>
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
