'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function LoginRedirect() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl')
  
  useEffect(() => {
    // Rediriger vers la page d'accueil avec le paramètre callbackUrl s'il existe
    const redirectUrl = callbackUrl ? `/?callbackUrl=${encodeURIComponent(callbackUrl)}` : '/'
    router.push(redirectUrl)
  }, [router, callbackUrl])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Redirection en cours...</p>
    </div>
  )
} 


