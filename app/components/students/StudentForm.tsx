'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Class {
  id: string
  name: string
  level: string
}

interface StudentFormProps {
  studentId?: string
  classId?: string
  onClose?: () => void
}

export default function StudentForm({ studentId, classId, onClose }: StudentFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [classes, setClasses] = useState<Class[]>([])
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'STUDENT' as const,
    classId: classId || ''
  })

  useEffect(() => {
    const initializeForm = async () => {
      setIsLoading(true)
      try {
        await Promise.all([
          fetchClasses(),
          studentId ? fetchStudentData() : Promise.resolve()
        ])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue')
      } finally {
        setIsLoading(false)
      }
    }

    initializeForm()
  }, [studentId, classId])

  const fetchClasses = async () => {
    try {
      const response = await fetch('/api/classes')
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des classes')
      }
      const data = await response.json()
      setClasses(data)

      // Si un classId n'est pas fourni mais qu'il y a des classes disponibles
      if (!classId && !formData.classId && data.length > 0) {
        setFormData(prev => ({ ...prev, classId: data[0].id }))
      }
    } catch (err) {
      console.error('Erreur lors du chargement des classes:', err)
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    }
  }

  const fetchStudentData = async () => {
    if (!studentId) return

    try {
      const response = await fetch(`/api/users/${studentId}`)
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des données de l\'élève')
      }
      const data = await response.json()
      setFormData({
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        email: data.email || '',
        password: '', // Ne pas afficher le mot de passe
        role: 'STUDENT',
        classId: data.classId || ''
      })
    } catch (err) {
      console.error('Erreur lors du chargement des données de l\'élève:', err)
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const url = studentId ? `/api/users/${studentId}` : '/api/users'
      const method = studentId ? 'PUT' : 'POST'

      const payload = {
        ...formData,
        // Ne pas envoyer le mot de passe s'il est vide et que c'est une mise à jour
        ...(studentId && formData.password === '' ? { password: undefined } : {})
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
        throw new Error(data.message || 'Erreur lors de l\'enregistrement de l\'élève')
      }

      if (onClose) {
        onClose()
      } else {
        router.push('/admin/students')
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

  if (isLoading && !formData.firstName) {
    return <div>Chargement en cours...</div>
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        {studentId ? 'Modifier l\'élève' : 'Ajouter un nouvel élève'}
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
            {studentId ? 'Nouveau mot de passe (laisser vide pour ne pas changer)' : 'Mot de passe'}
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required={!studentId}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="classId" className="block text-sm font-medium text-gray-700">
            Classe
          </label>
          <select
            id="classId"
            name="classId"
            value={formData.classId}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">-- Sélectionner une classe --</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.level})
              </option>
            ))}
          </select>
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
            {isLoading ? 'Enregistrement...' : studentId ? 'Modifier' : 'Ajouter'}
          </button>
        </div>
      </form>
    </div>
  )
} 


