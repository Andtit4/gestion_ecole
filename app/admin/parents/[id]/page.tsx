'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import ParentForm from '@/components/parents/ParentForm'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { use } from 'react'
import Link from 'next/link'

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: string
}

interface Child {
  id: string
  firstName: string
  lastName: string
  email: string
  classId?: string
  class?: {
    id: string
    name: string
    level: string
  }
}

export default function ParentDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [parent, setParent] = useState<User | null>(null)
  const [children, setChildren] = useState<Child[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  
  // Utiliser React.use pour résoudre la Promise de params
  const resolvedParams = use(params)
  const parentId = resolvedParams.id || ''

  const fetchParentDetails = useCallback(async () => {
    if (!parentId) return
    
    setIsLoading(true)
    try {
      const response = await fetch(`/api/parents/${parentId}`)
      if (!response.ok) throw new Error('Erreur de chargement')
      
      const data = await response.json()
      setParent(data)

      // Récupérer les enfants du parent
      const childrenResponse = await fetch(`/api/parents/${parentId}/children`)
      if (childrenResponse.ok) {
        const childrenData = await childrenResponse.json()
        setChildren(childrenData)
      }
    } catch (error) {
      console.error('Erreur:', error)
      setError('Impossible de charger les détails du parent')
    } finally {
      setIsLoading(false)
    }
  }, [parentId])

  useEffect(() => {
    fetchParentDetails()
  }, [fetchParentDetails])

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/users/${parentId}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error('Erreur lors de la suppression du parent')
      }
      router.push('/admin/parents')
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

  if (!parent) {
    return <div>Parent non trouvé</div>
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {!isEditing ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold text-gray-900">
                Détails du parent : {parent.firstName} {parent.lastName}
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
                    <dd className="mt-1 text-sm text-gray-900">{parent.firstName}</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Nom</dt>
                    <dd className="mt-1 text-sm text-gray-900">{parent.lastName}</dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                    <dd className="mt-1 text-sm text-gray-900">{parent.email}</dd>
                  </div>
                </dl>
              </div>

              <div className="px-4 py-5 sm:px-6 border-t border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Enfants associés</h3>
                </div>
                
                {children.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Nom
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Classe
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {children.map((child) => (
                          <tr key={child.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {child.lastName} {child.firstName}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">{child.email}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">
                                {child.class ? `${child.class.name} (${child.class.level})` : 'Non assigné'}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <Link
                                href={`/admin/students/${child.id}`}
                                className="text-indigo-600 hover:text-indigo-900"
                              >
                                Détails
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Aucun enfant associé à ce parent</p>
                )}
              </div>
            </div>
          </>
        ) : (
          <ParentForm
            parentId={parentId}
            onClose={() => {
              setIsEditing(false)
              fetchParentDetails()
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
                Êtes-vous sûr de vouloir supprimer ce parent ? Cette action est irréversible.
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