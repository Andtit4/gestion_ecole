'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import LoadingSpinner from '@/app/components/ui/LoadingSpinner'
import ScheduleManager from '@/app/components/timetable/ScheduleManager'

export default function SchedulePage() {
  const { data: session, status } = useSession()
  const [selectedClass, setSelectedClass] = useState<string | null>(null)
  const [classes, setClasses] = useState<Array<{ id: string, name: string }>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Charger la liste des classes
    const fetchClasses = async () => {
      try {
        const response = await fetch('/api/classes')
        if (response.ok) {
          const data = await response.json()
          setClasses(data)
          if (data.length > 0) {
            setSelectedClass(data[0].id)
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement des classes:', error)
      } finally {
        setLoading(false)
      }
    }

    if (session) {
      fetchClasses()
    }
  }, [session])

  if (status === 'loading' || loading) {
    return <LoadingSpinner />
  }

  if (!session || session.user.role !== 'ADMIN') {
    return <div>Accès non autorisé</div>
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">
            Gestion des emplois du temps
          </h1>
          
          {classes.length > 0 ? (
            <div>
              <div className="mb-4">
                <label htmlFor="class-select" className="block text-sm font-medium text-gray-700 mb-1">
                  Sélectionner une classe
                </label>
                <select
                  id="class-select"
                  value={selectedClass || ''}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {selectedClass && (
                <ScheduleManager classId={selectedClass} />
              )}
            </div>
          ) : (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    Aucune classe n'a été créée. Veuillez d'abord créer des classes.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 