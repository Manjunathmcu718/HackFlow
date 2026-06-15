import * as React from "react"
import { cn } from "@/lib/utils"

function Accordion({ type, collapsible, children, className }) {
  const [openItems, setOpenItems] = React.useState([])
  const ctx = {
    isOpen: (v) => openItems.includes(v),
    toggle: (v) => {
      setOpenItems(prev => {
        if (prev.includes(v)) return collapsible ? prev.filter(i => i !== v) : prev
        return type === "single" ? [v] : [...prev, v]
      })
    }
  }
  return <div className={cn("space-y-2", className)}>{React.Children.map(children, c => React.cloneElement(c, { __ctx: ctx }))}</div>
}

function AccordionItem({ value, children, className, __ctx }) {
  const ctx = __ctx
  const open = ctx?.isOpen(value)
  return (
    <div className={cn("border rounded-lg px-4", open && "bg-card shadow-sm", className)}>
      {React.Children.map(children, c => React.cloneElement(c, { __ctx: ctx, __value: value, __open: open }))}
    </div>
  )
}

function AccordionTrigger({ children, className, __ctx, __value, __open }) {
  return (
    <button onClick={() => __ctx?.toggle(__value)} className={cn("flex w-full items-center justify-between py-4 text-sm font-medium transition-all hover:underline text-left", className)}>
      {children}
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={cn("h-4 w-4 shrink-0 transition-transform duration-200", __open && "rotate-180")}>
        <path d="m6 9 6 6 6-6"/>
      </svg>
    </button>
  )
}

function AccordionContent({ children, className, __open }) {
  if (!__open) return null
  return <div className={cn("overflow-hidden text-sm pb-4", className)}>{children}</div>
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
