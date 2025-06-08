'use client'

import { useState } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface SchoolDayConfig {
  id?: string
  dayOfWeek: string
  dayStartTime: string
  dayEndTime: string
  breakStartTime: string
  breakEndTime: string
}

interface SchoolDayConfigFormProps {
  config?: SchoolDayConfig
  onSuccess: () => void
}

export default function SchoolDayConfigForm({ config, onSuccess }: SchoolDayConfigFormProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<SchoolDayConfig>(
    config || {
      dayOfWeek: 'MONDAY',
      dayStartTime: '08:00',
      dayEndTime: '17:00',
      breakStartTime: '12:00',
      breakEndTime: '13:00',
    }
  )

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validation
      const timeValues = [
        formData.dayStartTime,
        formData.dayEndTime,
        formData.breakStartTime,
        formData.breakEndTime
      ]
      
      // Vérifier que les horaires sont dans l'ordre logique
      if (formData.dayStartTime >= formData.breakStartTime) {
        throw new Error("L'heure de début de journée doit être avant l'heure de début de pause")
      }
      
      if (formData.breakStartTime >= formData.breakEndTime) {
        throw new Error("L'heure de début de pause doit être avant l'heure de fin de pause")
      }
      
      if (formData.breakEndTime >= formData.dayEndTime) {
        throw new Error("L'heure de fin de pause doit être avant l'heure de fin de journée")
      }

      // Déterminer l'URL et la méthode
      const url = config?.id 
        ? `/api/timetable/schoolday-config/${config.id}` 
        : '/api/timetable/schoolday-config'
      const method = config?.id ? 'PUT' : 'POST'

      // Envoyer les données
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Une erreur est survenue')
      }

      toast({
        title: 'Succès',
        description: `Configuration ${config?.id ? 'modifiée' : 'ajoutée'} avec succès`,
        variant: 'success',
      })

      onSuccess()
    } catch (error: any) {
      console.error('Erreur:', error)
      toast({
        title: 'Erreur',
        description: error.message || 'Une erreur est survenue',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {config?.id ? 'Modifier la configuration' : 'Configurer la journée scolaire'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="dayOfWeek">Jour de la semaine</Label>
            <Select
              value={formData.dayOfWeek}
              onValueChange={(value) => handleChange('dayOfWeek', value)}
              disabled={!!config?.id}
            >
              <SelectTrigger id="dayOfWeek">
                <SelectValue placeholder="Sélectionner un jour" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MONDAY">Lundi</SelectItem>
                <SelectItem value="TUESDAY">Mardi</SelectItem>
                <SelectItem value="WEDNESDAY">Mercredi</SelectItem>
                <SelectItem value="THURSDAY">Jeudi</SelectItem>
                <SelectItem value="FRIDAY">Vendredi</SelectItem>
                <SelectItem value="SATURDAY">Samedi</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dayStartTime">Début de journée</Label>
              <Input
                id="dayStartTime"
                type="time"
                value={formData.dayStartTime}
                onChange={(e) => handleChange('dayStartTime', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dayEndTime">Fin de journée</Label>
              <Input
                id="dayEndTime"
                type="time"
                value={formData.dayEndTime}
                onChange={(e) => handleChange('dayEndTime', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="breakStartTime">Début de pause</Label>
              <Input
                id="breakStartTime"
                type="time"
                value={formData.breakStartTime}
                onChange={(e) => handleChange('breakStartTime', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="breakEndTime">Fin de pause</Label>
              <Input
                id="breakEndTime"
                type="time"
                value={formData.breakEndTime}
                onChange={(e) => handleChange('breakEndTime', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? 'Enregistrement...'
                : config?.id
                ? 'Mettre à jour'
                : 'Enregistrer'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
} 


