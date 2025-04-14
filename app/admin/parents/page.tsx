'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import ParentList from '@/app/components/parents/ParentList'
import ParentForm from '@/app/components/parents/ParentForm'
import LoadingSpinner from '@/app/components/ui/LoadingSpinner'

export default function ParentsPage() {
  const { data: session, status } = useSession()
  const [isAddingParent, setIsAddingParent] = useState(false)

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
            Gestion des Parents
          </h1>
          <button
            onClick={() => setIsAddingParent(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Ajouter un parent
          </button>
        </div>

        {isAddingParent && (
          <div className="mt-6">
            <ParentForm onClose={() => setIsAddingParent(false)} />
          </div>
        )}

        <div className="mt-6">
          <ParentList />
        </div>
      </div>
    </div>
  )
} 