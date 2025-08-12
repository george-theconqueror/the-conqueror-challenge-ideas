"use client"

import Image from "next/image"
import { GameMenu } from "./GameMenu"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Header() {
  const pathname = usePathname()
  
  // Show game menu only on main page
  const showGameMenu = pathname === "/"
  
  return (
    <div className="flex justify-between items-center p-4 bg-zinc-900/80 backdrop-blur-sm border-b border-yellow-400/30 relative z-50">
      {/* Left side - Logo and Title */}
      <div className="flex items-center gap-3">
        <h1 className="text-3xl font-bold text-yellow-400" style={{ fontFamily: 'var(--font-onramp)' }}>
          Would You Rather
        </h1>
      </div>
      
      {/* Right side - Game Menu or Back to Game button */}
      {showGameMenu ? (
        <GameMenu />
      ) : (
        <Link href="/">
          <Button className="bg-yellow-500 hover:bg-yellow-400 text-zinc-900 px-4 font-semibold">
            ← Back to Game
          </Button>
        </Link>
      )}
    </div>
  )
}
