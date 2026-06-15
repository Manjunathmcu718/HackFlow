import * as React from "react"
import { cn } from "@/lib/utils"

const DialogContext = React.createContext({})

function Dialog({ open, onOpenChange, children }) {
  if (!open) return null
  return (
    <DialogContext.Provider value={{ onOpenChange }}>
      <div className="fixed inset-0 z-50">
        <div className="fixed inset-0 bg-black/80" onClick={() => onOpenChange(false)} />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          {children}
        </div>
      </div>
    </DialogContext.Provider>
  )
}

function DialogContent({ children, className }) {
  return (
    <div className={cn("relative w-full max-w-lg rounded-lg border bg-background p-6 shadow-lg", className)} onClick={e => e.stopPropagation()}>
      {children}
    </div>
  )
}

function DialogHeader({ children, className }) {
  return <div className={cn("mb-4", className)}>{children}</div>
}

function DialogTitle({ children, className }) {
  return <h2 className={cn("text-lg font-semibold", className)}>{children}</h2>
}

function DialogFooter({ children, className }) {
  return <div className={cn("flex justify-end gap-3 mt-6", className)}>{children}</div>
}

export { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter }
