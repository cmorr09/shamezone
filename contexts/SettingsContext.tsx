import React, { createContext, useContext, useState } from 'react';

type Tone = 'soft' | 'tryMe' | 'nuclear';
type TimeSetting = Date | string | null;

interface SettingsContextType {
  tone: Tone;
  setTone: (tone: Tone) => void;
  time: TimeSetting;
  setTime: (value: TimeSetting) => void;
  testMode: boolean;
  setTestMode: (value: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [tone, setTone] = useState<Tone>('soft');
  const [time, setTime] = useState<TimeSetting>(null);
  const [testMode, setTestMode] = useState<boolean>(false);

  return (
    <SettingsContext.Provider
      value={{
        tone,
        setTone,
        time,
        setTime,
        testMode,
        setTestMode,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}

