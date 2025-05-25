import Link from 'next/link'
import { UserGroupIcon, AcademicCapIcon, BookOpenIcon, UserIcon, ClockIcon, CalendarIcon, Cog6ToothIcon, HomeIcon } from '@heroicons/react/24/outline'
import { useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'

const Sidebar = () => {
  const { data: session } = useSession();
  const pathname = usePathname();

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-indigo-900 text-white font-urbanist">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-white">Gestion École</h1>
      </div>

      <ul className="space-y-2 px-3 py-4">
        <li>
          <Link 
            href="/dashboard" 
            className={`px-4 py-3 rounded-lg flex items-center space-x-3 transition-colors ${
              pathname === '/dashboard' 
                ? 'bg-indigo-800 text-white shadow-sm' 
                : 'text-indigo-100 hover:bg-indigo-800 hover:text-white'
            }`}
          >
            <HomeIcon className="h-5 w-5" />
            <span>Tableau de bord</span>
          </Link>
        </li>

        {session?.user.role === 'ADMIN' && (
          <>
            <li className="mt-6">
              <span className="px-4 text-xs uppercase font-semibold text-indigo-300 tracking-wider">
                Administration
              </span>
            </li>
            <li>
              <Link 
                href="/admin/users" 
                className={`px-4 py-3 rounded-lg flex items-center space-x-3 transition-colors ${
                  pathname.startsWith('/admin/users') 
                    ? 'bg-indigo-800 text-white shadow-sm' 
                    : 'text-indigo-100 hover:bg-indigo-800 hover:text-white'
                }`}
              >
                <UserGroupIcon className="h-5 w-5" />
                <span>Utilisateurs</span>
              </Link>
            </li>
            <li>
              <Link 
                href="/admin/classes" 
                className={`px-4 py-3 rounded-lg flex items-center space-x-3 transition-colors ${
                  pathname.startsWith('/admin/classes') 
                    ? 'bg-indigo-800 text-white shadow-sm' 
                    : 'text-indigo-100 hover:bg-indigo-800 hover:text-white'
                }`}
              >
                <AcademicCapIcon className="h-5 w-5" />
                <span>Classes</span>
              </Link>
            </li>
            <li>
              <Link 
                href="/admin/courses" 
                className={`px-4 py-3 rounded-lg flex items-center space-x-3 transition-colors ${
                  pathname.startsWith('/admin/courses') 
                    ? 'bg-indigo-800 text-white shadow-sm' 
                    : 'text-indigo-100 hover:bg-indigo-800 hover:text-white'
                }`}
              >
                <BookOpenIcon className="h-5 w-5" />
                <span>Cours</span>
              </Link>
            </li>
            <li>
              <Link 
                href="/admin/teachers" 
                className={`px-4 py-3 rounded-lg flex items-center space-x-3 transition-colors ${
                  pathname.startsWith('/admin/teachers') 
                    ? 'bg-indigo-800 text-white shadow-sm' 
                    : 'text-indigo-100 hover:bg-indigo-800 hover:text-white'
                }`}
              >
                <UserIcon className="h-5 w-5" />
                <span>Enseignants</span>
              </Link>
            </li>
            
            <li className="mt-6">
              <span className="px-4 text-xs uppercase font-semibold text-indigo-300 tracking-wider">
                Emploi du temps
              </span>
            </li>
            <li>
              <Link 
                href="/admin/timetable/timeslots" 
                className={`px-4 py-3 rounded-lg flex items-center space-x-3 transition-colors ${
                  pathname.startsWith('/admin/timetable/timeslots') 
                    ? 'bg-indigo-800 text-white shadow-sm' 
                    : 'text-indigo-100 hover:bg-indigo-800 hover:text-white'
                }`}
              >
                <ClockIcon className="h-5 w-5" />
                <span>Créneaux horaires</span>
              </Link>
            </li>
            <li>
              <Link 
                href="/admin/timetable/schedule" 
                className={`px-4 py-3 rounded-lg flex items-center space-x-3 transition-colors ${
                  pathname.startsWith('/admin/timetable/schedule') 
                    ? 'bg-indigo-800 text-white shadow-sm' 
                    : 'text-indigo-100 hover:bg-indigo-800 hover:text-white'
                }`}
              >
                <CalendarIcon className="h-5 w-5" />
                <span>Emplois du temps</span>
              </Link>
            </li>
            <li>
              <Link 
                href="/admin/timetable/schoolday-config" 
                className={`px-4 py-3 rounded-lg flex items-center space-x-3 transition-colors ${
                  pathname.startsWith('/admin/timetable/schoolday-config') 
                    ? 'bg-indigo-800 text-white shadow-sm' 
                    : 'text-indigo-100 hover:bg-indigo-800 hover:text-white'
                }`}
              >
                <Cog6ToothIcon className="h-5 w-5" />
                <span>Configuration</span>
              </Link>
            </li>
          </>
        )}

        {session?.user.role === 'TEACHER' && (
          <>
            <li className="mt-6">
              <span className="px-4 text-xs uppercase font-semibold text-indigo-300 tracking-wider">
                Enseignant
              </span>
            </li>
            <li>
              <Link 
                href="/dashboard/teacher/timetable" 
                className={`px-4 py-3 rounded-lg flex items-center space-x-3 transition-colors ${
                  pathname.startsWith('/dashboard/teacher/timetable') 
                    ? 'bg-indigo-800 text-white shadow-sm' 
                    : 'text-indigo-100 hover:bg-indigo-800 hover:text-white'
                }`}
              >
                <CalendarIcon className="h-5 w-5" />
                <span>Mon emploi du temps</span>
              </Link>
            </li>
            <li>
              <Link 
                href="/dashboard/teacher/classes" 
                className={`px-4 py-3 rounded-lg flex items-center space-x-3 transition-colors ${
                  pathname.startsWith('/dashboard/teacher/classes') 
                    ? 'bg-indigo-800 text-white shadow-sm' 
                    : 'text-indigo-100 hover:bg-indigo-800 hover:text-white'
                }`}
              >
                <AcademicCapIcon className="h-5 w-5" />
                <span>Mes classes</span>
              </Link>
            </li>
          </>
        )}

        {session?.user.role === 'STUDENT' && (
          <>
            <li className="mt-6">
              <span className="px-4 text-xs uppercase font-semibold text-indigo-300 tracking-wider">
                Élève
              </span>
            </li>
            <li>
              <Link 
                href="/dashboard/student/timetable" 
                className={`px-4 py-3 rounded-lg flex items-center space-x-3 transition-colors ${
                  pathname.startsWith('/dashboard/student/timetable') 
                    ? 'bg-indigo-800 text-white shadow-sm' 
                    : 'text-indigo-100 hover:bg-indigo-800 hover:text-white'
                }`}
              >
                <CalendarIcon className="h-5 w-5" />
                <span>Mon emploi du temps</span>
              </Link>
            </li>
          </>
        )}
      </ul>
    </div>
  )
}

export default Sidebar 