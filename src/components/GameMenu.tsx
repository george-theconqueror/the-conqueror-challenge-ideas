"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Menu, Star, HelpCircle } from "lucide-react"
import { GameRules } from "./GameRules"
import { FavoritesModal } from "./FavoritesModal"

export function GameMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const [showRules, setShowRules] = useState(false)
  const [showFavorites, setShowFavorites] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  const handleShowRules = () => {
    setShowRules(true)
    setIsOpen(false)
  }

  const handleShowFavorites = () => {
    setShowFavorites(true)
    setIsOpen(false)
  }

  return (
    <div 
      className="relative" 
      ref={dropdownRef}
    >
      {/* Main Button */}
      <Button
        onClick={toggleDropdown}
        className="bg-black border-none hover:bg-black text-tc-500 border px-4 transition-all duration-200 flex items-center gap-2"
      >
        <Menu className="w-7 h-7"/>
      </Button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div 
          className="absolute border-t-tc-500 border-t-2 top-full right-0 mt-2  w-48 bg-zinc-950 shadow-xl z-50 min-w-max"
        >
          {/* Favorites Option */}
          <div 
            className="flex items-center border-none gap-2 px-3 py-3 text-gray-200  hover:text-tc-500 transition-colors duration-300 cursor-pointer border-b"
            onClick={handleShowFavorites}
          >
            <Star className="w-6 h-6" />
            <span>Favorites</span>
          </div>

          {/* How to Play Option */}
          <div 
            className="flex items-center gap-2 px-3 py-3 border-t text-gray-200 hover:text-tc-500 transition-colors duration-300 cursor-pointer"
            onClick={handleShowRules}
          >
            <HelpCircle className="w-6 h-6" />
            <span>How to Play</span>
          </div>
        </div>
      )}

      {/* Game Rules Dialog */}
      {showRules && (
        <GameRules onClose={() => setShowRules(false)} />
      )}

      {/* Favorites Modal */}
      {showFavorites && (
        <FavoritesModal onClose={() => setShowFavorites(false)} />
      )}
    </div>
  )
}
