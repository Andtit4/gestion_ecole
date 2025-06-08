'use client'

import { useSession } from 'next-auth/react'
import PeriodsManagement from '@/components/periods/PeriodsManagement'

export default function PeriodsPage() {
  const { data: session, status } = useSession()

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

  if (!session || session.user.role !== 'ADMIN') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Acc�s refus�</h1>
          <p className="text-gray-600">Vous n'avez pas les permissions n�cessaires pour acc�der � cette page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des p�riodes</h1>
        <p className="text-gray-600">
          G�rez les p�riodes scolaires (trimestres, semestres) pour l'ann�e en cours.
        </p>
      </div>

      <PeriodsManagement />
    </div>
  )
} 
