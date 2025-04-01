'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import EvaluationForm from '@/app/components/evaluations/EvaluationForm'

export default function NewEvaluationPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  if (status === 'loading') {
    return <div className="text-center p-4">Chargement en cours...</div>
  }

  if (!session || session.user.role !== 'TEACHER') {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4">
        <p className="text-red-700">Accès non autorisé. Vous devez être connecté en tant qu'enseignant.</p>
      </div>
    )
  }

  const handleSuccess = () => {
    router.push('/teacher/evaluations')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">
          Créer une nouvelle évaluation
        </h1>
        <Link
          href="/teacher/evaluations"
          className="text-sm font-medium text-blue-600 hover:text-blue-500"
        >
          Retour aux évaluations
        </Link>
      </div>

      <EvaluationForm onSuccess={handleSuccess} />
    </div>
  )
} 