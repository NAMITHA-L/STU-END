import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Professional Black & Gold Palette
        "professional-black": "#0A0A0A",
        "professional-gold": "#FFD700",
        "professional-silver": "#C0C0C0",
        "professional-white": "#FFFFFF",
        "professional-silver-pink": "#E6C2C2",
        "professional-silver-blue": "#B8D4E3",
        "professional-platinum": "#E5E4E2",
        "professional-charcoal": "#36454F",

        // Chart colors - Professional palette
        "chart-1": "#FFD700", // Gold
        "chart-2": "#C0C0C0", // Silver
        "chart-3": "#E5E4E2", // Platinum
        "chart-4": "#36454F", // Charcoal
        "chart-5": "#E6C2C2", // Silver Pink
        "chart-6": "#B8D4E3", // Silver Blue

        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar))",
          foreground: "hsl(var(--sidebar-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "gold-glow": {
          "0%, 100%": { boxShadow: "0 0 5px rgba(255, 215, 0, 0.3)" },
          "50%": { boxShadow: "0 0 20px rgba(255, 215, 0, 0.6)" },
        },
        "professional-pulse": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "gold-glow": "gold-glow 2s ease-in-out infinite",
        "professional-pulse": "professional-pulse 2s ease-in-out infinite",
      },
      backgroundImage: {
        "professional-gradient": "linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 50%, #0A0A0A 100%)",
        "gold-gradient": "linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)",
        "silver-gradient": "linear-gradient(135deg, #C0C0C0 0%, #E5E4E2 50%, #C0C0C0 100%)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
