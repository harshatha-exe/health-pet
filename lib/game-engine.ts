// LifePet Game Engine
// Persistent creature system: one creature per user, evolves over time

export type Mood = "Calm" | "Tired" | "Stressed" | "Energetic"
export type FoodType =
"Healthy meal"
| "Home food"
| "Fast food"
| "Junk food"
export interface HealthData {
  steps: number
  sleepHours: number
  mood: Mood
  foodType: FoodType
  date: string // ISO date string
}

export interface CreatureStats {
  strength: number
  defense: number
  stamina: number
  stability: number
}

export interface Creature {
  name: string
  ownerName: string
  personality: string
  traitDescription: string
  stats: CreatureStats
  daysAlive: number
  streak: number
  history: HealthData[]
}

export interface BattleLog {
  turn: number
  message: string
  type: "attack" | "defend" | "miss" | "buff" | "penalty" | "result"
}

export interface BattleResult {
  playerCreature: Creature
  opponentCreature: Creature
  logs: BattleLog[]
  winner: "player" | "opponent"
  playerTotal: number
  opponentTotal: number
}

export interface FeedbackItem {
  category: string
  message: string
  impact: "positive" | "negative" | "neutral"
}

// ----- Food scoring -----
export function getFoodScore(foodType: FoodType): number {
  switch (foodType) {
    case "Healthy meal": return 95
    case "Home food": return 75
    case "Fast food": return 45
    case "Junk food": return 20
  }
}

export function getFoodLabel(foodType: FoodType): string {
  switch (foodType) {
    case "Healthy meal": return "Excellent nutrition"
    case "Home food": return "Balanced meal"
    case "Fast food": return "High oil, low nutrients"
    case "Junk food": return "Excessive sugar and fat"
  }
}

// ----- Stat calculation -----
// Stats are a running weighted average: 70% previous + 30% today's input
// This ensures the creature evolves smoothly over time
function calcStrength(steps: number): number {
  return Math.min(Math.round(steps / 100), 150)
}

function calcDefense(sleepHours: number): number {
  return Math.min(Math.round(sleepHours * 10), 100)
}

function calcStamina(foodType: FoodType): number {
  return Math.min(getFoodScore(foodType), 100)
}

function calcStability(history: HealthData[]): number {
  // Stability measures consistency across the last 7 days
  if (history.length < 2) return 50 // neutral starting point
  const recent = history.slice(-7)
  const avgSleep = recent.reduce((s, d) => s + d.sleepHours, 0) / recent.length
  const avgSteps = recent.reduce((s, d) => s + d.steps, 0) / recent.length
  // Calculate variance - lower variance = higher stability
  const sleepVar = recent.reduce((s, d) => s + Math.abs(d.sleepHours - avgSleep), 0) / recent.length
  const stepsVar = recent.reduce((s, d) => s + Math.abs(d.steps - avgSteps), 0) / recent.length
  // Normalize: low variance = high stability
  const sleepStability = Math.max(0, 100 - sleepVar * 15)
  const stepsStability = Math.max(0, 100 - (stepsVar / 100))
  return Math.min(Math.round((sleepStability + stepsStability) / 2), 100)
}

// ----- Personality determination -----
// Based on patterns in history, not just today
export function determinePersonality(
  creature: Creature
): { personality: string; traitDescription: string } {
  const history = creature.history
  if (history.length === 0) {
    return {
      personality: "Newborn Spirit",
      traitDescription: "A freshly awakened companion. Its form is yet to be shaped by your choices.",
    }
  }

  const recent = history.slice(-5)
  const avgSleep = recent.reduce((s, d) => s + d.sleepHours, 0) / recent.length
  const avgSteps = recent.reduce((s, d) => s + d.steps, 0) / recent.length
  const avgFood = recent.reduce((s, d) => s + getFoodScore(d.foodType), 0) / recent.length
  const junkCount = recent.filter(d => d.foodType === "Junk food" || d.foodType === "Fast food").length
  const lowSleepCount = recent.filter(d => d.sleepHours < 5).length

  // Frequent low sleep -> Nocturnal Spirit
  if (lowSleepCount >= 3) {
    return {
      personality: "Nocturnal Spirit",
      traitDescription: "Sleeps little, thinks much. Powered by moonlight and caffeine. High evasion, low accuracy.",
    }
  }

  // Junk food pattern -> Chaotic Imp
  if (junkCount >= 3) {
    return {
      personality: "Chaotic Imp",
      traitDescription: "Feeds on chaos and processed sugar. Surprisingly resilient but deeply unstable.",
    }
  }

  // Consistent balanced routine -> Balanced Sage
  if (creature.stats.stability >= 70 && avgSleep >= 7 && avgFood >= 60 && avgSteps >= 5000) {
    return {
      personality: "Balanced Sage",
      traitDescription: "A master of routine and discipline. Consistent habits grant unwavering power.",
    }
  }

  // Healthy routine -> Radiant Guardian
  if (avgSleep >= 7 && avgFood >= 70 && avgSteps >= 6000) {
    return {
      personality: "Radiant Guardian",
      traitDescription: "Peak health creates peak power. Well-rested and well-fed, a true champion.",
    }
  }

  // Irregular habits -> Unstable Drifter
  if (creature.stats.stability < 40) {
    return {
      personality: "Unstable Drifter",
      traitDescription: "Erratic habits lead to erratic power. One day strong, the next day weak.",
    }
  }

  // Default moderate creature
  return {
    personality: "Wandering Soul",
    traitDescription: "A creature finding its way. Neither strong nor weak, but full of potential.",
  }
}

