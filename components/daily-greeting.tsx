"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Quote } from "lucide-react"

const quotes = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  {
    text: "Success is not final, failure is not fatal: It is the courage to continue that counts.",
    author: "Winston Churchill",
  },
  { text: "The best way to predict the future is to create it.", author: "Peter Drucker" },
  { text: "Discipline is doing what needs to be done, even when you don't feel like it.", author: "Unknown" },
  { text: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs" },
  { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
]

export default function DailyGreeting() {
  const [greeting, setGreeting] = useState("")
  const [quote, setQuote] = useState({ text: "", author: "" })
  const [name, setName] = useState("Namitha")

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting("Good morning")
    else if (hour < 18) setGreeting("Good afternoon")
    else setGreeting("Good evening")

    // Select a random quote
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)]
    setQuote(randomQuote)
  }, [])

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-primary text-primary-foreground">
        <CardTitle className="text-2xl">
          {greeting}, {name}!
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex items-start space-x-4">
          <Quote className="h-6 w-6 text-muted-foreground shrink-0 mt-1" />
          <div>
            <p className="italic">{quote.text}</p>
            <p className="text-sm text-muted-foreground mt-2">— {quote.author}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
