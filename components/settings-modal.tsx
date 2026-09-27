"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Sun,
  Moon,
  Laptop,
  Bell,
  Palette,
  Volume2,
  Sparkles,
  Check,
  Settings,
  Eye,
} from "lucide-react"

export interface SettingsModalProps {
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function SettingsModal({ trigger, open, onOpenChange }: SettingsModalProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Accessible Settings State
  const [language, setLanguage] = React.useState("en")
  const [voiceCounselor, setVoiceCounselor] = React.useState(true)
  const [scholarshipAlerts, setScholarshipAlerts] = React.useState(true)
  const [highContrast, setHighContrast] = React.useState(false)
  const [reducedMotion, setReducedMotion] = React.useState(false)
  const [saveSuccess, setSaveSuccess] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const handleSave = () => {
    setSaveSuccess(true)
    setTimeout(() => {
      setSaveSuccess(false)
      if (onOpenChange) onOpenChange(false)
    }, 900)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            variant="outline"
            size="icon"
            className="rounded-full border-border/60 bg-background/80 backdrop-blur-sm hover:bg-accent focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            aria-label="Open System Settings"
          >
            <Settings className="h-4 w-4 text-muted-foreground transition-transform hover:rotate-45" />
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-2xl overflow-hidden rounded-2xl border border-border/80 bg-background/95 p-0 shadow-2xl backdrop-blur-xl sm:max-h-[85vh]">
        {/* Modal Header */}
        <div className="border-b border-border/60 px-6 pt-6 pb-4">
          <DialogHeader>
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Settings className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
                  Preferences & System Settings
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  Customize appearance, AI counselor voice, language, and accessibility.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Tabbed Navigation */}
        <Tabs defaultValue="appearance" className="w-full">
          <div className="border-b border-border/40 bg-muted/30 px-6 py-2">
            <TabsList className="grid w-full grid-cols-4 bg-muted/60 p-1">
              <TabsTrigger
                value="appearance"
                className="gap-2 text-xs font-semibold data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm sm:text-sm"
              >
                <Palette className="h-4 w-4" />
                <span>Theme</span>
              </TabsTrigger>
              <TabsTrigger
                value="ai"
                className="gap-2 text-xs font-semibold data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm sm:text-sm"
              >
                <Sparkles className="h-4 w-4" />
                <span>AI Voice</span>
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="gap-2 text-xs font-semibold data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm sm:text-sm"
              >
                <Bell className="h-4 w-4" />
                <span>Alerts</span>
              </TabsTrigger>
              <TabsTrigger
                value="accessibility"
                className="gap-2 text-xs font-semibold data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm sm:text-sm"
              >
                <Eye className="h-4 w-4" />
                <span>A11y</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="max-h-[52vh] overflow-y-auto px-6 py-4">
            {/* 1. Appearance & Dark Mode Tab */}
            <TabsContent value="appearance" className="m-0 space-y-6">
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-foreground">
                  Interface Theme
                </Label>
                <p className="text-xs text-muted-foreground">
                  Select your preferred visual mode or sync with system preferences.
                </p>

                {mounted && (
                  <RadioGroup
                    value={theme}
                    onValueChange={setTheme}
                    className="grid grid-cols-3 gap-3 pt-1"
                  >
                    {/* Light Option */}
                    <Label
                      htmlFor="theme-light"
                      className={`flex cursor-pointer flex-col items-center justify-between rounded-xl border-2 p-3 transition-all hover:bg-accent/50 ${
                        theme === "light"
                          ? "border-primary bg-primary/5 text-primary shadow-sm"
                          : "border-border/60 bg-card text-muted-foreground"
                      }`}
                    >
                      <RadioGroupItem value="light" id="theme-light" className="sr-only" />
                      <Sun className="h-6 w-6 text-amber-500" />
                      <span className="mt-2 text-xs font-semibold">Light Mode</span>
                    </Label>

                    {/* Dark Option */}
                    <Label
                      htmlFor="theme-dark"
                      className={`flex cursor-pointer flex-col items-center justify-between rounded-xl border-2 p-3 transition-all hover:bg-accent/50 ${
                        theme === "dark"
                          ? "border-primary bg-primary/5 text-primary shadow-sm"
                          : "border-border/60 bg-card text-muted-foreground"
                      }`}
                    >
                      <RadioGroupItem value="dark" id="theme-dark" className="sr-only" />
                      <Moon className="h-6 w-6 text-indigo-400" />
                      <span className="mt-2 text-xs font-semibold">Dark OLED</span>
                    </Label>

                    {/* System Option */}
                    <Label
                      htmlFor="theme-system"
                      className={`flex cursor-pointer flex-col items-center justify-between rounded-xl border-2 p-3 transition-all hover:bg-accent/50 ${
                        theme === "system"
                          ? "border-primary bg-primary/5 text-primary shadow-sm"
                          : "border-border/60 bg-card text-muted-foreground"
                      }`}
                    >
                      <RadioGroupItem value="system" id="theme-system" className="sr-only" />
                      <Laptop className="h-6 w-6 text-cyan-500" />
                      <span className="mt-2 text-xs font-semibold">Auto System</span>
                    </Label>
                  </RadioGroup>
                )}
              </div>

              {/* Language Selector */}
              <div className="flex items-center justify-between rounded-xl border border-border/60 bg-card/60 p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="app-language" className="text-sm font-medium text-foreground">
                    Counseling & Portal Language
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Multilingual support across Marathi, Hindi, and English.
                  </p>
                </div>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger id="app-language" className="w-36 bg-background">
                    <SelectValue placeholder="Language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English (US/IN)</SelectItem>
                    <SelectItem value="hi">हिंदी (Hindi)</SelectItem>
                    <SelectItem value="mr">मराठी (Marathi)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            {/* 2. AI Voice & Counseling Tab */}
            <TabsContent value="ai" className="m-0 space-y-4">
              <div className="flex items-center justify-between rounded-xl border border-border/60 bg-card/60 p-4">
                <div className="flex items-start gap-3">
                  <Volume2 className="mt-0.5 h-5 w-5 text-indigo-400" />
                  <div className="space-y-0.5">
                    <Label htmlFor="voice-counselor" className="text-sm font-medium text-foreground">
                      Voice Synthesis & Narration
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Automatically speaks career advice and contingency pivots via Web Speech API.
                    </p>
                  </div>
                </div>
                <Switch
                  id="voice-counselor"
                  checked={voiceCounselor}
                  onCheckedChange={setVoiceCounselor}
                  aria-label="Toggle Voice Synthesis"
                />
              </div>

              <div className="flex items-center justify-between rounded-xl border border-border/60 bg-card/60 p-4">
                <div className="flex items-start gap-3">
                  <Sparkles className="mt-0.5 h-5 w-5 text-amber-400" />
                  <div className="space-y-0.5">
                    <Label htmlFor="gemini-reasoning" className="text-sm font-medium text-foreground">
                      Deep AI Reasoning (Gemini 2.5)
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Enable structured psychometric matching with live admission benchmarks.
                    </p>
                  </div>
                </div>
                <Switch id="gemini-reasoning" defaultChecked aria-label="Toggle Gemini 2.5 Reasoning" />
              </div>
            </TabsContent>

            {/* 3. Alerts & Scholarship Notifications */}
            <TabsContent value="notifications" className="m-0 space-y-4">
              <div className="flex items-center justify-between rounded-xl border border-border/60 bg-card/60 p-4">
                <div className="flex items-start gap-3">
                  <Bell className="mt-0.5 h-5 w-5 text-emerald-400" />
                  <div className="space-y-0.5">
                    <Label htmlFor="scholarship-alerts" className="text-sm font-medium text-foreground">
                      MahaDBT & NSP Scholarship Deadlines
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Receive reminders for EBC fee waivers and Pragati/Saksham fellowship openings.
                    </p>
                  </div>
                </div>
                <Switch
                  id="scholarship-alerts"
                  checked={scholarshipAlerts}
                  onCheckedChange={setScholarshipAlerts}
                  aria-label="Toggle Scholarship Alerts"
                />
              </div>
            </TabsContent>

            {/* 4. Accessibility (A11y) Tab */}
            <TabsContent value="accessibility" className="m-0 space-y-4">
              <div className="flex items-center justify-between rounded-xl border border-border/60 bg-card/60 p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="high-contrast" className="text-sm font-medium text-foreground">
                    High Contrast Text & Outlines
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Boosts visual contrast borders and text weight to exceed WCAG AAA standards.
                  </p>
                </div>
                <Switch
                  id="high-contrast"
                  checked={highContrast}
                  onCheckedChange={setHighContrast}
                  aria-label="Toggle High Contrast Mode"
                />
              </div>

              <div className="flex items-center justify-between rounded-xl border border-border/60 bg-card/60 p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="reduced-motion" className="text-sm font-medium text-foreground">
                    Reduced Motion (No Animations)
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Disables 3D WebGL background rotation and kinetic spring transitions.
                  </p>
                </div>
                <Switch
                  id="reduced-motion"
                  checked={reducedMotion}
                  onCheckedChange={setReducedMotion}
                  aria-label="Toggle Reduced Motion"
                />
              </div>
            </TabsContent>
          </div>
        </Tabs>

        {/* Footer Actions */}
        <div className="border-t border-border/60 bg-muted/20 px-6 py-4">
          <DialogFooter className="flex items-center justify-between gap-3 sm:justify-between">
            <p className="text-xs text-muted-foreground">
              Changes apply instantly across your session.
            </p>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange && onOpenChange(false)}
                className="h-9 px-4 text-xs font-semibold"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSave}
                className="h-9 min-w-[90px] gap-1.5 px-4 text-xs font-semibold shadow-md transition-all active:scale-95"
              >
                {saveSuccess ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    Saved!
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