// ----- Creature color logic -----
// Returns: { bg, glow, ring } CSS color classes
export function getCreatureVisual(creature: Creature): {
  bgColor: string
  glowColor: string
  auraClass: string
} {
  const { stats, history, streak } = creature
  const total = stats.strength + stats.defense + stats.stamina
  const recentSleep = history.length > 0 ? history[history.length - 1].sleepHours : 7
  const recentFood = history.length > 0 ? getFoodScore(history[history.length - 1].foodType) : 50

  // Consistently good days -> golden aura
  if (streak >= 5 && total > 200) {
    return { bgColor: "#f5c542", glowColor: "rgba(245, 197, 66, 0.6)", auraClass: "aura-golden" }
  }

  // Healthy habits -> bright blue/green
  if (total > 200) {
    return { bgColor: "#4ade80", glowColor: "rgba(74, 222, 128, 0.5)", auraClass: "aura-healthy" }
  }

  // Moderate habits -> yellow
  if (total > 140) {
    return { bgColor: "#facc15", glowColor: "rgba(250, 204, 21, 0.4)", auraClass: "aura-moderate" }
  }

  // Poor sleep -> dim purple
  if (recentSleep < 5) {
    return { bgColor: "#a78bfa", glowColor: "rgba(167, 139, 250, 0.4)", auraClass: "aura-sleepy" }
  }

  // Junk food + low activity -> dark grey/black glossy
  if (recentFood < 40 && stats.strength < 40) {
    return { bgColor: "#4b5563", glowColor: "rgba(75, 85, 99, 0.3)", auraClass: "aura-dark" }
  }

  // Default
  return { bgColor: "#60a5fa", glowColor: "rgba(96, 165, 250, 0.4)", auraClass: "aura-default" }
}

// ----- Create new creature -----
export function createCreature(ownerName: string, creatureName: string): Creature {
  return {
    name: creatureName,
    ownerName,
    personality: "Newborn Spirit",
    traitDescription: "A freshly awakened companion. Its form is yet to be shaped by your choices.",
    stats: { strength: 10, defense: 10, stamina: 10, stability: 50 },
    daysAlive: 0,
    streak: 0,
    history: [],
  }
}

// ----- Update creature with daily data -----
export function updateCreature(creature: Creature, data: HealthData): Creature {
  const newHistory = [...creature.history, data]
  const todayStrength = calcStrength(data.steps)
  const todayDefense = calcDefense(data.sleepHours)
  const todayStamina = calcStamina(data.foodType)

  // Weighted average: 60% old + 40% new for smooth evolution
  const weight = creature.history.length === 0 ? 1 : 0.4
  const oldWeight = 1 - weight

  const newStats: CreatureStats = {
    strength: Math.round(creature.stats.strength * oldWeight + todayStrength * weight),
    defense: Math.round(creature.stats.defense * oldWeight + todayDefense * weight),
    stamina: Math.round(creature.stats.stamina * oldWeight + todayStamina * weight),
    stability: calcStability(newHistory),
  }

  // Streak: if sleep >= 6 and food >= 50 and steps >= 4000, increment streak
  const isGoodDay = data.sleepHours >= 6 && getFoodScore(data.foodType) >= 50 && data.steps >= 4000
  const newStreak = isGoodDay ? creature.streak + 1 : 0

  const updated: Creature = {
    ...creature,
    stats: newStats,
    daysAlive: creature.daysAlive + 1,
    streak: newStreak,
    history: newHistory,
  }

  // Re-evaluate personality
  const { personality, traitDescription } = determinePersonality(updated)
  updated.personality = personality
  updated.traitDescription = traitDescription

  return updated
}

