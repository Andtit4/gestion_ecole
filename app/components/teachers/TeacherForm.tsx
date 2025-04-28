'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface TeacherFormProps {
  teacherId?: string
  onClose?: () => void
}

export default function TeacherForm({ teacherId, onClose }: TeacherFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'TEACHER' as const
  })

  useEffect(() => {
    if (teacherId) {
      fetchTeacherData()
    }
  }, [teacherId])

  const fetchTeacherData = async () => {
    if (!teacherId) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/users/${teacherId}`)
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des données de l\'enseignant')
      }
      const data = await response.json()
      setFormData({
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        email: data.email || '',
        password: '', // Ne pas afficher le mot de passe
        role: 'TEACHER'
      })
    } catch (err) {
      console.error('Erreur lors du chargement des données de l\'enseignant:', err)
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const url = teacherId ? `/api/teachers` : '/api/teachers'
      const method = teacherId ? 'PUT' : 'POST'

      const payload = {
        ...formData,
        // Ne pas envoyer le mot de passe s'il est vide et que c'est une mise à jour
        ...(teacherId && formData.password === '' ? { password: undefined } : {})
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
        throw new Error(data.error || 'Erreur lors de l\'enregistrement de l\'enseignant')
      }

      if (onClose) {
        onClose()
      } else {
        router.push('/admin/teachers')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  if (isLoading && !formData.firstName) {
    return <div>Chargement en cours...</div>
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        {teacherId ? 'Modifier l\'enseignant' : 'Ajouter un nouvel enseignant'}
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
            {teacherId ? 'Nouveau mot de passe (laisser vide pour ne pas changer)' : 'Mot de passe'}
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required={!teacherId}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
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
            {isLoading ? 'Enregistrement...' : teacherId ? 'Modifier' : 'Ajouter'}
          </button>
        </div>
      </form>
    </div>
  )
} 