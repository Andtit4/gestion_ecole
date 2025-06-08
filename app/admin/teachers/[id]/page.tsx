'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import TeacherForm from '@/components/teachers/TeacherForm'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { use } from 'react'

interface Teacher {
  id: string
  userId: string
  firstName: string
  lastName: string
  email: string
  classes?: {
    id: string
    name: string
    level: string
    year: number
  }[]
}

export default function TeacherDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [teacher, setTeacher] = useState<Teacher | null>(null)
  const [classes, setClasses] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  
  // Utiliser React.use pour résoudre la Promise de params
  const resolvedParams = use(params)
  const teacherId = resolvedParams.id || ''

  useEffect(() => {
    if (teacherId) {
      fetchTeacherDetails()
    }
  }, [teacherId])

  const fetchTeacherDetails = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/teachers/${teacherId}`)
      if (!response.ok) throw new Error('Erreur de chargement')
      
      const data: Teacher = await response.json()
      setTeacher(data)

      // Récupérer les classes associées à l'enseignant
      const classesResponse = await fetch(`/api/teachers/${teacherId}/classes`)
      if (classesResponse.ok) {
        const classesData = await classesResponse.json()
        setClasses(classesData)
      }
    } catch (error) {
      console.error('Erreur:', error)
      setError('Impossible de charger les détails du professeur')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/teachers?id=${teacherId}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error('Erreur lors de la suppression de l\'enseignant')
      }
      router.push('/admin/teachers')
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

  if (!teacher) {
    return <div>Enseignant non trouvé</div>
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {!isEditing ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold text-gray-900">
                Détails de l'enseignant : {teacher.firstName} {teacher.lastName}
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
                    <dd className="mt-1 text-sm text-gray-900">{teacher.firstName}</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Nom</dt>
                    <dd className="mt-1 text-sm text-gray-900">{teacher.lastName}</dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                    <dd className="mt-1 text-sm text-gray-900">{teacher.email}</dd>
                  </div>
                </dl>
              </div>

              <div className="px-4 py-5 sm:px-6 border-t border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Classes assignées</h3>
                </div>
                
                {classes.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Nom
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Niveau
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Année
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {classes.map((cls) => (
                          <tr key={cls.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {cls.name}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">{cls.level}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">{cls.year}</div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-600">Aucune donnée d'évaluation trouvée pour ce professeur.</p>
                )}
              </div>
            </div>
          </>
        ) : (
          <TeacherForm
            teacherId={teacherId}
            onClose={() => {
              setIsEditing(false)
              fetchTeacherDetails()
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
                Êtes-vous sûr de vouloir supprimer cet enseignant ? Cette action est irréversible.
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