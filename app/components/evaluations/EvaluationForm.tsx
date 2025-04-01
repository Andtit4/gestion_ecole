'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Class {
  id: string
  name: string
}

interface Subject {
  id: string
  name: string
}

interface EvaluationFormProps {
  evaluationId?: string
  classId?: string
  onSuccess?: () => void
}

export default function EvaluationForm({ evaluationId, classId, onSuccess }: EvaluationFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [classes, setClasses] = useState<Class[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    coefficient: 1,
    subjectId: '',
    classId: classId || '',
    maxScore: 20
  })

  useEffect(() => {
    fetchClasses()
    fetchSubjects()
    if (evaluationId) {
      fetchEvaluationData()
    }
  }, [evaluationId])

  const fetchClasses = async () => {
    try {
      const response = await fetch('/api/classes')
      if (response.ok) {
        const data = await response.json()
        setClasses(data)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des classes:', error)
      setErrorMessage('Impossible de charger les classes.')
    }
  }

  const fetchSubjects = async () => {
    try {
      const response = await fetch('/api/subjects')
      if (response.ok) {
        const data = await response.json()
        setSubjects(data)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des matières:', error)
      setErrorMessage('Impossible de charger les matières.')
    }
  }

  const fetchEvaluationData = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/evaluations/${evaluationId}`)
      if (response.ok) {
        const data = await response.json()
        setFormData({
          title: data.title,
          description: data.description || '',
          date: new Date(data.date).toISOString().split('T')[0],
          coefficient: data.coefficient,
          subjectId: data.subjectId,
          classId: data.classId,
          maxScore: data.maxScore
        })
      } else {
        setErrorMessage('Impossible de charger les détails de l\'évaluation.')
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'évaluation:', error)
      setErrorMessage('Une erreur est survenue lors du chargement de l\'évaluation.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'coefficient' || name === 'maxScore' ? parseFloat(value) : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage('')

    try {
      const url = evaluationId 
        ? `/api/evaluations/${evaluationId}` 
        : '/api/evaluations'
      
      const method = evaluationId ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        if (onSuccess) {
          onSuccess()
        } else {
          router.push('/teacher/evaluations')
        }
      } else {
        const error = await response.json()
        setErrorMessage(error.message || 'Une erreur est survenue lors de l\'enregistrement.')
      }
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement:', error)
      setErrorMessage('Une erreur est survenue lors de l\'enregistrement de l\'évaluation.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading && evaluationId) {
    return <div className="text-center p-4">Chargement en cours...</div>
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
      {errorMessage && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <p className="text-red-700">{errorMessage}</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Titre de évaluation
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">
            Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="subjectId" className="block text-sm font-medium text-gray-700">
            Matière
          </label>
          <select
            id="subjectId"
            name="subjectId"
            value={formData.subjectId}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Sélectionner une matière</option>
            {subjects.map(subject => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
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
            required
            disabled={!!classId}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Sélectionner une classe</option>
            {classes.map(cls => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="coefficient" className="block text-sm font-medium text-gray-700">
            Coefficient
          </label>
          <input
            type="number"
            id="coefficient"
            name="coefficient"
            min="1"
            step="0.5"
            value={formData.coefficient}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="maxScore" className="block text-sm font-medium text-gray-700">
            Note maximale
          </label>
          <input
            type="number"
            id="maxScore"
            name="maxScore"
            min="1"
            step="1"
            value={formData.maxScore}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          value={formData.description}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {isLoading ? 'Enregistrement...' : evaluationId ? 'Mettre à jour' : 'Créer l\'évaluation'}
        </button>
      </div>
    </form>
  )
} 