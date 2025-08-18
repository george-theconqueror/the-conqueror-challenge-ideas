"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { QuestionCard } from "./QuestionCard"
import { useQueueContext } from "@/contexts/QueueContext"
import { Title } from "@/types"
import { updateEloRatings, lowerEloRatings } from "@/lib/api"
import { useGameState } from "@/contexts/GameStateContext"

export function GameLogic() {
  const { queue, dequeue, peek, isLoading, error } = useQueueContext();
  const { gameStarted, setGameStarted } = useGameState();
  const [currentTitles, setCurrentTitles] = useState<[Title, Title] | null>(null)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [isAnimating, setIsAnimating] = useState(true)
  const [gameState, setGameState] = useState<{
    selectedOption: 0 | 1 | null
    showResults: boolean
  }>({
    selectedOption: null,
    showResults: false
  })

  // Reusable loading screen component
  const LoadingScreen = () => (
    <div className="h-[calc(100vh-6rem)] bg-black flex flex-col overflow-hidden">
      {/* Centered text content */}
      <div className="flex-1 flex flex-col items-center -mt-12 md:-mt-20 justify-center px-4">
        {/* Main Title with ONRAMP Font */}
        <div className="text-center space-y-6">
          <h1 className="text-5xl md:text-8xl text-tc-500" style={{ fontFamily: 'var(--font-onramp)' }}>
            Would You Rather
          </h1>
          
          {/* Subtitle */}
          <div className="space-y-2">
            <p className="text-4xl md:text-7xl text-zinc-200" style={{ fontFamily: 'var(--font-lakesight)' }}>
              You choose the next
              <br />
              challenges!
            </p>
          </div>
        </div>
      </div>
      
      {/* Loading text */}
      <div className="pb-8 flex justify-center">
        <p className="text-xl md:text-2xl font-medium text-tc-500">Loading...</p>
      </div>
    </div>
  );

  // Handle entrance animation - only on initial load
  useEffect(() => {
    if (isInitialLoad && currentTitles) {
      setIsAnimating(true)
      const timer = setTimeout(() => {
        setIsAnimating(false)
      }, 300) // Animation duration
      
      return () => clearTimeout(timer)
    } else {
      setIsAnimating(false)
    }
  }, [currentTitles, isInitialLoad]) // Reset animation when titles change

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
      setIsInitialLoad(false); // No longer initial load after first pair
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

    // Hide results and reset state after animation completes
    setTimeout(() => {
      setGameState({
        selectedOption: null,
        showResults: false
      });
      
      // Load next pair
      loadNextPair();
    }, 300);
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
    }, 300);
  };

  // Start game automatically on component mount or restore state when returning to game
  useEffect(() => {
    if (!gameStarted && !isLoading && queue.length >= 2) {
      startNewGame();
    } else if (gameStarted && !currentTitles && !isLoading && queue.length >= 2) {
      // Game was started but we lost currentTitles (e.g., navigating back from favorites)
      // Restore the game state by loading a new pair
      const pair = getNextPair();
      if (pair) {
        setCurrentTitles(pair);
        setGameState({
          selectedOption: null,
          showResults: false
        });
      }
    }
  }, [gameStarted, isLoading, queue.length, currentTitles]);

  if (!gameStarted) {
    return <LoadingScreen />;
  }

  if (!currentTitles) {
    return <LoadingScreen />;
  }

  const [title1, title2] = currentTitles;
  
  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col overflow-hidden bg-black">
      {/* Question Card - 80% of available height */}
      <div className="h-[80%] overflow-hidden">
        <QuestionCard
          title1={title1}
          title2={title2}
          onSelect={handleOptionSelect}
          selectedOption={gameState.selectedOption}
          showResults={gameState.showResults}
          isInitialLoad={isInitialLoad}
        />
      </div>

      {/* "I like none of these" Button - 20% of available height */}
      <div className="h-[20%] flex items-center justify-center">
        <Button 
          onClick={handleNoneSelected}
          disabled={gameState.selectedOption !== null || gameState.showResults}
          className={`w-full h-full text-2xl md:text-4xl font-semibold border border-zinc-700 ${
            isAnimating && isInitialLoad ? 'animate-slide-in-bottom' : ''
          } ${
            gameState.selectedOption === null && !gameState.showResults
              ? '' // No transitions when nothing is selected yet
              : 'transition-all duration-400'
          } ${
            gameState.selectedOption !== null || gameState.showResults
              ? 'bg-zinc-900 text-zinc-500 rounded-none cursor-not-allowed'
              : 'bg-zinc-800 text-white/70 rounded-none hover:bg-zinc-900'
          }`}
        >
          None Of These
        </Button>
      </div>
    </div>
  );
}
