'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

interface GradeFormProps {
  grade?: {
    id: string
    value: number
    type: 'HOMEWORK' | 'QUIZ' | 'EXAM'
    date: string
    coefficient: number
    comment?: string
    studentId: string
    courseId: string
  }
  onClose: () => void
  onSubmit: (data: any) => void
  students: {
    id: string
    firstName: string
    lastName: string
    class: {
      id: string
      name: string
    }
  }[]
  courses: {
    id: string
    name: string
  }[]
}

export function GradeForm({ grade, onClose, onSubmit, students, courses }: GradeFormProps) {
  const { data: session } = useSession()
  const [formData, setFormData] = useState({
    value: grade?.value || 0,
    type: grade?.type || 'HOMEWORK',
    date: grade?.date ? new Date(grade.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    coefficient: grade?.coefficient || 1,
    comment: grade?.comment || '',
    studentId: grade?.studentId || '',
    courseId: grade?.courseId || '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {grade ? 'Modifier une note' : 'Ajouter une note'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="studentId">Élève</Label>
            <Select
              value={formData.studentId}
              onValueChange={(value) => setFormData({ ...formData, studentId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un élève" />
              </SelectTrigger>
              <SelectContent>
                {students.map((student) => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.firstName} {student.lastName} - {student.class.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="courseId">Cours</Label>
            <Select
              value={formData.courseId}
              onValueChange={(value) => setFormData({ ...formData, courseId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un cours" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type d'évaluation</Label>
            <Select
              value={formData.type}
              onValueChange={(value: 'HOMEWORK' | 'QUIZ' | 'EXAM') =>
                setFormData({ ...formData, type: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner le type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="HOMEWORK">Devoir</SelectItem>
                <SelectItem value="QUIZ">Contrôle</SelectItem>
                <SelectItem value="EXAM">Examen</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="value">Note</Label>
            <Input
              id="value"
              type="number"
              min="0"
              max="20"
              step="0.25"
              value={formData.value}
              onChange={(e) =>
                setFormData({ ...formData, value: parseFloat(e.target.value) })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="coefficient">Coefficient</Label>
            <Input
              id="coefficient"
              type="number"
              min="1"
              value={formData.coefficient}
              onChange={(e) =>
                setFormData({ ...formData, coefficient: parseFloat(e.target.value) })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">Commentaire</Label>
            <Textarea
              id="comment"
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit">
              {grade ? 'Modifier' : 'Ajouter'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 