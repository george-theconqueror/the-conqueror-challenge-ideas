import { useState, useEffect, useTransition } from 'react';

import { Title, RandomTitlesResponse } from '../types';

export const useQueue = (baseUrl: string) => {
  const [queue, setQueue] = useState<Title[]>([]);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const fetchRandomTitles = async () => {
    if (isPending) return;
    
    setError(null);
    
    startTransition(async () => {
      try {
        const response = await fetch(`${baseUrl}/random-titles`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data: RandomTitlesResponse = await response.json();
        
        setQueue(prevQueue => {
          const newQueue = [...prevQueue, ...data.titles];
          return newQueue;
        });
      } catch (err) {
        console.error('Error fetching titles:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch titles');
      }
    });
  };

  // Check queue length and fetch more if needed
  useEffect(() => {
    if (queue.length < 10 && !isPending) {
      fetchRandomTitles();
    }
  }, [queue.length, isPending, baseUrl]);

  const dequeue = () => {
    if (queue.length === 0) {
      return null;
    }
    
    setQueue(prevQueue => {
      const [first, ...rest] = prevQueue;
      return rest;
    });
    
    return queue[0];
  };

  const peek = () => {
    if (queue.length < 2) {
      return null;
    }
    return [queue[0], queue[1]];
  };

  const clearQueue = () => {
    setQueue([]);
  };

  return {
    queue,
    dequeue,
    peek,
    clearQueue,
    isLoading: isPending,
    error,
    queueLength: queue.length
  };
};