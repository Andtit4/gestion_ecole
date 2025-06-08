'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, User, Lock, School, BookOpen, Users, GraduationCap } from 'lucide-react'

export default function HomePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl
      })

      if (result?.error) {
        setError('Email ou mot de passe incorrect')
      } else if (result?.ok) {
        router.push(callbackUrl)
        router.refresh()
      }
    } catch (error) {
      setError('Une erreur est survenue lors de la connexion')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex">
      {/* Section gauche - Illustration et information */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 relative overflow-hidden">
        {/* Motifs décoratifs */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-40 -left-40 w-80 h-80 rounded-full bg-white blur-3xl"></div>
          <div className="absolute top-1/2 -right-20 w-64 h-64 rounded-full bg-white blur-2xl"></div>
          <div className="absolute -bottom-32 left-1/3 w-96 h-96 rounded-full bg-white blur-3xl"></div>
        </div>
        
        <div className="relative z-10 flex flex-col justify-center px-12 py-16 text-white">
          <div className="mb-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mr-4">
                <School className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold">GestionÉcole</h1>
            </div>
            <h2 className="text-4xl font-bold leading-tight mb-6">
              Gérez votre établissement scolaire en toute simplicité
            </h2>
            <p className="text-xl text-blue-100 leading-relaxed">
              Une solution complète pour la gestion des étudiants, enseignants, notes et présences. 
              Simplifiez votre administration scolaire avec nos outils modernes.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mr-4">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Gestion Multi-rôles</h3>
                <p className="text-blue-100">Administrateurs, enseignants, étudiants et parents</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mr-4">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Suivi Académique</h3>
                <p className="text-blue-100">Notes, présences et bulletins automatisés</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mr-4">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Interface Moderne</h3>
                <p className="text-blue-100">Design intuitif et responsive</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section droite - Formulaire de connexion */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* En-tête mobile */}
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mr-3">
                <School className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">GestionÉcole</h1>
            </div>
            <p className="text-gray-600">Connectez-vous à votre compte</p>
          </div>

          {/* En-tête desktop */}
          <div className="hidden lg:block text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Connexion</h2>
            <p className="text-gray-600">Accédez à votre espace personnel</p>
          </div>

          {/* Comptes de démonstration */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <h3 className="text-sm font-semibold text-blue-800 mb-2">Comptes de démonstration</h3>
            <div className="text-xs text-blue-700 space-y-1">
              <div><strong>Admin:</strong> admin@ecole.fr / admin123</div>
              <div><strong>Enseignant:</strong> marie.dupont@ecole.fr / password123</div>
              <div><strong>Parent:</strong> sophie.bernard@email.fr / password123</div>
              <div><strong>Étudiant:</strong> lucas.bernard@ecole.fr / password123</div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
                    placeholder="votre.email@ecole.fr"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Se souvenir de moi
                </label>
              </div>
              <div className="text-sm">
                <Link href="/auth/forgot-password" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                  Mot de passe oublié?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Connexion en cours...
                </>
              ) : (
                'Se connecter'
              )}
            </button>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Nouveau sur la plateforme?{' '}
                <Link href="/auth/register" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                  Contactez l'administration
                </Link>
              </p>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-center text-xs text-gray-500">
              © 2024 GestionÉcole. Plateforme sécurisée de gestion scolaire.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 


