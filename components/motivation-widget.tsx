"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Zap } from "lucide-react"

const motivationalTips = [
  "Break your study sessions into 25-minute focused blocks with 5-minute breaks (Pomodoro Technique).",
  "Create a dedicated study space free from distractions to train your brain to focus when in that environment.",
  "Use active recall instead of passive reading. Test yourself on the material regularly.",
  "Explain concepts out loud as if teaching someone else to solidify your understanding.",
  "Stay hydrated and take short walks between study sessions to keep your mind fresh.",
  "Use spaced repetition to review material at increasing intervals for better long-term retention.",
  "Set specific, achievable goals for each study session rather than vague objectives.",
  "Reward yourself after completing difficult tasks to build positive associations with studying.",
  "Try the 'two-minute rule': if a task takes less than two minutes, do it immediately.",
  "Remember your 'why' - connect your current studies to your long-term goals and aspirations.",
]

export default function MotivationWidget() {
  const [tip, setTip] = useState("")
  const [isVisible, setIsVisible] = useState(false)

  const generateTip = () => {
    const randomTip = motivationalTips[Math.floor(Math.random() * motivationalTips.length)]
    setTip(randomTip)
    setIsVisible(true)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Zap className="h-5 w-5 text-yellow-500 mr-2" />
          Motivation Widget
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center">
          <Button onClick={generateTip} variant="outline" className="mb-4">
            I'm tired... Need motivation!
          </Button>

          {isVisible && (
            <div className="bg-muted p-4 rounded-md mt-4 animate-fade-in">
              <p className="italic">{tip}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
