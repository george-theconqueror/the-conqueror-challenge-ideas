"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Title } from "@/types"
import { incrementFavorite } from "@/lib/api"

interface FavoritePopupProps {
  title1: Title
  title2: Title
  isOpen: boolean
  onClose: () => void
}

export function FavoritePopup({ title1, title2, isOpen, onClose }: FavoritePopupProps) {
  const [selectedTitles, setSelectedTitles] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(false)

  if (!isOpen) return null

  const toggleTitleSelection = (titleId: number) => {
    setSelectedTitles(prev => 
      prev.includes(titleId) 
        ? prev.filter(id => id !== titleId)
        : [...prev, titleId]
    )
  }

  const handleSave = async () => {
    if (selectedTitles.length === 0) return
    
    setIsLoading(true)
    try {
      const promises = selectedTitles.map(id => incrementFavorite(id))
      await Promise.all(promises)
      onClose()
    } catch (error) {
      console.error('Error adding to favorites:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setSelectedTitles([])
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl mx-4 border-yellow-400/30 bg-zinc-800/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-center text-2xl text-yellow-400">Select Favorites</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Selection Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Option 1 Card */}
            <Card 
              className={`cursor-pointer transition-all duration-200 ${
                selectedTitles.includes(title1.id)
                  ? 'border-2 border-yellow-400 bg-yellow-400/20'
                  : 'border-2 border-zinc-600 bg-zinc-700/50 hover:border-zinc-500'
              }`}
              onClick={() => toggleTitleSelection(title1.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <p className="text-yellow-400 text-lg font-medium">{title1.title}</p>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedTitles.includes(title1.id)
                      ? 'border-yellow-400 bg-yellow-400'
                      : 'border-zinc-500'
                  }`}>
                    {selectedTitles.includes(title1.id) && (
                      <span className="text-zinc-900 text-sm font-bold">✓</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Option 2 Card */}
            <Card 
              className={`cursor-pointer transition-all duration-200 ${
                selectedTitles.includes(title2.id)
                  ? 'border-2 border-yellow-400 bg-yellow-400/20'
                  : 'border-2 border-zinc-600 bg-zinc-700/50 hover:border-zinc-500'
              }`}
              onClick={() => toggleTitleSelection(title2.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <p className="text-yellow-400 text-lg font-medium">{title2.title}</p>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedTitles.includes(title2.id)
                      ? 'border-yellow-400 bg-yellow-400'
                      : 'border-zinc-500'
                  }`}>
                    {selectedTitles.includes(title2.id) && (
                      <span className="text-zinc-900 text-sm font-bold">✓</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-center">
            <Button
              onClick={handleSave}
              disabled={isLoading || selectedTitles.length === 0}
              className="bg-yellow-600 hover:bg-yellow-500 text-zinc-900 font-bold px-8"
            >
              {isLoading ? 'Saving...' : `Save ${selectedTitles.length} Favorite${selectedTitles.length !== 1 ? 's' : ''}`}
            </Button>
            
            <Button
              onClick={handleClose}
              className="bg-zinc-600 hover:bg-zinc-500 text-white px-8"
            >
              Cancel
            </Button>
          </div>

          {/* Instructions */}
          <p className="text-center text-zinc-400 text-sm">
            Click on the cards to select which options you want to add to favorites
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
