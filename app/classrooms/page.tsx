'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useToast } from '@/components/ui/use-toast'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface Classroom {
  id: string
  name: string
  capacity?: number
  floor?: number
  building?: string
  description?: string
}

export default function ClassroomsPage() {
  const { data: session, status } = useSession()
  const { toast } = useToast()
  const [classrooms, setClassrooms] = useState<Classroom[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formType, setFormType] = useState<'add' | 'edit'>('add')
  const [selectedClassroom, setSelectedClassroom] = useState<Classroom | null>(null)
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    capacity: '',
    floor: '',
    building: '',
    description: '',
  })

  useEffect(() => {
    if (status === 'authenticated') {
      fetchClassrooms()
    }
  }, [status])

  const fetchClassrooms = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/classrooms')
      if (!response.ok) throw new Error('Erreur lors de la récupération des salles')
      
      const data = await response.json()
      setClassrooms(data)
    } catch (error) {
      console.error('Erreur:', error)
      toast({
        title: 'Erreur',
        description: 'Impossible de charger la liste des salles',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const openAddForm = () => {
    setFormData({
      id: '',
      name: '',
      capacity: '',
      floor: '',
      building: '',
      description: '',
    })
    setFormType('add')
    setIsFormOpen(true)
  }

  const openEditForm = (classroom: Classroom) => {
    setFormData({
      id: classroom.id,
      name: classroom.name,
      capacity: classroom.capacity ? String(classroom.capacity) : '',
      floor: classroom.floor ? String(classroom.floor) : '',
      building: classroom.building || '',
      description: classroom.description || '',
    })
    setSelectedClassroom(classroom)
    setFormType('edit')
    setIsFormOpen(true)
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!formData.name.trim()) {
      toast({
        title: 'Erreur',
        description: 'Le nom de la salle est requis',
        variant: 'destructive',
      })
      return
    }
    
    // Préparer les données
    const dataToSend = {
      id: formData.id,
      name: formData.name.trim(),
      ...(formData.capacity && { capacity: parseInt(formData.capacity) }),
      ...(formData.floor && { floor: parseInt(formData.floor) }),
      ...(formData.building && { building: formData.building.trim() }),
      ...(formData.description && { description: formData.description.trim() }),
    }
    
    try {
      const method = formType === 'add' ? 'POST' : 'PUT'
      const url = '/api/classrooms'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Une erreur est survenue')
      }
      
      toast({
        title: 'Succès',
        description: formType === 'add' ? 'Salle ajoutée avec succès' : 'Salle mise à jour avec succès',
      })
      
      setIsFormOpen(false)
      fetchClassrooms()
    } catch (error) {
      console.error('Erreur:', error)
      toast({
        title: 'Erreur',
        description: error.message || 'Une erreur est survenue',
        variant: 'destructive',
      })
    }
  }
  
  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette salle?')) return
    
    try {
      const response = await fetch(`/api/classrooms?id=${id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Une erreur est survenue')
      }
      
      toast({
        title: 'Succès',
        description: 'Salle supprimée avec succès',
      })
      
      fetchClassrooms()
    } catch (error) {
      console.error('Erreur:', error)
      toast({
        title: 'Erreur',
        description: error.message || 'Une erreur est survenue',
        variant: 'destructive',
      })
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center h-[60vh]">
          <p>Chargement...</p>
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center h-[60vh]">
          <p>Veuillez vous connecter pour accéder à cette page.</p>
        </div>
      </div>
    )
  }

  if (session?.user.role !== 'ADMIN') {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center h-[60vh]">
          <p>Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestion des salles</h1>
        <Button onClick={openAddForm}>Ajouter une salle</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des salles</CardTitle>
          <CardDescription>
            Gérez les salles disponibles dans l'établissement
          </CardDescription>
        </CardHeader>
        <CardContent>
          {classrooms.length === 0 ? (
            <p className="text-center py-4">Aucune salle n'a été ajoutée</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Bâtiment</TableHead>
                  <TableHead>Étage</TableHead>
                  <TableHead>Capacité</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {classrooms.map((classroom) => (
                  <TableRow key={classroom.id}>
                    <TableCell className="font-medium">{classroom.name}</TableCell>
                    <TableCell>{classroom.building || '-'}</TableCell>
                    <TableCell>{classroom.floor !== undefined && classroom.floor !== null ? classroom.floor : '-'}</TableCell>
                    <TableCell>{classroom.capacity || '-'}</TableCell>
                    <TableCell className="max-w-xs truncate">{classroom.description || '-'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => openEditForm(classroom)}
                        >
                          Modifier
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDelete(classroom.id)}
                        >
                          Supprimer
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Formulaire d'ajout/modification */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>
              {formType === 'add' ? 'Ajouter une salle' : 'Modifier une salle'}
            </DialogTitle>
            <DialogDescription>
              Remplissez les champs ci-dessous pour {formType === 'add' ? 'ajouter une nouvelle salle' : 'mettre à jour la salle'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nom*
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="building" className="text-right">
                  Bâtiment
                </Label>
                <Input
                  id="building"
                  name="building"
                  value={formData.building}
                  onChange={handleFormChange}
                  className="col-span-3"
                  placeholder="Ex: Bâtiment A"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="floor" className="text-right">
                  Étage
                </Label>
                <Input
                  id="floor"
                  name="floor"
                  type="number"
                  value={formData.floor}
                  onChange={handleFormChange}
                  className="col-span-3"
                  placeholder="Ex: 1, 2, 3..."
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="capacity" className="text-right">
                  Capacité
                </Label>
                <Input
                  id="capacity"
                  name="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={handleFormChange}
                  className="col-span-3"
                  min="1"
                  placeholder="Nombre d'élèves"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Input
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  className="col-span-3"
                  placeholder="Description optionnelle"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                Annuler
              </Button>
              <Button type="submit">
                {formType === 'add' ? 'Ajouter' : 'Mettre à jour'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
} 


