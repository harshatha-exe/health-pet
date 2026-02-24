"use client"

import { GameProvider, useGame } from "@/lib/game-context"
import { LandingPage } from "@/components/landing-page"
import { SetupPage } from "@/components/setup-page"
import { HealthInputPage } from "@/components/health-input-page"
import { CreaturePage } from "@/components/creature-page"
import { BattlePage } from "@/components/battle-page"
import { FeedbackPage } from "@/components/feedback-page"

function GameRouter() {
  const { step, isLoaded } = useGame()

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  switch (step) {
    case "landing":
      return <LandingPage />
    case "setup":
      return <SetupPage />
    case "daily":
      return <HealthInputPage />
    case "creature":
      return <CreaturePage />
    case "battle":
      return <BattlePage />
    case "feedback":
      return <FeedbackPage />
    default:
      return <LandingPage />
  }
}

export default function Home() {
  return (
    <GameProvider>
      <main className="min-h-screen bg-background">
        <GameRouter />
      </main>
    </GameProvider>
  )
}
