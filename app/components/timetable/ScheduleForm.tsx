'use client'

import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { DayOfWeek } from '@prisma/client'

type TimeSlot = {
  id: string
  dayOfWeek: DayOfWeek
  startTime: string
  endTime: string
}

type Course = {
  id: string
  name: string
}

type Teacher = {
  id: string
  name: string
}

type ScheduleEntry = {
  id: string
  classId: string
  courseId: string
  teacherId: string
  timeSlotId: string
  room: string
  course: Course
  teacher: Teacher
  timeSlot: TimeSlot
}

type ScheduleFormProps = {
  classId: string
  timeSlots: TimeSlot[]
  courses: Course[]
  teachers: Teacher[]
  schedule?: ScheduleEntry
  onClose: () => void
}

const dayLabels: Record<DayOfWeek, string> = {
  MONDAY: 'Lundi',
  TUESDAY: 'Mardi',
  WEDNESDAY: 'Mercredi',
  THURSDAY: 'Jeudi',
  FRIDAY: 'Vendredi',
  SATURDAY: 'Samedi',
  SUNDAY: 'Dimanche'
}

export default function ScheduleForm({
  classId,
  timeSlots,
  courses,
  teachers,
  schedule,
  onClose
}: ScheduleFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    courseId: schedule?.courseId || '',
    teacherId: schedule?.teacherId || '',
    timeSlotId: schedule?.timeSlotId || '',
    room: schedule?.room || '',
  })
  
  const [filteredTimeSlots, setFilteredTimeSlots] = useState<TimeSlot[]>([])
  const [selectedDay, setSelectedDay] = useState<DayOfWeek | ''>('')

  useEffect(() => {
    // Si on édite un emploi du temps existant, sélectionner le jour correspondant
    if (schedule?.timeSlot) {
      setSelectedDay(schedule.timeSlot.dayOfWeek)
      setFilteredTimeSlots(
        timeSlots.filter(ts => ts.dayOfWeek === schedule.timeSlot.dayOfWeek)
      )
    }
  }, [schedule, timeSlots])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleDayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedDay = e.target.value as DayOfWeek | ''
    setSelectedDay(selectedDay)
    setFormData(prev => ({ ...prev, timeSlotId: '' }))
    
    if (selectedDay) {
      setFilteredTimeSlots(timeSlots.filter(ts => ts.dayOfWeek === selectedDay))
    } else {
      setFilteredTimeSlots([])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.courseId || !formData.teacherId || !formData.timeSlotId || !formData.room) {
      toast.error('Tous les champs sont requis')
      return
    }
    
    setIsSubmitting(true)
    
    try {
      const url = schedule
        ? `/api/timetable/schedule/${schedule.id}`
        : '/api/timetable/schedule'
      
      const method = schedule ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          classId
        }),
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Une erreur est survenue')
      }
      
      toast.success(
        schedule
          ? 'Emploi du temps mis à jour avec succès'
          : 'Cours ajouté à l\'emploi du temps avec succès'
      )
      
      onClose()
    } catch (error) {
      console.error('Erreur:', error)
      toast.error(error instanceof Error ? error.message : 'Une erreur est survenue')
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatTime = (time: string) => {
    return time.substring(0, 5)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-4">
        {schedule ? 'Modifier le cours' : 'Ajouter un cours'}
      </h2>
      
      <div className="mb-4">
        <label htmlFor="courseId" className="block text-sm font-medium text-gray-700 mb-1">
          Cours
        </label>
        <select
          id="courseId"
          name="courseId"
          value={formData.courseId}
          onChange={handleChange}
          className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          required
        >
          <option value="">Sélectionner un cours</option>
          {courses.map(course => (
            <option key={course.id} value={course.id}>
              {course.name}
            </option>
          ))}
        </select>
      </div>
      
      <div className="mb-4">
        <label htmlFor="teacherId" className="block text-sm font-medium text-gray-700 mb-1">
          Enseignant
        </label>
        <select
          id="teacherId"
          name="teacherId"
          value={formData.teacherId}
          onChange={handleChange}
          className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          required
        >
          <option value="">Sélectionner un enseignant</option>
          {teachers.map(teacher => (
            <option key={teacher.id} value={teacher.id}>
              {teacher.name}
            </option>
          ))}
        </select>
      </div>
      
      <div className="mb-4 grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="dayOfWeek" className="block text-sm font-medium text-gray-700 mb-1">
            Jour
          </label>
          <select
            id="dayOfWeek"
            value={selectedDay}
            onChange={handleDayChange}
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            required
          >
            <option value="">Sélectionner un jour</option>
            {Object.entries(dayLabels).map(([day, label]) => (
              <option key={day} value={day}>
                {label}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="timeSlotId" className="block text-sm font-medium text-gray-700 mb-1">
            Créneau horaire
          </label>
          <select
            id="timeSlotId"
            name="timeSlotId"
            value={formData.timeSlotId}
            onChange={handleChange}
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            required
            disabled={!selectedDay}
          >
            <option value="">Sélectionner un créneau</option>
            {filteredTimeSlots.map(timeSlot => (
              <option key={timeSlot.id} value={timeSlot.id}>
                {formatTime(timeSlot.startTime)} - {formatTime(timeSlot.endTime)}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="mb-4">
        <label htmlFor="room" className="block text-sm font-medium text-gray-700 mb-1">
          Salle
        </label>
        <input
          type="text"
          id="room"
          name="room"
          value={formData.room}
          onChange={handleChange}
          className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          required
          placeholder="Ex: Salle 101"
        />
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
          {isSubmitting ? 'Enregistrement...' : schedule ? 'Modifier' : 'Ajouter'}
        </button>
      </div>
    </form>
  )
} 