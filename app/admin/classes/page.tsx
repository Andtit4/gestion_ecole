'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import ClassList from '@/components/classes/ClassList'
import ClassForm from '@/components/classes/ClassForm'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

export default function ClassesPage() {
  const { data: session, status } = useSession()
  const [isAddingClass, setIsAddingClass] = useState(false)

  if (status === 'loading') {
    return <LoadingSpinner />
  }

  if (!session || session.user.role !== 'ADMIN') {
    return <div>Accès non autorisé</div>
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">
            Gestion des Classes
          </h1>
          <button
            onClick={() => setIsAddingClass(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Ajouter une classe
          </button>
        </div>

        {isAddingClass && (
          <div className="mt-6">
            <ClassForm onClose={() => setIsAddingClass(false)} />
          </div>
        )}

        <div className="mt-6">
          <ClassList />
        </div>
      </div>
    </div>
  )
} 


