'use client'

import { useEffect } from 'react'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Toujours utiliser le mode clair
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }, [])

  return <>{children}</>
} 


