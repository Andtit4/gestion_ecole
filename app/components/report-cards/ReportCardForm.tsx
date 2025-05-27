'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '../../components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog'
import {
  Form,
  FormControl,
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
import { Textarea } from '../../components/ui/textarea'

// Types pour les données de formulaire
type Student = {
  id: string
  user: {
    id: string
    firstName: string
    lastName: string
  }
  class?: {
    id: string
    name: string
  } | null
}

type Period = {
  id: string
  type: string
  startDate: string
  endDate: string
  schoolYear: string
  status: string
}

type ReportCard = {
  id: string
  periodId: string
  studentId: string
  average: number
  appreciation?: string | null
  generatedAt: string
  status: string
  period: Period
  student: Student
}

// Schéma de validation modifié - On accepte les chaînes pour studentId et periodId pour les valeurs statiques
const reportCardSchema = z.object({
  studentId: z.string().min(1, { message: "L'élève est requis" }),
  periodId: z.string().min(1, { message: "La période est requise" }),
  average: z.number().min(0).max(20, { message: "La moyenne doit être entre 0 et 20" }),
  appreciation: z.string().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED'], {
    required_error: "Le statut est requis",
  }),
})

type FormValues = z.infer<typeof reportCardSchema>

interface ReportCardFormProps {
  initialData: ReportCard | null
  onSubmit: (data: FormValues) => void
  onCancel: () => void
}

