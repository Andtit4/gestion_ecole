'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import StudentList from '@/app/components/students/StudentList'
import StudentForm from '@/app/components/students/StudentForm'
import LoadingSpinner from '@/app/components/ui/LoadingSpinner'

export default function StudentsPage() {
  const { data: session, status } = useSession()
  const [isAddingStudent, setIsAddingStudent] = useState(false)

  if (status === 'loading') {
    return <LoadingSpinner />
  }

  if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'TEACHER')) {
    return <div>Accès non autorisé</div>
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">
            Gestion des Élèves
          </h1>
          <button
            onClick={() => setIsAddingStudent(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Ajouter un élève
          </button>
        </div>

        {isAddingStudent && (
          <div className="mt-6">
            <StudentForm onClose={() => setIsAddingStudent(false)} />
          </div>
        )}

        <div className="mt-6">
          <StudentList />
        </div>
      </div>
    </div>
  )
} 