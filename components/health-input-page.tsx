"use client"

import { useState, useEffect, useRef } from "react"
import { useGame } from "@/lib/game-context"
import {
  updateCreature,
  getFoodScore,
  getFoodLabel,
  type Mood,
  type FoodType,
  type HealthData,
} from "@/lib/game-engine"

import {
  Footprints,
  Moon,
  Smile,
  UtensilsCrossed,
  RefreshCw,
  Camera
} from "lucide-react"


// YOUR MODEL
const MODEL_URL =
"https://teachablemachine.withgoogle.com/models/IBMXf_hcN/"


const moods: { value: Mood; label: string }[] = [
  { value: "Calm", label: "Calm" },
  { value: "Tired", label: "Tired" },
  { value: "Stressed", label: "Stressed" },
  { value: "Energetic", label: "Energetic" },
]

const foodTypes: FoodType[] =
["Healthy meal", "Home food", "Fast food", "Junk food"]

const moodStyles: Record<Mood, string> = {
  Calm: "border-primary bg-primary/10 text-primary",
  Tired: "border-muted-foreground bg-muted text-muted-foreground",
  Stressed: "border-destructive bg-destructive/10 text-destructive",
  Energetic: "border-accent bg-accent/10 text-accent",
}



export function HealthInputPage() {

  const { creature, setCreature, setLatestData, setStep } = useGame()

  const [steps, setSteps] = useState(5000)
  const [sleepHours, setSleepHours] = useState(7)
  const [mood, setMood] = useState<Mood>("Calm")
  const [foodType, setFoodType] = useState<FoodType>("Home food")


  // AI
  const [model, setModel] = useState<any>(null)
  const imageRef = useRef<HTMLImageElement>(null)



// LOAD AI MODEL silently
useEffect(() => {

async function load(){

const tmImage =
await import("@teachablemachine/image")

const m =
await tmImage.load(
MODEL_URL+"model.json",
MODEL_URL+"metadata.json"
)

setModel(m)

}

load()

}, [])



// image select
function handleImage(e:any){

const file = e.target.files[0]

if(file){

imageRef.current!.src =
URL.createObjectURL(file)

}

}



// analyze food
async function analyzeFood(){

if(!model){

alert("AI still loading...")

return

}

const prediction =
await model.predict(imageRef.current)


const healthy =
prediction[0].probability

const junk =
prediction[1].probability



if(healthy > junk){

setFoodType("Healthy meal")

}
else{

setFoodType("Junk food")

}

}



if (!creature) return null


const foodScore =
getFoodScore(foodType)

const foodLabel =
getFoodLabel(foodType)



const handleUpdate = () => {

const data: HealthData = {

steps,

sleepHours,

mood,

foodType,

date:
new Date().toISOString().split("T")[0],

}

const updated =
updateCreature(creature, data)

setCreature(updated)

setLatestData(data)

setStep("creature")

}



return (

<div className="flex min-h-screen flex-col px-4 py-6">

<div className="mx-auto w-full max-w-xl">




{/* Header */}

<div className="mb-6">

<div className="flex items-center justify-between">

<div>

<h1 className="font-mono text-sm text-foreground">

Daily Activity

</h1>

<p className="text-sm text-muted-foreground">

Update {creature.name}'s world

</p>

</div>

</div>

</div>




{/* AI FOOD SCAN */}

<section className="mb-4 rounded-xl border border-border bg-card p-4">

<div className="mb-3 flex items-center gap-3">

<Camera className="h-4 w-4 text-primary" />

<h2 className="font-mono text-[10px] uppercase tracking-wider">

Scan Meal (AI)

</h2>

</div>


<input

type="file"

onChange={handleImage}

className="mb-2 text-xs"

/>


<img

ref={imageRef}

width="200"

className="rounded-lg mb-2"

/>


<button

onClick={analyzeFood}

className="rounded-lg border border-primary bg-primary/10 px-3 py-2 text-xs font-mono hover:bg-primary hover:text-white transition"

>

Analyze Food

</button>


</section>




{/* Steps */}

<section className="mb-4 rounded-xl border border-border bg-card p-4">

<div className="mb-3 flex items-center gap-3">

<Footprints className="h-4 w-4 text-primary" />

<h2 className="font-mono text-[10px] uppercase tracking-wider">

Steps Walked Today

</h2>

</div>


<input

type="number"

value={steps}

onChange={(e)=>
setSteps(parseInt(e.target.value)||0)}

className="w-full rounded-lg border border-border bg-input px-4 py-3"

min={0}

/>

</section>




{/* Sleep */}

<section className="mb-4 rounded-xl border border-border bg-card p-4">

<div className="mb-3 flex items-center gap-3">

<Moon className="h-4 w-4 text-primary" />

<h2 className="font-mono text-[10px] uppercase tracking-wider">

Sleep Hours

</h2>

</div>


<input

type="range"

min={0}

max={10}

step={0.5}

value={sleepHours}

onChange={(e)=>
setSleepHours(parseFloat(e.target.value))}

className="w-full"

/>

</section>




{/* Mood */}

<section className="mb-4 rounded-xl border border-border bg-card p-4">

<div className="mb-3 flex items-center gap-3">

<Smile className="h-4 w-4 text-primary" />

<h2 className="font-mono text-[10px] uppercase tracking-wider">

Mood

</h2>

</div>


<div className="grid grid-cols-2 gap-2">

{moods.map(m=>(

<button

key={m.value}

onClick={()=>setMood(m.value)}

className={`rounded-lg border px-3 py-2 text-xs font-mono transition ${
mood===m.value
? moodStyles[m.value]
: "border-border bg-secondary"
}`}

>

{m.label}

</button>

))}

</div>

</section>




{/* Meal Quality */}

<section className="mb-4 rounded-xl border border-border bg-card p-4">

<div className="mb-1 flex justify-between">

<span className="text-xs font-mono">

Meal Quality

</span>

<span className="text-xs font-mono text-primary">

{foodScore}/100

</span>

</div>

<div className="h-2 bg-secondary rounded-full">

<div

className="h-full bg-primary rounded-full"

style={{
width: `${foodScore}%`
}}

/>

</div>

<p className="text-xs mt-1">

{foodLabel}

</p>

</section>




{/* Submit */}

<button

onClick={handleUpdate}

className="flex w-full items-center justify-center gap-2 rounded-xl border border-primary bg-primary px-8 py-4 font-mono text-xs text-primary-foreground hover:shadow-lg"

>

<RefreshCw className="h-4 w-4" />

Update My Day

</button>




</div>

</div>

)

}