"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { QuestionCard } from "./QuestionCard"
import { GameRules } from "./GameRules"
import { FavoritePopup } from "./FavoritePopup"
import { NameInput } from "./NameInput"
import { useQueueContext } from "@/contexts/QueueContext"
import { useNameContext } from "@/contexts/NameContext"
import { Title } from "@/types"
import { updateEloRatings, lowerEloRatings } from "@/lib/api"
import Image from "next/image"
import Link from "next/link"

export function GameLogic() {
  const { queue, dequeue, peek, isLoading, error } = useQueueContext();
  const { playerName } = useNameContext();
  const [currentTitles, setCurrentTitles] = useState<[Title, Title] | null>(null)
  const [gameState, setGameState] = useState<{
    selectedOption: 0 | 1 | null
    showResults: boolean
  }>({
    selectedOption: null,
    showResults: false
  })
  const [gameStarted, setGameStarted] = useState(false)
  const [showFavoritePopup, setShowFavoritePopup] = useState(false)


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
    if (!gameStarted && !isLoading && queue.length >= 2 && playerName) {
      startNewGame();
    }
  }, [gameStarted, isLoading, queue.length, playerName]);

  // Show name input if player hasn't entered their name
  if (!playerName) {
    return <NameInput onStartGame={() => {}} />;
  }

  if (!gameStarted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
        <Card className="w-full max-w-md mx-4 border-yellow-400/30 bg-zinc-800/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-center text-3xl text-yellow-400">Would You Rather</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-center text-yellow-400/70">
              Make tough choices and see how others voted!
            </p>
            {isLoading ? (
              <p className="text-center text-yellow-400/50">Loading titles...</p>
            ) : error ? (
              <p className="text-center text-red-400">Error: {error}</p>
            ) : queue.length < 2 ? (
              <p className="text-center text-yellow-400/50">Not enough titles available</p>
            ) : (
              <Button onClick={startNewGame} className="w-full bg-yellow-400 text-zinc-800 hover:bg-yellow-500" size="lg">
                Start Game
              </Button>
            )}
            <div className="flex justify-center">
              <GameRules />
            </div>
          </CardContent>
        </Card>
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
    <div className="h-screen flex flex-col bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-zinc-900/80 backdrop-blur-sm border-b border-yellow-400/30">
          <Image
            src="/Conqueror Logo.png"
            alt="Conqueror Logo"
            width={32}
            height={32}
            className="rounded-sm"
          />
          <h1 className="text-xl font-bold text-yellow-400">
            Would You Rather
          </h1>
        
        <Link href="/favorites">
          <Button className="bg-zinc-700 hover:bg-zinc-600 text-yellow-400 border border-yellow-400/50 hover:border-yellow-400 px-4 transition-colors duration-200">
            ♥ Favorites
          </Button>
        </Link>
      </div>

      {/* Question Card - 80% of screen height */}
      <div className="h-[80%]">
        <QuestionCard
          title1={title1}
          title2={title2}
          onSelect={handleOptionSelect}
          selectedOption={gameState.selectedOption}
          showResults={gameState.showResults}
        />
      </div>

      {/* "I like none of these" Button - 20% of screen height */}
      <div className="h-[20%] flex items-center justify-center p-4 pt-2 gap-4">
        <Button 
          onClick={handleNoneSelected}
          disabled={gameState.selectedOption !== null || gameState.showResults}
          className={`flex-1 h-full text-2xl font-bold transition-all duration-300 ${
            gameState.selectedOption !== null || gameState.showResults
              ? 'bg-zinc-600 text-zinc-400 cursor-not-allowed'
              : 'bg-zinc-800 text-yellow-400/85 border-4 border-zinc-700 hover:bg-zinc-700 hover:border-yellow-500/50'
          }`}
        >
          None of these
        </Button>

        <Button 
          onClick={() => setShowFavoritePopup(true)}
          disabled={gameState.selectedOption !== null || gameState.showResults}
          className={`flex-1 h-full text-2xl font-bold transition-all duration-300 ${
            gameState.selectedOption !== null || gameState.showResults
              ? 'bg-zinc-600 text-zinc-400 cursor-not-allowed'
              : 'bg-yellow-500/95 text-zinc-800 border-4 border-yellow-600 hover:bg-yellow-400 hover:border-yellow-500 hover:text-zinc-700'
          }`}
        >
          Add to Favorites
        </Button> {/**                 : 'bg-yellow-500 text-zinc-800 border-4 border-yellow-500 hover:bg-yellow-400 hover:border-yellow-600' */}
      </div>

      {/* Favorite Popup */}
      {currentTitles && (
        <FavoritePopup
          title1={currentTitles[0]}
          title2={currentTitles[1]}
          isOpen={showFavoritePopup}
          onClose={() => setShowFavoritePopup(false)}
        />
      )}



      {/* Floating Help Button - Bottom Right Corner */}
      <div className="fixed bottom-6 right-6 z-50">
        <GameRules />
      </div>
    </div>
  );
}
