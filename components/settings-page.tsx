"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { useTheme } from "next-themes"
import { useAccentColor } from "@/components/theme-provider"
import { Moon, Sun, Trash2, Settings2, Crown } from "lucide-react"

const professionalAccentColors = [
  { name: "Silver", value: "silver", color: "bg-professional-silver", preview: "#C0C0C0" },
  { name: "White", value: "white", color: "bg-professional-white border border-gray-300", preview: "#FFFFFF" },
  { name: "Gold", value: "gold", color: "bg-professional-gold", preview: "#FFD700" },
  { name: "Silver Pink", value: "silver-pink", color: "bg-professional-silver-pink", preview: "#E6C2C2" },
  { name: "Silver Blue", value: "silver-blue", color: "bg-professional-silver-blue", preview: "#B8D4E3" },
  { name: "Platinum", value: "platinum", color: "bg-professional-platinum", preview: "#E5E4E2" },
  { name: "Charcoal", value: "charcoal", color: "bg-professional-charcoal", preview: "#36454F" },
]

export default function SettingsPage() {
  const { toast } = useToast()
  const { theme, setTheme } = useTheme()
  const { accentColor, changeAccentColor } = useAccentColor()
  const [startTime, setStartTime] = useState("09:00")
  const [endTime, setEndTime] = useState("18:00")
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [reminderInterval, setReminderInterval] = useState(30)
  const [showResetDialog, setShowResetDialog] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const saveSettings = () => {
    toast({
      title: "Settings Updated",
      description: "Your preferences have been saved successfully.",
    })
  }

  const resetAllData = () => {
    setShowResetDialog(false)
    toast({
      title: "Data Reset Complete",
      description: "All application data has been cleared.",
      variant: "destructive",
    })
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Professional Header */}
      <div className="text-center space-y-2 py-6">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Application Settings
        </h1>
        <p className="text-muted-foreground text-lg">Configure your professional study environment</p>
      </div>

      {/* Appearance Settings */}
      <Card className="border-2 border-primary/20 professional-shadow-lg">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5 border-b border-primary/10">
          <CardTitle className="flex items-center text-xl">
            <Crown className="h-6 w-6 mr-3 text-primary" />
            Professional Theme Configuration
          </CardTitle>
          <CardDescription className="text-base">
            Customize the visual appearance for optimal productivity
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 pt-8">
          <div className="space-y-4">
            <Label className="text-lg font-semibold">Display Mode</Label>
            <RadioGroup value={theme} onValueChange={setTheme} className="grid grid-cols-3 gap-4">
              <div className="flex items-center space-x-3 p-4 border-2 border-muted rounded-lg hover:border-primary/50 transition-colors">
                <RadioGroupItem value="light" id="theme-light" />
                <Label htmlFor="theme-light" className="flex items-center cursor-pointer font-medium">
                  <Sun className="h-5 w-5 mr-2 text-yellow-500" /> Light Mode
                </Label>
              </div>

              <div className="flex items-center space-x-3 p-4 border-2 border-muted rounded-lg hover:border-primary/50 transition-colors">
                <RadioGroupItem value="dark" id="theme-dark" />
                <Label htmlFor="theme-dark" className="flex items-center cursor-pointer font-medium">
                  <Moon className="h-5 w-5 mr-2 text-blue-400" /> Dark Mode
                </Label>
              </div>

              <div className="flex items-center space-x-3 p-4 border-2 border-muted rounded-lg hover:border-primary/50 transition-colors">
                <RadioGroupItem value="system" id="theme-system" />
                <Label htmlFor="theme-system" className="cursor-pointer font-medium">
                  <Settings2 className="h-5 w-5 mr-2 text-muted-foreground inline" /> System
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-4">
            <Label className="text-lg font-semibold">Professional Accent Color</Label>
            <Select value={accentColor} onValueChange={changeAccentColor}>
              <SelectTrigger className="w-full h-12 border-2 border-primary/20 focus:border-primary">
                <SelectValue placeholder="Select professional accent color" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default (Gold)</SelectItem>
                {professionalAccentColors.map((color) => (
                  <SelectItem key={color.value} value={color.value}>
                    <div className="flex items-center">
                      <div
                        className="w-5 h-5 rounded-full mr-3 border-2 border-muted shadow-sm"
                        style={{ backgroundColor: color.preview }}
                      />
                      {color.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="grid grid-cols-7 gap-4 mt-6">
              <Button
                variant="outline"
                className="h-16 w-full rounded-lg border-3 hover:scale-105 transition-all duration-200 professional-shadow"
                style={{
                  backgroundColor: "#FFD70020",
                  borderColor: accentColor === "default" ? "#FFD700" : "transparent",
                  borderWidth: accentColor === "default" ? "3px" : "1px",
                }}
                onClick={() => changeAccentColor("default")}
              >
                <div className="w-8 h-8 rounded-full bg-professional-gold shadow-lg"></div>
              </Button>
              {professionalAccentColors.map((color) => (
                <Button
                  key={color.value}
                  variant="outline"
                  className="h-16 w-full rounded-lg border-3 hover:scale-105 transition-all duration-200 professional-shadow"
                  style={{
                    backgroundColor: `${color.preview}20`,
                    borderColor: accentColor === color.value ? color.preview : "transparent",
                    borderWidth: accentColor === color.value ? "3px" : "1px",
                  }}
                  onClick={() => changeAccentColor(color.value)}
                >
                  <div className="w-8 h-8 rounded-full shadow-lg" style={{ backgroundColor: color.preview }}></div>
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Study Configuration */}
      <Card className="border-2 border-secondary/20 professional-shadow-lg">
        <CardHeader className="bg-gradient-to-r from-secondary/5 to-primary/5 border-b border-secondary/10">
          <CardTitle className="text-xl text-secondary">Study Session Configuration</CardTitle>
          <CardDescription className="text-base">Define your optimal study schedule parameters</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 pt-8">
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-3">
              <Label className="text-base font-semibold">Session Start Time</Label>
              <Select value={startTime} onValueChange={setStartTime}>
                <SelectTrigger className="h-12 border-2 border-secondary/20 focus:border-secondary">
                  <SelectValue placeholder="Select start time" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 13 }, (_, i) => i + 6).map((hour) => (
                    <SelectItem key={`start-${hour}`} value={`${hour.toString().padStart(2, "0")}:00`}>
                      {`${hour}:00 ${hour < 12 ? "AM" : "PM"}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="text-base font-semibold">Session End Time</Label>
              <Select value={endTime} onValueChange={setEndTime}>
                <SelectTrigger className="h-12 border-2 border-secondary/20 focus:border-secondary">
                  <SelectValue placeholder="Select end time" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 13 }, (_, i) => i + 12).map((hour) => (
                    <SelectItem key={`end-${hour}`} value={`${hour.toString().padStart(2, "0")}:00`}>
                      {`${hour > 12 ? hour - 12 : hour}:00 ${hour < 12 ? "AM" : "PM"}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Management */}
      <Card className="border-2 border-primary/20 professional-shadow-lg">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5 border-b border-primary/10">
          <CardTitle className="text-xl text-primary">Notification Management</CardTitle>
          <CardDescription className="text-base">Configure intelligent notification preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 pt-8">
          <div className="flex items-center justify-between p-6 bg-primary/5 rounded-lg border border-primary/20">
            <div className="space-y-2">
              <Label htmlFor="notifications" className="text-base font-semibold">
                Enable Smart Notifications
              </Label>
              <p className="text-sm text-muted-foreground">Receive intelligent reminders for optimal productivity</p>
            </div>
            <Switch
              id="notifications"
              checked={notificationsEnabled}
              onCheckedChange={setNotificationsEnabled}
              className="data-[state=checked]:bg-primary scale-125"
            />
          </div>

          {notificationsEnabled && (
            <div className="space-y-4 p-6 bg-secondary/5 rounded-lg border border-secondary/20">
              <div className="flex justify-between items-center">
                <Label htmlFor="reminder-interval" className="text-base font-semibold">
                  Notification Frequency
                </Label>
                <span className="text-lg font-bold text-primary">{reminderInterval} minutes</span>
              </div>
              <Slider
                id="reminder-interval"
                min={5}
                max={60}
                step={5}
                value={[reminderInterval]}
                onValueChange={(value) => setReminderInterval(value[0])}
                className="w-full"
              />
              <p className="text-sm text-muted-foreground">
                Optimal reminder intervals for sustained focus and productivity
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card className="border-2 border-destructive/20 professional-shadow-lg">
        <CardHeader className="bg-gradient-to-r from-destructive/5 to-destructive/10 border-b border-destructive/10">
          <CardTitle className="text-xl text-destructive">Data Management</CardTitle>
          <CardDescription className="text-base">Manage application data and system preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-8">
          <div className="flex items-center justify-between p-6 bg-primary/5 rounded-lg border border-primary/20">
            <div className="space-y-2">
              <h3 className="text-base font-semibold text-primary">Export Application Data</h3>
              <p className="text-sm text-muted-foreground">Download comprehensive backup of all study data</p>
            </div>
            <Button
              variant="outline"
              className="border-2 border-primary text-primary hover:bg-primary hover:text-black font-semibold px-6"
            >
              Export Data
            </Button>
          </div>

          <div className="flex items-center justify-between p-6 bg-destructive/5 rounded-lg border border-destructive/20">
            <div className="space-y-2">
              <h3 className="text-base font-semibold text-destructive">Reset Application Data</h3>
              <p className="text-sm text-muted-foreground">Permanently remove all stored information</p>
            </div>
            <Button variant="destructive" onClick={() => setShowResetDialog(true)} className="font-semibold px-6">
              <Trash2 className="h-4 w-4 mr-2" />
              Reset All Data
            </Button>
          </div>
        </CardContent>
        <CardFooter className="pt-8">
          <Button
            onClick={saveSettings}
            className="w-full h-14 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-black font-bold text-lg rounded-lg professional-shadow-lg hover:professional-shadow-xl transition-all duration-300"
          >
            Apply Configuration Changes
          </Button>
        </CardFooter>
      </Card>

      {/* Reset Confirmation Dialog */}
      <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <DialogContent className="border-2 border-destructive/20 professional-shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-xl text-destructive">Confirm Data Reset</DialogTitle>
            <DialogDescription className="text-base">
              This action will permanently delete all application data and cannot be undone. Please confirm to proceed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-4">
            <Button variant="outline" onClick={() => setShowResetDialog(false)} className="font-semibold px-6">
              Cancel Operation
            </Button>
            <Button variant="destructive" onClick={resetAllData} className="font-semibold px-6">
              Confirm Reset
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
