'use client'

import { useState, useEffect } from 'react'
import { Grade, Course } from '@prisma/client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const gradeSchema = z.object({
  studentId: z.string().min(1, "L'élève est requis"),
  courseId: z.string().min(1, "La matière est requise"),
  value: z.number().min(0).max(20, "La note doit être entre 0 et 20"),
  type: z.enum(['HOMEWORK', 'QUIZ', 'EXAM']),
  comment: z.string().optional(),
  date: z.string().min(1, "La date est requise"),
})

type GradeFormValues = z.infer<typeof gradeSchema>

// Type pour les étudiants retournés par l'API
type StudentWithUser = {
  id: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  class?: {
    id: string;
    name: string;
    level: string;
  } | null;
}

interface AddGradeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (grade: GradeFormValues) => void
}

export default function AddGradeDialog({
  open,
  onOpenChange,
  onSubmit,
}: AddGradeDialogProps) {
  const [students, setStudents] = useState<StudentWithUser[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<GradeFormValues>({
    resolver: zodResolver(gradeSchema),
    defaultValues: {
      studentId: '',
      courseId: '',
      value: 0,
      type: 'HOMEWORK',
      comment: '',
      date: new Date().toISOString().split('T')[0],
    },
  })

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const [studentsRes, coursesRes] = await Promise.all([
          fetch('/api/students', {
            credentials: 'include', // Important: inclure les cookies pour l'authentification
          }),
          fetch('/api/courses', {
            credentials: 'include', // Important: inclure les cookies pour l'authentification
          }),
        ])
        
        if (!studentsRes.ok) {
          console.error('Erreur étudiants:', await studentsRes.text())
          throw new Error(`Erreur lors du chargement des étudiants: ${studentsRes.status}`)
        }
        
        if (!coursesRes.ok) {
          console.error('Erreur cours:', await coursesRes.text())
          throw new Error(`Erreur lors du chargement des cours: ${coursesRes.status}`)
        }

        const [studentsData, coursesData] = await Promise.all([
          studentsRes.json(),
          coursesRes.json(),
        ])

        console.log('Étudiants chargés:', studentsData)
        setStudents(studentsData)
        setCourses(coursesData)
      } catch (error) {
        console.error('Erreur:', error)
        setError(error instanceof Error ? error.message : 'Erreur lors du chargement des données')
      } finally {
        setLoading(false)
      }
    }

    if (open) {
      fetchData()
    }
  }, [open])

  const handleSubmit = (values: GradeFormValues) => {
    onSubmit(values)
    form.reset()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter une note</DialogTitle>
        </DialogHeader>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4">
            {error}
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="studentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Élève</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={loading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un élève" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {students.length === 0 ? (
                        <SelectItem value="empty" disabled>
                          Aucun élève disponible
                        </SelectItem>
                      ) : (
                        students.map((student) => (
                          <SelectItem key={student.id} value={student.id}>
                            {student.user.firstName} {student.user.lastName}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="courseId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Matière</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={loading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une matière" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {courses.length === 0 ? (
                        <SelectItem value="empty" disabled>
                          Aucune matière disponible
                        </SelectItem>
                      ) : (
                        courses.map((course) => (
                          <SelectItem key={course.id} value={course.id}>
                            {course.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={loading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="HOMEWORK">Devoir</SelectItem>
                      <SelectItem value="QUIZ">Contrôle</SelectItem>
                      <SelectItem value="EXAM">Examen</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      max="20"
                      step="0.5"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Commentaire</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={loading}>
                {loading ? 'Chargement...' : 'Ajouter'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 