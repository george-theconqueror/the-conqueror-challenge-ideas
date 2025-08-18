"use client"

import Image from "next/image"
import { GameMenu } from "./GameMenu"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useGameState } from "@/contexts/GameStateContext"
import { Star, HelpCircle } from "lucide-react"
import { useState } from "react"
import { GameRules } from "./GameRules"
import { FavoritesModal } from "./FavoritesModal"

export function Header() {
  const { gameStarted } = useGameState()
  const pathname = usePathname()
  const [showRules, setShowRules] = useState(false)
  const [showFavorites, setShowFavorites] = useState(false)
  
  // Show game menu only on main page
  const showGameMenu = pathname === "/"
  
  // Show conqueror logo only when game hasn't started (loading screen)
  const showConquerorLogo = pathname === "/" && !gameStarted
  
  // Show regular header content when game has started or on other pages
  const showRegularHeader = gameStarted || pathname !== "/"
  
  return (
    <div className="flex bg-black justify-between items-center px-2 pl-5 md:px-6 md:pl-8 relative z-50 h-24 min-h-[6rem] max-h-[6rem]">
      {showConquerorLogo && (
        <div className="flex justify-center w-full mt-20 md:mt-32">
          <Image
            src="/conqueror-logo.svg"
            alt="Conqueror Logo"
            width={140}
            height={60}
            className="w-28 h-auto sm:w-32 md:w-36"
          />
        </div>
      )}
      
      {showRegularHeader && (
        <>
          {/* Left side - Logo and Title */}
          <div className="flex items-center gap-3">
            <Link href="/">
              <h1 className="text-3xl tracking-wide md:text-4xl font-bold text-tc-500 hover:text-tc-600 duration-500 cursor-pointer transition-colors" style={{ fontFamily: 'var(--font-onramp)' }}>
                Would You Rather
              </h1>
            </Link>
          </div>
          
          {/* Right side - Desktop Menu or Mobile Menu or Back to Game button */}
          {showGameMenu ? (
            <>
              {/* Desktop Menu - Show individual buttons */}
              <div className="hidden md:flex items-center gap-2">
                <Button 
                  onClick={() => setShowFavorites(true)}
                  className="bg-black border-none font-bold hover:bg-black text-tc-500 hover:text-tc-600 hover:cursor-pointer transition-colors duration-200 flex items-center gap-3 px-6 py-3 text-lg"
                >
                  <Star className="w-8 h-8 -mr-1" />
                  <span>Favorites</span>
                </Button>
                <Button 
                  onClick={() => setShowRules(true)}
                  className="bg-black border-none hover:bg-black font-bold text-tc-500 hover:text-tc-600 hover:cursor-pointer transition-colors duration-200 flex items-center gap-3 px-6 py-3 text-lg"
                >
                  <HelpCircle className="w-8 h-8 -mr-1" />
                  <span>How to Play</span>
                </Button>
              </div>
              
              {/* Mobile Menu - Show hamburger menu */}
              <div className="md:hidden">
                <GameMenu />
              </div>
            </>
          ) : (
            <Link href="/">
              <Button className="bg-tc-500 rounded-none hover:bg-tc-600 hover:cursor-pointer text-zinc-900 px-4 font-semibold">
                ← Back to Game
              </Button>
            </Link>
          )}
        </>
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