export function ReportCardForm({ initialData, onSubmit, onCancel }: ReportCardFormProps) {
  const [students, setStudents] = useState<Student[]>([])
  const [periods, setPeriods] = useState<Period[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [loadingStudents, setLoadingStudents] = useState(false)
  const [loadingPeriods, setLoadingPeriods] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isUsingStaticData, setIsUsingStaticData] = useState(true)

  // Données statiques pour le débogage - TOUJOURS DISPONIBLES
  const staticStudents = [
    { id: "student1", user: { id: "user1", firstName: "Jean", lastName: "Dupont" } },
    { id: "student2", user: { id: "user2", firstName: "Marie", lastName: "Martin" } },
    { id: "student3", user: { id: "user3", firstName: "Lucas", lastName: "Bernard" } }
  ]

  const staticPeriods = [
    { id: "period1", type: "TRIMESTER", startDate: "2023-09-01", endDate: "2023-12-20", schoolYear: "2023-2024", status: "ACTIVE" },
    { id: "period2", type: "TRIMESTER", startDate: "2024-01-01", endDate: "2024-03-31", schoolYear: "2023-2024", status: "ACTIVE" },
    { id: "period3", type: "TRIMESTER", startDate: "2024-04-01", endDate: "2024-06-30", schoolYear: "2023-2024", status: "ACTIVE" }
  ]

  // Initialiser le formulaire avec des valeurs par défaut statiques
  const form = useForm<FormValues>({
    resolver: zodResolver(reportCardSchema),
    defaultValues: initialData ? {
      studentId: initialData.studentId,
      periodId: initialData.periodId,
      average: initialData.average,
      appreciation: initialData.appreciation || '',
      status: initialData.status as 'DRAFT' | 'PUBLISHED',
    } : {
      studentId: staticStudents[0].id,
      periodId: staticPeriods[0].id,
      average: 0,
      appreciation: '',
      status: 'DRAFT',
    },
  })
  
  // Définir immédiatement les données statiques pour que le formulaire soit utilisable
  useEffect(() => {
    setStudents(staticStudents)
    setPeriods(staticPeriods)
    // Ne pas bloquer l'interface avec un état de chargement
    setIsLoading(false)
    setIsUsingStaticData(true)
    setError("Le formulaire utilise des données de test. Les bulletins créés auront des identifiants fictifs.")
  }, [])

  // Essayer de charger les données réelles en arrière-plan
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        console.log('Tentative de chargement des élèves...')
        const response = await fetch('/api/students', { 
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          cache: 'no-store'
        })
        
        if (!response.ok) {
          console.log('API élèves indisponible, utilisation des données statiques')
          return
        }
        
        const data = await response.json()
        
        if (data && data.length > 0) {
          console.log(`${data.length} élèves chargés avec succès`)
          setStudents(data)
          setIsUsingStaticData(false)
          setError(null)
          
          // Mettre à jour la valeur dans le formulaire si c'est une valeur statique
          const currentStudentId = form.getValues('studentId')
          if (currentStudentId.startsWith('student')) {
            form.setValue('studentId', data[0].id)
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement des élèves:', error)
      }
    }

    const fetchPeriods = async () => {
      try {
        console.log('Tentative de chargement des périodes...')
        const response = await fetch('/api/periods', { 
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          cache: 'no-store'
        })
        
        if (!response.ok) {
          console.log('API périodes indisponible, utilisation des données statiques')
          return
        }
        
        const data = await response.json()
        
        if (data && data.length > 0) {
          console.log(`${data.length} périodes chargées avec succès`)
          setPeriods(data)
          setIsUsingStaticData(false)
          setError(null)
          
          // Mettre à jour la valeur dans le formulaire si c'est une valeur statique
          const currentPeriodId = form.getValues('periodId')
          if (currentPeriodId.startsWith('period')) {
            form.setValue('periodId', data[0].id)
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement des périodes:', error)
      }
    }

    // Essayer de charger les données réelles sans bloquer l'interface
    fetchStudents()
    fetchPeriods()
  }, [form])

  const handleSubmit = (values: FormValues) => {
    // Si nous utilisons des données statiques, ajuster les données avant l'envoi
    if (isUsingStaticData) {
      console.log('Utilisation de données de test pour la création du bulletin:', values);
      setError('Ce bulletin est créé avec des données de test. Il peut ne pas être lié à de vrais élèves ou périodes dans la base de données.');
    }

    // Toujours envoyer les données (l'API backend gérera la validation)
    onSubmit(values);
  }

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Modifier le bulletin' : 'Créer un bulletin'}
          </DialogTitle>
          <DialogDescription>
            {initialData 
              ? 'Modifiez les informations du bulletin de notes'
              : 'Complétez les informations pour créer un nouveau bulletin'}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded-md text-sm mb-4">
            {error}
          </div>
        )}

        {isUsingStaticData && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-md text-sm mb-4">
            Mode débogage: Utilisation de données statiques pour tester le formulaire.
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="studentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Élève</FormLabel>
                  <Select
                    disabled={!!initialData || loadingStudents}
                    onValueChange={field.onChange}
                    defaultValue={field.value || (students[0]?.id || 'student1')}
                    value={field.value || (students[0]?.id || 'student1')}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={loadingStudents ? "Chargement des élèves..." : "Sélectionner un élève"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {students.map((student) => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.user.firstName} {student.user.lastName}
                          {student.class?.name ? ` (${student.class.name})` : ''}
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
              name="periodId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Période</FormLabel>
                  <Select
                    disabled={!!initialData || loadingPeriods}
                    onValueChange={field.onChange}
                    defaultValue={field.value || (periods[0]?.id || 'period1')}
                    value={field.value || (periods[0]?.id || 'period1')}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={loadingPeriods ? "Chargement des périodes..." : "Sélectionner une période"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {periods.map((period) => (
                        <SelectItem key={period.id} value={period.id}>
                          {period.type === 'TRIMESTER' ? 'Trimestre' : 
                          period.type === 'SEMESTER' ? 'Semestre' : 'Année'} - {period.schoolYear}
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
              name="average"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Moyenne</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      max="20"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="appreciation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Appréciation</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Commentaire global sur le travail de l'élève"
                      className="resize-none"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Statut</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value || "DRAFT"}
                    value={field.value || "DRAFT"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Statut du bulletin" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="DRAFT">Brouillon</SelectItem>
                      <SelectItem value="PUBLISHED">Publié</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button variant="outline" type="button" onClick={onCancel}>
                Annuler
              </Button>
              <Button type="submit" disabled={isLoading}>
                {initialData ? 'Mettre à jour' : 'Créer'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 