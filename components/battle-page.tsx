"use client"

import { useState, useEffect, useRef } from "react"
import { useGame } from "@/lib/game-context"
import { simulateBattle, getRandomOpponent, getCreatureVisual, type BattleLog, type Creature } from "@/lib/game-engine"
import { Sword, Shield, Heart, Activity, ArrowLeft, Trophy, X } from "lucide-react"

function MiniOrb({ creature }: { creature: Creature }) {
  const visual = getCreatureVisual(creature)
  return (
    <div className="relative flex items-center justify-center">
      <div
        className="absolute h-20 w-20 animate-pulse rounded-full"
        style={{ background: `radial-gradient(circle, ${visual.glowColor} 0%, transparent 70%)` }}
      />
      <div
        className="relative z-10 h-14 w-14 rounded-full border"
        style={{
          backgroundColor: visual.bgColor,
          borderColor: visual.bgColor,
          boxShadow: `0 0 15px ${visual.glowColor}, inset 0 -5px 10px rgba(0,0,0,0.3)`,
        }}
      >
        <div
          className="absolute top-1.5 left-2 h-4 w-5 rounded-full"
          style={{ background: "rgba(255,255,255,0.2)", filter: "blur(2px)" }}
        />
      </div>
    </div>
  )
}

function MiniStat({ icon, value }: { icon: React.ReactNode; value: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-muted-foreground">{icon}</span>
      <span className="font-mono text-[10px] text-foreground">{value}</span>
    </div>
  )
}

