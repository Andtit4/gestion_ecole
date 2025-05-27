"use client"

import * as React from "react"
import { toast as sonnerToast } from "sonner"

type ToastProps = {
  title?: string
  description?: string
  action?: React.ReactNode
  variant?: "default" | "destructive" | "success"
}

export function useToast() {
  return {
    toast: ({ title, description, action, variant = "default" }: ToastProps) => {
      const toastFunction = variant === "destructive" 
        ? sonnerToast.error
        : variant === "success"
          ? sonnerToast.success
          : sonnerToast

      toastFunction(title, {
        description,
        action
      })
    },
    dismiss: () => sonnerToast.dismiss()
  }
} 