'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/app/components/ui/button'

interface PeriodFormProps {
  periodId?: string | null
  onClose: () => void
}

interface PeriodData {
  type: string
  startDate: string
  endDate: string
  schoolYear: string
  status: string
}

export default function PeriodForm({ periodId, onClose }: PeriodFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState<PeriodData>({
    type: '',
    startDate: '',
    endDate: '',
    schoolYear: '',
    status: 'upcoming'
  })

  useEffect(() => {
    if (periodId) {
      fetchPeriodData()
    } else {
      // Initialiser avec l'année scolaire actuelle
      const currentYear = new Date().getFullYear()
      const nextYear = currentYear + 1
      setFormData(prev => ({
        ...prev,
        schoolYear: `${currentYear}-${nextYear}`
      }))
    }
  }, [periodId])

  const fetchPeriodData = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/periods/${periodId}`)
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des données de la période')
      }
      const data = await response.json()
      
      // Formatter les dates pour l'input date (YYYY-MM-DD)
      const formatDateForInput = (dateString: string) => {
        const date = new Date(dateString)
        return date.toISOString().split('T')[0]
      }
      
      setFormData({
        type: data.type,
        startDate: formatDateForInput(data.startDate),
        endDate: formatDateForInput(data.endDate),
        schoolYear: data.schoolYear,
        status: data.status
      })
    } catch (err) {
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
      const url = periodId 
        ? `/api/periods/${periodId}` 
        : '/api/periods'
      
      const method = periodId ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Erreur lors de l\'enregistrement de la période')
      }

      onClose()
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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          {periodId ? 'Modifier la période' : 'Ajouter une période'}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-400 hover:text-gray-500 transition-colors focus:outline-none"
          aria-label="Fermer"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1">
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">
            Type de période<span className="text-red-500 ml-1">*</span>
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
          >
            <option value="">Sélectionner un type</option>
            <option value="Trimestre 1">Trimestre 1</option>
            <option value="Trimestre 2">Trimestre 2</option>
            <option value="Trimestre 3">Trimestre 3</option>
            <option value="Semestre 1">Semestre 1</option>
            <option value="Semestre 2">Semestre 2</option>
            <option value="Année complète">Année complète</option>
          </select>
        </div>

        <div className="space-y-1">
          <label htmlFor="schoolYear" className="block text-sm font-medium text-gray-700">
            Année scolaire<span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="text"
            id="schoolYear"
            name="schoolYear"
            value={formData.schoolYear}
            onChange={handleChange}
            placeholder="ex: 2023-2024"
            required
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
          />
          <p className="text-xs text-gray-500 mt-1">Format: AAAA-AAAA (ex: 2023-2024)</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
              Date de début<span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
              Date de fin<span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Statut<span className="text-red-500 ml-1">*</span>
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
          >
            <option value="upcoming">À venir</option>
            <option value="active">Active</option>
            <option value="completed">Terminée</option>
          </select>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center text-sm">
            <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
            </svg>
            <span>{error}</span>
          </div>
        )}

        <div className="flex justify-end space-x-4 pt-4 border-t border-gray-100 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="hover:bg-gray-50 transition-colors"
          >
            Annuler
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="relative"
          >
            {isLoading ? (
              <>
                <span className="opacity-0">{periodId ? 'Modifier' : 'Ajouter'}</span>
                <span className="absolute inset-0 flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
              </>
            ) : (
              periodId ? 'Modifier' : 'Ajouter'
            )}
          </Button>
        </div>
      </form>
    </div>
  )
} 