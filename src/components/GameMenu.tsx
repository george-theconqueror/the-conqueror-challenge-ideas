"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Menu, Star, HelpCircle } from "lucide-react"
import Link from "next/link"
import { GameRules } from "./GameRules"

export function GameMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const [showRules, setShowRules] = useState(false)
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

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Main Button */}
      <Button
        onClick={toggleDropdown}
        className="bg-zinc-800 hover:bg-zinc-700 text-yellow-400 border border-yellow-400/50 hover:border-yellow-400 px-4 transition-colors duration-200 flex items-center gap-2"
      >
        <Menu/>
      </Button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full border rounded-sm right-0 mt-2 w-48 bg-zinc-800 shadow-xl z-50 min-w-max">
          {/* Favorites Option */}
          <Link href="/favorites">
            <div 
              className="flex items-center gap-2 px-3 py-2 text-gray-200  hover:text-yellow-400 transition-colors duration-300 cursor-pointer border-b"
              onClick={() => setIsOpen(false)}
            >
              <Star className="w-6 h-6" />
              <span>Favorites</span>
            </div>
          </Link>

          {/* How to Play Option */}
          <div 
            className="flex items-center gap-2 px-3 py-2 text-gray-200 hover:text-yellow-400 transition-colors duration-300 cursor-pointer"
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
    </div>
  )
}
