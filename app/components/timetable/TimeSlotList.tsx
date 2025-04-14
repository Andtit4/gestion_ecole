/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { DayOfWeek, TimeSlot, dayOfWeekLabels } from '@/app/types'
import TimeSlotForm from './TimeSlotForm'
import LoadingSpinner from '../ui/LoadingSpinner'

export default function TimeSlotList() {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [loading, setLoading] = useState(true)
  const [editingTimeSlot, setEditingTimeSlot] = useState<TimeSlot | null>(null)

  useEffect(() => {
    fetchTimeSlots()
  }, [])

  const fetchTimeSlots = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/timetable/timeslots')
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des créneaux horaires')
      }
      const data = await response.json()
      setTimeSlots(data)
    } catch (error) {
      console.error('Erreur:', error)
      toast.error('Erreur lors de la récupération des créneaux horaires')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce créneau horaire ?')) {
      return
    }

    try {
      const response = await fetch(`/api/timetable/timeslots/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Erreur lors de la suppression')
      }

      setTimeSlots(timeSlots.filter(timeSlot => timeSlot.id !== id))
      toast.success('Créneau horaire supprimé avec succès')
    } catch (error) {
      console.error('Erreur:', error)
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la suppression')
    }
  }

  const formatTime = (time: string) => {
    // Si c'est déjà au format ISO, extraire l'heure et les minutes
    if (time.includes('T')) {
      const date = new Date(time);
      return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    }
    // Sinon, extraire HH:MM comme avant (cas de chaîne simple)
    return time.substring(0, 5);
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div>
      {editingTimeSlot && (
        <div className="mb-6">
          <TimeSlotForm 
            timeSlot={editingTimeSlot} 
            onClose={() => {
              setEditingTimeSlot(null)
              fetchTimeSlots()
            }} 
          />
        </div>
      )}

      {timeSlots.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-lg shadow">
          <p className="text-gray-500">Aucun créneau horaire a été défini</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 shadow-sm rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jour
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Début
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fin
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {timeSlots.map((timeSlot) => (
                <tr key={timeSlot.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {dayOfWeekLabels[timeSlot.dayOfWeek]}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatTime(timeSlot.startTime)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatTime(timeSlot.endTime)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => setEditingTimeSlot(timeSlot)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(timeSlot.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Supprimer
                    </button>
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