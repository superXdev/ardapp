"use client"

import { useState, useEffect } from "react"
import { X, ZoomIn, ZoomOut } from "lucide-react"
import { Button } from "@/components/ui/button"

interface LightboxProps {
  imageUrl: string
  isOpen: boolean
  onClose: () => void
}

export default function Lightbox({ imageUrl, isOpen, onClose }: LightboxProps) {
  const [scale, setScale] = useState(1)

  // Reset zoom when image changes
  useEffect(() => {
    setScale(1)
  }, [imageUrl])

  // Close on escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }

    if (isOpen) {
      window.addEventListener("keydown", handleEsc)
    }

    return () => {
      window.removeEventListener("keydown", handleEsc)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const zoomIn = () => {
    setScale((prev) => Math.min(prev + 0.25, 3))
  }

  const zoomOut = () => {
    setScale((prev) => Math.max(prev - 0.25, 0.5))
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center backdrop-blur-sm" onClick={onClose}>
      <div className="relative max-w-[90vw] max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="overflow-auto p-4 flex items-center justify-center">
          <img
            src={imageUrl || "/placeholder.svg"}
            alt="Enlarged view"
            className="max-w-full max-h-[80vh] object-contain transition-transform duration-200"
            style={{ transform: `scale(${scale})` }}
          />
        </div>

        <div className="absolute top-2 right-2 flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={zoomIn}
            className="h-8 w-8 rounded-full bg-black/50 text-white hover:bg-black/70"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={zoomOut}
            className="h-8 w-8 rounded-full bg-black/50 text-white hover:bg-black/70"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 rounded-full bg-black/50 text-white hover:bg-black/70"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
