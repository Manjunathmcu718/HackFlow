"use client"
import * as React from "react"
import { cn } from "@/lib/utils"

const SelectContext = React.createContext({})

function Select({ children, value, onValueChange }) {
  const [open, setOpen] = React.useState(false)
  const triggerRef = React.useRef(null)
  
  React.useEffect(() => {
    const handler = (e) => { if (triggerRef.current && !triggerRef.current.contains(e.target)) setOpen(false) }
    document.addEventListener("click", handler)
    return () => document.removeEventListener("click", handler)
  }, [])

  return (
    <SelectContext.Provider value={{ value, onValueChange, open, setOpen }}>
      <div className="relative inline-block">{children}</div>
    </SelectContext.Provider>
  )
}

function SelectTrigger({ className, children, ...props }) {
  const { open, setOpen } = React.useContext(SelectContext)
  return (
    <button
      type="button"
      onClick={() => setOpen(!open)}
      className={cn("flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", className)}
      {...props}
    >
      {children}
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 opacity-50"><path d="m6 9 6 6 6-6"/></svg>
    </button>
  )
}

function SelectValue({ placeholder }) {
  const { value } = React.useContext(SelectContext)
  return <span className={!value ? "text-muted-foreground" : ""}>{value || placeholder}</span>
}

function SelectContent({ children, className }) {
  const { open } = React.useContext(SelectContext)
  if (!open) return null
  return (
    <div className={cn("absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-80 mt-1", className)}>
      <div className="p-1">{children}</div>
    </div>
  )
}

function SelectItem({ children, value, ...props }) {
  const { onValueChange, setOpen } = React.useContext(SelectContext)
  return (
    <div
      onClick={() => { onValueChange(value); setOpen(false) }}
      className="relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
      {...props}
    >
      {children}
    </div>
  )
}

export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue }
