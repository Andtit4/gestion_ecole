'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Student {
  id: string
  firstName: string
  lastName: string
  email: string
}

interface ParentFormProps {
  parentId?: string
  onClose?: () => void
}

export default function ParentForm({ parentId, onClose }: ParentFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [students, setStudents] = useState<Student[]>([])
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'PARENT' as const,
  })

  useEffect(() => {
    const initializeForm = async () => {
      setIsLoading(true)
      try {
        await Promise.all([
          fetchStudents(),
          parentId ? fetchParentData() : Promise.resolve()
        ])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue')
      } finally {
        setIsLoading(false)
      }
    }

    initializeForm()
  }, [parentId])

  const fetchStudents = async () => {
    try {
      const response = await fetch('/api/users?role=STUDENT')
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des étudiants')
      }
      const data = await response.json()
      setStudents(data)
    } catch (err) {
      console.error('Erreur lors du chargement des étudiants:', err)
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    }
  }

  const fetchParentData = async () => {
    if (!parentId) return

    try {
      // Récupérer les données du parent
      const parentResponse = await fetch(`/api/users/${parentId}`)
      if (!parentResponse.ok) {
        throw new Error('Erreur lors du chargement des données du parent')
      }
      const parentData = await parentResponse.json()
      setFormData({
        firstName: parentData.firstName || '',
        lastName: parentData.lastName || '',
        email: parentData.email || '',
        password: '', // Ne pas afficher le mot de passe
        role: 'PARENT',
      })

      // Récupérer les enfants associés au parent
      const childrenResponse = await fetch(`/api/parents/${parentId}/children`)
      if (childrenResponse.ok) {
        const childrenData = await childrenResponse.json()
        setSelectedStudents(childrenData.map((child: Student) => child.id))
      }
    } catch (err) {
      console.error('Erreur lors du chargement des données du parent:', err)
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // 1. Créer ou mettre à jour le parent
      const url = parentId ? `/api/users/${parentId}` : '/api/users'
      const method = parentId ? 'PUT' : 'POST'

      const payload = {
        ...formData,
        // Ne pas envoyer le mot de passe s'il est vide et que c'est une mise à jour
        ...(parentId && formData.password === '' ? { password: undefined } : {})
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.message || 'Erreur lors de l\'enregistrement du parent')
      }

      const parentData = await response.json()

      // 2. Associer les enfants au parent
      if (selectedStudents.length > 0) {
        const associateResponse = await fetch(`/api/parents/${parentData.id}/children`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ childrenIds: selectedStudents }),
        })

        if (!associateResponse.ok) {
          throw new Error('Erreur lors de l\'association des enfants au parent')
        }
      }

      if (onClose) {
        onClose()
      } else {
        router.push('/admin/parents')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectStudent = (studentId: string) => {
    setSelectedStudents(prev => 
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    )
  }

  if (isLoading && !formData.firstName) {
    return <div>Chargement en cours...</div>
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        {parentId ? 'Modifier le parent' : 'Ajouter un nouveau parent'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
              Prénom
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
              Nom
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            {parentId ? 'Nouveau mot de passe (laisser vide pour ne pas changer)' : 'Mot de passe'}
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required={!parentId}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enfants associés
          </label>
          <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-md p-2">
            {students.length > 0 ? (
              students.map((student) => (
                <div key={student.id} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id={`student-${student.id}`}
                    checked={selectedStudents.includes(student.id)}
                    onChange={() => handleSelectStudent(student.id)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label 
                    htmlFor={`student-${student.id}`}
                    className="ml-2 block text-sm text-gray-900"
                  >
                    {student.lastName} {student.firstName} ({student.email})
                  </label>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">Aucun étudiant disponible</p>
            )}
          </div>
        </div>

        {error && (
          <div className="text-red-600 text-sm">{error}</div>
        )}

        <div className="flex justify-end space-x-4">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Annuler
            </button>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
          >
            {isLoading ? 'Enregistrement...' : parentId ? 'Modifier' : 'Ajouter'}
          </button>
        </div>
      </form>
    </div>
  )
} 