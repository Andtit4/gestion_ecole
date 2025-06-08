'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { useState, useEffect } from 'react'
import {
  Menu,
  X,
  LogOut,
  Home,
  Users,
  GraduationCap,
  Calendar,
  FileText,
  CreditCard,
  BookOpen,
  BarChart3,
  User
} from 'lucide-react'
import AuthLayout from './AuthLayout'

// Types pour les éléments de menu
interface MenuItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  role: string[]
  subItems?: MenuItem[]
}

// Configuration du menu
const menuItems: MenuItem[] = [
  {
    title: 'Tableau de bord',
    href: '/dashboard',
    icon: Home,
    role: ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT']
  },
  {
    title: 'Élèves',
    href: '/students',
    icon: Users,
    role: ['ADMIN', 'TEACHER']
  },
  {
    title: 'Professeurs',
    href: '/teachers',
    icon: GraduationCap,
    role: ['ADMIN']
  },
  {
    title: 'Classes',
    href: '/classes',
    icon: Users,
    role: ['ADMIN', 'TEACHER']
  },
  {
    title: 'Cours',
    href: '/courses',
    icon: BookOpen,
    role: ['ADMIN', 'TEACHER']
  },
  {
    title: 'Emploi du temps',
    href: '/timetable',
    icon: Calendar,
    role: ['ADMIN', 'TEACHER', 'STUDENT']
  },
  {
    title: 'Notes',
    href: '/grades',
    icon: BarChart3,
    role: ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT']
  },
  {
    title: 'Bulletins',
    href: '/report-cards',
    icon: FileText,
    role: ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT']
  },
  {
    title: 'Scolarité',
    href: '/scolarite',
    icon: FileText,
    role: ['ADMIN', 'TEACHER']
  },
  {
    title: 'Finances',
    href: '/finances',
    icon: CreditCard,
    role: ['ADMIN']
  }
]

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [expandedItems, setExpandedItems] = useState<string[]>([])

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

  // Détecter si nous sommes sur la page d'accueil (login)
  const isLoginPage = pathname === '/';

  // Si nous sommes sur la page de login, utiliser le layout d'authentification
  if (isLoginPage) {
    return <AuthLayout>{children}</AuthLayout>;
  }

  // Filtrer les éléments du menu selon le rôle de l'utilisateur
  const filteredMenuItems = status === 'loading' 
    ? menuItems.filter(item => item.href === '/dashboard') 
    : !session?.user?.role
      ? menuItems
      : menuItems.filter(item => item.role.includes(session.user.role));

  const toggleSubMenu = (href: string) => {
    setExpandedItems(prev => 
      prev.includes(href) 
        ? prev.filter(item => item !== href) 
        : [...prev, href]
    );
  };

  return (
    <div className='flex h-screen bg-gray-50'>
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed inset-y-0 left-0 z-50 w-64 transform border-r border-gray-200 bg-white transition-transform duration-300 md:static md:translate-x-0`}
      >
        <div className='flex h-full flex-col'>
          {/* Logo */}
          <div className='flex h-16 items-center justify-between px-4 border-b border-gray-100'>
            <Link href='/' className='flex items-center'>
              <span className='text-xl font-bold text-blue-600'>EcoleGestion</span>
            </Link>
            {isMobile && (
              <button
                onClick={() => setIsSidebarOpen(false)}
                className='md:hidden text-gray-500 hover:text-gray-700'
              >
                <X className='h-5 w-5' />
              </button>
            )}
          </div>

          {/* Navigation */}
          <nav className='flex-1 overflow-y-auto p-2'>
            {status === 'loading' ? (
              <div className='py-4 text-center text-sm text-gray-500'>Chargement du menu...</div>
            ) : (
              <ul className='space-y-1'>
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
                            <div className='flex items-center'>
                              <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                              <span>{item.title}</span>
                            </div>
                            <svg
                              className={`h-5 w-5 transition-transform ${isExpanded ? 'transform rotate-180' : ''}`}
                              fill='none'
                              viewBox='0 0 24 24'
                              stroke='currentColor'
                            >
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                            </svg>
                          </div>
                          
                          {isExpanded && (
                            <ul className='mt-1 ml-6 space-y-1 border-l border-gray-200 pl-2'>
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
                                        <span className='text-sm'>{subItem.title}</span>
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
          <div className='border-t border-gray-200 p-4 bg-gray-50'>
            {status === 'authenticated' ? (
              <div className='flex items-center gap-3'>
                <div className='flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold'>
                  {session?.user?.firstName?.[0]}{session?.user?.lastName?.[0]}
                </div>
                <div className='flex-1 truncate'>
                  <p className='truncate text-sm font-medium text-gray-900'>
                    {session?.user?.firstName} {session?.user?.lastName}
                  </p>
                  <p className='truncate text-xs text-gray-500'>
                    {session?.user?.email}
                  </p>
                </div>
                <button 
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className='text-gray-500 hover:text-gray-700'
                >
                  <LogOut className='h-5 w-5' />
                </button>
              </div>
            ) : (
              <div className='text-center'>
                <Link href='/' className='text-sm text-blue-600 hover:text-blue-700'>
                  Se connecter
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className='flex flex-1 flex-col overflow-hidden'>
        {/* Header */}
        <header className='flex h-16 items-center border-b border-gray-200 bg-white px-4'>
          {isMobile && (
            <button
              onClick={() => setIsSidebarOpen(true)}
              className='mr-2 md:hidden text-gray-500 hover:text-gray-700'
            >
              <Menu className='h-5 w-5' />
            </button>
          )}
          
          <div className='flex flex-1 items-center justify-between'>
            <h1 className='text-lg font-semibold text-gray-900'>
              {/* Titre dynamique basé sur la route */}
              {pathname === '/dashboard' && 'Tableau de bord'}
              {pathname === '/students' && 'Gestion des élèves'}
              {pathname === '/teachers' && 'Gestion des professeurs'}
              {pathname === '/classes' && 'Gestion des classes'}
              {pathname === '/courses' && 'Gestion des cours'}
              {pathname === '/timetable' && 'Emploi du temps'}
              {pathname === '/grades' && 'Notes et évaluations'}
              {pathname === '/report-cards' && 'Bulletins scolaires'}
              {pathname === '/scolarite' && 'Scolarité'}
              {pathname === '/finances' && 'Gestion financière'}
            </h1>
            
            <div className='flex items-center gap-4'>
              {status === 'authenticated' && (
                <div className='flex items-center gap-2 text-sm text-gray-600'>
                  <User className='h-4 w-4' />
                  <span>{session?.user?.role}</span>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Contenu de la page */}
        <main className='flex-1 overflow-y-auto p-6'>
          {children}
        </main>
      </div>

      {/* Overlay pour mobile */}
      {isMobile && isSidebarOpen && (
        <div
          className='fixed inset-0 z-40 bg-black bg-opacity-25 md:hidden'
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  )
} 


