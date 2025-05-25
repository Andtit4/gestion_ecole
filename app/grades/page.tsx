'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import AddGradeDialog from './components/AddGradeDialog'
import GradesTable from './components/GradesTable'
import { Grade } from '@prisma/client'

// Type pour représenter les notes avec les détails inclus
type GradeWithDetails = Grade & {
  student: {
    id: string;
    user?: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
    };
  };
  course: {
    id: string;
    name: string;
  };
}

export default function GradesPage() {
  const [grades, setGrades] = useState<GradeWithDetails[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)

  const fetchGrades = async () => {
    try {
      const response = await fetch('/api/grades', {
        credentials: 'include', // Assurez-vous d'inclure les cookies pour l'authentification
      })
      if (!response.ok) throw new Error('Erreur lors du chargement des notes')
      const data = await response.json()
      console.log('Données de notes reçues:', data)
      setGrades(data)
    } catch (error) {
      console.error('Erreur lors du chargement des notes:', error)
      toast({
        title: "Erreur",
        description: "Impossible de charger les notes",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchGrades()
  }, [])

  const handleAddGrade = async (newGrade: Omit<Grade, 'id'>) => {
    try {
      console.log('Envoi de nouvelle note:', newGrade)
      const response = await fetch('/api/grades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newGrade),
        credentials: 'include', // Inclure les cookies pour l'authentification
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Erreur réponse API:', errorData)
        throw new Error(`Erreur lors de l'ajout de la note: ${response.status}`)
      }
      
      toast({
        title: "Succès",
        description: "La note a été ajoutée avec succès",
      })
      
      setIsAddDialogOpen(false)
      fetchGrades()
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la note:', error)
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la note",
        variant: "destructive"
      })
    }
  }

  const handleDeleteGrade = async (id: string) => {
    try {
      const response = await fetch(`/api/grades/${id}`, {
        method: 'DELETE',
        credentials: 'include', // Inclure les cookies pour l'authentification
      })

      if (!response.ok) throw new Error('Erreur lors de la suppression de la note')
      
      toast({
        title: "Succès",
        description: "La note a été supprimée avec succès",
      })
      
      fetchGrades()
    } catch (error) {
      console.error('Erreur lors de la suppression de la note:', error)
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la note",
        variant: "destructive"
      })
    }
  }

  const handleUpdateGrade = async (id: string, updatedGrade: Partial<Grade>) => {
    try {
      const response = await fetch(`/api/grades/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedGrade),
        credentials: 'include', // Inclure les cookies pour l'authentification
      })

      if (!response.ok) throw new Error('Erreur lors de la modification de la note')
      
      toast({
        title: "Succès",
        description: "La note a été modifiée avec succès",
      })
      
      fetchGrades()
    } catch (error) {
      console.error('Erreur lors de la modification de la note:', error)
      toast({
        title: "Erreur",
        description: "Impossible de modifier la note",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestion des Notes</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          Ajouter une note
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center">Chargement des notes...</div>
      ) : (
        <GradesTable 
          grades={grades}
          onDelete={handleDeleteGrade}
          onUpdate={handleUpdateGrade}
        />
      )}

      <AddGradeDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleAddGrade}
      />
    </div>
  )
} 