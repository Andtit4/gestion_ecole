'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'

interface Student {
  id: string
  user: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
  class: {
    id: string
    name: string
  } | null
}

interface Parent {
  id: string
  user: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
}

interface StudentFormProps {
  student: Student | null
  classes: any[]
  parents: Parent[]
  onClose: () => void
  onSubmit: (data: any) => void
}

export function StudentForm({
  student,
  classes,
  parents,
  onClose,
  onSubmit
}: StudentFormProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    classId: 'none',
    parentIds: [] as string[]
  })
  
  const [existingParents, setExistingParents] = useState<Parent[]>([])
  const [errors, setErrors] = useState({
    firstName: false,
    lastName: false,
    email: false,
    password: false
  })
  const [activeTab, setActiveTab] = useState('informations')

  // Charger les données de l'étudiant s'il existe
  useEffect(() => {
    if (student) {
      setFormData({
        firstName: student.user.firstName,
        lastName: student.user.lastName,
        email: student.user.email,
        password: '',
        classId: student.class ? student.class.id : 'none',
        parentIds: []
      })
      
      // Charger les parents associés
      fetchStudentParents(student.id)
    }
  }, [student])

  // Récupérer les parents associés à l'étudiant
  const fetchStudentParents = async (studentId: string) => {
    try {
      const response = await fetch(`/api/students/${studentId}/parents`)
      if (!response.ok) throw new Error('Erreur lors de la récupération des parents')
      
      const data = await response.json()
      setExistingParents(data)
      
      // Mettre à jour les IDs des parents dans le formulaire
      setFormData(prev => ({
        ...prev,
        parentIds: data.map((parent: Parent) => parent.id)
      }))
    } catch (error) {
      console.error('Erreur:', error)
      toast.error('Erreur lors du chargement des parents associés')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: false }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleParentToggle = (parentId: string) => {
    setFormData(prev => {
      const parentIds = [...prev.parentIds]
      
      if (parentIds.includes(parentId)) {
        return { ...prev, parentIds: parentIds.filter(id => id !== parentId) }
      } else {
        return { ...prev, parentIds: [...parentIds, parentId] }
      }
    })
  }

  const validateForm = () => {
    const newErrors = {
      firstName: !formData.firstName,
      lastName: !formData.lastName,
      email: !formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email),
      password: !student && !formData.password
    }

    setErrors(newErrors)
    return !Object.values(newErrors).some(Boolean)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error('Veuillez corriger les erreurs dans le formulaire')
      return
    }

    // Préparer les données à envoyer
    const dataToSubmit = {
      ...formData,
      // Convertir 'none' en null pour classId
      classId: formData.classId === 'none' ? null : formData.classId,
      // Si on modifie un étudiant existant, on inclut son ID
      ...(student && { userId: student.user.id }),
      // Si le mot de passe est vide et qu'on modifie un étudiant, on ne l'envoie pas
      ...((!formData.password && student) && { password: undefined })
    }

    onSubmit(dataToSubmit)
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {student ? 'Modifier un étudiant' : 'Ajouter un étudiant'}
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="informations" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="informations">Informations</TabsTrigger>
            <TabsTrigger value="parents">Parents</TabsTrigger>
          </TabsList>
          
          <form onSubmit={handleSubmit}>
            <TabsContent value="informations" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom <span className="text-red-500">*</span></Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={errors.firstName ? 'border-red-500' : ''}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-xs">Le prénom est requis</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom <span className="text-red-500">*</span></Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={errors.lastName ? 'border-red-500' : ''}
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-xs">Le nom est requis</p>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs">Un email valide est requis</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">
                  {student ? 'Mot de passe (laisser vide pour ne pas changer)' : 'Mot de passe'}
                  {!student && <span className="text-red-500"> *</span>}
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? 'border-red-500' : ''}
                />
                {errors.password && (
                  <p className="text-red-500 text-xs">Le mot de passe est requis</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="classId">Classe</Label>
                <Select
                  value={formData.classId}
                  onValueChange={(value) => handleSelectChange('classId', value)}
                >
                  <SelectTrigger id="classId">
                    <SelectValue placeholder="Sélectionner une classe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Non assigné</SelectItem>
                    {classes.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id}>
                        {cls.name} - {cls.level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex justify-between mt-4">
                <Button type="button" variant="outline" onClick={() => setActiveTab('parents')}>
                  Suivant
                </Button>
                <Button type="submit">
                  {student ? 'Enregistrer' : 'Ajouter'}
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="parents" className="space-y-4 mt-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Associer des parents</h3>
                
                {parents.length === 0 ? (
                  <p className="text-muted-foreground">Aucun parent disponible</p>
                ) : (
                  <div className="space-y-2 max-h-[300px] overflow-y-auto border rounded-md p-2">
                    {parents.map((parent) => (
                      <div key={parent.id} className="flex items-center space-x-2 py-2 border-b">
                        <input
                          type="checkbox"
                          id={`parent-${parent.id}`}
                          checked={formData.parentIds.includes(parent.id)}
                          onChange={() => handleParentToggle(parent.id)}
                          className="h-4 w-4"
                        />
                        <label htmlFor={`parent-${parent.id}`} className="flex-grow">
                          {parent.user.firstName} {parent.user.lastName} ({parent.user.email})
                        </label>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="flex justify-between mt-4">
                  <Button type="button" variant="outline" onClick={() => setActiveTab('informations')}>
                    Précédent
                  </Button>
                  <Button type="submit">
                    {student ? 'Enregistrer' : 'Ajouter'}
                  </Button>
                </div>
              </div>
            </TabsContent>
          </form>
        </Tabs>
        
        <DialogFooter className="mt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Annuler
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 


