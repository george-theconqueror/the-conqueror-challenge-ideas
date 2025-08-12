"use client"

import React, { createContext, useContext, ReactNode, useState } from 'react';

interface NameContextType {
  playerName: string;
  setPlayerName: (name: string) => void;
}

const NameContext = createContext<NameContextType | undefined>(undefined);

interface NameProviderProps {
  children: ReactNode;
}

export function NameProvider({ children }: NameProviderProps) {
  const [playerName, setPlayerName] = useState<string>('');

  return (
    <NameContext.Provider value={{ playerName, setPlayerName }}>
      {children}
    </NameContext.Provider>
  );
}

export function useNameContext() {
  const context = useContext(NameContext);
  if (context === undefined) {
    throw new Error('useNameContext must be used within a NameProvider');
  }
  return context;
}
