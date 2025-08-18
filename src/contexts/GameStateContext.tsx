"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react'

interface GameStateContextType {
  gameStarted: boolean
  setGameStarted: (started: boolean) => void
}

const GameStateContext = createContext<GameStateContextType | undefined>(undefined)

export function GameStateProvider({ children }: { children: ReactNode }) {
  const [gameStarted, setGameStarted] = useState(false)

  return (
    <GameStateContext.Provider value={{ gameStarted, setGameStarted }}>
      {children}
    </GameStateContext.Provider>
  )
}

export function useGameState() {
  const context = useContext(GameStateContext)
  if (context === undefined) {
    throw new Error('useGameState must be used within a GameStateProvider')
  }
  return context
}
