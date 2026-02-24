"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import type { HealthData, Creature, BattleResult } from "./game-engine"
import { loadCreature, saveCreature, clearCreature } from "./game-engine"

export type GameStep = "landing" | "setup" | "daily" | "creature" | "battle" | "feedback"

interface GameState {
  step: GameStep
  creature: Creature | null
  latestData: HealthData | null
  battleResult: BattleResult | null
  isLoaded: boolean
  setStep: (step: GameStep) => void
  setCreature: (creature: Creature) => void
  setLatestData: (data: HealthData) => void
  setBattleResult: (result: BattleResult) => void
  resetAll: () => void
}

const GameContext = createContext<GameState | null>(null)

export function GameProvider({ children }: { children: ReactNode }) {
  const [step, setStep] = useState<GameStep>("landing")
  const [creature, setCreatureState] = useState<Creature | null>(null)
  const [latestData, setLatestData] = useState<HealthData | null>(null)
  const [battleResult, setBattleResult] = useState<BattleResult | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load creature from localStorage on mount
  useEffect(() => {
    const saved = loadCreature()
    if (saved) {
      setCreatureState(saved)
    }
    setIsLoaded(true)
  }, [])

  const setCreature = useCallback((c: Creature) => {
    setCreatureState(c)
    saveCreature(c)
  }, [])

  const resetAll = useCallback(() => {
    clearCreature()
    setCreatureState(null)
    setLatestData(null)
    setBattleResult(null)
    setStep("landing")
  }, [])

  return (
    <GameContext.Provider
      value={{
        step,
        creature,
        latestData,
        battleResult,
        isLoaded,
        setStep,
        setCreature,
        setLatestData,
        setBattleResult,
        resetAll,
      }}
    >
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error("useGame must be used inside GameProvider")
  return ctx
}
