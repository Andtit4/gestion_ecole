'use client'

import { useSession } from 'next-auth/react'
// import AdminDashboard from '@/components/dashboard/AdminDashboard'
// import TeacherDashboard from '@/components/dashboard/TeacherDashboard'
// import StudentDashboard from './components/dashboard/StudentDashboard'
// import ParentDashboard from '@/components/dashboard/ParentDashboard'
// import LoadingSpinner from '@/components/ui/LoadingSpinner'
import TeacherDashboard from '../components/dashboard/TeacherDashboard'
import StudentDashboard from '../components/dashboard/StudentDashboard'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import ParentDashboard from '../components/dashboard/ParentDashboard'
import AdminDashboard from '../components/dashboard/AdminDashboard'

export default function DashboardPage() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return <LoadingSpinner />
  }

  if (!session?.user) {
    return null
  }

  const dashboardComponents = {
    ADMIN: AdminDashboard,
    TEACHER: TeacherDashboard,
    STUDENT: StudentDashboard,
    PARENT: ParentDashboard,
  }

  const DashboardComponent = dashboardComponents[session.user.role]

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Tableau de bord - {session.user.name} {session.user.role}
        </h1>
        <div className="mt-6">
          <DashboardComponent user={session.user} />
        </div>
      </div>
    </div>
  )
} 