function LogEntry({ log, isVisible }: { log: BattleLog; isVisible: boolean }) {
  const colors: Record<string, string> = {
    attack: "border-accent/30 bg-accent/5",
    defend: "border-primary/30 bg-primary/5",
    miss: "border-destructive/30 bg-destructive/5",
    buff: "border-primary/40 bg-primary/10",
    penalty: "border-destructive/30 bg-destructive/5",
    result: "border-accent/50 bg-accent/10",
  }

  return (
    <div
      className={`rounded-lg border p-3 transition-all duration-500 ${colors[log.type] || ""} ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
    >
      <div className="flex items-start gap-2">
        <span className="shrink-0 font-mono text-[10px] text-muted-foreground">T{log.turn}</span>
        <p className="text-xs leading-relaxed text-foreground">{log.message}</p>
      </div>
    </div>
  )
}

export function BattlePage() {
  const { creature, latestData, setStep, setBattleResult } = useGame()
  const [opponent] = useState(() => getRandomOpponent())
  const [battleState, setBattleState] = useState<"ready" | "fighting" | "done">("ready")
  const [visibleLogs, setVisibleLogs] = useState(0)
  const [result, setResult] = useState<ReturnType<typeof simulateBattle> | null>(null)
  const logContainerRef = useRef<HTMLDivElement>(null)

  const startBattle = () => {
    if (!creature) return
    const battleResult = simulateBattle(creature, opponent, latestData)
    setResult(battleResult)
    setBattleResult(battleResult)
    setBattleState("fighting")
  }

  useEffect(() => {
    if (battleState !== "fighting" || !result) return
    if (visibleLogs >= result.logs.length) {
      const timer = setTimeout(() => setBattleState("done"), 800)
      return () => clearTimeout(timer)
    }
    const timer = setTimeout(() => {
      setVisibleLogs((v) => v + 1)
      // Auto-scroll log container
      if (logContainerRef.current) {
        logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight
      }
    }, 900)
    return () => clearTimeout(timer)
  }, [battleState, visibleLogs, result])

  if (!creature) return null

  return (
    <div className="flex min-h-screen flex-col px-4 py-6">
      <div className="mx-auto w-full max-w-2xl">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <button
            onClick={() => setStep("creature")}
            className="flex items-center justify-center rounded-lg border border-border bg-card p-2 text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Go back"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="font-mono text-sm text-foreground">Battle Arena</h1>
            <p className="text-xs text-muted-foreground">Your habits determine your fate</p>
          </div>
        </div>

        {/* VS Display */}
        <div className="mb-6 grid grid-cols-[1fr_auto_1fr] items-center gap-4 rounded-2xl border border-border bg-card p-6">
          {/* Player */}
          <div className="flex flex-col items-center gap-3 text-center">
            <MiniOrb creature={creature} />
            <div>
              <span className="block font-mono text-xs text-foreground">{creature.name}</span>
              <span className="block text-[10px] text-muted-foreground">{creature.personality}</span>
            </div>
            <div className="flex flex-col gap-1.5">
              <MiniStat icon={<Sword className="h-3 w-3" />} value={creature.stats.strength} />
              <MiniStat icon={<Shield className="h-3 w-3" />} value={creature.stats.defense} />
              <MiniStat icon={<Heart className="h-3 w-3" />} value={creature.stats.stamina} />
              <MiniStat icon={<Activity className="h-3 w-3" />} value={creature.stats.stability} />
            </div>
          </div>

          {/* VS */}
          <div className="flex flex-col items-center">
            <span className="font-mono text-xl text-accent">VS</span>
          </div>

          {/* Opponent */}
          <div className="flex flex-col items-center gap-3 text-center">
            <MiniOrb creature={opponent} />
            <div>
              <span className="block font-mono text-xs text-foreground">{opponent.name}</span>
              <span className="block text-[10px] text-muted-foreground">{opponent.personality}</span>
            </div>
            <div className="flex flex-col gap-1.5">
              <MiniStat icon={<Sword className="h-3 w-3" />} value={opponent.stats.strength} />
              <MiniStat icon={<Shield className="h-3 w-3" />} value={opponent.stats.defense} />
              <MiniStat icon={<Heart className="h-3 w-3" />} value={opponent.stats.stamina} />
              <MiniStat icon={<Activity className="h-3 w-3" />} value={opponent.stats.stability} />
            </div>
          </div>
        </div>

        {/* Fight Button */}
        {battleState === "ready" && (
          <button
            onClick={startBattle}
            className="mb-6 flex w-full items-center justify-center gap-2 rounded-xl border border-accent/40 bg-accent px-8 py-4 font-mono text-xs text-accent-foreground transition-all hover:shadow-lg hover:shadow-accent/25 active:scale-[0.98]"
          >
            <Sword className="h-4 w-4" />
            Fight!
          </button>
        )}

        {/* Battle Log */}
        {result && (
          <div ref={logContainerRef} className="mb-6 flex max-h-96 flex-col gap-2 overflow-y-auto">
            {result.logs.map((log, i) => (
              <LogEntry key={i} log={log} isVisible={i < visibleLogs} />
            ))}
          </div>
        )}

        {/* Result Banner */}
        {battleState === "done" && result && (
          <div
            className={`mb-6 rounded-2xl border-2 p-8 text-center ${
              result.winner === "player"
                ? "border-primary/50 bg-primary/10"
                : "border-destructive/50 bg-destructive/10"
            }`}
          >
            <div className="mb-2 flex items-center justify-center">
              {result.winner === "player" ? (
                <Trophy className="h-8 w-8 text-primary" />
              ) : (
                <X className="h-8 w-8 text-destructive" />
              )}
            </div>
            <h2
              className={`font-mono text-2xl ${
                result.winner === "player" ? "text-primary" : "text-destructive"
              }`}
            >
              {result.winner === "player" ? "VICTORY" : "DEFEAT"}
            </h2>
            <p className="mt-2 text-xs text-muted-foreground">
              {result.playerTotal} vs {result.opponentTotal}
            </p>

            <button
              onClick={() => setStep("feedback")}
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl border border-primary/40 bg-primary px-8 py-3 font-mono text-[10px] text-primary-foreground transition-all hover:shadow-lg hover:shadow-primary/25"
            >
              See Behavioral Report
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
