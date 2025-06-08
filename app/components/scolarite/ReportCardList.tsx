'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'
import GenerateReportCardForm from './GenerateReportCardForm'

interface ReportCard {
  id: string
  periodId: string
  studentId: string
  average: number
  appreciation?: string
  generatedAt: string
  status: string
  period: {
    type: string
    schoolYear: string
  }
  student: {
    user: {
      firstName: string
      lastName: string
    }
    class?: {
      name: string
    }
  }
}

export default function ReportCardList() {
  const [reportCards, setReportCards] = useState<ReportCard[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isGenerateFormOpen, setIsGenerateFormOpen] = useState(false)
  const [viewReportCardId, setViewReportCardId] = useState<string | null>(null)
  
  // Filtres
  const [selectedPeriod, setSelectedPeriod] = useState<string>('')
  const [selectedClass, setSelectedClass] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [periods, setPeriods] = useState<{id: string, type: string, schoolYear: string}[]>([])
  const [classes, setClasses] = useState<{id: string, name: string}[]>([])

  useEffect(() => {
    fetchReportCards()
    fetchPeriods()
    fetchClasses()
  }, [])

  const fetchPeriods = async () => {
    try {
      const response = await fetch('/api/periods')
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des p�riodes')
      }
      const data = await response.json()
      setPeriods(data)
    } catch (err) {
      console.error('Erreur lors du chargement des p�riodes:', err)
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
    } catch (err) {
      console.error('Erreur lors du chargement des classes:', err)
    }
  }

  const fetchReportCards = async () => {
    try {
      setIsLoading(true)
      
      // Construire l'URL avec les filtres
      let url = '/api/report-cards'
      const params = new URLSearchParams()
      if (selectedPeriod) params.append('periodId', selectedPeriod)
      if (selectedClass) params.append('classId', selectedClass)
      if (searchQuery) params.append('search', searchQuery)
      
      if (params.toString()) {
        url += `?${params.toString()}`
      }
      
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des bulletins')
      }
      const data = await response.json()
      setReportCards(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerateClose = () => {
    setIsGenerateFormOpen(false)
    fetchReportCards()
  }

  const handleFiltersChange = () => {
    fetchReportCards()
  }

  const resetFilters = () => {
    setSelectedPeriod('')
    setSelectedClass('')
    setSearchQuery('')
    fetchReportCards()
  }

  const handleViewReportCard = (id: string) => {
    setViewReportCardId(id)
    // Ici, on pourrait ouvrir un modal ou rediriger vers une page d�taill�e
    window.open(`/report-cards/${id}`, '_blank')
  }

  const handlePublishReportCard = async (id: string) => {
    try {
      const response = await fetch(`/api/report-cards/${id}/publish`, {
        method: 'PUT'
      })
      if (!response.ok) {
        throw new Error('Erreur lors de la publication du bulletin')
      }
      
      // Mettre � jour l'�tat local
      setReportCards(reportCards.map(rc => 
        rc.id === id ? {...rc, status: 'published'} : rc
      ))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'draft': return 'bg-yellow-100 text-yellow-800 border border-yellow-200'
      case 'published': return 'bg-green-100 text-green-800 border border-green-200'
      case 'archived': return 'bg-gray-100 text-gray-800 border border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border border-gray-200'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status.toLowerCase()) {
      case 'draft': return 'Brouillon'
      case 'published': return 'Publi�'
      case 'archived': return 'Archiv�'
      default: return status
    }
  }

  if (isLoading && !reportCards.length) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <span className="ml-3 text-gray-600">Chargement en cours...</span>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h2 className="text-xl font-semibold text-gray-800">Bulletins scolaires</h2>
        <Button 
          onClick={() => setIsGenerateFormOpen(true)}
          className="shadow-sm hover:shadow-md transition-all"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          G�n�rer des bulletins
        </Button>
      </div>

      {/* Filtres */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-8 shadow-sm">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Filtres de recherche</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="periodFilter" className="block text-sm font-medium text-gray-700 mb-1">
              P�riode
            </label>
            <select
              id="periodFilter"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
            >
              <option value="">Toutes les p�riodes</option>
              {periods.map(period => (
                <option key={period.id} value={period.id}>
                  {period.type} ({period.schoolYear})
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="classFilter" className="block text-sm font-medium text-gray-700 mb-1">
              Classe
            </label>
            <select
              id="classFilter"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
            >
              <option value="">Toutes les classes</option>
              {classes.map(cls => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="searchQuery" className="block text-sm font-medium text-gray-700 mb-1">
              Recherche
            </label>
            <input
              type="text"
              id="searchQuery"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Nom ou pr�nom de l'�l�ve"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
            />
          </div>
          
          <div className="flex items-end space-x-2">
            <Button
              onClick={handleFiltersChange}
              className="flex-1 shadow-sm"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
              </svg>
              Filtrer
            </Button>
            <Button
              variant="outline"
              onClick={resetFilters}
              className="hover:bg-gray-50"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              R�initialiser
            </Button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center mb-6">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
          </svg>
          {error}
        </div>
      )}

      {reportCards.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun bulletin trouv�</h3>
          <p className="mt-1 text-sm text-gray-500">Utilisez le bouton "G�n�rer des bulletins" pour en cr�er.</p>
          <div className="mt-6">
            <Button 
              onClick={() => setIsGenerateFormOpen(true)}
              className="shadow-sm hover:shadow-md transition-all"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              G�n�rer des bulletins
            </Button>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg border border-gray-200 shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">�l�ve</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Classe</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">P�riode</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Moyenne</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">G�n�r� le</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reportCards.map((reportCard) => (
                <tr key={reportCard.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-medium">
                    {reportCard.student.user.firstName} {reportCard.student.user.lastName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {reportCard.student.class?.name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {reportCard.period.type} ({reportCard.period.schoolYear})
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`font-medium ${reportCard.average >= 10 ? 'text-green-700' : 'text-red-600'}`}>
                      {reportCard.average.toFixed(2)}/20
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {formatDate(reportCard.generatedAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(reportCard.status)}`}>
                      {getStatusLabel(reportCard.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <button
                      onClick={() => handleViewReportCard(reportCard.id)}
                      className="text-indigo-600 hover:text-indigo-900 font-medium inline-flex items-center mr-4 transition-colors"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                      </svg>
                      Voir
                    </button>
                    {reportCard.status === 'draft' && (
                      <button
                        onClick={() => handlePublishReportCard(reportCard.id)}
                        className="text-green-600 hover:text-green-900 font-medium inline-flex items-center transition-colors"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"></path>
                        </svg>
                        Publier
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isGenerateFormOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-indigo-600"></div>
            <div className="p-6">
              <GenerateReportCardForm onClose={handleGenerateClose} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 


