import { Metadata } from 'next'
import LoginForm from './components/auth/LoginForm'

export const metadata: Metadata = {
  title: 'Connexion - Gestion École',
  description: 'Connectez-vous à votre compte Gestion École',
}

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-100">
      {/* Header avec présentation */}
      <div className="text-center py-12">
        <h1 className="text-5xl font-bold text-gray-900">
          <span className="text-blue-600">Ecole</span>Gestion
        </h1>
        <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
          Une solution complète pour la gestion de votre établissement scolaire
        </p>
      </div>
      
      {/* Formulaire de connexion */}
      <div className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="bg-white shadow-xl rounded-xl p-8 border border-gray-200">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900">
                Connexion à votre compte
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Accédez à votre espace personnel de gestion scolaire
              </p>
            </div>
            <LoginForm />
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="py-8 text-center">
        <p className="text-sm text-gray-500">
          &copy; {new Date().getFullYear()} EcoleGestion - Tous droits réservés
        </p>
      </div>
    </div>
  )
} 