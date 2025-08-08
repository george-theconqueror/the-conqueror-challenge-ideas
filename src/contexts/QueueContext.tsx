"use client"

import React, { createContext, useContext, ReactNode } from 'react';
import { useQueue } from '@/hooks/useQueue';
import { Title } from '@/types';

interface QueueContextType {
  queue: Title[];
  dequeue: () => Title | null;
  peek: () => [Title, Title] | null;
  clearQueue: () => void;
  isLoading: boolean;
  error: string | null;
  queueLength: number;
}

const QueueContext = createContext<QueueContextType | undefined>(undefined);

interface QueueProviderProps {
  children: ReactNode;
  baseUrl: string;
}

export function QueueProvider({ children, baseUrl }: QueueProviderProps) {
  const queueState = useQueue(baseUrl);

  return (
    <QueueContext.Provider value={queueState}>
      {children}
    </QueueContext.Provider>
  );
}

export function useQueueContext() {
  const context = useContext(QueueContext);
  if (context === undefined) {
    throw new Error('useQueueContext must be used within a QueueProvider');
  }
  return context;
}
