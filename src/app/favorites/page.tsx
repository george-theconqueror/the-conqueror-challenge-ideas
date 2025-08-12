"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { fetchFavoriteTitles } from "@/lib/api"
import Link from "next/link"

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<{id: number, title: string, added_favorite: number}[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadFavorites()
  }, [])

  const loadFavorites = async () => {
    try {
      const titles = await fetchFavoriteTitles()
      setFavorites(titles)
    } catch (error) {
      console.error('Error loading favorites:', error)
    } finally {
      setIsLoading(false)
    }
  }

      return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
                {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-4xl mx-auto border-yellow-400/30 bg-zinc-800/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-center text-3xl text-yellow-400">Your Favorite Ideas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-yellow-400 text-xl">Loading your favorites...</p>
              </div>
            ) : favorites.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-zinc-400 text-xl mb-4">No favorites yet!</p>
                <p className="text-zinc-500 mb-6">Start playing the game and add some ideas to your favorites.</p>
                <Link href="/">
                  <Button className="bg-yellow-600 hover:bg-yellow-500 text-zinc-900 px-6 py-3 text-lg">
                    Start Playing
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {favorites.map((favorite) => (
                  <div
                    key={favorite.id}
                    className="p-4 bg-zinc-700/50 rounded-lg border border-zinc-600 hover:bg-zinc-700/70 transition-colors duration-200"
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
    </div>
  )
}
