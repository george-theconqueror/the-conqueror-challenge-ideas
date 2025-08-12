"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { QuestionCard } from "./QuestionCard"
import { useQueueContext } from "@/contexts/QueueContext"
import { Title } from "@/types"
import { updateEloRatings, lowerEloRatings } from "@/lib/api"
import Image from "next/image"
import Link from "next/link"

export function GameLogic() {
  const { queue, dequeue, peek, isLoading, error } = useQueueContext();
  const [currentTitles, setCurrentTitles] = useState<[Title, Title] | null>(null)
  const [gameState, setGameState] = useState<{
    selectedOption: 0 | 1 | null
    showResults: boolean
  }>({
    selectedOption: null,
    showResults: false
  })
  const [gameStarted, setGameStarted] = useState(false)



  // Get next pair of titles
  const getNextPair = (): [Title, Title] | null => {
    if (queue.length < 2) {
      return null;
    }
    
    // Get both titles at once using peek
    const titles = peek();
    if (!titles) {
      return null;
    }
    
    const [title1, title2] = titles;
    
    // Remove both titles from queue
    dequeue();
    dequeue();
    
    return [title1, title2];
  };

  // Initialize game with first pair
  const startNewGame = () => {
    const pair = getNextPair();
    if (pair) {
      setCurrentTitles(pair);
      setGameState({
        selectedOption: null,
        showResults: false
      });
      setGameStarted(true);
    }
  };

  // Load next pair when needed
  const loadNextPair = () => {
    const pair = getNextPair();
    if (pair) {
      setCurrentTitles(pair);
    }
  };

  // Handle option selection
  const handleOptionSelect = async (option: 0 | 1) => {
    if (gameState.selectedOption !== null) return // Prevent multiple selections

    // Update both selectedOption and showResults atomically
    setGameState({
      selectedOption: option,
      showResults: true
    });

    // Update Elo ratings if we have current titles
    if (currentTitles) {
      const [title1, title2] = currentTitles;
      
      try {
        const success = await updateEloRatings(title1.id, title2.id, option);
        if (!success) {
          console.error('Failed to update Elo ratings');
        }
      } catch (error) {
        console.error('Error updating Elo ratings:', error);
      }
    }

    // Hide results after 3 seconds and reset state
    setTimeout(() => {
      setGameState({
        selectedOption: null,
        showResults: false
      });
      
      // Load next pair
      loadNextPair();
    }, 1000);
  };

  // Handle "I like none of these" selection
  const handleNoneSelected = async () => {
    if (gameState.selectedOption !== null) return // Prevent multiple selections

    // Update both selectedOption and showResults atomically
    setGameState({
      selectedOption: null,
      showResults: true
    });

    // Lower ELO ratings for both titles when user likes neither
    if (currentTitles) {
      const [title1, title2] = currentTitles;
      
      try {
        const success = await lowerEloRatings(title1.id, title2.id);
        if (!success) {
          console.error('Failed to lower ELO ratings');
        }
      } catch (error) {
        console.error('Error lowering ELO ratings:', error);
      }
    }

    setTimeout(() => {
      setGameState({
        selectedOption: null,
        showResults: false
      });
      
      // Load next pair
      loadNextPair();
    }, 600);
  };

  // Start game automatically on component mount
  useEffect(() => {
    if (!gameStarted && !isLoading && queue.length >= 2) {
      startNewGame();
    }
  }, [gameStarted, isLoading, queue.length]);

  if (!gameStarted) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-zinc-900/50 from-20% via-zinc-900 via-80% to-zinc-900/70">
        {/* Cropped TC Image at the very top */}
        <div className="flex justify-center pt-8">
          <Image
            src="/cropped-tc.png"
            alt="Cropped TC"
            width={120}
            height={120}
            className="rounded-lg"
          />
        </div>
        
        {/* Centered content below the logo */}
        <div className="flex-1 flex flex-col items-center justify-center">
          {/* Main Title with ONRAMP Font */}
          <h1 className="text-8xl text-yellow-400 mb-4 text-center" style={{ fontFamily: 'var(--font-onramp)' }}>
            Would You Rather
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl text-zinc-600 mb-8 text-center" style={{ fontFamily: 'var(--font-lakesight)' }}>
            Choose your next challenges
          </p>
        </div>
                
      </div>
    );
  }

  if (!currentTitles) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
        <Card className="w-full max-w-md border-yellow-400/30 bg-zinc-800/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-center text-yellow-400">Loading...</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-yellow-400/70">
              Preparing your questions...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const [title1, title2] = currentTitles;
  
  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
      {/* Question Card - 80% of available height */}
      <div className="h-[80%]">
        <QuestionCard
          title1={title1}
          title2={title2}
          onSelect={handleOptionSelect}
          selectedOption={gameState.selectedOption}
          showResults={gameState.showResults}
        />
      </div>

      {/* "I like none of these" Button - 20% of available height */}
      <div className="h-[20%] flex items-center justify-center p-4 pt-2">
        <Button 
          onClick={handleNoneSelected}
          disabled={gameState.selectedOption !== null || gameState.showResults}
          className={`w-full h-full text-2xl font-bold transition-all duration-300 ${
            gameState.selectedOption !== null || gameState.showResults
              ? 'bg-zinc-600 text-zinc-400 cursor-not-allowed'
              : 'bg-zinc-900 text-gray-300 border-4 border-zinc-800 hover:bg-zinc-800 hover:border-gray-500/50'
          }`}
        >
          None of these
        </Button>
      </div>
    </div>
  );
}