// ----- Sample opponents -----
const sampleOpponents: Creature[] = [
  {
    name: "Darkfang",
    ownerName: "Shadow",
    personality: "Nocturnal Spirit",
    traitDescription: "A creature of the dark. Thrives in low light, attacks from the shadows.",
    stats: { strength: 55, defense: 50, stamina: 60, stability: 45 },
    daysAlive: 12,
    streak: 2,
    history: [],
  },
  {
    name: "Ironshell",
    ownerName: "Tank",
    personality: "Balanced Sage",
    traitDescription: "Slow but incredibly resilient. Years of routine forged this creature.",
    stats: { strength: 40, defense: 85, stamina: 70, stability: 90 },
    daysAlive: 30,
    streak: 15,
    history: [],
  },
  {
    name: "Blazewisp",
    ownerName: "Sparky",
    personality: "Chaotic Imp",
    traitDescription: "Burns bright and fast. Feeds on junk food energy and pure chaos.",
    stats: { strength: 75, defense: 30, stamina: 35, stability: 20 },
    daysAlive: 8,
    streak: 0,
    history: [],
  },
]

export function getRandomOpponent(): Creature {
  return sampleOpponents[Math.floor(Math.random() * sampleOpponents.length)]
}

// ----- Battle simulation -----
export function simulateBattle(
  player: Creature,
  opponent: Creature,
  latestData: HealthData | null
): BattleResult {
  const logs: BattleLog[] = []
  let turn = 0

  // --- Turn 1: Player attacks ---
  turn++
  const playerRoll = Math.floor(Math.random() * 20) + 1
  let playerAttack = player.stats.strength + playerRoll

  // Miss chance if sleep < 5
  const sleepPenalty = latestData && latestData.sleepHours < 5
  if (sleepPenalty && Math.random() < 0.35) {
    logs.push({
      turn,
      message: `${player.name} swings but misses! Sleep deprivation causes blurred vision...`,
      type: "miss",
    })
    playerAttack = Math.floor(playerAttack * 0.4)
  } else {
    logs.push({
      turn,
      message: `${player.name} attacks with ${playerAttack} power! (STR ${player.stats.strength} + Roll ${playerRoll})`,
      type: "attack",
    })
  }

  // --- Turn 2: Nutrition buff ---
  turn++
  if (latestData && getFoodScore(latestData.foodType) >= 70) {
    const buff = Math.floor(playerAttack * 0.2)
    playerAttack += buff
    logs.push({
      turn,
      message: `Nutrition buff! +${buff} attack power from quality meals.`,
      type: "buff",
    })
  } else if (latestData && getFoodScore(latestData.foodType) < 40) {
    const penalty = Math.floor(playerAttack * 0.15)
    playerAttack -= penalty
    logs.push({
      turn,
      message: `Poor nutrition! -${penalty} attack power from junk food.`,
      type: "penalty",
    })
  } else {
    logs.push({
      turn,
      message: `Moderate nutrition. No bonus or penalty applied.`,
      type: "defend",
    })
  }

  // --- Turn 3: Opponent attacks ---
  turn++
  const opponentRoll = Math.floor(Math.random() * 20) + 1
  const opponentAttack = opponent.stats.strength + opponentRoll
  logs.push({
    turn,
    message: `${opponent.name} counters with ${opponentAttack} power! (STR ${opponent.stats.strength} + Roll ${opponentRoll})`,
    type: "attack",
  })

  // --- Turn 4: Guard values ---
  turn++
  const playerGuard = player.stats.defense + player.stats.stamina / 2
  const opponentGuard = opponent.stats.defense + opponent.stats.stamina / 2
  logs.push({
    turn,
    message: `Guards up! ${player.name}: ${Math.round(playerGuard)} DEF | ${opponent.name}: ${Math.round(opponentGuard)} DEF`,
    type: "defend",
  })

  // --- Turn 5: Stability / Consistency bonus ---
  turn++
  let stabilityBonus = 0
  if (player.stats.stability >= 70) {
    stabilityBonus = Math.floor(player.stats.stability * 0.3)
    logs.push({
      turn,
      message: `Consistency bonus! +${stabilityBonus} from high stability (${player.stats.stability}).`,
      type: "buff",
    })
  } else if (player.stats.stability < 35) {
    stabilityBonus = -Math.floor((50 - player.stats.stability) * 0.2)
    logs.push({
      turn,
      message: `Instability penalty! ${stabilityBonus} from erratic habits.`,
      type: "penalty",
    })
  } else {
    logs.push({
      turn,
      message: `Moderate stability. No consistency bonus.`,
      type: "defend",
    })
  }

  // --- Final scoring ---
  const playerTotal = Math.round(playerAttack + playerGuard + stabilityBonus)
  const opponentTotal = Math.round(opponentAttack + opponentGuard)

  turn++
  logs.push({
    turn,
    message: `Final Score: ${player.name} ${playerTotal} vs ${opponent.name} ${opponentTotal}`,
    type: "result",
  })

  const winner = playerTotal >= opponentTotal ? "player" : "opponent"

  turn++
  logs.push({
    turn,
    message: winner === "player"
      ? `${player.name} WINS! Your healthy habits paid off!`
      : `${opponent.name} wins... Time to improve your routine.`,
    type: "result",
  })

  return { playerCreature: player, opponentCreature: opponent, logs, winner, playerTotal, opponentTotal }
}

