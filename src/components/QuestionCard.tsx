"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Title } from "@/types"
import { incrementFavorite } from "@/lib/api"
import { Star } from "lucide-react"

interface QuestionCardProps {
  title1: Title
  title2: Title
  onSelect: (option: 0 | 1) => void
  selectedOption?: 0 | 1 | null
  showResults?: boolean
  isInitialLoad?: boolean
}

export function QuestionCard({ title1, title2, onSelect, selectedOption, showResults = false, isInitialLoad = false }: QuestionCardProps) {
  const [isPortrait, setIsPortrait] = useState(false)
  const [favoritedTitles, setFavoritedTitles] = useState<Set<number>>(new Set())
  const [isAnimating, setIsAnimating] = useState(true)

  // Check if screen is portrait (height > width)
  useEffect(() => {
    const checkOrientation = () => {
      setIsPortrait(window.innerHeight > window.innerWidth)
    }

    checkOrientation()
    window.addEventListener('resize', checkOrientation)
    return () => window.removeEventListener('resize', checkOrientation)
  }, [])

  // Handle entrance animation - only on initial load
  useEffect(() => {
    if (isInitialLoad) {
      setIsAnimating(true)
      const timer = setTimeout(() => {
        setIsAnimating(false)
      }, 300) // Animation duration
      
      return () => clearTimeout(timer)
    } else {
      setIsAnimating(false)
    }
  }, [title1.id, title2.id, isInitialLoad]) // Reset animation when titles change

  // Determine animation direction - cyan card always from left, teal card always from right
  const getAnimationClass = (cardIndex: 0 | 1) => {
    if (!isAnimating || !isInitialLoad) return ''
    
    if (cardIndex === 0) {
      // First card (cyan) always slides in from left
      return 'animate-slide-in-left'
    } else {
      // Second card (teal) always slides in from right
      return 'animate-slide-in-right'
    }
  }



  return (
    <div className="w-full h-full flex flex-col overflow-hidden bg-black">
      {/* Two Large Cards - Full Screen */}
      <div className={`flex-1 flex gap-4 pb-3.5 ${
        isPortrait ? 'flex-col' : 'flex-row'
      }`}>
        {/* Option 0 Card - Yellow text on zinc background before selection */}
        <Card 
          className={`cursor-pointer relative ${getAnimationClass(0)} ${
            selectedOption === null && !showResults
              ? '' // No transitions when nothing is selected yet
              : 'transition-all duration-500 ease-in-out'
          } ${
            selectedOption === 0 
              ? 'bg-cyan-800 text-zinc-900' 
              : selectedOption === 1
                ? 'bg-zinc-800 text-zinc-400'
                : showResults && selectedOption === null
                  ? 'bg-zinc-800 text-zinc-400'
                  : 'bg-cyan-800 text-yellow-500 hover:bg-cyan-700 transition-all duration-300'
          } ${
            selectedOption === 0 
              ? (isPortrait ? 'h-[70%] w-full' : 'w-[70%] h-full')
              : selectedOption === 1
                ? (isPortrait ? 'h-[30%] w-full' : 'w-[30%] h-full')
                : (isPortrait ? 'h-1/2 w-full' : 'w-1/2 h-full')
          } ${selectedOption !== null || showResults ? 'pointer-events-none' : ''}`}
          onClick={() => selectedOption === null && !showResults && onSelect(0)}
        >
          {/* Favorite Button - Responsive positioning */}
          {!(selectedOption === 1 || (showResults && selectedOption === null)) && (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                incrementFavorite(title1.id);
                setFavoritedTitles(prev => new Set(prev).add(title1.id));
              }}
              className={`absolute z-10 p-1 h-10 w-10 ${
                isPortrait ? 'top-2 left-1/2 transform -translate-x-1/2' : 'top-2 right-2'
              } ${
                favoritedTitles.has(title1.id) 
                  ? 'bg-zinc-800/80 text-cyan-500 cursor-not-allowed' 
                  : 'bg-zinc-800/80 text-cyan-400 hover:bg-zinc-700/90'
              }`}
              disabled={selectedOption !== null || showResults || favoritedTitles.has(title1.id)}
            >
              {favoritedTitles.has(title1.id) ? <Star className="text-cyan-500" fill="currentColor" size={20}/> : <Star className="text-cyan-400" size={20}/>}
            </Button>
          )}
          
          <CardHeader className={`h-full flex flex-col justify-center items-center ${
            isPortrait ? 'text-center' : ''
          }`}>
            <CardTitle className={`font-bold text-2xl md:text-5xl mb-4 ${
            selectedOption === 1 || (showResults && selectedOption === null) ? 'text-zinc-700/50' : 'text-white'
} ${isPortrait ? 'text-center w-full' : 'self-center text-center'}`}>
              {title1.title}
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Option 1 Card - cyan text on teal background before selection */}
        <Card 
          className={`cursor-pointer relative ${getAnimationClass(1)} ${
            selectedOption === null && !showResults
              ? '' // No transitions when nothing is selected yet
              : 'transition-all duration-500 ease-in-out'
          } ${
            selectedOption === 1 
              ? 'bg-teal-600/70 text-teal-900' 
              : selectedOption === 0
                ? 'bg-zinc-800 text-zinc-700/50'
                : showResults && selectedOption === null
                  ? 'bg-zinc-800 text-zinc-700/50'
                  : 'bg-teal-600/75 text-cyan-100 hover:bg-teal-600/90 transition-all duration-300'
          } ${
            selectedOption === 1 
              ? (isPortrait ? 'h-[70%] w-full' : 'w-[70%] h-full')
              : selectedOption === 0
                ? (isPortrait ? 'h-[30%] w-full' : 'w-[30%] h-full')
                : (isPortrait ? 'h-1/2 w-full' : 'w-1/2 h-full')
          } ${selectedOption !== null || showResults ? 'pointer-events-none' : ''}`}

          onClick={() => selectedOption === null && !showResults && onSelect(1)}
        >
          {/* Favorite Button - Responsive positioning */}
          {!(selectedOption === 0 || (showResults && selectedOption === null)) && (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                incrementFavorite(title2.id);
                setFavoritedTitles(prev => new Set(prev).add(title2.id));
              }}
              className={`absolute z-10 p-1 h-10 w-10 ${
                isPortrait ? 'bottom-2 left-1/2 transform -translate-x-1/2' : 'top-2 left-2'
              } ${
                favoritedTitles.has(title2.id) 
                  ? 'bg-zinc-800/80 text-teal-400 cursor-not-allowed' 
                  : 'bg-zinc-800/80 text-teal-400 hover:bg-zinc-700/90'
              }`}
              disabled={selectedOption !== null || showResults || favoritedTitles.has(title2.id)}
            >
              {favoritedTitles.has(title2.id) ? <Star className="text-teal-400" fill="currentColor" size={20}/> : <Star className="text-teal-400" size={20}/>}
            </Button>
          )}
          
          <CardHeader className={`h-full flex flex-col justify-center items-center ${
            isPortrait ? 'text-center' : ''
          }`}>
            <CardTitle className={`text-2xl md:text-5xl font-bold mb-4 ${
  selectedOption === 0 || (showResults && selectedOption === null) ? 'text-zinc-700' : 'text-white'
} ${isPortrait ? 'text-center w-full' : 'self-center text-center'}`}>
              {title2.title}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}
