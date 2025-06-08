'use client'

import { useSession } from 'next-auth/react'
import { Suspense } from 'react'
import AdminDashboard from '../components/dashboard/AdminDashboard'
import TeacherDashboard from '../components/dashboard/TeacherDashboard'
import StudentDashboard from '../components/dashboard/StudentDashboard'
import ParentDashboard from '../components/dashboard/ParentDashboard'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  Calendar,
  TrendingUp,
  Bell,
  Settings,
  FileText,
  BarChart3,
  Clock,
  CheckCircle,
  AlertTriangle,
  UserCheck
} from 'lucide-react'

// Composant de loading pour le dashboard
function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container-responsive py-8">
        <div className="mb-8">
          <div className="h-8 w-64 bg-gray-200 rounded-lg mb-2 skeleton"></div>
          <div className="h-4 w-96 bg-gray-200 rounded skeleton"></div>
        </div>
        
        <div className="grid-responsive mb-8">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="h-5 w-32 bg-gray-200 rounded skeleton"></div>
                  <div className="h-8 w-8 bg-gray-200 rounded skeleton"></div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-8 w-20 bg-gray-200 rounded skeleton mb-2"></div>
                <div className="h-4 w-24 bg-gray-200 rounded skeleton"></div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="animate-pulse">
            <CardHeader>
              <div className="h-6 w-48 bg-gray-200 rounded skeleton"></div>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gray-200 rounded skeleton"></div>
            </CardContent>
          </Card>
          
          <Card className="animate-pulse">
            <CardHeader>
              <div className="h-6 w-48 bg-gray-200 rounded skeleton"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <div className="h-10 w-10 bg-gray-200 rounded-full skeleton"></div>
                    <div className="flex-1">
                      <div className="h-4 w-32 bg-gray-200 rounded skeleton mb-1"></div>
                      <div className="h-3 w-24 bg-gray-200 rounded skeleton"></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Composant d'en-tête du dashboard
function DashboardHeader({ user }: { user: any }) {
  const getRoleInfo = (role: string) => {
    switch(role) {
      case 'ADMIN':
        return {
          title: 'Tableau de bord Administrateur',
          description: 'Vue d\'ensemble de l\'établissement scolaire',
          gradient: 'from-purple-600 to-indigo-700',
          icon: UserCheck,
          badgeVariant: 'admin' as const
        }
      case 'TEACHER':
        return {
          title: 'Tableau de bord Enseignant',
          description: 'Gérez vos classes et suivez les progrès de vos élèves',
          gradient: 'from-blue-600 to-blue-800',
          icon: GraduationCap,
          badgeVariant: 'teacher' as const
        }
      case 'STUDENT':
        return {
          title: 'Tableau de bord Élève',
          description: 'Suivez vos cours, notes et emploi du temps',
          gradient: 'from-green-600 to-green-800',
          icon: BookOpen,
          badgeVariant: 'student' as const
        }
      case 'PARENT':
        return {
          title: 'Tableau de bord Parent',
          description: 'Suivez la scolarité de vos enfants',
          gradient: 'from-amber-500 to-orange-600',
          icon: Users,
          badgeVariant: 'parent' as const
        }
      default:
        return {
          title: 'Tableau de bord',
          description: 'Bienvenue sur votre espace personnel',
          gradient: 'from-gray-600 to-gray-800',
          icon: Users,
          badgeVariant: 'secondary' as const
        }
    }
  }

  const roleInfo = getRoleInfo(user.role)
  const IconComponent = roleInfo.icon

  return (
    <div className={`bg-gradient-to-r ${roleInfo.gradient} shadow-lg overflow-hidden relative`}>
      {/* Motif décoratif */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-white rounded-full"></div>
        <div className="absolute top-8 -right-8 w-16 h-16 bg-white rounded-full"></div>
        <div className="absolute bottom-4 -left-4 w-20 h-20 bg-white rounded-full"></div>
      </div>
      
      <div className="relative container-responsive py-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <IconComponent className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">
                {roleInfo.title}
              </h1>
              <p className="text-white/90 text-lg">
                {roleInfo.description}
              </p>
              <p className="text-white/80 text-sm mt-1">
                Bienvenue, {user.firstName || user.name} {user.lastName}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
                         <Badge variant={roleInfo.badgeVariant} className="px-4 py-2 text-sm font-medium bg-white/20 text-white border-white/30">
               {user.role === 'ADMIN' && 'Administrateur'}
               {user.role === 'TEACHER' && 'Enseignant'}
               {user.role === 'STUDENT' && 'Élève'}
               {user.role === 'PARENT' && 'Parent'}
             </Badge>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
              >
                <Bell className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
              >
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Composant principal du dashboard
export default function DashboardPage() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return <DashboardSkeleton />
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="p-8 text-center">
          <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Session expirée
          </h2>
          <p className="text-gray-600 mb-4">
            Veuillez vous reconnecter pour accéder à votre tableau de bord.
          </p>
          <Button>
            Se reconnecter
          </Button>
        </Card>
      </div>
    )
  }

  const dashboardComponents = {
    ADMIN: AdminDashboard,
    TEACHER: TeacherDashboard,
    STUDENT: StudentDashboard,
    PARENT: ParentDashboard,
  }

  const DashboardComponent = dashboardComponents[session.user.role]

  if (!DashboardComponent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="p-8 text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Rôle non reconnu
          </h2>
          <p className="text-gray-600">
            Votre rôle utilisateur n'est pas configuré correctement.
          </p>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <DashboardHeader user={session.user} />
      
      <div className="container-responsive py-8">
        <Suspense fallback={
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner />
          </div>
        }>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <DashboardComponent user={session.user} />
          </div>
        </Suspense>
      </div>
    </div>
  )
} 


