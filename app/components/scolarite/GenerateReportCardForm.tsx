'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/app/components/ui/button'

interface GenerateReportCardFormProps {
  onClose: () => void
}

export default function GenerateReportCardForm({ onClose }: GenerateReportCardFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [periods, setPeriods] = useState<{id: string, type: string, schoolYear: string}[]>([])
  const [classes, setClasses] = useState<{id: string, name: string}[]>([])
  const [selectedPeriod, setSelectedPeriod] = useState('')
  const [selectedClass, setSelectedClass] = useState('')
  const [generateForAllStudents, setGenerateForAllStudents] = useState(false)

  useEffect(() => {
    fetchPeriods()
    fetchClasses()
  }, [])

  const fetchPeriods = async () => {
    try {
      const response = await fetch('/api/periods')
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des périodes')
      }
      const data = await response.json()
      
      // Filtrer les périodes actives ou terminées
      const activePeriods = data.filter((p: any) => 
        p.status === 'active' || p.status === 'completed'
      )
      
      setPeriods(activePeriods)
      if (activePeriods.length > 0) {
        setSelectedPeriod(activePeriods[0].id)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    }
  }

  const fetchClasses = async () => {
    try {
      const response = await fetch('/api/classes')
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des classes')
      }
      const data = await response.json()
      setClasses(data)
      if (data.length > 0) {
        setSelectedClass(data[0].id)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    if (!selectedPeriod) {
      setError('Veuillez sélectionner une période')
      setIsLoading(false)
      return
    }

    if (!generateForAllStudents && !selectedClass) {
      setError('Veuillez sélectionner une classe ou générer pour tous les élèves')
      setIsLoading(false)
      return
    }

    try {
      // Construire les paramètres
      const params: any = {
        periodId: selectedPeriod
      }
      
      if (!generateForAllStudents) {
        params.classId = selectedClass
      }

      const response = await fetch('/api/report-cards/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Erreur lors de la génération des bulletins')
      }

      const data = await response.json()
      setSuccess(`${data.count} bulletin(s) généré(s) avec succès.`)
      
      // Fermer automatiquement après 2 secondes
      setTimeout(() => {
        onClose()
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Générer des bulletins</h2>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-400 hover:text-gray-500"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="period" className="block text-sm font-medium text-gray-700 mb-1">
            Période
          </label>
          <select
            id="period"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            required
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Sélectionner une période</option>
            {periods.map(period => (
              <option key={period.id} value={period.id}>
                {period.type} ({period.schoolYear})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center mb-2">
          <input
            type="checkbox"
            id="generateForAll"
            checked={generateForAllStudents}
            onChange={(e) => setGenerateForAllStudents(e.target.checked)}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="generateForAll" className="ml-2 block text-sm text-gray-900">
            Générer pour tous les élèves
          </label>
        </div>

        {!generateForAllStudents && (
          <div>
            <label htmlFor="class" className="block text-sm font-medium text-gray-700 mb-1">
              Classe
            </label>
            <select
              id="class"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              disabled={generateForAllStudents}
              required={!generateForAllStudents}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-gray-100 disabled:text-gray-500"
            >
              <option value="">Sélectionner une classe</option>
              {classes.map(cls => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}

        {success && (
          <div className="text-green-500 text-sm">{success}</div>
        )}

        <div className="flex justify-end space-x-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Génération en cours...' : 'Générer les bulletins'}
          </Button>
        </div>
      </form>
    </div>
  )
} 