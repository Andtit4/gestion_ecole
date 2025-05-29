'use client'

import React from 'react'

interface AuthLayoutProps {
  children: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Contenu principal sans sidebar ni header */}
      <main className="min-h-screen flex flex-col">{children}</main>
    </div>
  )
} 