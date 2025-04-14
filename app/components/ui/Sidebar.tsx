import Link from 'next/link'
import { UserGroupIcon, AcademicCapIcon, BookOpenIcon, UserIcon, ClockIcon, CalendarIcon } from '@heroicons/react/24/outline'

const Sidebar = () => {
  const session = null; // Replace with actual session handling
  const pathname = ''; // Replace with actual pathname

  return (
    <div className="flex-1 flex flex-col overflow-y-auto">
      {/* Rest of the component content */}
      {session?.user.role === 'ADMIN' && (
        <>
          <li>
            <span className="px-3 text-xs uppercase font-semibold text-gray-400 tracking-wider">
              Administration
            </span>
          </li>
          <li>
            <Link href="/admin/users" className={`px-3 py-2 rounded-md flex items-center space-x-2 ${pathname.startsWith('/admin/users') ? 'bg-indigo-800 text-white' : 'text-gray-300 hover:bg-indigo-700'}`}>
              <UserGroupIcon className="h-5 w-5" />
              <span>Utilisateurs</span>
            </Link>
          </li>
          <li>
            <Link href="/admin/classes" className={`px-3 py-2 rounded-md flex items-center space-x-2 ${pathname.startsWith('/admin/classes') ? 'bg-indigo-800 text-white' : 'text-gray-300 hover:bg-indigo-700'}`}>
              <AcademicCapIcon className="h-5 w-5" />
              <span>Classes</span>
            </Link>
          </li>
          <li>
            <Link href="/admin/courses" className={`px-3 py-2 rounded-md flex items-center space-x-2 ${pathname.startsWith('/admin/courses') ? 'bg-indigo-800 text-white' : 'text-gray-300 hover:bg-indigo-700'}`}>
              <BookOpenIcon className="h-5 w-5" />
              <span>Cours</span>
            </Link>
          </li>
          <li>
            <Link href="/admin/teachers" className={`px-3 py-2 rounded-md flex items-center space-x-2 ${pathname.startsWith('/admin/teachers') ? 'bg-indigo-800 text-white' : 'text-gray-300 hover:bg-indigo-700'}`}>
              <UserIcon className="h-5 w-5" />
              <span>Enseignants</span>
            </Link>
          </li>
          
          {/* Nouvelle section pour l'emploi du temps */}
          <li className="mt-4">
            <span className="px-3 text-xs uppercase font-semibold text-gray-400 tracking-wider">
              Emploi du temps
            </span>
          </li>
          <li>
            <Link href="/admin/timetable/timeslots" className={`px-3 py-2 rounded-md flex items-center space-x-2 ${pathname.startsWith('/admin/timetable/timeslots') ? 'bg-indigo-800 text-white' : 'text-gray-300 hover:bg-indigo-700'}`}>
              <ClockIcon className="h-5 w-5" />
              <span>Créneaux horaires</span>
            </Link>
          </li>
          <li>
            <Link href="/admin/timetable/schedule" className={`px-3 py-2 rounded-md flex items-center space-x-2 ${pathname.startsWith('/admin/timetable/schedule') ? 'bg-indigo-800 text-white' : 'text-gray-300 hover:bg-indigo-700'}`}>
              <CalendarIcon className="h-5 w-5" />
              <span>Emplois du temps</span>
            </Link>
          </li>
        </>
      )}
    </div>
  )
}

export default Sidebar 