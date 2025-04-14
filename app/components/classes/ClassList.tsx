'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

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
  _count: {
    students: number
  }
}

export default function ClassList() {
  const router = useRouter()
  const [classes, setClasses] = useState<Class[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [classToDelete, setClassToDelete] = useState<string | null>(null)

  useEffect(() => {
    fetchClasses()
  }, [])

  const fetchClasses = async () => {
    try {
      const response = await fetch('/api/classes')
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des classes')
      }
      const data = await response.json()
      setClasses(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/classes/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error('Erreur lors de la suppression de la classe')
      }
      setClasses(classes.filter(c => c.id !== id))
      setClassToDelete(null)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    }
  }

  if (isLoading) {
    return <div>Chargement des classes...</div>
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  return (
    <>
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul role="list" className="divide-y divide-gray-200">
          {classes.map((classe) => (
            <li key={classe.id}>
              <div className="px-4 py-4 flex items-center justify-between sm:px-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">🏫</div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {classe.name}
                    </h3>
                    <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                      <span>Niveau : {classe.level}</span>
                      <span>Année : {classe.year}</span>
                      <span>
                        Professeur principal : {classe.teacher.firstName || ''}{' '}
                        {classe.teacher.lastName || ''}
                      </span>
                      <span>{classe._count.students} élèves</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-4">
                  <Link
                    href={`/admin/classes/${classe.id}`}
                    className="text-indigo-600 hover:text-indigo-900 font-medium"
                  >
                    Détails
                  </Link>
                  <button
                    onClick={() => setClassToDelete(classe.id)}
                    className="text-red-600 hover:text-red-900 font-medium"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {classToDelete && (
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
                onClick={() => setClassToDelete(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDelete(classToDelete)}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
} 