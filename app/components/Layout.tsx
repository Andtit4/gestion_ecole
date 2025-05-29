'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  BookOpen,
  BookMarked,
  CalendarDays,
  ClipboardList,
  FileText,
  User,
  CalendarCheck,
  Settings,
  LogOut,
  Menu,
  X,
  BookmarkIcon,
  PencilIcon,
  SchoolIcon,
  ClipboardIcon,
  GraduationCap as GraduationCapIcon,
} from 'lucide-react'
import AuthLayout from './AuthLayout'

const menuItems = [
  { title: 'Tableau de bord', href: '/dashboard', icon: LayoutDashboard, role: ['ADMIN', 'TEACHER', 'PARENT', 'STUDENT'] },
  { title: 'Élèves', href: '/students', icon: GraduationCap, role: ['ADMIN', 'TEACHER'] },
  { title: 'Enseignants', href: '/teachers', icon: Users, role: ['ADMIN'] },
  { title: 'Classes', href: '/classes', icon: BookOpen, role: ['ADMIN', 'TEACHER'] },
  { title: 'Cours', href: '/courses', icon: BookMarked, role: ['ADMIN', 'TEACHER', 'STUDENT'] },
  { title: 'Emploi du temps', href: '/schedule', icon: CalendarDays, role: ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT'] },
  { title: 'Notes', href: '/grades', icon: ClipboardList, role: ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT'] },
  { title: 'Bulletins', href: '/dashboard/report-cards', icon: FileText, role: ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT'] },
  { 
    title: 'Scolarité', 
    href: '/scolarite', 
    icon: GraduationCap, 
    role: ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT'],
    subItems: [
      { title: 'Programmes', href: '/scolarite/programmes', icon: BookOpen, role: ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT'] },
      { title: 'Évaluations', href: '/scolarite/evaluations', icon: ClipboardList, role: ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT'] },
      { title: 'Périodes', href: '/scolarite/periodes', icon: CalendarDays, role: ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT'] },
      { title: 'Matières', href: '/scolarite/matieres', icon: BookMarked, role: ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT'] },
    ]
  },
  { title: 'Parents', href: '/parents', icon: User, role: ['ADMIN'] },
  { title: 'Assiduité', href: '/attendance', icon: CalendarCheck, role: ['ADMIN', 'TEACHER', 'PARENT'] },
  { title: 'Utilisateurs', href: '/users', icon: Users, role: ['ADMIN'] },
  { title: 'Paramètres', href: '/settings', icon: Settings, role: ['ADMIN'] },
]

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  
  // Détecter si nous sommes sur la page d'accueil (login)
  const isLoginPage = pathname === '/';

  // Si nous sommes sur la page de login, utiliser le layout d'authentification
  if (isLoginPage) {
    return <AuthLayout>{children}</AuthLayout>;
  }

  // Gestion du responsive
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsMobile(true)
        setIsSidebarOpen(false)
      } else {
        setIsMobile(false)
        setIsSidebarOpen(true)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Afficher dans la console l'état de la session
  useEffect(() => {
    console.log('Session status:', status);
    console.log('Session data:', session);
  }, [session, status]);

  // Filtrer les éléments du menu selon le rôle de l'utilisateur
  // Si pas de session, afficher tous les éléments du menu pour le dashboard uniquement
  const filteredMenuItems = status === 'loading' 
    ? menuItems.filter(item => item.href === '/dashboard') 
    : !session?.user?.role
      ? menuItems  // Afficher tous les menus si pas de rôle défini
      : menuItems.filter(item => item.role.includes(session.user.role));

  const toggleSubMenu = (href: string) => {
    setExpandedItems(prev => 
      prev.includes(href) 
        ? prev.filter(item => item !== href) 
        : [...prev, href]
    );
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed inset-y-0 left-0 z-50 w-64 transform border-r border-gray-200 bg-white transition-transform duration-300 md:static md:translate-x-0`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-4 border-b border-gray-100">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-blue-600">EcoleGestion</span>
            </Link>
            {isMobile && (
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="md:hidden text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-2">
            {status === 'loading' ? (
              <div className="py-4 text-center text-sm text-gray-500">Chargement du menu...</div>
            ) : (
              <ul className="space-y-1">
                {filteredMenuItems.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                  const hasSubItems = item.subItems && item.subItems.length > 0;
                  const isExpanded = expandedItems.includes(item.href);
                  
                  return (
                    <li key={item.href} className={hasSubItems ? 'mb-1' : ''}>
                      {hasSubItems ? (
                        <>
                          <div
                            className={`flex items-center justify-between rounded-md px-3 py-2 cursor-pointer transition-colors ${
                              isActive
                                ? 'bg-blue-50 text-blue-600 font-medium'
                                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                            }`}
                            onClick={() => toggleSubMenu(item.href)}
                          >
                            <div className="flex items-center">
                              <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                              <span>{item.title}</span>
                            </div>
                            <svg
                              className={`h-5 w-5 transition-transform ${isExpanded ? 'transform rotate-180' : ''}`}
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                          
                          {isExpanded && (
                            <ul className="mt-1 ml-6 space-y-1 border-l border-gray-200 pl-2">
                              {item.subItems.filter(subItem => 
                                !session?.user?.role || subItem.role.includes(session.user.role)
                              ).map((subItem) => {
                                const isSubActive = pathname === subItem.href;
                                return (
                                  <li key={subItem.href}>
                                    <Link href={subItem.href}>
                                      <div
                                        className={`flex items-center rounded-md px-3 py-2 transition-colors ${
                                          isSubActive
                                            ? 'bg-blue-50 text-blue-600 font-medium'
                                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                        }`}
                                      >
                                        <subItem.icon className={`mr-3 h-4 w-4 ${isSubActive ? 'text-blue-600' : 'text-gray-500'}`} />
                                        <span className="text-sm">{subItem.title}</span>
                                      </div>
                                    </Link>
                                  </li>
                                );
                              })}
                            </ul>
                          )}
                        </>
                      ) : (
                        <Link href={item.href}>
                          <div
                            className={`flex items-center rounded-md px-3 py-2 transition-colors ${
                              isActive
                                ? 'bg-blue-50 text-blue-600 font-medium'
                                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                            }`}
                          >
                            <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                            <span>{item.title}</span>
                          </div>
                        </Link>
                      )}
                    </li>
                  )
                })}
              </ul>
            )}
          </nav>

          {/* Profil utilisateur */}
          <div className="border-t border-gray-200 p-4 bg-gray-50">
            {status === 'authenticated' ? (
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold">
                  {session?.user?.firstName?.[0]}{session?.user?.lastName?.[0]}
                </div>
                <div className="flex-1 truncate">
                  <p className="truncate text-sm font-medium text-gray-900">
                    {session?.user?.firstName} {session?.user?.lastName}
                  </p>
                  <p className="truncate text-xs text-gray-500">
                    {session?.user?.email}
                  </p>
                </div>
                <button 
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="text-center">
                <Link href="/" className="text-sm text-blue-600 hover:text-blue-700">
                  Se connecter
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 items-center border-b border-gray-200 bg-white px-4">
          {isMobile && (
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="mr-2 md:hidden text-gray-500 hover:text-gray-700"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}
          <h1 className="text-lg font-semibold text-gray-900">
            {filteredMenuItems.find(item => pathname === item.href)?.title || 'Tableau de bord'}
          </h1>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
} 