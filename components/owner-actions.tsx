"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Bomb } from "lucide-react"

interface OwnerActionsProps {
  onDestroyContract: () => void
}

export default function OwnerActions({ onDestroyContract }: OwnerActionsProps) {
  const [isHovering, setIsHovering] = useState(false)

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={onDestroyContract}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        className={`bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] hover:from-[#ff3162] hover:to-[#ff3b1b] text-white rounded-full shadow-lg transition-all duration-300 ${
          isHovering ? "animate-bounce" : ""
        }`}
      >
        <Bomb className="w-5 h-5 mr-2" />
        Hancurkan Kontrak
      </Button>
    </div>
  )
}
