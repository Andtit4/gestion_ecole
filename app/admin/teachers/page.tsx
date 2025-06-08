'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import TeacherList from '@/components/teachers/TeacherList'
import TeacherForm from '@/components/teachers/TeacherForm'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

export default function TeachersPage() {
  const { data: session, status } = useSession()
  const [isAddingTeacher, setIsAddingTeacher] = useState(false)

  if (status === 'loading') {
    return <LoadingSpinner />
  }

  if (!session || session.user.role !== 'ADMIN') {
    return <div>Acc�s non autoris�</div>
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">
            Gestion des Enseignants
          </h1>
          <button
            onClick={() => setIsAddingTeacher(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Ajouter un enseignant
          </button>
        </div>

        {isAddingTeacher && (
          <div className="mt-6">
            <TeacherForm onClose={() => setIsAddingTeacher(false)} />
          </div>
        )}

        <div className="mt-6">
          <TeacherList />
        </div>
      </div>
    </div>
  )
} 


