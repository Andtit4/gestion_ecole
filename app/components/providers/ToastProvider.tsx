'use client'

import { Toaster } from 'react-hot-toast'

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: '#333',
          color: '#fff',
        },
        success: {
          style: {
            background: '#22c55e',
            color: '#fff',
          },
        },
        error: {
          style: {
            background: '#ef4444',
            color: '#fff',
          },
        },
      }}
    />
  )
} 