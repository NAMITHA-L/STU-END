"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface CelebrationPopupProps {
  isVisible: boolean
  onClose: () => void
}

export default function CelebrationPopup({ isVisible, onClose }: CelebrationPopupProps) {
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    if (isVisible) {
      setShowConfetti(true)
      const timer = setTimeout(() => {
        setShowConfetti(false)
        onClose()
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose])

  if (!isVisible) return null

  return (
    <>
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "absolute w-2 h-2 rounded-full animate-bounce",
                i % 5 === 0 && "bg-yellow-400",
                i % 5 === 1 && "bg-green-400",
                i % 5 === 2 && "bg-blue-400",
                i % 5 === 3 && "bg-pink-400",
                i % 5 === 4 && "bg-purple-400",
              )}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Popup */}
      <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-40 animate-in fade-in duration-300">
        <Card className="mx-4 max-w-md animate-in zoom-in duration-300">
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <CheckCircle className="h-16 w-16 text-green-500" />
                <Sparkles className="h-6 w-6 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-green-600 mb-2">Congratulations!</h3>
            <p className="text-muted-foreground">
              Great job on completing your task! Keep going, you can definitely do it! 🎉
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
