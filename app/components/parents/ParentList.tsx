'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Parent {
  id: string
  firstName: string
  lastName: string
  email: string
  childrenCount?: number
}

export default function ParentList() {
  const router = useRouter()
  const [parents, setParents] = useState<Parent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [parentToDelete, setParentToDelete] = useState<string | null>(null)

  useEffect(() => {
    fetchParents()
  }, [])

  const fetchParents = async () => {
    try {
      const response = await fetch('/api/users?role=PARENT')
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des parents')
      }
      const data = await response.json()
      
      // Récupérer le nombre d'enfants pour chaque parent
      const parentsWithChildrenCount = await Promise.all(
        data.map(async (parent: Parent) => {
          try {
            const childrenResponse = await fetch(`/api/parents/${parent.id}/children`)
            if (childrenResponse.ok) {
              const children = await childrenResponse.json()
              return { ...parent, childrenCount: children.length }
            }
            return { ...parent, childrenCount: 0 }
          } catch (e) {
            return { ...parent, childrenCount: 0 }
          }
        })
      )
      
      setParents(parentsWithChildrenCount)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error('Erreur lors de la suppression du parent')
      }
      setParents(parents.filter(p => p.id !== id))
      setParentToDelete(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    }
  }

  if (isLoading) {
    return <div>Chargement des parents...</div>
  }

  if (error) {
    return <div className="text-red-600">{error}</div>
  }

  return (
    <div className="bg-white shadow-sm rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Liste des parents
          </h3>
          <Link
            href="/admin/parents/new"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Ajouter un parent
          </Link>
        </div>

        <div className="mt-4">
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
                    Nombre d'enfants
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {parents.length > 0 ? (
                  parents.map((parent) => (
                    <tr key={parent.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {parent.lastName} {parent.firstName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{parent.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {parent.childrenCount || 0}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-3">
                          <Link
                            href={`/admin/parents/${parent.id}`}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Détails
                          </Link>
                          <button
                            onClick={() => setParentToDelete(parent.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                      Aucun parent trouvé
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {parentToDelete && (
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
                onClick={() => setParentToDelete(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDelete(parentToDelete)}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 


