'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'

interface CourseFormProps {
  course?: {
    id: string
    name: string
    coefficient: number
    level: string
    description: string
    teacherId: string
  }
  onClose: () => void
  onSubmit: (data: any) => void
  teachers: {
    id: string
    firstName: string
    lastName: string
  }[]
}

export function CourseForm({ course, onClose, onSubmit, teachers }: CourseFormProps) {
  const { data: session } = useSession()
  const [formData, setFormData] = useState({
    name: course?.name || '',
    coefficient: course?.coefficient || 1,
    level: course?.level || '',
    description: course?.description || '',
    teacherId: course?.teacherId || '',
  })
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-white">
        <DialogHeader>
          <DialogTitle>
            {course ? 'Modifier la matière' : 'Ajouter une matière'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom de la matière</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
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
                handleChange('coefficient', e.target.value)
              }
              required
            />
          </div>

          <div className="mb-4">
            <Label htmlFor="level">Niveau</Label>
            <Select
              value={formData.level}
              onValueChange={(value) => handleChange('level', value)}
            >
              <SelectTrigger id="level">
                <SelectValue placeholder="Sélectionner un niveau" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6ème">6ème</SelectItem>
                <SelectItem value="5ème">5ème</SelectItem>
                <SelectItem value="4ème">4ème</SelectItem>
                <SelectItem value="3ème">3ème</SelectItem>
                <SelectItem value="2nde">2nde</SelectItem>
                <SelectItem value="1ère">1ère</SelectItem>
                <SelectItem value="Terminale">Terminale</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
            />
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
          </div>

          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit">
              {course ? 'Mettre à jour' : 'Ajouter'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 