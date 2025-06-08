'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import StudentForm from '@/components/students/StudentForm'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { use } from 'react'

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: string
  classId?: string
  class?: {
    id: string
    name: string
    level: string
  }
}

export default function StudentDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [student, setStudent] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  
  // Utiliser React.use pour résoudre la Promise de params
  const resolvedParams = use(params)
  const studentId = resolvedParams.id || ''

  useEffect(() => {
    if (studentId) {
      fetchStudentDetails()
    }
  }, [studentId])

  const fetchStudentDetails = async () => {
    try {
      const response = await fetch(`/api/users/${studentId}`)
      if (!response.ok) {
        throw new Error('Erreur lors du chargement de l\'étudiant')
      }
      const data = await response.json()
      setStudent(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/users/${studentId}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error('Erreur lors de la suppression de l\'étudiant')
      }
      router.push('/admin/students')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    }
  }

  if (status === 'loading' || isLoading) {
    return <LoadingSpinner />
  }

  if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'TEACHER')) {
    return <div>Accès non autorisé</div>
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  if (!student) {
    return <div>Étudiant non trouvé</div>
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {!isEditing ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold text-gray-900">
                Détails de l'étudiant : {student.firstName} {student.lastName}
              </h1>
              <div className="flex space-x-4">
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                  Modifier
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                >
                  Supprimer
                </button>
              </div>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Prénom</dt>
                    <dd className="mt-1 text-sm text-gray-900">{student.firstName}</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Nom</dt>
                    <dd className="mt-1 text-sm text-gray-900">{student.lastName}</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                    <dd className="mt-1 text-sm text-gray-900">{student.email}</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Classe</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {student.class ? `${student.class.name} (${student.class.level})` : 'Non assigné'}
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Ici on pourrait ajouter des sections pour les notes, présences, etc. */}
              <div className="px-4 py-5 sm:px-6 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Notes récentes</h3>
                <p className="text-gray-600">Aucune donnée d'évaluation trouvée pour cet élève.</p>
              </div>
              
              <div className="px-4 py-5 sm:px-6 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Présences</h3>
                <p className="mt-2 text-sm text-gray-500">Fonctionnalité à venir...</p>
              </div>
            </div>
          </>
        ) : (
          <StudentForm
            studentId={studentId}
            onClose={() => {
              setIsEditing(false)
              fetchStudentDetails()
            }}
          />
        )}

        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-xl">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Confirmer la suppression
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Êtes-vous sûr de vouloir supprimer cet étudiant ? Cette action est irréversible et supprimera également toutes ses notes et présences.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 