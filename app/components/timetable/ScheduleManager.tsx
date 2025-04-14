'use client'

import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import LoadingSpinner from '../ui/LoadingSpinner'
import ScheduleForm from './ScheduleForm'
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

type ScheduleByDay = {
  [key in DayOfWeek]?: ScheduleEntry[]
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

type ScheduleManagerProps = {
  classId: string
}

export default function ScheduleManager({ classId }: ScheduleManagerProps) {
  const [loading, setLoading] = useState(true)
  const [scheduleByDay, setScheduleByDay] = useState<ScheduleByDay>({})
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [isAddingSchedule, setIsAddingSchedule] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState<ScheduleEntry | null>(null)
  const [classInfo, setClassInfo] = useState<{ name: string } | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // Récupérer les informations de la classe
        const classResponse = await fetch(`/api/classes/${classId}`)
        if (classResponse.ok) {
          const classData = await classResponse.json()
          setClassInfo(classData)
        }

        // Récupérer l'emploi du temps
        const scheduleResponse = await fetch(`/api/timetable/schedule/class/${classId}`)
        if (scheduleResponse.ok) {
          const scheduleData: ScheduleEntry[] = await scheduleResponse.json()
          
          // Organiser par jour
          const byDay: ScheduleByDay = {}
          scheduleData.forEach(entry => {
            const day = entry.timeSlot.dayOfWeek
            if (!byDay[day]) {
              byDay[day] = []
            }
            byDay[day]?.push(entry)
          })
          
          // Trier les créneaux pour chaque jour par heure de début
          Object.keys(byDay).forEach(day => {
            byDay[day as DayOfWeek]?.sort((a, b) => 
              a.timeSlot.startTime < b.timeSlot.startTime ? -1 : 1
            )
          })
          
          setScheduleByDay(byDay)
        }

        // Récupérer les créneaux horaires
        const timeSlotsResponse = await fetch('/api/timetable/timeslots')
        if (timeSlotsResponse.ok) {
          const timeSlotsData = await timeSlotsResponse.json()
          setTimeSlots(timeSlotsData)
        }

        // Récupérer les cours
        const coursesResponse = await fetch('/api/courses')
        if (coursesResponse.ok) {
          const coursesData = await coursesResponse.json()
          setCourses(coursesData)
        }

        // Récupérer les enseignants
        const teachersResponse = await fetch('/api/users?role=TEACHER')
        if (teachersResponse.ok) {
          const teachersData = await teachersResponse.json()
          setTeachers(teachersData.map((t: any) => ({ 
            id: t.id, 
            name: `${t.firstName} ${t.lastName}` 
          })))
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error)
        toast.error('Erreur lors du chargement des données')
      } finally {
        setLoading(false)
      }
    }

    if (classId) {
      fetchData()
    }
  }, [classId])

  const handleDeleteSchedule = async (scheduleId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette entrée de l\'emploi du temps ?')) {
      return
    }

    try {
      const response = await fetch(`/api/timetable/schedule/${scheduleId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression')
      }

      // Mettre à jour l'affichage de l'emploi du temps
      const newScheduleByDay = { ...scheduleByDay }
      
      Object.keys(newScheduleByDay).forEach(day => {
        const dayEntries = newScheduleByDay[day as DayOfWeek]
        if (dayEntries) {
          newScheduleByDay[day as DayOfWeek] = dayEntries.filter(entry => entry.id !== scheduleId)
          if (newScheduleByDay[day as DayOfWeek]?.length === 0) {
            delete newScheduleByDay[day as DayOfWeek]
          }
        }
      })
      
      setScheduleByDay(newScheduleByDay)
      toast.success('Entrée supprimée avec succès')
    } catch (error) {
      console.error('Erreur:', error)
      toast.error('Erreur lors de la suppression')
    }
  }

  const refreshSchedule = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/timetable/schedule/class/${classId}`)
      if (response.ok) {
        const scheduleData: ScheduleEntry[] = await response.json()
        
        // Organiser par jour
        const byDay: ScheduleByDay = {}
        scheduleData.forEach(entry => {
          const day = entry.timeSlot.dayOfWeek
          if (!byDay[day]) {
            byDay[day] = []
          }
          byDay[day]?.push(entry)
        })
        
        // Trier les créneaux pour chaque jour par heure de début
        Object.keys(byDay).forEach(day => {
          byDay[day as DayOfWeek]?.sort((a, b) => 
            a.timeSlot.startTime < b.timeSlot.startTime ? -1 : 1
          )
        })
        
        setScheduleByDay(byDay)
      }
    } catch (error) {
      console.error('Erreur lors du rafraîchissement de l\'emploi du temps:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (time: string) => {
    return time.substring(0, 5)
  }

  if (loading) {
    return <LoadingSpinner />
  }

  const sortedDays = Object.keys(scheduleByDay)
    .sort((a, b) => {
      const dayOrder: Record<DayOfWeek, number> = {
        MONDAY: 1,
        TUESDAY: 2,
        WEDNESDAY: 3,
        THURSDAY: 4,
        FRIDAY: 5,
        SATURDAY: 6,
        SUNDAY: 7
      }
      return dayOrder[a as DayOfWeek] - dayOrder[b as DayOfWeek]
    })

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          Emploi du temps - {classInfo?.name || 'Classe sélectionnée'}
        </h2>
        <button
          onClick={() => setIsAddingSchedule(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Ajouter un cours
        </button>
      </div>

      {isAddingSchedule && (
        <div className="mb-6">
          <ScheduleForm
            classId={classId}
            timeSlots={timeSlots}
            courses={courses}
            teachers={teachers}
            onClose={() => {
              setIsAddingSchedule(false)
              refreshSchedule()
            }}
          />
        </div>
      )}

      {editingSchedule && (
        <div className="mb-6">
          <ScheduleForm
            classId={classId}
            timeSlots={timeSlots}
            courses={courses}
            teachers={teachers}
            schedule={editingSchedule}
            onClose={() => {
              setEditingSchedule(null)
              refreshSchedule()
            }}
          />
        </div>
      )}

      {sortedDays.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-lg shadow">
          <p className="text-gray-500">Aucun cours n'a été ajouté à l'emploi du temps</p>
        </div>
      ) : (
        <div>
          {sortedDays.map(day => (
            <div key={day} className="mb-6">
              <h3 className="font-medium text-lg mb-2">{dayLabels[day as DayOfWeek]}</h3>
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Horaire
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cours
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Enseignant
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Salle
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {scheduleByDay[day as DayOfWeek]?.map((entry) => (
                      <tr key={entry.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          {formatTime(entry.timeSlot.startTime)} - {formatTime(entry.timeSlot.endTime)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {entry.course.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {entry.teacher.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {entry.room}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => setEditingSchedule(entry)}
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                          >
                            Modifier
                          </button>
                          <button
                            onClick={() => handleDeleteSchedule(entry.id)}
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
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 