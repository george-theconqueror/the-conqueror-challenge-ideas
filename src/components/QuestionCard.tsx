"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Title } from "@/types"

interface QuestionCardProps {
  title1: Title
  title2: Title
  onSelect: (option: 0 | 1) => void
  selectedOption?: 0 | 1 | null
  showResults?: boolean
}

export function QuestionCard({ title1, title2, onSelect, selectedOption, showResults = false }: QuestionCardProps) {
  const [isPortrait, setIsPortrait] = useState(false)

  // Check if screen is portrait (height > width)
  useEffect(() => {
    const checkOrientation = () => {
      setIsPortrait(window.innerHeight > window.innerWidth)
    }

    checkOrientation()
    window.addEventListener('resize', checkOrientation)
    return () => window.removeEventListener('resize', checkOrientation)
  }, [])



  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      {/* Two Large Cards - Full Screen */}
      <div className={`flex-1 flex gap-4 p-4 pb-2 ${
        isPortrait ? 'flex-col' : 'flex-row'
      }`}>
        {/* Option 0 Card - Yellow text on zinc background before selection */}
        <Card 
          className={`cursor-pointer ${
            selectedOption === null 
              ? '' // No transitions when "I like none of these" is selected
              : 'transition-all duration-1000 ease-in-out'
          } ${
            selectedOption === 0 
              ? 'bg-yellow-500 text-zinc-900 border-4 border-yellow-500' 
              : selectedOption === 1
                ? 'bg-zinc-800 text-yellow-500 border-4 border-yellow-500'
                : 'bg-zinc-800 text-yellow-500 border-4 border-zinc-700 hover:bg-zinc-700 hover:border-yellow-500/50'
          } ${
            selectedOption === 0 
              ? (isPortrait ? 'h-[70%] w-full' : 'w-[70%] h-full')
              : selectedOption === 1
                ? (isPortrait ? 'h-[30%] w-full' : 'w-[30%] h-full')
                : (isPortrait ? 'h-1/2 w-full' : 'w-1/2 h-full')
          } ${selectedOption !== null ? 'pointer-events-none' : ''}`}
          onClick={() => selectedOption === null && onSelect(0)}
        >
          <CardHeader className={`h-full flex flex-col justify-center ${
            isPortrait ? 'text-center' : ''
          }`}>
            <CardTitle className={`text-2xl md:text-3xl font-bold mb-4 ${
  selectedOption === 0 ? 'text-zinc-900' : 'text-yellow-500'
} ${isPortrait ? 'text-center' : 'self-center'}`}>
              {title1.title}
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Option 1 Card - zinc text on yellow background before selection */}
        <Card 
          className={`cursor-pointer ${
            selectedOption === null 
              ? '' // No transitions when "I like none of these" is selected
              : 'transition-all duration-1000 ease-in-out'
          } ${
            selectedOption === 1 
              ? 'bg-yellow-500 text-zinc-900 border-4 border-yellow-500' 
              : selectedOption === 0
                ? 'bg-zinc-800 text-yellow-500 border-4 border-yellow-500'
                : 'bg-yellow-500 text-zinc-800 border-4 border-yellow-500 hover:bg-yellow-400 hover:border-yellow-600'
          } ${
            selectedOption === 1 
              ? (isPortrait ? 'h-[70%] w-full' : 'w-[70%] h-full')
              : selectedOption === 0
                ? (isPortrait ? 'h-[30%] w-full' : 'w-[30%] h-full')
                : (isPortrait ? 'h-1/2 w-full' : 'w-1/2 h-full')
          } ${selectedOption !== null ? 'pointer-events-none' : ''}`}

          onClick={() => selectedOption === null && onSelect(1)}
        >
          <CardHeader className={`h-full flex flex-col justify-center ${
            isPortrait ? 'text-center' : ''
          }`}>
            <CardTitle className={`text-2xl md:text-3xl font-bold mb-4 ${
  selectedOption === 0 ? 'text-yellow-400' : 'text-zinc-800'
} ${isPortrait ? 'text-center' : 'self-center'}`}>
              {title2.title}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}
