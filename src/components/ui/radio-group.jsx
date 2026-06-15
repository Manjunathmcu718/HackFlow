import * as React from "react"
import { cn } from "@/lib/utils"

const RadioGroupContext = React.createContext({})

function RadioGroup({ value, onValueChange, children, className }) {
  return (
    <RadioGroupContext.Provider value={{ value, onValueChange }}>
      <div className={cn("space-y-2", className)}>{children}</div>
    </RadioGroupContext.Provider>
  )
}

function RadioGroupItem({ value, id, className }) {
  const { value: current, onValueChange } = React.useContext(RadioGroupContext)
  return (
    <button
      type="button"
      onClick={() => onValueChange(value)}
      className={cn(
        "h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 shrink-0",
        current === value ? "bg-primary" : "",
        className
      )}
      id={id}
    >
      {current === value && <div className="h-2 w-2 rounded-full bg-background mx-auto" />}
    </button>
  )
}

export { RadioGroup, RadioGroupItem }
