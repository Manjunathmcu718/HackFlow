import * as React from "react"
import { cn } from "@/lib/utils"

const TabsContext = React.createContext({})

function Tabs({ defaultValue, value, onValueChange, children, className }) {
  const [internal, setInternal] = React.useState(defaultValue || "")
  const current = value !== undefined ? value : internal
  const set = onValueChange || setInternal
  return (
    <TabsContext.Provider value={{ value: current, setValue: set }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  )
}

function TabsList({ children, className }) {
  return <div className={cn("inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground", className)}>{children}</div>
}

function TabsTrigger({ value, children, className }) {
  const { value: current, setValue } = React.useContext(TabsContext)
  return (
    <button
      onClick={() => setValue(value)}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        current === value ? "bg-background text-foreground shadow-sm" : "",
        className
      )}
    >
      {children}
    </button>
  )
}

function TabsContent({ value, children, className }) {
  const { value: current } = React.useContext(TabsContext)
  if (current !== value) return null
  return <div className={cn("mt-2", className)}>{children}</div>
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