// ----- Feedback generation -----
export function generateFeedback(
  data: HealthData,
  creature: Creature,
  battleResult: BattleResult | null
): FeedbackItem[] {
  const items: FeedbackItem[] = []

  // Sleep feedback
  if (data.sleepHours < 5) {
    items.push({ category: "Sleep", message: `Low sleep (${data.sleepHours}h) reduced reaction speed and caused miss chances in battle.`, impact: "negative" })
  } else if (data.sleepHours >= 8) {
    items.push({ category: "Sleep", message: `Great sleep (${data.sleepHours}h)! Maximum defense stats and sharp reflexes.`, impact: "positive" })
  } else {
    items.push({ category: "Sleep", message: `${data.sleepHours}h of sleep. Decent rest, defense is holding steady.`, impact: "neutral" })
  }

  // Steps feedback
  if (data.steps < 3000) {
    items.push({ category: "Activity", message: `Only ${data.steps.toLocaleString()} steps. Weak attack power. Your creature could barely swing.`, impact: "negative" })
  } else if (data.steps >= 8000) {
    items.push({ category: "Activity", message: `${data.steps.toLocaleString()} steps! Excellent activity gave maximum strength.`, impact: "positive" })
  } else {
    items.push({ category: "Activity", message: `${data.steps.toLocaleString()} steps. Moderate activity, decent strength.`, impact: "neutral" })
  }

  // Food feedback
  if (data.foodType === "Junk food" || data.foodType === "Fast food") {
    items.push({ category: "Nutrition", message: `${data.foodType} detected. Stamina was reduced, weakening your guard.`, impact: "negative" })
  } else {
    items.push({ category: "Nutrition", message: `${data.foodType} boosted stamina and gave an attack buff.`, impact: "positive" })
  }

  // Stability feedback
  if (creature.stats.stability >= 70) {
    items.push({ category: "Consistency", message: `High stability (${creature.stats.stability}). Consistent routine grants a bonus in battle.`, impact: "positive" })
  } else if (creature.stats.stability < 40) {
    items.push({ category: "Consistency", message: `Irregular routine caused instability (${creature.stats.stability}). This hurt battle performance.`, impact: "negative" })
  }

  // Mood feedback
  if (data.mood === "Energetic" || data.mood === "Calm") {
    items.push({ category: "Mood", message: `${data.mood} mood improved overall creature morale.`, impact: "positive" })
  } else {
    items.push({ category: "Mood", message: `${data.mood} mood weakened creature focus and stability.`, impact: "negative" })
  }

  return items
}

// ----- LocalStorage persistence -----
const STORAGE_KEY = "lifepet_creature"

export function saveCreature(creature: Creature): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(creature))
  }
}

export function loadCreature(): Creature | null {
  if (typeof window === "undefined") return null
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as Creature
  } catch {
    return null
  }
}

export function clearCreature(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY)
  }
}
