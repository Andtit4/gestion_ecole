'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../../components/ui/table'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '../../components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
import { useToast } from '../../components/ui/use-toast'
import { Tags, Pencil, Trash2, Plus, Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Textarea } from '../../components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'

// Définition du schéma de validation pour les groupes de frais
const feeGroupSchema = z.object({
  name: z.string().min(2, { message: 'Le nom doit contenir au moins 2 caractères' }),
  description: z.string().optional(),
  classId: z.string().optional().nullable(),
  level: z.string().optional().nullable(),
  year: z.number().int().positive({ message: 'L\'année doit être un nombre positif' }),
})

type FeeGroup = z.infer<typeof feeGroupSchema> & {
  id: string
  createdAt: string
  updatedAt: string
  class?: {
    id: string
    name: string
  } | null
}

type Class = {
  id: string
  name: string
  level: string
  year: number
}

export default function FeeGroupsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [feeGroups, setFeeGroups] = useState<FeeGroup[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingFeeGroup, setEditingFeeGroup] = useState<FeeGroup | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const form = useForm<z.infer<typeof feeGroupSchema>>({
    resolver: zodResolver(feeGroupSchema),
    defaultValues: {
      name: '',
      description: '',
      classId: null,
      level: null,
      year: new Date().getFullYear(),
    },
  })

  // Charger les données au chargement de la page
  useEffect(() => {
    Promise.all([
      fetchFeeGroups(),
      fetchClasses()
    ])
  }, [])

  // Récupérer les groupes de frais depuis l'API
  const fetchFeeGroups = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/feeGroups')
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des groupes de frais')
      }
      const data = await response.json()
      setFeeGroups(data)
    } catch (error) {
      console.error('Erreur:', error)
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les groupes de frais',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Récupérer les classes depuis l'API
  const fetchClasses = async () => {
    try {
      const response = await fetch('/api/classes')
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des classes')
      }
      const data = await response.json()
      setClasses(data)
    } catch (error) {
      console.error('Erreur:', error)
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les classes',
        variant: 'destructive',
      })
    }
  }

  // Fonction pour créer ou mettre à jour un groupe de frais
  const onSubmit = async (values: z.infer<typeof feeGroupSchema>) => {
    try {
      setIsSubmitting(true)
      
      const url = editingFeeGroup 
        ? `/api/feeGroups?id=${editingFeeGroup.id}` 
        : '/api/feeGroups'
      
      const method = editingFeeGroup ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error(`Erreur lors de ${editingFeeGroup ? 'la mise à jour' : 'la création'} du groupe de frais`)
      }

      toast({
        title: 'Succès',
        description: `Groupe de frais ${editingFeeGroup ? 'mis à jour' : 'créé'} avec succès`,
      })

      setIsDialogOpen(false)
      resetForm()
      fetchFeeGroups()
    } catch (error) {
      console.error('Erreur:', error)
      toast({
        title: 'Erreur',
        description: `Impossible de ${editingFeeGroup ? 'mettre à jour' : 'créer'} le groupe de frais`,
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Fonction pour supprimer un groupe de frais
  const deleteFeeGroup = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce groupe de frais?')) {
      return
    }

    try {
      const response = await fetch(`/api/feeGroups?id=${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression du groupe de frais')
      }

      toast({
        title: 'Succès',
        description: 'Groupe de frais supprimé avec succès',
      })

      fetchFeeGroups()
    } catch (error) {
      console.error('Erreur:', error)
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer le groupe de frais',
        variant: 'destructive',
      })
    }
  }

  // Ouvrir le formulaire pour l'édition
  const handleEdit = (feeGroup: FeeGroup) => {
    setEditingFeeGroup(feeGroup)
    form.reset({
      name: feeGroup.name,
      description: feeGroup.description || '',
      classId: feeGroup.classId || null,
      level: feeGroup.level || null,
      year: feeGroup.year,
    })
    setIsDialogOpen(true)
  }

  // Ouvrir le formulaire pour la création
  const handleCreate = () => {
    setEditingFeeGroup(null)
    resetForm()
    setIsDialogOpen(true)
  }

  // Réinitialiser le formulaire
  const resetForm = () => {
    form.reset({
      name: '',
      description: '',
      classId: null,
      level: null,
      year: new Date().getFullYear(),
    })
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">Groupes de frais</CardTitle>
            <CardDescription>
              Organisez les frais par niveaux ou classes
            </CardDescription>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau groupe
          </Button>
        </CardHeader>
      </Card>

      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <Card>
          <CardContent className="p-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Classe</TableHead>
                  <TableHead>Niveau</TableHead>
                  <TableHead>Année</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {feeGroups.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Aucun groupe de frais trouvé. Créez votre premier groupe de frais!
                    </TableCell>
                  </TableRow>
                ) : (
                  feeGroups.map((feeGroup) => (
                    <TableRow key={feeGroup.id}>
                      <TableCell className="font-medium">{feeGroup.name}</TableCell>
                      <TableCell>{feeGroup.description || '-'}</TableCell>
                      <TableCell>{feeGroup.class?.name || '-'}</TableCell>
                      <TableCell>{feeGroup.level || '-'}</TableCell>
                      <TableCell>{feeGroup.year}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(feeGroup)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteFeeGroup(feeGroup.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingFeeGroup ? 'Modifier le groupe de frais' : 'Créer un groupe de frais'}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom</FormLabel>
                    <FormControl>
                      <Input placeholder="Frais de scolarité 2023-2024" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Description du groupe de frais" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="classId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Classe (optionnel)</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value || undefined}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez une classe" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="">Aucune classe spécifique</SelectItem>
                          {classes.map((classItem) => (
                            <SelectItem key={classItem.id} value={classItem.id}>
                              {classItem.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Si spécifié, ce groupe sera associé uniquement à cette classe
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Niveau (optionnel)</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value || undefined}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez un niveau" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="">Aucun niveau spécifique</SelectItem>
                          <SelectItem value="CP">CP</SelectItem>
                          <SelectItem value="CE1">CE1</SelectItem>
                          <SelectItem value="CE2">CE2</SelectItem>
                          <SelectItem value="CM1">CM1</SelectItem>
                          <SelectItem value="CM2">CM2</SelectItem>
                          <SelectItem value="6ème">6ème</SelectItem>
                          <SelectItem value="5ème">5ème</SelectItem>
                          <SelectItem value="4ème">4ème</SelectItem>
                          <SelectItem value="3ème">3ème</SelectItem>
                          <SelectItem value="2nde">2nde</SelectItem>
                          <SelectItem value="1ère">1ère</SelectItem>
                          <SelectItem value="Terminale">Terminale</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Si spécifié, ce groupe sera associé à toutes les classes de ce niveau
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Année scolaire</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                      />
                    </FormControl>
                    <FormDescription>
                      L'année scolaire à laquelle ce groupe de frais s'applique
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    resetForm()
                    setIsDialogOpen(false)
                  }}
                >
                  Annuler
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingFeeGroup ? 'Mettre à jour' : 'Créer'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
} 


