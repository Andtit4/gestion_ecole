'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
// import ClassForm from '@/components/classes/ClassForm'
// import LoadingSpinner from '@/components/ui/LoadingSpinner'
import ClassForm from '@/app/components/classes/ClassForm'
import LoadingSpinner from '@/app/components/ui/LoadingSpinner'

interface Class {
  id: string
  name: string
  level: string
  year: number
  teacherId: string
  teacher: {
    firstName: string
    lastName: string
  }
  students: {
    id: string
    firstName: string
    lastName: string
    email: string
  }[]
}

export default function ClassDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [classe, setClasse] = useState<Class | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    fetchClassDetails()
  }, [params.id])

  const fetchClassDetails = async () => {
    try {
      const response = await fetch(`/api/classes/${params.id}`)
      if (!response.ok) {
        throw new Error('Erreur lors du chargement de la classe')
      }
      const data = await response.json()
      setClasse(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/classes/${params.id}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error('Erreur lors de la suppression de la classe')
      }
      router.push('/admin/classes')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    }
  }

  if (status === 'loading' || isLoading) {
    return <LoadingSpinner />
  }

  if (!session || session.user.role !== 'ADMIN') {
    return <div>Accès non autorisé</div>
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  if (!classe) {
    return <div>Classe non trouvée</div>
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {!isEditing ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold text-gray-900">
                Détails de la classe : {classe.name}
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
                    <dt className="text-sm font-medium text-gray-500">Niveau</dt>
                    <dd className="mt-1 text-sm text-gray-900">{classe.level}</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Année scolaire</dt>
                    <dd className="mt-1 text-sm text-gray-900">{classe.year}</dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">Professeur principal</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {classe.teacher.firstName} {classe.teacher.lastName}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg font-medium text-gray-900">Liste des élèves</h3>
                <div className="mt-4">
                  {classe.students.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                      {classe.students.map((student) => (
                        <li key={student.id} className="py-4">
                          <div className="flex items-center space-x-4">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {student.firstName} {student.lastName}
                              </p>
                              <p className="text-sm text-gray-500 truncate">
                                {student.email}
                              </p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">Aucun élève dans cette classe</p>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          <ClassForm
            classId={params.id}
            onClose={() => {
              setIsEditing(false)
              fetchClassDetails()
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
                Êtes-vous sûr de vouloir supprimer cette classe ? Cette action est irréversible.
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