"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

// Create a custom hook to manage accent color
export function useAccentColor() {
  const [accentColor, setAccentColor] = React.useState<string>("default")

  React.useEffect(() => {
    // Get saved accent color from localStorage
    const savedAccent = localStorage.getItem("accent-color") || "default"
    setAccentColor(savedAccent)
    document.documentElement.classList.forEach((className) => {
      if (className.startsWith("theme-")) {
        document.documentElement.classList.remove(className)
      }
    })
    if (savedAccent !== "default") {
      document.documentElement.classList.add(`theme-${savedAccent}`)
    }
  }, [])

  const changeAccentColor = (color: string) => {
    // Remove all theme classes
    document.documentElement.classList.forEach((className) => {
      if (className.startsWith("theme-")) {
        document.documentElement.classList.remove(className)
      }
    })

    // Add new theme class if not default
    if (color !== "default") {
      document.documentElement.classList.add(`theme-${color}`)
    }

    // Save to localStorage
    localStorage.setItem("accent-color", color)
    setAccentColor(color)
  }

  return { accentColor, changeAccentColor }
}
