"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import QuestionMark from "./QuestionMark"

export function GameRules() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          size="icon" 
          className="w-12 h-12 rounded-full border-3 bg-yellow-500 shadow-lg backdrop-blur-sm"
        >
          <QuestionMark className="h-8 w-8"/>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] border-2 border-yellow-400/30 bg-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-yellow-400">The Conqueror Virtual Challenges</DialogTitle>
          <DialogDescription className="text-yellow-400/70">
            Help us discover amazing virtual challenge ideas for The Conqueror community!
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-semibold text-yellow-400">Our Mission</h4>
            <p className="text-sm text-yellow-400/70">
              We're collecting creative virtual challenge ideas that can inspire The Conqueror community 
              to push their limits and achieve amazing feats together.
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-semibold text-yellow-400">How It Works</h4>
            <ul className="text-sm text-yellow-400/70 space-y-1">
              <li>• Choose between two virtual challenge scenarios</li>
              <li>• Your votes help us identify the most popular ideas</li>
              <li>• See how the community votes on each challenge</li>
              <li>• The most voted ideas may become real Conqueror challenges!</li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-semibold text-yellow-400">What We're Looking For</h4>
            <ul className="text-sm text-yellow-400/70 space-y-1">
              <li>• Creative and inspiring virtual challenges</li>
              <li>• Challenges that can be done from anywhere</li>
              <li>• Ideas that bring the community together</li>
              <li>• Challenges that push personal boundaries</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-yellow-400">Your Impact</h4>
            <p className="text-sm text-yellow-400/70">
              Every vote counts! The most popular challenge ideas from this game could become 
              official Conqueror virtual challenges that thousands of people will participate in.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
