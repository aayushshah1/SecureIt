import React from "react"
import { createContext, useContext, useState } from "react"
import { cn } from "../../lib/utils"

const ToastContext = createContext({})

export function Toaster({ children, ...props }) {
  const [toasts, setToasts] = useState([])

  const add = (message) => {
    const toast = { id: Math.random().toString(), message, visible: true }
    setToasts((prev) => [...prev, toast])
    setTimeout(() => {
      setToasts((prev) => 
        prev.map((t) => (t.id === toast.id ? { ...t, visible: false } : t))
      )
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id))
      }, 300)
    }, 3000)
  }

  return (
    <ToastContext.Provider value={{ add }}>
      {children}
      <div className="fixed top-0 right-0 z-50 p-4 space-y-4 w-full max-w-md">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              "bg-white rounded-lg border border-gray-200 shadow-md p-4 transition-opacity duration-300",
              toast.visible ? "opacity-100" : "opacity-0"
            )}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  
  return {
    toast: (message) => {
      if (typeof message === 'string') {
        context.add(message)
      } else {
        const { title, description, variant } = message
        context.add(
          <div className={cn("flex flex-col gap-1", variant === "destructive" && "text-red-500")}>
            {title && <h4 className="font-semibold">{title}</h4>}
            {description && <p className="text-sm">{description}</p>}
          </div>
        )
      }
    }
  }
}

export function toast(props) {
  const { toast } = useToast()
  toast(props)
}