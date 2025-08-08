"use client"

import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { useState, useEffect } from "react"
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

  // Simple 70/30 ratio based on selected option
  const idea1Percentage = selectedOption === 0 ? 70 : 30;
  const idea2Percentage = selectedOption === 1 ? 70 : 30;

  // Calculate flex values with minimum 20% width/height
  const getFlexValue = (percentage: number) => {
    if (!showResults) return 1 // Equal size when not showing results
    
    // Ensure minimum 20% size (0.2) and maximum 80% size (0.8)
    const normalizedPercentage = percentage / 100
    const minFlex = 0.2
    const maxFlex = 0.8
    
    if (normalizedPercentage <= minFlex) return minFlex
    if (normalizedPercentage >= maxFlex) return maxFlex
    return normalizedPercentage
  }

  const idea1Flex = getFlexValue(idea1Percentage)
  const idea2Flex = getFlexValue(idea2Percentage)

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      {/* Two Large Cards - Full Screen */}
      <div className={`flex-1 flex gap-4 p-4 ${
        isPortrait ? 'flex-col' : 'flex-row'
      }`}>
        {/* Option 0 Card - Yellow text on zinc background before selection */}
        <Card 
          className={`cursor-pointer transition-all duration-1000 ease-out ${
            selectedOption === 0 
              ? 'ring-4 ring-yellow-500 bg-yellow-500 text-zinc-800 border-6 border-yellow-500' 
              : showResults 
                ? 'bg-zinc-800 text-yellow-500 border-4 border-yellow-500'
                : 'border-4 border-zinc-700 bg-zinc-800 text-yellow-500 hover:bg-zinc-700 hover:border-yellow-500/50'
          } ${showResults ? 'pointer-events-none' : ''}`}
          style={{
            flex: showResults ? (isPortrait ? idea1Flex : idea1Flex) : 1
          }}
          onClick={() => !showResults && onSelect(0)}
        >
          <CardHeader className={`h-full flex flex-col justify-center ${
            isPortrait ? 'text-center' : ''
          }`}>
            <CardTitle className={`text-2xl md:text-3xl font-bold mb-4 ${
              selectedOption === 0 ? 'text-zinc-800' : 'text-yellow-500'
            } ${isPortrait ? 'text-center' : 'self-center'}`}>
              {title1.title}
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Option 1 Card - zinc text on yellow background before selection */}
        <Card 
          className={`cursor-pointer transition-all duration-1000 ease-out ${
            selectedOption === 1 
              ? 'ring-4 ring-yellow-500 bg-yellow-500 text-zinc-800 border-6 border-yellow-500' 
              : showResults 
                ? 'bg-zinc-800 text-yellow-500 border-4 border-yellow-500'
                : 'border-4 border-zinc-700 bg-yellow-500 text-zinc-800 hover:bg-yellow-400 hover:border-yellow-600'
          } ${showResults ? 'pointer-events-none' : ''}`}
          style={{
            flex: showResults ? (isPortrait ? idea2Flex : idea2Flex) : 1
          }}
          onClick={() => !showResults && onSelect(1)}
        >
          <CardHeader className={`h-full flex flex-col justify-center ${
            isPortrait ? 'text-center' : ''
          }`}>
            <CardTitle className={`text-2xl md:text-3xl font-bold mb-4 ${
              selectedOption === 1 ? 'text-zinc-800' : selectedOption === 0 ? 'text-yellow-500' : 'text-zinc-800'
            } ${isPortrait ? 'text-center' : 'self-center'}`}>
              {title2.title}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}
