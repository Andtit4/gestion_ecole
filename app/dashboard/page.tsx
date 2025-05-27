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
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner />
      </div>
    )
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
  
  // Obtenir la couleur d'accentuation basée sur le rôle
  const getRoleAccentColor = (role) => {
    switch(role) {
      case 'ADMIN': return 'from-purple-600 to-indigo-700'
      case 'TEACHER': return 'from-blue-600 to-blue-800'
      case 'STUDENT': return 'from-green-600 to-green-800'
      case 'PARENT': return 'from-amber-500 to-orange-600'
      default: return 'from-gray-600 to-gray-800'
    }
  }

  const roleGradient = getRoleAccentColor(session.user.role)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className={`bg-gradient-to-r ${roleGradient} shadow-md`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                Tableau de bord
              </h1>
              <p className="mt-1 text-white text-opacity-90">
                Bienvenue, {session.user.name}
              </p>
            </div>
            <div className="mt-3 md:mt-0">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white bg-opacity-20 text-white">
                {session.user.role === 'ADMIN' && 'Administrateur'}
                {session.user.role === 'TEACHER' && 'Enseignant'}
                {session.user.role === 'STUDENT' && 'Élève'}
                {session.user.role === 'PARENT' && 'Parent'}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <DashboardComponent user={session.user} />
        </div>
      </div>
    </div>
  )
} 