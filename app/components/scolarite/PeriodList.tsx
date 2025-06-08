'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'
import PeriodForm from './PeriodForm'

interface Period {
  id: string
  type: string
  startDate: string
  endDate: string
  schoolYear: string
  status: string
}

export default function PeriodList() {
  const [periods, setPeriods] = useState<Period[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editPeriodId, setEditPeriodId] = useState<string | null>(null)

  useEffect(() => {
    fetchPeriods()
  }, [])

  const fetchPeriods = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/periods')
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des p�riodes')
      }
      const data = await response.json()
      setPeriods(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('�tes-vous s�r de vouloir supprimer cette p�riode?')) return
    
    try {
      const response = await fetch(`/api/periods/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error('Erreur lors de la suppression de la p�riode')
      }
      setPeriods(periods.filter(period => period.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    }
  }

  const handleEdit = (id: string) => {
    setEditPeriodId(id)
    setIsFormOpen(true)
  }

  const handleFormClose = () => {
    setIsFormOpen(false)
    setEditPeriodId(null)
    fetchPeriods()
  }

  const statusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800 border border-green-200'
      case 'completed': return 'bg-blue-100 text-blue-800 border border-blue-200'
      case 'upcoming': return 'bg-yellow-100 text-yellow-800 border border-yellow-200'
      default: return 'bg-gray-100 text-gray-800 border border-gray-200'
    }
  }

  const getStatusLabel = (status: string) => {
    switch(status.toLowerCase()) {
      case 'active': return 'Active'
      case 'completed': return 'Termin�e'
      case 'upcoming': return '� venir'
      default: return status
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <span className="ml-3 text-gray-600">Chargement en cours...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center">
        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
        </svg>
        {error}
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-semibold text-gray-800">Liste des p�riodes</h2>
        <Button 
          onClick={() => setIsFormOpen(true)}
          className="shadow-sm hover:shadow-md transition-all"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Ajouter une p�riode
        </Button>
      </div>

      {periods.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune p�riode d�finie</h3>
          <p className="mt-1 text-sm text-gray-500">Commencez par cr�er une nouvelle p�riode scolaire.</p>
          <div className="mt-6">
            <Button 
              onClick={() => setIsFormOpen(true)}
              className="shadow-sm hover:shadow-md transition-all"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Ajouter une p�riode
            </Button>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg border border-gray-200 shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ann�e scolaire</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date de d�but</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date de fin</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {periods.map((period) => (
                <tr key={period.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-medium">{period.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{period.schoolYear}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{formatDate(period.startDate)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{formatDate(period.endDate)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusBadgeColor(period.status)}`}>
                      {getStatusLabel(period.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <button
                      onClick={() => handleEdit(period.id)}
                      className="text-indigo-600 hover:text-indigo-900 font-medium inline-flex items-center mr-4 transition-colors"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                      </svg>
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(period.id)}
                      className="text-red-600 hover:text-red-900 font-medium inline-flex items-center transition-colors"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isFormOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-indigo-600"></div>
            <div className="p-6">
              <PeriodForm 
                periodId={editPeriodId} 
                onClose={handleFormClose} 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 


