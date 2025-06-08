'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface Period {
  id: string
  type: string
  startDate: string
  endDate: string
  schoolYear: string
  isActive: boolean
}

export default function PeriodsManagement() {
  const { data: session } = useSession()
  const [periods, setPeriods] = useState<Period[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({
    type: '',
    startDate: '',
    endDate: '',
    schoolYear: new Date().getFullYear().toString()
  })

  useEffect(() => {
    fetchPeriods()
  }, [])

  const fetchPeriods = async () => {
    try {
      const response = await fetch('/api/periods')
      if (response.ok) {
        const data = await response.json()
        setPeriods(data)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des périodes:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/periods', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setIsCreating(false)
        setFormData({
          type: '',
          startDate: '',
          endDate: '',
          schoolYear: new Date().getFullYear().toString()
        })
        fetchPeriods()
      }
    } catch (error) {
      console.error('Erreur lors de la création de la période:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette période?')) {
      try {
        const response = await fetch(`/api/periods/${id}`, {
          method: 'DELETE',
        })
        if (response.ok) {
          fetchPeriods()
        }
      } catch (error) {
        console.error('Erreur lors de la suppression:', error)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Bouton pour créer une nouvelle période */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Périodes scolaires</h2>
        <button
          onClick={() => setIsCreating(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Ajouter une période
        </button>
      </div>

      {/* Formulaire de création */}
      {isCreating && (
        <div className="bg-white p-6 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-medium mb-4">Nouvelle période</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Type de période
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                required
              >
                <option value="">Sélectionner un type</option>
                <option value="TRIMESTER">Trimestre</option>
                <option value="SEMESTER">Semestre</option>
                <option value="QUARTER">Quatrimestre</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date de début
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date de fin
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Année scolaire
              </label>
              <input
                type="text"
                value={formData.schoolYear}
                onChange={(e) => setFormData({ ...formData, schoolYear: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="2024-2025"
                required
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Créer
              </button>
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Liste des périodes */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {periods.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Aucune période créée</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {periods.map((period) => (
              <li key={period.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center">
                      <h3 className="text-lg font-medium text-gray-900">
                        {period.type} - {period.schoolYear}
                      </h3>
                      {period.isActive && (
                        <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      Du {new Date(period.startDate).toLocaleDateString('fr-FR')} au{' '}
                      {new Date(period.endDate).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(period.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Supprimer
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
} 