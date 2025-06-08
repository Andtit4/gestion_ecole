'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'

const levels = ['6�me', '5�me', '4�me', '3�me', 'Seconde', 'Premi�re', 'Terminale']
const statuses = [
  { value: 'DRAFT', label: 'Brouillon' },
  { value: 'PUBLISHED', label: 'Publi�' },
  { value: 'ARCHIVED', label: 'Archiv�' }
]

export default function ProgrammeForm({ programme, courses, onSubmit, onCancel }) {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    description: '',
    level: '',
    year: currentYear,
    courseId: '',
    content: '',
    objectives: '',
    status: 'DRAFT',
    userId: ''
  })

  useEffect(() => {
    if (programme) {
      setFormData({
        id: programme.id,
        title: programme.title || '',
        description: programme.description || '',
        level: programme.level || '',
        year: programme.year || currentYear,
        courseId: programme.courseId || '',
        content: programme.content || '',
        objectives: programme.objectives || '',
        status: programme.status || 'DRAFT',
        userId: programme.userId || session?.user?.id || ''
      })
    } else if (courses.length > 0) {
      setFormData(prev => ({
        ...prev,
        courseId: courses[0].id,
        level: levels[0],
        userId: session?.user?.id || ''
      }))
    }
  }, [programme, courses, session, currentYear])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.title || !formData.level || !formData.courseId) {
      toast({
        title: 'Formulaire incomplet',
        description: 'Veuillez remplir tous les champs obligatoires',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)

    try {
      const url = formData.id 
        ? `/api/programmes/${formData.id}` 
        : '/api/programmes'
      
      const method = formData.id ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Une erreur est survenue')
      }

      const savedProgramme = await response.json()
      
      toast({
        title: formData.id ? 'Programme mis � jour' : 'Programme cr��',
        description: formData.id 
          ? 'Le programme a �t� mis � jour avec succ�s' 
          : 'Le programme a �t� cr�� avec succ�s',
      })

      onSubmit(savedProgramme)
    } catch (error) {
      toast({
        title: 'Erreur',
        description: error.message || 'Une erreur est survenue',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {programme ? 'Modifier le programme' : 'Ajouter un programme'}
          </DialogTitle>
          <DialogDescription>
            {programme
              ? 'Mettez � jour les informations du programme scolaire'
              : 'Cr�ez un nouveau programme scolaire pour une mati�re et un niveau'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="font-medium">
                Titre <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Titre du programme"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="courseId" className="font-medium">
                Mati�re <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.courseId}
                onValueChange={(value) => handleSelectChange('courseId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="S�lectionner une mati�re" />
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
              <Label htmlFor="level" className="font-medium">
                Niveau <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.level}
                onValueChange={(value) => handleSelectChange('level', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="S�lectionner un niveau" />
                </SelectTrigger>
                <SelectContent>
                  {levels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="year" className="font-medium">
                Ann�e scolaire <span className="text-red-500">*</span>
              </Label>
              <Input
                id="year"
                name="year"
                type="number"
                value={formData.year}
                onChange={handleChange}
                min={2000}
                max={2100}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status" className="font-medium">
                Statut
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleSelectChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="S�lectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="description" className="font-medium">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                placeholder="Description du programme"
                rows={2}
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="objectives" className="font-medium">
                Objectifs p�dagogiques
              </Label>
              <Textarea
                id="objectives"
                name="objectives"
                value={formData.objectives || ''}
                onChange={handleChange}
                placeholder="Objectifs p�dagogiques du programme"
                rows={3}
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="content" className="font-medium">
                Contenu du programme
              </Label>
              <Textarea
                id="content"
                name="content"
                value={formData.content || ''}
                onChange={handleChange}
                placeholder="Contenu d�taill� du programme"
                rows={8}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Enregistrement...' : programme ? 'Mettre � jour' : 'Cr�er'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 


