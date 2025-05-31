"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Zap, BookOpen, Coffee, Brain, Volume2, RefreshCw } from "lucide-react"

// Sample motivational quotes
const quotes = [
  {
    text: "The secret of getting ahead is getting started.",
    author: "Mark Twain",
  },
  {
    text: "It always seems impossible until it's done.",
    author: "Nelson Mandela",
  },
  {
    text: "Don't watch the clock; do what it does. Keep going.",
    author: "Sam Levenson",
  },
  {
    text: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt",
  },
  {
    text: "Success is not final, failure is not fatal: It is the courage to continue that counts.",
    author: "Winston Churchill",
  },
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
  },
  {
    text: "Discipline is doing what needs to be done, even when you don't feel like it.",
    author: "Unknown",
  },
]

// Sample study tips
const studyTips = [
  "Use the Pomodoro Technique: 25 minutes of focused study followed by a 5-minute break.",
  "Create a dedicated study space free from distractions.",
  "Use active recall instead of passive reading. Test yourself on the material.",
  "Explain concepts out loud as if teaching someone else to solidify your understanding.",
  "Stay hydrated and take short walks between study sessions to keep your mind fresh.",
  "Use spaced repetition to review material at increasing intervals for better retention.",
  "Set specific, achievable goals for each study session rather than vague objectives.",
  "Try the 'Feynman Technique': Explain a concept in simple terms to identify knowledge gaps.",
  "Use mind maps to visualize connections between different concepts.",
  "Get enough sleep. Your brain consolidates memories during sleep.",
]

export default function MotivationPage() {
  const [activeTab, setActiveTab] = useState("quotes")
  const [currentQuote, setCurrentQuote] = useState(quotes[0])
  const [currentTip, setCurrentTip] = useState(studyTips[0])
  const [isAnimating, setIsAnimating] = useState(false)

  // Get new quote
  const getNewQuote = () => {
    setIsAnimating(true)
    setTimeout(() => {
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)]
      setCurrentQuote(randomQuote)
      setIsAnimating(false)
    }, 300)
  }

  // Get new tip
  const getNewTip = () => {
    setIsAnimating(true)
    setTimeout(() => {
      const randomTip = studyTips[Math.floor(Math.random() * studyTips.length)]
      setCurrentTip(randomTip)
      setIsAnimating(false)
    }, 300)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="h-5 w-5 text-yellow-500 mr-2" />
            Motivation Center
          </CardTitle>
          <CardDescription>Need a boost? Get motivational quotes and study tips to keep you going</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="quotes" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="quotes">Motivational Quotes</TabsTrigger>
              <TabsTrigger value="tips">Study Tips</TabsTrigger>
            </TabsList>

            <div className="mt-6">
              <TabsContent value="quotes" className="space-y-4">
                <div
                  className={`bg-primary/5 p-6 rounded-lg transition-opacity ${isAnimating ? "opacity-0" : "opacity-100"}`}
                >
                  <p className="text-lg italic">"{currentQuote.text}"</p>
                  <p className="text-sm text-muted-foreground mt-2">— {currentQuote.author}</p>
                </div>

                <div className="flex justify-center">
                  <Button onClick={getNewQuote} className="flex items-center">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    New Quote
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="tips" className="space-y-4">
                <div
                  className={`bg-primary/5 p-6 rounded-lg transition-opacity ${isAnimating ? "opacity-0" : "opacity-100"}`}
                >
                  <p className="text-lg">{currentTip}</p>
                </div>

                <div className="flex justify-center">
                  <Button onClick={getNewTip} className="flex items-center">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    New Tip
                  </Button>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="flex items-center text-sm text-muted-foreground">
            <Coffee className="h-4 w-4 mr-1" />
            <span>Take a break if you need it!</span>
          </div>

          <Button variant="outline" size="sm" className="flex items-center">
            <Volume2 className="h-4 w-4 mr-2" />
            Read Aloud
          </Button>
        </CardFooter>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-base">
              <BookOpen className="h-4 w-4 mr-2" />
              Quick Study Resources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center">
                <div className="w-1 h-1 bg-primary rounded-full mr-2"></div>
                <a href="#" className="text-sm hover:underline">
                  Effective Study Techniques
                </a>
              </li>
              <li className="flex items-center">
                <div className="w-1 h-1 bg-primary rounded-full mr-2"></div>
                <a href="#" className="text-sm hover:underline">
                  Memory Improvement Methods
                </a>
              </li>
              <li className="flex items-center">
                <div className="w-1 h-1 bg-primary rounded-full mr-2"></div>
                <a href="#" className="text-sm hover:underline">
                  Focus & Concentration Tips
                </a>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-base">
              <Brain className="h-4 w-4 mr-2" />
              Mental Wellness
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center">
                <div className="w-1 h-1 bg-primary rounded-full mr-2"></div>
                <a href="#" className="text-sm hover:underline">
                  Quick Meditation Exercises
                </a>
              </li>
              <li className="flex items-center">
                <div className="w-1 h-1 bg-primary rounded-full mr-2"></div>
                <a href="#" className="text-sm hover:underline">
                  Stress Management for Students
                </a>
              </li>
              <li className="flex items-center">
                <div className="w-1 h-1 bg-primary rounded-full mr-2"></div>
                <a href="#" className="text-sm hover:underline">
                  Balancing Study and Rest
                </a>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
