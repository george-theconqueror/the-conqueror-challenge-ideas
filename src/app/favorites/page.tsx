"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { fetchFavoriteTitles } from "@/lib/api"
import Image from "next/image"
import Link from "next/link"

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<string[]>([])
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
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-zinc-900/80 backdrop-blur-sm border-b border-yellow-400/30">
        <div className="flex items-center gap-3">
          <Image
            src="/Conqueror Logo.png"
            alt="Conqueror Logo"
            width={32}
            height={32}
            className="rounded-sm"
          />
          <h1 className="text-xl font-bold text-yellow-400">
            The Conqueror Virtual Challenges Ideas
          </h1>
        </div>
        
        <Link href="/">
          <Button className="bg-yellow-600 hover:bg-yellow-500 text-zinc-900 px-4">
            ← Back to Game
          </Button>
        </Link>
      </div>

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
                {favorites.map((title, index) => (
                  <div
                    key={index}
                    className="p-4 bg-zinc-700/50 rounded-lg border border-zinc-600 hover:bg-zinc-700/70 transition-colors duration-200"
                  >
                    <p className="text-yellow-400 text-lg">{title}</p>
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
