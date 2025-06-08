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
} from '@/components/ui/table'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '@/components/ui/use-toast'
import { BanknoteIcon, CalendarIcon, Pencil, Trash2, Plus, Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'

// Définition du schéma de validation pour les éléments de frais
const feeItemSchema = z.object({
  name: z.string().min(2, { message: 'Le nom doit contenir au moins 2 caractères' }),
  amount: z.number().positive({ message: 'Le montant doit être un nombre positif' }),
  dueDate: z.date().optional().nullable(),
  description: z.string().optional(),
  mandatory: z.boolean().default(true),
  feeTypeId: z.string().min(1, { message: 'Veuillez sélectionner un type de frais' }),
  feeGroupId: z.string().min(1, { message: 'Veuillez sélectionner un groupe de frais' }),
})

type FeeItem = z.infer<typeof feeItemSchema> & {
  id: string
  createdAt: string
  updatedAt: string
  feeType: {
    id: string
    name: string
  }
  feeGroup: {
    id: string
    name: string
  }
}

type FeeType = {
  id: string
  name: string
}

type FeeGroup = {
  id: string
  name: string
}

export default function FeeItemsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [feeItems, setFeeItems] = useState<FeeItem[]>([])
  const [feeTypes, setFeeTypes] = useState<FeeType[]>([])
  const [feeGroups, setFeeGroups] = useState<FeeGroup[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingFeeItem, setEditingFeeItem] = useState<FeeItem | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const form = useForm<z.infer<typeof feeItemSchema>>({
    resolver: zodResolver(feeItemSchema),
    defaultValues: {
      name: '',
      amount: 0,
      dueDate: null,
      description: '',
      mandatory: true,
      feeTypeId: '',
      feeGroupId: '',
    },
  })

  // Charger les données au chargement de la page
  useEffect(() => {
    Promise.all([
      fetchFeeItems(),
      fetchFeeTypes(),
      fetchFeeGroups()
    ])
  }, [])

  // Récupérer les éléments de frais depuis l'API
  const fetchFeeItems = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/feeItems')
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des éléments de frais')
      }
      const data = await response.json()
      setFeeItems(data)
    } catch (error) {
      console.error('Erreur:', error)
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les éléments de frais',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Récupérer les types de frais depuis l'API
  const fetchFeeTypes = async () => {
    try {
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
    }
  }

  // Récupérer les groupes de frais depuis l'API
  const fetchFeeGroups = async () => {
    try {
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
    }
  }

  // Fonction pour créer ou mettre à jour un élément de frais
  const onSubmit = async (values: z.infer<typeof feeItemSchema>) => {
    try {
      setIsSubmitting(true)
      
      const url = editingFeeItem 
        ? `/api/feeItems?id=${editingFeeItem.id}` 
        : '/api/feeItems'
      
      const method = editingFeeItem ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error(`Erreur lors de ${editingFeeItem ? 'la mise à jour' : 'la création'} de l'élément de frais`)
      }

      toast({
        title: 'Succès',
        description: `Élément de frais ${editingFeeItem ? 'mis à jour' : 'créé'} avec succès`,
      })

      setIsDialogOpen(false)
      resetForm()
      fetchFeeItems()
    } catch (error) {
      console.error('Erreur:', error)
      toast({
        title: 'Erreur',
        description: `Impossible de ${editingFeeItem ? 'mettre à jour' : 'créer'} l'élément de frais`,
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Fonction pour supprimer un élément de frais
  const deleteFeeItem = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet élément de frais?')) {
      return
    }

    try {
      const response = await fetch(`/api/feeItems?id=${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression de l\'élément de frais')
      }

      toast({
        title: 'Succès',
        description: 'Élément de frais supprimé avec succès',
      })

      fetchFeeItems()
    } catch (error) {
      console.error('Erreur:', error)
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer l\'élément de frais',
        variant: 'destructive',
      })
    }
  }

  // Ouvrir le formulaire pour l'édition
  const handleEdit = (feeItem: FeeItem) => {
    setEditingFeeItem(feeItem)
    form.reset({
      name: feeItem.name,
      amount: feeItem.amount,
      dueDate: feeItem.dueDate ? new Date(feeItem.dueDate) : null,
      description: feeItem.description || '',
      mandatory: feeItem.mandatory,
      feeTypeId: feeItem.feeTypeId,
      feeGroupId: feeItem.feeGroupId,
    })
    setIsDialogOpen(true)
  }

  // Ouvrir le formulaire pour la création
  const handleCreate = () => {
    setEditingFeeItem(null)
    resetForm()
    setIsDialogOpen(true)
  }

  // Réinitialiser le formulaire
  const resetForm = () => {
    form.reset({
      name: '',
      amount: 0,
      dueDate: null,
      description: '',
      mandatory: true,
      feeTypeId: '',
      feeGroupId: '',
    })
  }

  // Formater le montant en devise
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount)
  }

  // Formater la date
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return '-'
    return format(new Date(dateString), 'dd MMMM yyyy', { locale: fr })
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">Éléments de frais</CardTitle>
            <CardDescription>
              Gérez les frais individuels et leurs montants
            </CardDescription>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvel élément
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
                  <TableHead>Montant</TableHead>
                  <TableHead>Date d'échéance</TableHead>
                  <TableHead>Type de frais</TableHead>
                  <TableHead>Groupe</TableHead>
                  <TableHead>Obligatoire</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {feeItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Aucun élément de frais trouvé. Créez votre premier élément de frais!
                    </TableCell>
                  </TableRow>
                ) : (
                  feeItems.map((feeItem) => (
                    <TableRow key={feeItem.id}>
                      <TableCell className="font-medium">{feeItem.name}</TableCell>
                      <TableCell>{formatCurrency(feeItem.amount)}</TableCell>
                      <TableCell>{formatDate(feeItem.dueDate)}</TableCell>
                      <TableCell>{feeItem.feeType.name}</TableCell>
                      <TableCell>{feeItem.feeGroup.name}</TableCell>
                      <TableCell>{feeItem.mandatory ? 'Oui' : 'Non'}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(feeItem)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteFeeItem(feeItem.id)}>
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingFeeItem ? 'Modifier l\'élément de frais' : 'Créer un élément de frais'}</DialogTitle>
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
                      <Input placeholder="Frais d'inscription" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Montant (€)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        step="0.01"
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
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date d'échéance</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "dd MMMM yyyy", { locale: fr })
                            ) : (
                              <span>Choisir une date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value || undefined}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      La date à laquelle ce frais doit être payé
                    </FormDescription>
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
                      <Textarea placeholder="Description de l'élément de frais" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mandatory"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Obligatoire</FormLabel>
                      <FormDescription>
                        Ce frais est-il obligatoire pour tous les élèves?
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="feeTypeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type de frais</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez un type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {feeTypes.map((feeType) => (
                            <SelectItem key={feeType.id} value={feeType.id}>
                              {feeType.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="feeGroupId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Groupe de frais</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez un groupe" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {feeGroups.map((feeGroup) => (
                            <SelectItem key={feeGroup.id} value={feeGroup.id}>
                              {feeGroup.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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
                  {editingFeeItem ? 'Mettre à jour' : 'Créer'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
} 


