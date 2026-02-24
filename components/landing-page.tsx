"use client"

import { useGame } from "@/lib/game-context"
import { Heart, Sword, Shield, Activity } from "lucide-react"

export function LandingPage() {
  const { creature, setStep } = useGame()

  const handleEnter = () => {
    if (creature) {
      // Returning user -> go straight to daily input
      setStep("daily")
    } else {
      // First time -> setup
      setStep("setup")
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      {/* Floating particles */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              backgroundColor: "var(--primary)",
              opacity: 0.15,
              animation: `float ${Math.random() * 4 + 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex max-w-lg flex-col items-center text-center">
        {/* Creature orb preview */}
        <div className="relative mb-8">
          <div className="h-24 w-24 rounded-full bg-primary/20" style={{ boxShadow: "0 0 40px var(--primary), 0 0 80px var(--primary)" }}>
            <div className="flex h-full w-full items-center justify-center rounded-full border-2 border-primary/40 bg-primary/30">
              <Activity className="h-10 w-10 text-primary" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="mb-3 font-mono text-2xl leading-relaxed text-foreground md:text-3xl">
          LifePet
        </h1>
        <p className="mb-8 max-w-sm text-balance text-base leading-relaxed text-muted-foreground">
          Your habits shape a living companion. This system converts lifestyle patterns into a digital creature that evolves every day.
        </p>

        {/* Stat cards */}
        <div className="mb-10 grid w-full max-w-sm grid-cols-2 gap-3">
          <StatCard icon={<Sword className="h-4 w-4" />} stat="Strength" source="Steps walked" />
          <StatCard icon={<Shield className="h-4 w-4" />} stat="Defense" source="Sleep hours" />
          <StatCard icon={<Heart className="h-4 w-4" />} stat="Stamina" source="Food quality" />
          <StatCard icon={<Activity className="h-4 w-4" />} stat="Stability" source="Consistency" />
        </div>

        {/* CTA */}
        <button
          onClick={handleEnter}
          className="rounded-xl border border-primary/40 bg-primary px-10 py-4 font-mono text-xs text-primary-foreground transition-all hover:shadow-lg hover:shadow-primary/25 active:scale-95"
        >
          {creature ? "Continue My Journey" : "Enter My World"}
        </button>

        {creature && (
          <p className="mt-4 text-xs text-muted-foreground">
            Welcome back! {creature.name} is waiting for you.
          </p>
        )}
      </div>
    </div>
  )
}

function StatCard({ icon, stat, source }: { icon: React.ReactNode; stat: string; source: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3">
      <div className="text-primary">{icon}</div>
      <div className="text-left">
        <div className="font-mono text-[10px] text-foreground">{stat}</div>
        <div className="text-xs text-muted-foreground">{source}</div>
      </div>
    </div>
  )
}
