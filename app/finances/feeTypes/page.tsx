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
  DialogTrigger,
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
import { Checkbox } from '../../components/ui/checkbox'
import { useToast } from '../../components/ui/use-toast'
import { Tag, Pencil, Trash2, Plus, Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Textarea } from '../../components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'

// Définition du schéma de validation pour les types de frais
const feeTypeSchema = z.object({
  name: z.string().min(2, { message: 'Le nom doit contenir au moins 2 caractères' }),
  description: z.string().optional(),
  isRecurrent: z.boolean().default(false),
  frequency: z.string().optional().nullable(),
})

type FeeType = z.infer<typeof feeTypeSchema> & {
  id: string
  createdAt: string
  updatedAt: string
}

export default function FeeTypesPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [feeTypes, setFeeTypes] = useState<FeeType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingFeeType, setEditingFeeType] = useState<FeeType | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const form = useForm<z.infer<typeof feeTypeSchema>>({
    resolver: zodResolver(feeTypeSchema),
    defaultValues: {
      name: '',
      description: '',
      isRecurrent: false,
      frequency: null,
    },
  })

  // Charger les types de frais au chargement de la page
  useEffect(() => {
    fetchFeeTypes()
  }, [])

  // Récupérer les types de frais depuis l'API
  const fetchFeeTypes = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/feeTypes')
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des types de frais')
      }
      const data = await response.json()
      setFeeTypes(data)
    } catch (error) {
      console.error('Erreur:', error)
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les types de frais',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Fonction pour créer ou mettre à jour un type de frais
  const onSubmit = async (values: z.infer<typeof feeTypeSchema>) => {
    try {
      setIsSubmitting(true)
      
      const url = editingFeeType 
        ? `/api/feeTypes?id=${editingFeeType.id}` 
        : '/api/feeTypes'
      
      const method = editingFeeType ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error(`Erreur lors de ${editingFeeType ? 'la mise à jour' : 'la création'} du type de frais`)
      }

      toast({
        title: 'Succès',
        description: `Type de frais ${editingFeeType ? 'mis à jour' : 'créé'} avec succès`,
      })

      setIsDialogOpen(false)
      resetForm()
      fetchFeeTypes()
    } catch (error) {
      console.error('Erreur:', error)
      toast({
        title: 'Erreur',
        description: `Impossible de ${editingFeeType ? 'mettre à jour' : 'créer'} le type de frais`,
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Fonction pour supprimer un type de frais
  const deleteFeeType = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce type de frais?')) {
      return
    }

    try {
      const response = await fetch(`/api/feeTypes?id=${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression du type de frais')
      }

      toast({
        title: 'Succès',
        description: 'Type de frais supprimé avec succès',
      })

      fetchFeeTypes()
    } catch (error) {
      console.error('Erreur:', error)
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer le type de frais',
        variant: 'destructive',
      })
    }
  }

  // Ouvrir le formulaire pour l'édition
  const handleEdit = (feeType: FeeType) => {
    setEditingFeeType(feeType)
    form.reset({
      name: feeType.name,
      description: feeType.description || '',
      isRecurrent: feeType.isRecurrent,
      frequency: feeType.frequency || null,
    })
    setIsDialogOpen(true)
  }

  // Ouvrir le formulaire pour la création
  const handleCreate = () => {
    setEditingFeeType(null)
    resetForm()
    setIsDialogOpen(true)
  }

  // Réinitialiser le formulaire
  const resetForm = () => {
    form.reset({
      name: '',
      description: '',
      isRecurrent: false,
      frequency: null,
    })
  }

  // Formatter la fréquence pour l'affichage
  const formatFrequency = (frequency: string | null | undefined) => {
    if (!frequency) return 'N/A'
    
    const frequencies: Record<string, string> = {
      'ONCE': 'Unique',
      'MONTHLY': 'Mensuel',
      'QUARTERLY': 'Trimestriel',
      'SEMI_ANNUAL': 'Semestriel',
      'ANNUAL': 'Annuel'
    }
    
    return frequencies[frequency] || frequency
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">Types de frais</CardTitle>
            <CardDescription>
              Gérez les différentes catégories de frais scolaires
            </CardDescription>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau type
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
                  <TableHead>Récurrent</TableHead>
                  <TableHead>Fréquence</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {feeTypes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      Aucun type de frais trouvé. Créez votre premier type de frais!
                    </TableCell>
                  </TableRow>
                ) : (
                  feeTypes.map((feeType) => (
                    <TableRow key={feeType.id}>
                      <TableCell className="font-medium">{feeType.name}</TableCell>
                      <TableCell>{feeType.description || '-'}</TableCell>
                      <TableCell>{feeType.isRecurrent ? 'Oui' : 'Non'}</TableCell>
                      <TableCell>{formatFrequency(feeType.frequency)}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(feeType)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteFeeType(feeType.id)}>
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
            <DialogTitle>{editingFeeType ? 'Modifier le type de frais' : 'Créer un type de frais'}</DialogTitle>
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
                      <Input placeholder="Frais de scolarité" {...field} />
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
                      <Textarea placeholder="Description du type de frais" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isRecurrent"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          field.onChange(checked)
                          if (!checked) {
                            form.setValue('frequency', null)
                          }
                        }}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Récurrent</FormLabel>
                      <FormDescription>
                        Ce type de frais est-il facturé de façon récurrente?
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              {form.watch('isRecurrent') && (
                <FormField
                  control={form.control}
                  name="frequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fréquence</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value || undefined}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez une fréquence" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="MONTHLY">Mensuel</SelectItem>
                          <SelectItem value="QUARTERLY">Trimestriel</SelectItem>
                          <SelectItem value="SEMI_ANNUAL">Semestriel</SelectItem>
                          <SelectItem value="ANNUAL">Annuel</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

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
                  {editingFeeType ? 'Mettre à jour' : 'Créer'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
} 


