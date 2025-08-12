"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { fetchFavoriteTitles } from "@/lib/api"

interface FavoritesTabProps {
  isOpen: boolean
  onClose: () => void
}

interface FavoriteTitle {
  id: number
  title: string
  added_favorite: number
}

export function FavoritesTab({ isOpen, onClose }: FavoritesTabProps) {
  const [favorites, setFavorites] = useState<FavoriteTitle[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      loadFavorites()
    }
  }, [isOpen])

  const loadFavorites = async () => {
    setIsLoading(true)
    try {
      const titles = await fetchFavoriteTitles()
      setFavorites(titles)
    } catch (error) {
      console.error('Error loading favorites:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl mx-4 border-yellow-400/30 bg-zinc-800/90 backdrop-blur-sm max-h-[80vh] overflow-hidden">
        <CardHeader className="border-b border-zinc-700">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl text-yellow-400">Favorites</CardTitle>
            <Button
              onClick={onClose}
              className="bg-zinc-600 hover:bg-zinc-500 text-white"
            >
              Close
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center">
              <p className="text-yellow-400">Loading...</p>
            </div>
          ) : favorites.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-zinc-400">No favorites yet. Start adding some!</p>
            </div>
          ) : (
            <div className="max-h-[60vh] overflow-y-auto">
              {favorites.map((favorite) => (
                <div
                  key={favorite.id}
                  className="p-4 border-b border-zinc-700 last:border-b-0 hover:bg-zinc-700/50 transition-colors duration-200"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-yellow-400 text-lg">{favorite.title}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-400/70 text-sm">♥</span>
                      <span className="text-yellow-400 font-semibold">{favorite.added_favorite}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
