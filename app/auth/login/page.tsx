import { Metadata } from 'next'
import LoginForm from '../../components/auth/LoginForm'

export const metadata: Metadata = {
  title: 'Connexion - Gestion École',
  description: 'Connectez-vous à votre compte Gestion École',
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white shadow-lg rounded-xl p-8 border border-gray-100">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-blue-600 mb-2">EcoleGestion</h1>
            <h2 className="text-2xl font-bold text-gray-900">
              Connexion à votre compte
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Accédez à votre espace personnel de gestion scolaire
            </p>
          </div>
          <LoginForm />
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              &copy; {new Date().getFullYear()} EcoleGestion - Tous droits réservés
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 