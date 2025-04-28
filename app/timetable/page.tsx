'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useToast } from '@/components/ui/use-toast'
import ClassTimetable from '@/components/timetable/ClassTimetable'

interface Class {
  id: string
  name: string
}

export default function TimetablePage() {
  const { data: session, status } = useSession()
  const { toast } = useToast()
  const [classes, setClasses] = useState<Class[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'authenticated') {
      fetchClasses()
    }
  }, [status])

  const fetchClasses = async () => {
    try {
      const response = await fetch('/api/classes')
      if (!response.ok) throw new Error('Erreur lors de la récupération des classes')
      const data = await response.json()
      setClasses(data)
    } catch (error) {
      console.error('Erreur lors du chargement des classes:', error)
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les classes',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-[60vh]">
          <p>Chargement...</p>
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-[60vh]">
          <p>Veuillez vous connecter pour accéder à cette page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Gestion des emplois du temps</h1>

      <ClassTimetable classes={classes} />
    </div>
  )
} 