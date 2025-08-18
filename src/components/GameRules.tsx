"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface GameRulesProps {
  onClose: () => void
}

export function GameRules({ onClose }: GameRulesProps) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] pt-6 bg-zinc-950">
        <div className="flex flex-col sm:flex-row gap-6 h-full">
          {/* Image - Top on mobile, Left on desktop */}
          <div className="flex-shrink-0 flex justify-center sm:items-center">
            <img 
              src="/conqueror-next.png" 
              alt="The Conqueror Next Medal" 
              className="w-60 sm:w-72 h-auto sm:h-full object-contain"
            />
          </div>
          
          {/* Text content - Bottom on mobile, Right on desktop */}
          <div className="flex-1 border-t sm:border-t-0 sm:border-l pt-6 sm:pt-0 sm:pl-6 space-y-4">
            <DialogHeader className="text-left p-0">
              <DialogTitle className="text-tc-500 text-xl">Virtual Challenge - Would You Rather</DialogTitle>
              <DialogDescription className="text-white">
                Help us decide the next amazing virtual challenges for The Conqueror community!
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-2">
             <h4 className="font-medium text-tc-500">What We're Looking For</h4>
              <ul className="text-sm text-white space-y-1">
                <li>- Creative and inspiring virtual challenges</li>
                <li>- Ideas that bring the community together</li>
                <li>- Challenges that push personal boundaries</li>
              </ul>
            </div>

            <div className="space-y-2">
             <h4 className="font-medium text-tc-500">Your Impact</h4>
              <p className="text-sm text-white">
                Every vote counts! The most voted and the most favourited challenge ideas could become 
                official virtual challenges that thousands of people will participate in.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
