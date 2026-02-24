"use client"

import { useGame } from "@/lib/game-context"
import { getCreatureVisual } from "@/lib/game-engine"
import { Sword, Shield, Heart, Activity, Swords, ArrowLeft, Flame } from "lucide-react"

function CreatureOrb({ creature }: { creature: NonNullable<ReturnType<typeof useGame>["creature"]> }) {
  const visual = getCreatureVisual(creature)

  return (
    <div className="relative flex items-center justify-center">
      {/* Outer aura pulse */}
      <div
        className="absolute h-48 w-48 animate-pulse rounded-full"
        style={{
          background: `radial-gradient(circle, ${visual.glowColor} 0%, transparent 70%)`,
        }}
      />
      {/* Middle glow */}
      <div
        className="absolute h-36 w-36 rounded-full"
        style={{
          background: `radial-gradient(circle, ${visual.glowColor} 0%, transparent 60%)`,
          animation: "pulse 2s ease-in-out infinite",
        }}
      />
      {/* Core creature circle */}
      <div
        className="relative z-10 h-28 w-28 rounded-full border-2"
        style={{
          backgroundColor: visual.bgColor,
          borderColor: visual.bgColor,
          boxShadow: `0 0 30px ${visual.glowColor}, 0 0 60px ${visual.glowColor}, inset 0 -10px 20px rgba(0,0,0,0.3)`,
        }}
      >
        {/* Glossy highlight */}
        <div
          className="absolute top-2 left-3 h-8 w-10 rounded-full"
          style={{ background: "rgba(255,255,255,0.25)", filter: "blur(4px)" }}
        />
      </div>
    </div>
  )
}

function StatBar({ label, value, max, icon }: { label: string; value: number; max: number; icon: React.ReactNode }) {
  const pct = Math.min((value / max) * 100, 100)
  return (
    <div className="flex items-center gap-3">
      <div className="flex w-7 items-center justify-center text-primary">{icon}</div>
      <div className="flex-1">
        <div className="mb-1 flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{label}</span>
          <span className="font-mono text-xs text-foreground">{value}</span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-primary transition-all duration-1000 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  )
}

export function CreaturePage() {
  const { creature, setStep } = useGame()

  if (!creature) return null

  return (
    <div className="flex min-h-screen flex-col px-4 py-6">
      <div className="mx-auto w-full max-w-xl">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <button
            onClick={() => setStep("daily")}
            className="flex items-center justify-center rounded-lg border border-border bg-card p-2 text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Go back"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="font-mono text-sm text-foreground">Creature Card</h1>
            <p className="text-xs text-muted-foreground">Shaped by your daily habits</p>
          </div>
        </div>

        {/* Creature Display Card */}
        <div className="mb-6 overflow-hidden rounded-2xl border border-border bg-card">
          {/* Creature visual area */}
          <div className="relative flex flex-col items-center bg-secondary/30 px-6 py-10">
            <CreatureOrb creature={creature} />

            <h2 className="mt-6 font-mono text-xl text-foreground">{creature.name}</h2>
            <span className="mt-1 inline-block rounded-full border border-primary/30 bg-primary/10 px-4 py-1 font-mono text-[10px] text-primary">
              {creature.personality}
            </span>

            {/* Meta info */}
            <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
              <span>Day {creature.daysAlive}</span>
              <span className="h-3 w-px bg-border" />
              <span className="flex items-center gap-1">
                <Flame className="h-3 w-3 text-accent" />
                {creature.streak} streak
              </span>
              <span className="h-3 w-px bg-border" />
              <span>Owner: {creature.ownerName}</span>
            </div>
          </div>

          {/* Stats panel */}
          <div className="flex flex-col gap-4 p-6">
            <StatBar label="Strength" value={creature.stats.strength} max={150} icon={<Sword className="h-4 w-4" />} />
            <StatBar label="Defense" value={creature.stats.defense} max={100} icon={<Shield className="h-4 w-4" />} />
            <StatBar label="Stamina" value={creature.stats.stamina} max={100} icon={<Heart className="h-4 w-4" />} />
            <StatBar label="Stability" value={creature.stats.stability} max={100} icon={<Activity className="h-4 w-4" />} />
          </div>

          {/* Trait description */}
          <div className="border-t border-border px-6 py-4">
            <p className="text-sm leading-relaxed text-muted-foreground italic">
              {`"${creature.traitDescription}"`}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => setStep("battle")}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-accent/40 bg-accent px-6 py-4 font-mono text-xs text-accent-foreground transition-all hover:shadow-lg hover:shadow-accent/25 active:scale-[0.98]"
          >
            <Swords className="h-4 w-4" />
            Find Opponent
          </button>
          <button
            onClick={() => setStep("feedback")}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-card px-6 py-4 font-mono text-xs text-foreground transition-all hover:bg-secondary active:scale-[0.98]"
          >
            View Report
          </button>
        </div>
      </div>
    </div>
  )
}
