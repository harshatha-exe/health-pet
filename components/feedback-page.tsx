"use client"

import { useGame } from "@/lib/game-context"
import { generateFeedback } from "@/lib/game-engine"
import {
  ArrowLeft,
  RotateCcw,
  Trophy,
  X,
  CheckCircle2,
  XCircle,
  MinusCircle,
  Moon,
  Footprints,
  UtensilsCrossed,
  Activity,
  Smile,
} from "lucide-react"

const categoryIcons: Record<string, React.ReactNode> = {
  Sleep: <Moon className="h-4 w-4" />,
  Activity: <Footprints className="h-4 w-4" />,
  Nutrition: <UtensilsCrossed className="h-4 w-4" />,
  Consistency: <Activity className="h-4 w-4" />,
  Mood: <Smile className="h-4 w-4" />,
}

const impactConfig = {
  positive: {
    border: "border-primary/30",
    bg: "bg-primary/5",
    icon: <CheckCircle2 className="h-4 w-4 text-primary" />,
    iconColor: "text-primary",
  },
  negative: {
    border: "border-destructive/30",
    bg: "bg-destructive/5",
    icon: <XCircle className="h-4 w-4 text-destructive" />,
    iconColor: "text-destructive",
  },
  neutral: {
    border: "border-accent/30",
    bg: "bg-accent/5",
    icon: <MinusCircle className="h-4 w-4 text-accent" />,
    iconColor: "text-accent",
  },
}

export function FeedbackPage() {

  // ✅ removed resetAll
  const { creature, latestData, battleResult, setStep } = useGame()


  if (!creature) return null


  const data =
    latestData ||
    (creature.history.length > 0
      ? creature.history[creature.history.length - 1]
      : null)


  if (!data) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4">
        <p className="mb-4 text-sm text-muted-foreground">
          No activity data yet. Update your day first.
        </p>

        <button
          onClick={() => setStep("daily")}
          className="rounded-xl border border-primary/40 bg-primary px-8 py-3 font-mono text-xs text-primary-foreground"
        >
          Go to Daily Input
        </button>

      </div>
    )
  }


  const feedback =
    generateFeedback(data, creature, battleResult)



  return (

    <div className="flex min-h-screen flex-col px-4 py-6">

      <div className="mx-auto w-full max-w-xl">


{/* Header */}

<div className="mb-6 flex items-center gap-4">

<button
onClick={() => setStep(battleResult ? "battle" : "creature")}
className="flex items-center justify-center rounded-lg border border-border bg-card p-2 text-muted-foreground transition-colors hover:text-foreground"
>

<ArrowLeft className="h-4 w-4" />

</button>


<div>

<h1 className="font-mono text-sm text-foreground">
Behavioral Report
</h1>

<p className="text-xs text-muted-foreground">
How your habits shaped performance
</p>

</div>

</div>



{/* Battle banner */}

{battleResult && (

<div className={`mb-6 flex items-center gap-4 rounded-2xl border-2 p-5 ${
battleResult.winner === "player"
? "border-primary/40 bg-primary/10"
: "border-destructive/40 bg-destructive/10"
}`}>

{battleResult.winner === "player"
?
<Trophy className="h-8 w-8 text-primary"/>
:
<X className="h-8 w-8 text-destructive"/>
}

<div>

<h2 className={`font-mono text-base ${
battleResult.winner === "player"
? "text-primary"
: "text-destructive"
}`}>

{battleResult.winner === "player"
? "Victory! Here is why you won"
: "Defeat. Here is what went wrong"}

</h2>

</div>

</div>

)}




{/* Feedback */}

<div className="mb-6 flex flex-col gap-3">

{feedback.map((item,i)=>{

const config = impactConfig[item.impact]

return(

<div key={i}
className={`flex gap-3 rounded-xl border ${config.border} ${config.bg} p-4`}>

<div>{categoryIcons[item.category]}</div>

<p className="text-xs">
{item.message}
</p>

</div>

)

})}

</div>




{/* Summary */}

<div className="mb-6 rounded-xl border border-border bg-card p-5">

<h3 className="mb-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">

Day Summary

</h3>

<p className="text-xs">
Steps: {data.steps}
</p>

<p className="text-xs">
Sleep: {data.sleepHours}
</p>

<p className="text-xs">
Food: {data.foodType}
</p>

<p className="text-xs">
Mood: {data.mood}
</p>

</div>




{/* ONLY NEW DAY BUTTON */}

<button

onClick={() => setStep("daily")}

className="flex w-full items-center justify-center gap-2 rounded-xl border border-primary/40 bg-primary px-6 py-4 font-mono text-xs text-primary-foreground"

>

<RotateCcw className="h-4 w-4"/>

New Day

</button>



</div>

</div>

)

}