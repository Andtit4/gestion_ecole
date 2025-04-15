'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

interface Student {
  id: string
  firstName: string
  lastName: string
  email: string
  classId: string | null
  class?: {
    id: string
    name: string
  }
}

interface StudentFormProps {
  student: Student | null
  onClose: () => void
  onSubmit: (data: {
    firstName: string
    lastName: string
    email: string
    password?: string
    classId: string | null
  }) => void
  classes: {
    id: string
    name: string
    level: string
  }[]
}

export function StudentForm({
  student,
  onClose,
  onSubmit,
  classes,
}: StudentFormProps) {
  const [formData, setFormData] = useState({
    firstName: student?.firstName || '',
    lastName: student?.lastName || '',
    email: student?.email || '',
    password: '',
    classId: student?.classId || 'none',
  })

  const [errors, setErrors] = useState({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
  })

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors = {
      firstName: !formData.firstName,
      lastName: !formData.lastName,
      email: !formData.email || !validateEmail(formData.email),
      password: !student && !formData.password,
    }

    setErrors(newErrors)

    if (Object.values(newErrors).some(Boolean)) {
      toast.error('Veuillez corriger les erreurs dans le formulaire')
      return
    }

    // Ne pas envoyer le mot de passe si c'est une mise à jour et qu'il n'a pas été modifié
    const dataToSubmit = student && !formData.password 
      ? { 
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          classId: formData.classId === 'none' ? null : formData.classId 
        } 
      : {
          ...formData,
          classId: formData.classId === 'none' ? null : formData.classId
        }

    onSubmit(dataToSubmit)
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-white">
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="text-xl">
            {student ? 'Modifier l\'élève' : 'Ajouter un élève'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 pt-4">
          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-sm font-medium">Nom</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              className={`h-10 px-3 py-2 bg-white ${errors.lastName ? 'border-red-500 focus-visible:ring-red-500' : 'border-gray-300'}`}
            />
            {errors.lastName && (
              <p className="text-sm text-red-500">Le nom est requis</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-sm font-medium">Prénom</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className={`h-10 px-3 py-2 bg-white ${errors.firstName ? 'border-red-500 focus-visible:ring-red-500' : 'border-gray-300'}`}
            />
            {errors.firstName && (
              <p className="text-sm text-red-500">Le prénom est requis</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`h-10 px-3 py-2 bg-white ${errors.email ? 'border-red-500 focus-visible:ring-red-500' : 'border-gray-300'}`}
            />
            {errors.email && (
              <p className="text-sm text-red-500">
                Veuillez fournir un email valide
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Mot de passe{student ? ' (laisser vide pour ne pas changer)' : ''}
            </Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className={`h-10 px-3 py-2 bg-white ${errors.password ? 'border-red-500 focus-visible:ring-red-500' : 'border-gray-300'}`}
            />
            {errors.password && (
              <p className="text-sm text-red-500">Le mot de passe est requis</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="classId" className="text-sm font-medium">Classe</Label>
            <Select
              value={formData.classId}
              onValueChange={(value) => setFormData({ ...formData, classId: value })}
            >
              <SelectTrigger className="h-10 px-3 py-2 bg-white border-gray-300">
                <SelectValue placeholder="Sélectionner une classe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Aucune classe</SelectItem>
                {classes.map((class_) => (
                  <SelectItem key={class_.id} value={class_.id}>
                    {class_.name} ({class_.level})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
              {student ? 'Enregistrer' : 'Ajouter'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 