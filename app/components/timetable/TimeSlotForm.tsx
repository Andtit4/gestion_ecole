'use client'

import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { DayOfWeek, TimeSlot } from '@/types'

type TimeSlotFormProps = {
  timeSlot?: TimeSlot
  onClose: () => void
}

export default function TimeSlotForm({ timeSlot, onClose }: TimeSlotFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    dayOfWeek: timeSlot?.dayOfWeek || 'MONDAY',
    startTime: timeSlot?.startTime || '08:00',
    endTime: timeSlot?.endTime || '09:00',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const url = timeSlot ? `/api/timetable/timeslots/${timeSlot.id}` : '/api/timetable/timeslots'
      const method = timeSlot ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Une erreur est survenue')
      }

      toast.success(timeSlot ? 'Créneau horaire modifié avec succès' : 'Créneau horaire ajouté avec succès')
      onClose()
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du créneau horaire:', error)
      toast.error(error instanceof Error ? error.message : 'Une erreur est survenue')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-4">
        {timeSlot ? 'Modifier le créneau horaire' : 'Ajouter un créneau horaire'}
      </h2>
      
      <div className="mb-4">
        <label htmlFor="dayOfWeek" className="block text-sm font-medium text-gray-700 mb-1">
          Jour de la semaine
        </label>
        <select
          id="dayOfWeek"
          name="dayOfWeek"
          value={formData.dayOfWeek}
          onChange={handleChange}
          className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          required
        >
          <option value="MONDAY">Lundi</option>
          <option value="TUESDAY">Mardi</option>
          <option value="WEDNESDAY">Mercredi</option>
          <option value="THURSDAY">Jeudi</option>
          <option value="FRIDAY">Vendredi</option>
          <option value="SATURDAY">Samedi</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="mb-4">
          <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
            Heure de début
          </label>
          <input
            type="time"
            id="startTime"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
            Heure de fin
          </label>
          <input
            type="time"
            id="endTime"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 mt-6">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isSubmitting ? 'Enregistrement...' : timeSlot ? 'Modifier' : 'Ajouter'}
        </button>
      </div>
    </form>
  )
} 


