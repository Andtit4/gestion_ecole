'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/app/components/ui/button'
import { formatDate } from '@/app/lib/utils'

interface AttendanceData {
  id: string
  date: string
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED'
  student: {
    id: string
    user: {
      firstName: string
      lastName: string
    }
    class?: {
      name: string
    }
  }
}

export default function AttendanceOverview() {
  const [attendances, setAttendances] = useState<AttendanceData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  
  // Filtres
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [selectedClass, setSelectedClass] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [classes, setClasses] = useState<{id: string, name: string}[]>([])

  useEffect(() => {
    // Initialiser les dates par défaut (dernier mois)
    const today = new Date()
    const lastMonth = new Date()
    lastMonth.setMonth(today.getMonth() - 1)
    
    setEndDate(today.toISOString().split('T')[0])
    setStartDate(lastMonth.toISOString().split('T')[0])
    
    fetchClasses()
    // Attendons que les filtres soient initialisés avant de charger les données
    setTimeout(() => fetchAttendances(), 100)
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
      console.error('Erreur lors du chargement des classes:', err)
    }
  }

  const fetchAttendances = async () => {
    try {
      setIsLoading(true)
      
      // Construire l'URL avec les filtres
      let url = '/api/attendance'
      const params = new URLSearchParams()
      
      if (startDate) params.append('startDate', startDate)
      if (endDate) params.append('endDate', endDate)
      if (selectedClass) params.append('classId', selectedClass)
      if (selectedStatus) params.append('status', selectedStatus)
      if (searchQuery) params.append('search', searchQuery)
      
      if (params.toString()) {
        url += `?${params.toString()}`
      }
      
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des absences')
      }
      const data = await response.json()
      setAttendances(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFiltersChange = () => {
    fetchAttendances()
  }

  const resetFilters = () => {
    const today = new Date()
    const lastMonth = new Date()
    lastMonth.setMonth(today.getMonth() - 1)
    
    setEndDate(today.toISOString().split('T')[0])
    setStartDate(lastMonth.toISOString().split('T')[0])
    setSelectedClass('')
    setSelectedStatus('')
    setSearchQuery('')
    
    // Attendons que les états soient mis à jour
    setTimeout(() => fetchAttendances(), 100)
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'PRESENT': return 'bg-green-100 text-green-800'
      case 'ABSENT': return 'bg-red-100 text-red-800'
      case 'LATE': return 'bg-yellow-100 text-yellow-800'
      case 'EXCUSED': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PRESENT': return 'Présent'
      case 'ABSENT': return 'Absent'
      case 'LATE': return 'En retard'
      case 'EXCUSED': return 'Excusé'
      default: return status
    }
  }

  const countByStatus = () => {
    const counts = {
      PRESENT: 0,
      ABSENT: 0,
      LATE: 0,
      EXCUSED: 0
    }
    
    attendances.forEach(att => {
      counts[att.status]++
    })
    
    return counts
  }

  if (isLoading && !attendances.length) {
    return <div className="flex justify-center p-4">Chargement en cours...</div>
  }

  const statusCounts = countByStatus()

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Suivi des absences</h2>
        <Button 
          onClick={() => window.open('/admin/attendance/new', '_blank')}
          variant="outline"
        >
          Saisir des absences
        </Button>
      </div>

      {/* Statistiques d'absences */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <div className="text-green-600 text-lg font-semibold">{statusCounts.PRESENT}</div>
          <div className="text-gray-500 text-sm">Présences</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <div className="text-red-600 text-lg font-semibold">{statusCounts.ABSENT}</div>
          <div className="text-gray-500 text-sm">Absences</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <div className="text-yellow-600 text-lg font-semibold">{statusCounts.LATE}</div>
          <div className="text-gray-500 text-sm">Retards</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <div className="text-blue-600 text-lg font-semibold">{statusCounts.EXCUSED}</div>
          <div className="text-gray-500 text-sm">Absences excusées</div>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-gray-50 p-4 rounded-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
              Date de début
            </label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
              Date de fin
            </label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          
          <div>
            <label htmlFor="classFilter" className="block text-sm font-medium text-gray-700 mb-1">
              Classe
            </label>
            <select
              id="classFilter"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Toutes les classes</option>
              {classes.map(cls => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-1">
              Statut
            </label>
            <select
              id="statusFilter"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Tous les statuts</option>
              <option value="PRESENT">Présent</option>
              <option value="ABSENT">Absent</option>
              <option value="LATE">En retard</option>
              <option value="EXCUSED">Excusé</option>
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
              placeholder="Nom ou prénom de l'élève"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          
          <div className="flex items-end space-x-2">
            <Button
              onClick={handleFiltersChange}
              className="flex-1"
            >
              Filtrer
            </Button>
            <Button
              variant="outline"
              onClick={resetFilters}
            >
              Réinitialiser
            </Button>
          </div>
        </div>
      </div>

      {error && (
        <div className="text-red-500 p-4 mb-4">{error}</div>
      )}

      {attendances.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Aucune donnée d'absence trouvée pour les critères sélectionnés.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Élève</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Classe</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {attendances.map((attendance) => (
                <tr key={attendance.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {attendance.student.user.firstName} {attendance.student.user.lastName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {attendance.student.class?.name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatDate(attendance.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(attendance.status)}`}>
                      {getStatusLabel(attendance.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
} 