'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import TeacherForm from '@/app/components/teachers/TeacherForm'
import LoadingSpinner from '@/app/components/ui/LoadingSpinner'

export default function NewTeacherPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  if (status === 'loading') {
    return <LoadingSpinner />
  }

  if (!session || session.user.role !== 'ADMIN') {
    return <div>Accès non autorisé</div>
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Ajouter un nouvel enseignant
          </h1>
        </div>
        
        <TeacherForm onClose={() => router.push('/admin/teachers')} />
      </div>
    </div>
  )
} 