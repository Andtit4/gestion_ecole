'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import EvaluationList from '@/app/components/evaluations/EvaluationList'

export default function TeacherEvaluationsPage() {
  const { data: session, status } = useSession()
  const [isAddingEvaluation, setIsAddingEvaluation] = useState(false)

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">
          Gestion des évaluations
        </h1>
        <Link
          href="/teacher/evaluations/new"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Créer une évaluation
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Mes évaluations
        </h2>
        <EvaluationList teacherId={session.user.id} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Statistiques
          </h2>
          <div className="rounded-md bg-yellow-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Information
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    Les statistiques détaillées seront disponibles prochainement. Vous pourrez analyser les performances de vos classes et comparer les résultats entre différentes évaluations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Ressources
          </h2>
          <div className="divide-y divide-gray-200">
            <div className="py-4">
              <h3 className="text-sm font-medium text-gray-900">Guide d'évaluation</h3>
              <p className="mt-1 text-sm text-gray-500">
                Consultez notre guide détaillé sur les bonnes pratiques d'évaluation
              </p>
              <a href="#" className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-500">
                Télécharger le guide
              </a>
            </div>
            <div className="py-4">
              <h3 className="text-sm font-medium text-gray-900">Modèles d'évaluation</h3>
              <p className="mt-1 text-sm text-gray-500">
                Accédez à notre bibliothèque de modèles d'évaluation prêts à l'emploi
              </p>
              <a href="#" className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-500">
                Parcourir les modèles
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 