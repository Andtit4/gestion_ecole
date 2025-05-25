'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signIn, signOut, useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { ThemeToggle } from '@/components/ui/theme-toggle'

export default function Navbar() {
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const { toast } = useToast()
  const [dbError, setDbError] = useState(false)

  // Vérifier l'état de la connexion à la base de données
  useEffect(() => {
    const checkDatabase = async () => {
      try {
        const response = await fetch('/api/health')
        if (response.ok) {
          setDbError(false)
        } else {
          setDbError(true)
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de la base de données:', error)
        setDbError(true)
      }
    }

    // Vérifier immédiatement au chargement
    checkDatabase()

    // Puis vérifier toutes les 30 secondes
    const interval = setInterval(checkDatabase, 30000)
    return () => clearInterval(interval)
  }, [])

  const isActive = (path: string) => {
    return pathname === path
      ? 'text-primary-600 font-medium border-b-2 border-primary-600'
      : 'text-gray-800 hover:text-primary-600 hover:border-b-2 hover:border-primary-600 transition-colors'
  }

  return (
    <div className="w-full">
      {dbError && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erreur de connexion à la base de données</AlertTitle>
          <AlertDescription>
            Impossible de se connecter à MySQL. Assurez-vous que le serveur de base de données est démarré.
          </AlertDescription>
        </Alert>
      )}
      
      <nav className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex-shrink-0">
              <Link href="/" className="text-xl font-bold text-gray-900">
                Gestion École
              </Link>
            </div>
            
            <div className="flex space-x-8">
              {session ? (
                <>
                  <Link href="/dashboard" className={isActive('/dashboard')}>
                    Tableau de bord
                  </Link>
                  <Link href="/students" className={isActive('/students')}>
                    Élèves
                  </Link>
                  <Link href="/teachers" className={isActive('/teachers')}>
                    Enseignants
                  </Link>
                  <Link href="/classes" className={isActive('/classes')}>
                    Classes
                  </Link>
                  <Link href="/courses" className={isActive('/courses')}>
                    Matières
                  </Link>
                  <Link href="/course-sessions" className={isActive('/course-sessions')}>
                    Séances
                  </Link>
                  <Link href="/grades" className={isActive('/grades')}>
                    Notes
                  </Link>
                </>
              ) : null}
            </div>
            
            <div className="flex items-center gap-4">
              <ThemeToggle />
              {session ? (
                <div className="flex items-center gap-4">
                  <span className="text-gray-800">
                    {session.user.firstName} {session.user.lastName}
                  </span>
                  <Button variant="outline" onClick={() => signOut()}>
                    Déconnexion
                  </Button>
                </div>
              ) : (
                <Button onClick={() => signIn()}>Connexion</Button>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
} 