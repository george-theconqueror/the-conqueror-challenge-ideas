"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { fetchFavoriteTitles } from "@/lib/api"
import { Star } from "lucide-react"

interface FavoritesModalProps {
  onClose: () => void
}

export function FavoritesModal({ onClose }: FavoritesModalProps) {
  const [favorites, setFavorites] = useState<{id: number, title: string, added_favorite: number}[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadFavorites()
  }, [])

  const loadFavorites = async () => {
    try {
      const titles = await fetchFavoriteTitles()
      // Sort by added_favorite count and take top 10
      const sortedTitles = titles.sort((a, b) => b.added_favorite - a.added_favorite).slice(0, 10)
      setFavorites(sortedTitles)
    } catch (error) {
      console.error('Error loading favorites:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getRankingColor = (index: number) => {
    switch (index) {
      case 0: return "text-yellow-400" // Gold
      case 1: return "text-slate-300" // Silver
      case 2: return "text-amber-600" // Bronze
      default: return "text-tc-500"
    }
  }

  const getRankingBg = (index: number) => {
    switch (index) {
      case 0: return "bg-yellow-400/10 border-yellow-400/30" // Gold
      case 1: return "bg-slate-300/10 border-slate-300/30" // Silver
      case 2: return "bg-amber-600/10 border-amber-600/30" // Bronze
      default: return "bg-tc-500/5 border-tc-500/10"
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] pt-6 bg-zinc-950 max-h-[600px] overflow-hidden">
        <div className="flex flex-col sm:flex-row gap-4 h-full">
          {/* Image - Top on mobile, Left on desktop */}
          <div className="flex-shrink-0 flex justify-center sm:items-start sm:pt-4">
            <img 
              src="/conqueror-logo.svg" 
              alt="The Conqueror Logo" 
              className="w-20 md:w-36 -mt-6 md:-mt-4 h-auto object-contain"
            />
          </div>
          
          {/* Content - Bottom on mobile, Right on desktop */}
          <div className="flex-1 border-t sm:border-t-0 sm:border-l pt-4 sm:pt-0 sm:pl-4 space-y-3 overflow-hidden">
            <DialogHeader className="text-left p-0">
              <DialogTitle className="text-tc-500 text-xl">The Community Favorites</DialogTitle>
              <DialogDescription className="text-white -mt-1 mb-3 md:mb-1 text-md">
                These are the top 10 most starred challenges from our community!
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-2 overflow-y-auto h-[350px] pr-3">
              {isLoading ? (
                <div className="flex items-center justify-center border h-full">
                  <p className="text-tc-400 text-lg">Loading...</p>
                </div>
              ) : favorites.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <p className="text-zinc-400 text-lg mb-2">No favorites yet!</p>
                  <p className="text-zinc-500">Start playing to see community favorites.</p>
                </div>
              ) : (
                favorites.map((favorite, index) => (
                  <div
                    key={favorite.id}
                    className={`p-4 border ${getRankingBg(index)}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`text-xl font-bold min-w-[1.5rem] ${getRankingColor(index)}`}>
                        #{index + 1}
                      </div>
                      <div className="flex-1">
                        <p className={`font-semibold text-base leading-tight ${getRankingColor(index)}`}>
                          {favorite.title}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Star className={`${getRankingColor(index)}`} fill="currentColor" size={14}/>
                        <span className={`font-semibold text-sm ${getRankingColor(index)}`}>
                          {favorite.added_favorite}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
