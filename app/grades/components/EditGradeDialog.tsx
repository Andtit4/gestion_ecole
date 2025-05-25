'use client'

import { useEffect } from 'react'
import { Grade, Student, Course } from '@prisma/client'
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
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const editGradeSchema = z.object({
  value: z.number().min(0).max(20, "La note doit être entre 0 et 20"),
  comment: z.string().optional(),
  date: z.string().min(1, "La date est requise"),
})

type EditGradeFormValues = z.infer<typeof editGradeSchema>

type GradeWithDetails = Grade & {
  student: Student
  course: Course
}

interface EditGradeDialogProps {
  grade: GradeWithDetails | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (grade: EditGradeFormValues) => void
}

export default function EditGradeDialog({
  grade,
  open,
  onOpenChange,
  onSubmit,
}: EditGradeDialogProps) {
  const form = useForm<EditGradeFormValues>({
    resolver: zodResolver(editGradeSchema),
    defaultValues: {
      value: 0,
      comment: '',
      date: new Date().toISOString().split('T')[0],
    },
  })

  useEffect(() => {
    if (grade) {
      form.reset({
        value: grade.value,
        comment: grade.comment || '',
        date: new Date(grade.date).toISOString().split('T')[0],
      })
    }
  }, [grade, form])

  const handleSubmit = (values: EditGradeFormValues) => {
    onSubmit(values)
    form.reset()
  }

  if (!grade) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Modifier la note de {grade.student.firstName} {grade.student.lastName}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="text-sm text-gray-500 mb-4">
              Matière : {grade.course.name}
            </div>

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
              <Button type="submit">Enregistrer</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 