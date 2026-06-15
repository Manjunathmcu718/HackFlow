import * as React from "react"
import { cn } from "@/lib/utils"

const Slider = React.forwardRef(({ className, value, onValueChange, min = 0, max = 100, step = 1, ...props }, ref) => {
  const val = value?.[0] ?? 0
  const pct = ((val - min) / (max - min)) * 100
  return (
    <div className={cn("relative flex w-full touch-none select-none items-center", className)}>
      <div className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
        <div className="absolute h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
      </div>
      <input
        type="range"
        min={min} max={max} step={step}
        value={val}
        onChange={(e) => onValueChange?.([Number(e.target.value)])}
        className="absolute inset-0 w-full h-2 opacity-0 cursor-pointer"
      />
    </div>
  )
})
Slider.displayName = "Slider"
export { Slider }
