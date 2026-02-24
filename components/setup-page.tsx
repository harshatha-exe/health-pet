"use client"

import { useState } from "react"
import { useGame } from "@/lib/game-context"
import { createCreature } from "@/lib/game-engine"
import { User, Sparkles } from "lucide-react"

export function SetupPage() {
  const { setCreature, setStep } = useGame()
  const [userName, setUserName] = useState("")
  const [creatureName, setCreatureName] = useState("")

  const canSubmit = userName.trim().length > 0 && creatureName.trim().length > 0

  const handleCreate = () => {
    if (!canSubmit) return
    const creature = createCreature(userName.trim(), creatureName.trim())
    setCreature(creature)
    setStep("daily")
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-primary/30 bg-primary/10">
            <User className="h-7 w-7 text-primary" />
          </div>
          <h1 className="mb-2 font-mono text-lg text-foreground">First-Time Setup</h1>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Choose a name for yourself and your creature. This is permanent.
          </p>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-5">
          {/* User Name */}
          <div className="rounded-xl border border-border bg-card p-5">
            <label htmlFor="user-name" className="mb-2 block font-mono text-xs text-muted-foreground">
              Your Name
            </label>
            <input
              id="user-name"
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your name..."
              maxLength={20}
              className="w-full rounded-lg border border-border bg-input px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Creature Name */}
          <div className="rounded-xl border border-border bg-card p-5">
            <label htmlFor="creature-name" className="mb-2 block font-mono text-xs text-muted-foreground">
              Creature Name
            </label>
            <input
              id="creature-name"
              type="text"
              value={creatureName}
              onChange={(e) => setCreatureName(e.target.value)}
              placeholder="Name your companion..."
              maxLength={20}
              className="w-full rounded-lg border border-border bg-input px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Submit */}
          <button
            onClick={handleCreate}
            disabled={!canSubmit}
            className="flex items-center justify-center gap-2 rounded-xl border border-primary/40 bg-primary px-8 py-4 font-mono text-xs text-primary-foreground transition-all hover:shadow-lg hover:shadow-primary/25 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Sparkles className="h-4 w-4" />
            Awaken My Creature
          </button>
        </div>
      </div>
    </div>
  )
}
