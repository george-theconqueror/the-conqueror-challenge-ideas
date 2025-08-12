"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useNameContext } from "@/contexts/NameContext"
import Image from "next/image"

interface NameInputProps {
  onStartGame: () => void
}

export function NameInput({ onStartGame }: NameInputProps) {
  const { playerName, setPlayerName } = useNameContext()
  const [inputName, setInputName] = useState(playerName)
  const [error, setError] = useState("")

  const handleStartGame = () => {
    if (!inputName.trim()) {
      setError("Please enter your name")
      return
    }
    
    if (inputName.trim().length < 2) {
      setError("Name must be at least 2 characters long")
      return
    }
    
    setError("")
    setPlayerName(inputName.trim())
    onStartGame()
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleStartGame()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
      <Card className="w-full max-w-md mx-4 border-yellow-400/30 bg-zinc-800/50 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Image
              src="/Conqueror Logo.png"
              alt="Conqueror Logo"
              width={64}
              height={64}
              className="rounded-sm"
            />
          </div>
          <CardTitle className="text-3xl text-yellow-400">Welcome to Would You Rather</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-center text-yellow-400/70">
            Enter your name to start playing and track your favorites!
          </p>
          
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Enter your name..."
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              onKeyPress={handleKeyPress}
              className="text-center text-lg bg-zinc-700 border-yellow-400/50 text-yellow-400 placeholder:text-yellow-400/50 focus:border-yellow-400 focus:ring-yellow-400/20"
              autoFocus
            />
            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}
          </div>
          
          <Button 
            onClick={handleStartGame}
            className="w-full bg-yellow-400 text-zinc-800 hover:bg-yellow-500 text-lg font-semibold py-3"
            size="lg"
          >
            Start Game
          </Button>
          
          <p className="text-center text-yellow-400/50 text-sm">
            Your name will be saved and used for tracking favorites
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
