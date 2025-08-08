"use client"

import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

interface GameProgressProps {
  currentQuestion: number
  totalQuestions: number
  questionsAnswered: number
}

export function GameProgress({ currentQuestion, totalQuestions, questionsAnswered }: GameProgressProps) {
  const progressPercentage = (questionsAnswered / totalQuestions) * 100

  return (
    <div className="w-full space-y-2">
      {/* Progress Bar */}
      <div className="flex justify-between items-center text-sm">
        <span className="font-medium text-white">Progress</span>
        <span className="text-gray-400">
          {questionsAnswered} / {totalQuestions}
        </span>
      </div>
      <Progress value={progressPercentage} className="h-2 bg-gray-700" />
      
      {/* Current Question */}
      <div className="flex justify-center">
        <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">
          Question {currentQuestion} of {totalQuestions}
        </Badge>
      </div>
    </div>
  )
}
