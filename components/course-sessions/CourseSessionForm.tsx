'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface CourseSessionFormProps {
  session?: {
    id: string
    date: string
    startTime: string
    endTime: string
    content: string
    status: 'PLANNED' | 'ONGOING' | 'COMPLETED' | 'CANCELED'
    classId: string
    courseId: string
    teacherId: string
  }
  onClose: () => void
  onSubmit: (data: any) => void
  classes: Array<{ id: string; name: string }>
  courses: Array<{ id: string; name: string }>
  teachers: Array<{ id: string; firstName: string; lastName: string }>
}

export default function CourseSessionForm({
  session,
  onClose,
  onSubmit,
  classes,
  courses,
  teachers,
}: CourseSessionFormProps) {
  const { data: sessionData } = useSession()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    date: session?.date || '',
    startTime: session?.startTime || '',
    endTime: session?.endTime || '',
    content: session?.content || '',
    status: session?.status || 'PLANNED',
    classId: session?.classId || '',
    courseId: session?.courseId || '',
    teacherId: session?.teacherId || '',
  })
  const [errors, setErrors] = useState({
    date: '',
    startTime: '',
    endTime: '',
    status: '',
    classId: '',
    courseId: '',
    teacherId: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation des champs requis
    if (!formData.date || !formData.startTime || !formData.endTime || 
        !formData.classId || !formData.courseId || !formData.teacherId) {
      toast({
        title: 'Erreur',
        description: 'Veuillez remplir tous les champs obligatoires',
        variant: 'destructive',
      })
      return
    }

    // Validation des horaires
    const startTime = new Date(`${formData.date}T${formData.startTime}`)
    const endTime = new Date(`${formData.date}T${formData.endTime}`)
    
    if (endTime <= startTime) {
      toast({
        title: 'Erreur',
        description: 'L\'heure de fin doit être postérieure à l\'heure de début',
        variant: 'destructive',
      })
      return
    }

    try {
      onSubmit(formData)
      onClose()
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la sauvegarde de la séance',
        variant: 'destructive',
      })
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px] bg-white">
        <DialogHeader>
          <DialogTitle>
            {session ? 'Modifier la séance de cours' : 'Ajouter une séance de cours'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
              {errors.date && (
                <p className="text-red-500 text-sm mt-1">{errors.date}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleChange('status', value)}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PLANNED">Planifiée</SelectItem>
                  <SelectItem value="ONGOING">En cours</SelectItem>
                  <SelectItem value="COMPLETED">Terminée</SelectItem>
                  <SelectItem value="CANCELED">Annulée</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-red-500 text-sm mt-1">{errors.status}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Heure de début</Label>
              <Input
                id="startTime"
                name="startTime"
                type="time"
                value={formData.startTime}
                onChange={handleChange}
                required
              />
              {errors.startTime && (
                <p className="text-red-500 text-sm mt-1">{errors.startTime}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">Heure de fin</Label>
              <Input
                id="endTime"
                name="endTime"
                type="time"
                value={formData.endTime}
                onChange={handleChange}
                required
              />
              {errors.endTime && (
                <p className="text-red-500 text-sm mt-1">{errors.endTime}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="classId">Classe</Label>
              <Select
                value={formData.classId}
                onValueChange={(value) => handleChange('classId', value)}
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
              {errors.classId && (
                <p className="text-red-500 text-sm mt-1">{errors.classId}</p>
              )}
            </div>
            <div>
              <Label htmlFor="courseId">Matière</Label>
              <Select
                value={formData.courseId}
                onValueChange={(value) => handleChange('courseId', value)}
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
                <p className="text-red-500 text-sm mt-1">{errors.courseId}</p>
              )}
            </div>
          </div>

          <div className="mb-4">
            <Label htmlFor="teacherId">Professeur</Label>
            <Select
              value={formData.teacherId}
              onValueChange={(value) => handleChange('teacherId', value)}
            >
              <SelectTrigger id="teacherId">
                <SelectValue placeholder="Sélectionner un professeur" />
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
              <p className="text-red-500 text-sm mt-1">{errors.teacherId}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Contenu du cours</Label>
            <Textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={4}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>
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