'use client'

import { useState, useEffect } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import SchoolDayConfigForm from './SchoolDayConfigForm'

interface SchoolDayConfig {
  id: string
  dayOfWeek: string
  dayStartTime: string
  dayEndTime: string
  breakStartTime: string
  breakEndTime: string
}

const dayOfWeekLabels: Record<string, string> = {
  MONDAY: 'Lundi',
  TUESDAY: 'Mardi',
  WEDNESDAY: 'Mercredi',
  THURSDAY: 'Jeudi',
  FRIDAY: 'Vendredi',
  SATURDAY: 'Samedi',
  SUNDAY: 'Dimanche',
}

export default function SchoolDayConfigList() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [configs, setConfigs] = useState<SchoolDayConfig[]>([])
  const [editingConfig, setEditingConfig] = useState<SchoolDayConfig | null>(null)
  const [addingDay, setAddingDay] = useState(false)

  useEffect(() => {
    fetchConfigs()
  }, [])

  const fetchConfigs = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/timetable/schoolday-config')
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des configurations')
      }
      const data = await response.json()
      setConfigs(data)
    } catch (error) {
      console.error('Erreur:', error)
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les configurations des journées',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette configuration ?')) {
      return
    }

    try {
      const response = await fetch(`/api/timetable/schoolday-config/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression')
      }

      toast({
        title: 'Succès',
        description: 'Configuration supprimée avec succès',
        variant: 'success',
      })

      fetchConfigs()
    } catch (error) {
      console.error('Erreur:', error)
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer la configuration',
        variant: 'destructive',
      })
    }
  }

  const formatTime = (time: string) => {
    // Si c'est déjà au format ISO, extraire l'heure et les minutes
    if (time.includes('T')) {
      const date = new Date(time)
      return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
    }
    // Sinon, extraire HH:MM comme avant (cas de chaîne simple)
    return time.substring(0, 5)
  }

  const getAvailableDays = () => {
    const configuredDays = configs.map(config => config.dayOfWeek)
    return Object.keys(dayOfWeekLabels).filter(day => !configuredDays.includes(day))
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Configurations des journées scolaires</CardTitle>
          {getAvailableDays().length > 0 && (
            <Button onClick={() => setAddingDay(true)} disabled={addingDay}>
              Ajouter une journée
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Chargement...</div>
          ) : configs.length === 0 ? (
            <div className="text-center py-4">Aucune configuration trouvée</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Jour</TableHead>
                  <TableHead>Début journée</TableHead>
                  <TableHead>Fin journée</TableHead>
                  <TableHead>Début pause</TableHead>
                  <TableHead>Fin pause</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {configs.map((config) => (
                  <TableRow key={config.id}>
                    <TableCell>{dayOfWeekLabels[config.dayOfWeek]}</TableCell>
                    <TableCell>{formatTime(config.dayStartTime)}</TableCell>
                    <TableCell>{formatTime(config.dayEndTime)}</TableCell>
                    <TableCell>{formatTime(config.breakStartTime)}</TableCell>
                    <TableCell>{formatTime(config.breakEndTime)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        className="mr-2"
                        onClick={() => setEditingConfig(config)}
                      >
                        Modifier
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(config.id)}
                      >
                        Supprimer
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {addingDay && (
        <SchoolDayConfigForm
          onSuccess={() => {
            setAddingDay(false)
            fetchConfigs()
          }}
        />
      )}

      {editingConfig && (
        <SchoolDayConfigForm
          config={editingConfig}
          onSuccess={() => {
            setEditingConfig(null)
            fetchConfigs()
          }}
        />
      )}
    </div>
  )
} 


