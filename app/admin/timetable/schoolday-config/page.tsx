'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import SchoolDayConfigForm from '@/components/timetable/SchoolDayConfigForm'
import SchoolDayConfigList from '@/components/timetable/SchoolDayConfigList'
import { toast } from 'react-hot-toast'

export default function SchoolDayConfigPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isGenerating, setIsGenerating] = useState(false)

  // Rediriger si l'utilisateur n'est pas un administrateur
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
      router.push('/')
    }
  }, [session, status, router])

  const handleGenerateTimeSlots = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch('/api/timetable/generate-timeslots', {
        method: 'POST',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Erreur lors de la g�n�ration des cr�neaux horaires')
      }

      const data = await response.json()
      toast.success(`${data.count} cr�neaux horaires g�n�r�s avec succ�s`)
    } catch (error) {
      console.error('Erreur:', error)
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la g�n�ration des cr�neaux horaires')
    } finally {
      setIsGenerating(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4">Chargement...</p>
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    router.push('/auth/login')
    return null
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Gestion des horaires de journ�e</h1>
          <p className="text-gray-600">
            Configurez les heures de d�but et de fin de journ�e ainsi que les pauses pour chaque jour de la semaine.
          </p>
        </div>
        <Button 
          onClick={handleGenerateTimeSlots} 
          disabled={isGenerating}
          className="bg-green-600 hover:bg-green-700"
        >
          {isGenerating ? 'G�n�ration...' : 'G�n�rer les cr�neaux horaires'}
        </Button>
      </div>

      <SchoolDayConfigList />
    </div>
  )
} 


