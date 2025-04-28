"use client"

import * as React from "react"
import { Toaster as SonnerToaster } from "sonner"

import { cn } from "@/lib/utils"

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {}

function Toast({ className, ...props }: ToastProps) {
  return (
    <div
      className={cn(
        "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border border-border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full data-[state=closed]:slide-out-to-right-full",
        className
      )}
      {...props}
    />
  )
}

interface ToasterProps {
  className?: string
}

function Toaster({ className }: ToasterProps) {
  return (
    <SonnerToaster
      className={cn(className)}
      toastOptions={{
        classNames: {
          toast: cn(
            "group p-4 rounded-md shadow-md flex items-center gap-3 data-[type=success]:bg-green-50 data-[type=error]:bg-red-50 data-[type=default]:bg-white"
          ),
          title: cn("text-sm font-medium text-foreground"),
          description: cn("text-xs text-muted-foreground"),
          actionButton: cn(
            "bg-primary text-primary-foreground hover:bg-primary/90 h-8 px-3 rounded-md text-xs"
          ),
          cancelButton: cn(
            "bg-muted text-muted-foreground hover:bg-muted/90 h-8 px-3 rounded-md text-xs"
          ),
        },
      }}
    />
  )
}

export { Toaster, Toast } 