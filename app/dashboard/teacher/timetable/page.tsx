'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'react-hot-toast'
import { CalendarIcon, ClockIcon } from '@heroicons/react/24/outline'

interface TimeSlot {
  id: string
  dayOfWeek: string
  startTime: string
  endTime: string
}

interface ScheduleEntry {
  id: string
  room: string
  class: {
    id: string
    name: string
    level: string
  }
  course: {
    id: string
    name: string
  }
  timeslot: TimeSlot
}

const daysOfWeek = {
  'MONDAY': 'Lundi',
  'TUESDAY': 'Mardi',
  'WEDNESDAY': 'Mercredi',
  'THURSDAY': 'Jeudi',
  'FRIDAY': 'Vendredi',
  'SATURDAY': 'Samedi'
}

export default function TeacherTimetablePage() {
  const { data: session, status } = useSession()
  const [schedule, setSchedule] = useState<ScheduleEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [groupedSchedule, setGroupedSchedule] = useState<{[key: string]: ScheduleEntry[]}>({})

  // Fonction pour formater l'heure au format HH:MM
  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
  }

  useEffect(() => {
    const fetchSchedule = async () => {
      if (status !== 'authenticated' || session?.user?.role !== 'TEACHER') {
        return
      }

      try {
        setLoading(true)
        const response = await fetch('/api/timetable/teacher')
        
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération de l\'emploi du temps')
        }
        
        const data = await response.json()
        setSchedule(data)
        
        // Regrouper par jour
        const grouped = data.reduce((acc: {[key: string]: ScheduleEntry[]}, entry: ScheduleEntry) => {
          const day = entry.timeslot.dayOfWeek
          if (!acc[day]) {
            acc[day] = []
          }
          acc[day].push(entry)
          return acc
        }, {})
        
        // Trier chaque journée par heure de début
        Object.keys(grouped).forEach(day => {
          grouped[day].sort((a, b) => {
            const aTime = new Date(a.timeslot.startTime).getTime()
            const bTime = new Date(b.timeslot.startTime).getTime()
            return aTime - bTime
          })
        })
        
        setGroupedSchedule(grouped)
      } catch (error) {
        console.error('Erreur:', error)
        toast.error('Impossible de charger votre emploi du temps')
      } finally {
        setLoading(false)
      }
    }

    fetchSchedule()
  }, [session, status])

  if (status === 'loading' || loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (status === 'unauthenticated' || session?.user?.role !== 'TEACHER') {
    return (
      <Card className="shadow-xl">
        <CardContent className="pt-6">
          <div className="text-center p-6">
            <h2 className="text-xl font-semibold text-gray-800">Accès non autorisé</h2>
            <p className="mt-2 text-gray-600">Vous devez être connecté en tant qu'enseignant pour accéder à cette page.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Mon emploi du temps
      </h1>

      <Tabs defaultValue={Object.keys(groupedSchedule)[0] || "MONDAY"} className="w-full">
        <TabsList className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-8 bg-gray-100 p-1 rounded-lg">
          {Object.entries(daysOfWeek).map(([value, label]) => (
            <TabsTrigger 
              key={value} 
              value={value}
              className={`py-3 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-indigo-700 font-medium`}
            >
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.entries(daysOfWeek).map(([day, label]) => (
          <TabsContent key={day} value={day} className="mt-4">
            <Card className="overflow-hidden border-0 shadow-lg">
              <CardHeader className="bg-indigo-600 py-4">
                <CardTitle className="text-white flex items-center">
                  <CalendarIcon className="w-5 h-5 mr-2" />
                  {label}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {!groupedSchedule[day] || groupedSchedule[day].length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    <p>Aucun cours prévu ce jour</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {groupedSchedule[day]?.map((entry) => (
                      <div key={entry.id} className="p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex flex-col md:flex-row md:items-center justify-between">
                          <div className="mb-2 md:mb-0">
                            <h3 className="font-semibold text-xl text-indigo-700">{entry.course.name}</h3>
                            <p className="text-gray-600">Classe: {entry.class.name} ({entry.class.level})</p>
                            <p className="text-gray-600">Salle: {entry.room}</p>
                          </div>
                          <div className="flex items-center text-indigo-600 bg-indigo-50 px-4 py-2 rounded-full">
                            <ClockIcon className="w-4 h-4 mr-2" />
                            <span className="font-medium">
                              {formatTime(entry.timeslot.startTime)} - {formatTime(entry.timeslot.endTime)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
} 