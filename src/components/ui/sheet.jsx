import * as React from "react"
import { cn } from "@/lib/utils"

const SheetContext = React.createContext({})

function Sheet({ open, onOpenChange, children }) {
  return (
    <SheetContext.Provider value={{ open, setOpen: onOpenChange }}>
      {children}
    </SheetContext.Provider>
  )
}

function SheetTrigger({ asChild, children, className }) {
  const { setOpen } = React.useContext(SheetContext)
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, { onClick: () => setOpen(true) })
  }
  return <button onClick={() => setOpen(true)} className={className}>{children}</button>
}

function SheetContent({ side = "right", children, className }) {
  const { open, setOpen } = React.useContext(SheetContext)
  if (!open) return null
  const sideStyles = { right: "right-0", left: "left-0", top: "top-0", bottom: "bottom-0" }
  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setOpen(false)} />
      <div className={cn("fixed z-50 h-full w-72 bg-background border-l shadow-lg p-6 overflow-auto", sideStyles[side], className)} onClick={e => e.stopPropagation()}>
        <button onClick={() => setOpen(false)} className="absolute top-4 right-4 p-1 rounded-md hover:bg-muted"><svg width="16" height="16" viewBox="0 0 15 15"><path d="M12.85 2.15a.5.5 0 0 0-.7 0L7.5 6.79 2.85 2.15a.5.5 0 1 0-.7.7L6.79 7.5l-4.64 4.65a.5.5 0 0 0 .7.7L7.5 8.21l4.65 4.64a.5.5 0 0 0 .7-.7L8.21 7.5l4.64-4.65a.5.5 0 0 0 0-.7z" fill="currentColor"/></svg></button>
        {children}
      </div>
    </>
  )
}

export { Sheet, SheetTrigger, SheetContent }

