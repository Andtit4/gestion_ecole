'use client'

import { useState, useEffect } from 'react'
import { useToast } from '@/components/ui/use-toast'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface TimeSlot {
  id: string
  start: string
  end: string
}

interface DayOfWeek {
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

interface Classroom {
  id: string
  name: string
  capacity?: number
  floor?: number
  building?: string
}

interface Session {
  id: string
  courseId: string
  teacherId: string
  room: string
  dayOfWeek: string
  timeSlotId: string
}

interface TimetableSessionFormProps {
  timeSlot: TimeSlot
  dayOfWeek: DayOfWeek
  session?: Session
  courses: Course[]
  teachers: Teacher[]
  onClose: () => void
  onSubmit: (data: any) => void
  className?: string
}

export default function TimetableSessionForm({
  timeSlot,
  dayOfWeek,
  session,
  courses,
  teachers,
  onClose,
  onSubmit,
  className,
}: TimetableSessionFormProps) {
  const { toast } = useToast()
  const [classrooms, setClassrooms] = useState<Classroom[]>([])
  const [formData, setFormData] = useState({
    id: session?.id || '',
    courseId: session?.courseId || '',
    teacherId: session?.teacherId || '',
    room: session?.room || className || '',
    dayOfWeek: dayOfWeek.id,
    timeSlotId: timeSlot.id,
  })
  const [errors, setErrors] = useState({
    courseId: '',
    teacherId: '',
    room: '',
  })

  // Charger les salles de classe
  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        const response = await fetch('/api/classrooms')
        if (!response.ok) throw new Error('Erreur lors de la récupération des salles')
        const data = await response.json()
        setClassrooms(data)
        
        // Si aucune salle n'est sélectionnée et qu'il y a des salles disponibles
        if (!formData.room && data.length > 0) {
          const existingRoom = data.find(room => room.name === session?.room)
          if (existingRoom) {
            setFormData(prev => ({ ...prev, room: existingRoom.id }))
          } else {
            setFormData(prev => ({ ...prev, room: data[0].id }))
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement des salles:', error)
        toast({
          title: 'Erreur',
          description: 'Impossible de charger la liste des salles',
          variant: 'destructive',
        })
      }
    }

    fetchClassrooms()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (fieldName: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    const newErrors = {
      courseId: '',
      teacherId: '',
      room: '',
    }

    if (!formData.courseId) {
      newErrors.courseId = 'Veuillez sélectionner un cours'
    }
    if (!formData.teacherId) {
      newErrors.teacherId = 'Veuillez sélectionner un enseignant'
    }
    
    // Utiliser le nom de la classe si aucune salle n'est sélectionnée
    if (!formData.room && className) {
      setFormData(prev => ({ ...prev, room: className }))
    } else if (!formData.room) {
      newErrors.room = 'Veuillez saisir une salle'
    }

    if (newErrors.courseId || newErrors.teacherId || newErrors.room) {
      setErrors(newErrors)
      return
    }

    // S'assurer que tous les champs requis sont présents
    const dataToSubmit = {
      ...formData,
      room: formData.room || className || "Salle non spécifiée",
      dayOfWeek: dayOfWeek.id  // S'assurer que dayOfWeek est inclus dans la soumission
    };
    
    console.log('Données à soumettre:', dataToSubmit);
    onSubmit(dataToSubmit);
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {session ? 'Modifier un cours' : 'Ajouter un cours'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Jour</Label>
              <div className="p-2 border rounded-md bg-gray-50">{dayOfWeek.name}</div>
            </div>
            <div className="space-y-2">
              <Label>Horaire</Label>
              <div className="p-2 border rounded-md bg-gray-50">
                {timeSlot.start} - {timeSlot.end}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="courseId">Matière</Label>
            <Select
              value={formData.courseId}
              onValueChange={(value) => handleSelectChange('courseId', value)}
            >
              <SelectTrigger id="courseId">
                <SelectValue placeholder="Sélectionner une matière" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.courseId && (
              <p className="text-red-500 text-sm">{errors.courseId}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="teacherId">Enseignant</Label>
            <Select
              value={formData.teacherId}
              onValueChange={(value) => handleSelectChange('teacherId', value)}
            >
              <SelectTrigger id="teacherId">
                <SelectValue placeholder="Sélectionner un enseignant" />
              </SelectTrigger>
              <SelectContent>
                {teachers.map((teacher) => (
                  <SelectItem key={teacher.id} value={teacher.id}>
                    {teacher.firstName} {teacher.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.teacherId && (
              <p className="text-red-500 text-sm">{errors.teacherId}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="room">Salle</Label>
            <Input
              id="room"
              value={formData.room}
              onChange={(e) => handleChange(e)}
              name="room"
              placeholder={className || "Nom de la salle"}
              className="w-full"
            />
            {errors.room && <p className="text-red-500 text-sm">{errors.room}</p>}
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit">
              {session ? 'Mettre à jour' : 'Ajouter'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 