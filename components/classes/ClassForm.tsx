'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

interface Teacher {
  id: string
  firstName: string
  lastName: string
}

interface Class {
  id: string
  name: string
  level: string
  year: number
  teacher: Teacher
  studentCount: number
}

interface ClassFormProps {
  class_: Class | null
  onClose: () => void
  onSubmit: (data: {
    name: string
    level: string
    year: number
    teacherId: string
  }) => void
  teachers: Teacher[]
  levels: string[]
}

export function ClassForm({
  class_,
  onClose,
  onSubmit,
  teachers,
  levels,
}: ClassFormProps) {
  const currentYear = new Date().getFullYear()
  
  const [formData, setFormData] = useState({
    name: class_?.name || '',
    level: class_?.level || '',
    year: class_?.year || currentYear,
    teacherId: class_?.teacher?.id || '',
  })

  const [errors, setErrors] = useState({
    name: false,
    level: false,
    year: false,
    teacherId: false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors = {
      name: !formData.name,
      level: !formData.level,
      year: !formData.year || formData.year < 2000 || formData.year > 2100,
      teacherId: !formData.teacherId,
    }

    setErrors(newErrors)

    if (Object.values(newErrors).some(Boolean)) {
      toast.error('Veuillez corriger les erreurs dans le formulaire')
      return
    }

    onSubmit({
      ...formData,
      year: Number(formData.year)
    })
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-white">
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="text-xl">
            {class_ ? 'Modifier la classe' : 'Ajouter une classe'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">Nom de la classe</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`h-10 px-3 py-2 bg-white ${errors.name ? 'border-red-500 focus-visible:ring-red-500' : 'border-gray-300'}`}
              placeholder="ex: 6A, CE2-B, Terminal S2..."
            />
            {errors.name && (
              <p className="text-sm text-red-500">Le nom de la classe est requis</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="level" className="text-sm font-medium">Niveau</Label>
            <Select
              value={formData.level}
              onValueChange={(value) => setFormData({ ...formData, level: value })}
            >
              <SelectTrigger 
                className={`h-10 px-3 py-2 bg-white ${errors.level ? 'border-red-500 focus-visible:ring-red-500' : 'border-gray-300'}`}
              >
                <SelectValue placeholder="Sélectionner un niveau" />
              </SelectTrigger>
              <SelectContent>
                {levels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.level && (
              <p className="text-sm text-red-500">Le niveau est requis</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="year" className="text-sm font-medium">Année scolaire</Label>
            <Input
              id="year"
              type="number"
              min="2000"
              max="2100"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || currentYear })}
              className={`h-10 px-3 py-2 bg-white ${errors.year ? 'border-red-500 focus-visible:ring-red-500' : 'border-gray-300'}`}
            />
            {errors.year && (
              <p className="text-sm text-red-500">L'année scolaire doit être comprise entre 2000 et 2100</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="teacherId" className="text-sm font-medium">Professeur principal</Label>
            <Select
              value={formData.teacherId}
              onValueChange={(value) => setFormData({ ...formData, teacherId: value })}
            >
              <SelectTrigger 
                className={`h-10 px-3 py-2 bg-white ${errors.teacherId ? 'border-red-500 focus-visible:ring-red-500' : 'border-gray-300'}`}
              >
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
              <p className="text-sm text-red-500">Le professeur principal est requis</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="bg-white"
            >
              Annuler
            </Button>
            <Button 
              type="submit"
              className="bg-blue-600 hover:bg-blue-700"
            >
              {class_ ? 'Enregistrer' : 'Ajouter'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 


