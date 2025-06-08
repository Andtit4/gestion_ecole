'use client'

import { useState, useEffect } from 'react'
import { useToast } from '@/components/ui/use-toast'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import TimetableSessionForm from './TimetableSessionForm'

const daysOfWeek = [
  { id: 'MONDAY', name: 'Lundi' },
  { id: 'TUESDAY', name: 'Mardi' },
  { id: 'WEDNESDAY', name: 'Mercredi' },
  { id: 'THURSDAY', name: 'Jeudi' },
  { id: 'FRIDAY', name: 'Vendredi' },
]

interface ScheduleEntry {
  id: string
  classId: string
  courseId: string
  teacherId: string
  timeSlotId: string
  dayOfWeek: string
  room: string
  course: {
    id: string
    name: string
  }
  teacher: {
    id: string
    firstName: string
    lastName: string
  }
}

interface Class {
  id: string
  name: string
}

interface Course {
  id: string
  name: string
}

interface Teacher {
  id: string
  firstName: string
  lastName: string
}

interface Props {
  classes: Class[]
}

export default function ClassTimetable({ classes }: Props) {
  const { toast } = useToast()
  const [selectedClassId, setSelectedClassId] = useState<string>('')
  const [selectedClassName, setSelectedClassName] = useState<string>('')
  const [schedule, setSchedule] = useState<ScheduleEntry[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [loading, setLoading] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [timeSlots, setTimeSlots] = useState([
    { id: '1', start: '08:00', end: '09:00' },
    { id: '2', start: '09:00', end: '10:00' },
    { id: '3', start: '10:00', end: '11:00' },
    { id: '4', start: '11:00', end: '12:00' },
    { id: '5', start: '13:00', end: '14:00' },
    { id: '6', start: '14:00', end: '15:00' },
    { id: '7', start: '15:00', end: '16:00' },
    { id: '8', start: '16:00', end: '17:00' },
  ])
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<{
    timeSlotId: string
    dayOfWeek: string
    existingEntry?: ScheduleEntry
  } | null>(null)

  useEffect(() => {
    fetchCourses()
    fetchTeachers()
    fetchTimeSlots()
  }, [])

  useEffect(() => {
    if (selectedClassId) {
      fetchSchedule(selectedClassId)
    } else {
      setSchedule([])
    }
  }, [selectedClassId])

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/courses')
      if (!response.ok) throw new Error('Erreur lors de la récupération des cours')
      const data = await response.json()
      setCourses(data)
    } catch (error) {
      console.error(error)
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les cours',
        variant: 'destructive',
      })
    }
  }

  const fetchTeachers = async () => {
    try {
      const response = await fetch('/api/teachers')
      if (!response.ok) throw new Error('Erreur lors de la récupération des enseignants')
      const data = await response.json()
      setTeachers(data)
    } catch (error) {
      console.error(error)
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les enseignants',
        variant: 'destructive',
      })
    }
  }

  const fetchTimeSlots = async () => {
    try {
      const response = await fetch('/api/timetable/timeslots')
      if (!response.ok) throw new Error('Erreur lors de la récupération des créneaux horaires')
      const data = await response.json()
      
      console.log('Créneaux horaires reçus de l\'API:', data);
      
      // Regrouper les créneaux par heure (peu importe le jour) pour avoir une grille uniforme
      const timeSlotsByTime = {};
      
      // Pour chaque créneau, créer une entrée dans le dictionnaire en utilisant startTime comme clé
      data.forEach(slot => {
        const time = formatTime(slot.startTime);
        const endTime = formatTime(slot.endTime);
        const key = `${time}-${endTime}`;
        
        if (!timeSlotsByTime[key]) {
          timeSlotsByTime[key] = {
            start: time,
            end: endTime,
            slots: {}
          };
        }
        
        // Ajouter l'ID du créneau avec son jour
        timeSlotsByTime[key].slots[slot.dayOfWeek] = slot.id;
      });
      
      // Convertir en tableau pour l'affichage
      const formattedTimeSlots = Object.entries(timeSlotsByTime).map(([key, value]) => ({
        key: key,
        start: value.start,
        end: value.end,
        slotsByDay: value.slots
      }));
      
      console.log('Créneaux formatés:', formattedTimeSlots);
      setTimeSlots(formattedTimeSlots);
    } catch (error) {
      console.error(error)
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les créneaux horaires',
        variant: 'destructive',
      })
    }
  }
  
  const formatTime = (time: string) => {
    // Convertir le format ISO en HH:MM
    const date = new Date(time)
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
  }

  const fetchSchedule = async (classId: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/timetable/class/${classId}`)
      if (!response.ok) throw new Error('Erreur lors de la récupération de l\'emploi du temps')
      const data = await response.json()
      console.log('Données du calendrier reçues:', data);
      setSchedule(data)
    } catch (error) {
      console.error(error)
      toast({
        title: 'Erreur',
        description: 'Impossible de charger l\'emploi du temps',
        variant: 'destructive',
      })
      setSchedule([])
    } finally {
      setLoading(false)
    }
  }

  const handleClassChange = (classId: string) => {
    setSelectedClassId(classId);
    const selectedClass = classes.find(c => c.id === classId);
    setSelectedClassName(selectedClass?.name || '');
  };

  const handleAddSession = (timeSlotKey: string, dayOfWeek: string) => {
    // Récupérer l'ID du créneau horaire pour ce jour
    const timeSlot = timeSlots.find(ts => ts.key === timeSlotKey);
    if (!timeSlot || !timeSlot.slotsByDay || !timeSlot.slotsByDay[dayOfWeek]) {
      toast({
        title: 'Erreur',
        description: 'Créneau horaire non disponible pour ce jour',
        variant: 'destructive',
      });
      return;
    }
    
    const timeSlotId = timeSlot.slotsByDay[dayOfWeek];
    
    // Vérifier si une entrée existe déjà pour ce créneau
    const existingEntry = schedule.find(
      (entry) => entry.timeSlotId === timeSlotId && entry.dayOfWeek === dayOfWeek
    );

    setSelectedTimeSlot({
      timeSlotId,
      dayOfWeek,
      existingEntry,
    });
    setIsFormOpen(true);
  }

  const handleFormSubmit = async (data: any) => {
    try {
      const endpoint = data.id ? `/api/timetable/schedule/${data.id}` : '/api/timetable/schedule'
      const method = data.id ? 'PUT' : 'POST'
      
      console.log('Envoi de données à l\'API:', {
        ...data,
        classId: selectedClassId,
      });

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          classId: selectedClassId,
        }),
      })

      console.log('Réponse de l\'API status:', response.status);
      
      if (!response.ok) {
        // Tenter de récupérer le message d'erreur envoyé par l'API
        let errorMessage = 'Erreur lors de l\'enregistrement du cours';
        try {
          const errorData = await response.json();
          console.log('Erreur reçue de l\'API:', errorData);
          if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (e) {
          // Ignorer l'erreur de parsing JSON
          console.log('Erreur lors du parsing de l\'erreur:', e);
        }
        throw new Error(errorMessage);
      }

      toast({
        title: 'Succès',
        description: `Cours ${data.id ? 'modifié' : 'ajouté'} avec succès`,
        variant: 'success',
      })

      setIsFormOpen(false)
      fetchSchedule(selectedClassId)
    } catch (error: any) {
      console.error(error)
      toast({
        title: 'Erreur',
        description: error.message || 'Impossible d\'enregistrer le cours',
        variant: 'destructive',
      })
    }
  }

  const handleDeleteSession = async (sessionId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce cours?')) return

    try {
      const response = await fetch(`/api/timetable/schedule/${sessionId}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Erreur lors de la suppression du cours')

      toast({
        title: 'Succès',
        description: 'Cours supprimé avec succès',
      })

      fetchSchedule(selectedClassId)
    } catch (error) {
      console.error(error)
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer le cours',
        variant: 'destructive',
      })
    }
  }

  const getSessionForTimeSlot = (timeSlotKey: string, dayOfWeek: string) => {
    // Récupérer l'ID du créneau horaire pour ce jour
    const timeSlot = timeSlots.find(ts => ts.key === timeSlotKey);
    if (!timeSlot || !timeSlot.slotsByDay || !timeSlot.slotsByDay[dayOfWeek]) {
      return null;
    }
    
    const timeSlotId = timeSlot.slotsByDay[dayOfWeek];
    
    console.log(`Recherche session pour timeSlotId=${timeSlotId}, dayOfWeek=${dayOfWeek}`);
    
    // Trouver la session avec cet ID de créneau et ce jour
    const foundSession = schedule.find(
      (entry) => entry.timeSlotId === timeSlotId && entry.dayOfWeek === dayOfWeek
    );
    
    console.log('Session trouvée:', foundSession);
    return foundSession;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Emploi du temps hebdomadaire</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="classId">Classe</Label>
              <Select
                value={selectedClassId}
                onValueChange={handleClassChange}
              >
                <SelectTrigger id="classId">
                  <SelectValue placeholder="Sélectionner une classe" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedClassId && !loading ? (
              <>
                <Table className="border">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Horaire</TableHead>
                      {daysOfWeek.map((day) => (
                        <TableHead key={day.id}>{day.name}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {timeSlots.map((timeSlot) => (
                      <TableRow key={timeSlot.id}>
                        <TableCell className="font-medium">
                          {timeSlot.start} - {timeSlot.end}
                        </TableCell>
                        {daysOfWeek.map((day) => {
                          const session = getSessionForTimeSlot(timeSlot.key, day.id)
                          return (
                            <TableCell key={day.id} className="relative min-h-[80px]">
                              {session ? (
                                <div className="p-2 bg-blue-50 border border-blue-200 rounded-md">
                                  <div className="font-medium">{session.course.name}</div>
                                  <div className="text-sm">
                                    {session.teacher.firstName} {session.teacher.lastName}
                                  </div>
                                  <div className="text-xs text-gray-500">Salle: {session.room}</div>
                                  <div className="mt-2 flex gap-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleAddSession(timeSlot.key, day.id)}
                                    >
                                      Modifier
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={() => handleDeleteSession(session.id)}
                                    >
                                      Supprimer
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <Button
                                  variant="ghost"
                                  className="w-full h-full min-h-[80px] border border-dashed border-gray-300 justify-center"
                                  onClick={() => handleAddSession(timeSlot.key, day.id)}
                                >
                                  + Ajouter
                                </Button>
                              )}
                            </TableCell>
                          )
                        })}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </>
            ) : loading ? (
              <div className="py-10 text-center">Chargement...</div>
            ) : (
              <div className="py-10 text-center">
                Veuillez sélectionner une classe pour voir son emploi du temps
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {isFormOpen && selectedTimeSlot && (
        <TimetableSessionForm
          timeSlot={{
            id: selectedTimeSlot.timeSlotId,
            start: timeSlots.find(ts => Object.values(ts.slotsByDay).includes(selectedTimeSlot.timeSlotId))?.start || "",
            end: timeSlots.find(ts => Object.values(ts.slotsByDay).includes(selectedTimeSlot.timeSlotId))?.end || ""
          }}
          dayOfWeek={daysOfWeek.find(d => d.id === selectedTimeSlot.dayOfWeek)!}
          session={selectedTimeSlot.existingEntry}
          courses={courses}
          teachers={teachers}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleFormSubmit}
          className={selectedClassName}
        />
      )}
    </div>
  )
} 


