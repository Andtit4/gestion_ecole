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
  User,
  Settings,
  Bell,
  Search,
  Moon,
  Sun,
  ChevronDown,
  Building2,
  ClipboardList,
  DollarSign,
  UserCheck,
  FileBarChart
} from 'lucide-react'
import { useTheme } from 'next-themes'
import AuthLayout from './AuthLayout'
import { Button, IconButton } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu'
import { Badge } from '../../components/ui/badge'

// Types pour les éléments de menu
interface MenuItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  role: string[]
  badge?: string
  subItems?: MenuItem[]
}

// Configuration du menu mise à jour
const menuItems: MenuItem[] = [
  {
    title: 'Tableau de bord',
    href: '/dashboard',
    icon: Home,
    role: ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT']
  },
  {
    title: 'Gestion des utilisateurs',
    href: '/admin',
    icon: UserCheck,
    role: ['ADMIN'],
    subItems: [
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
        title: 'Parents',
        href: '/parents',
        icon: User,
        role: ['ADMIN']
      }
    ]
  },
  {
    title: 'Académique',
    href: '/academic',
    icon: BookOpen,
    role: ['ADMIN', 'TEACHER', 'STUDENT'],
    subItems: [
      {
        title: 'Classes',
        href: '/classes',
        icon: Building2,
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
        title: 'Salles de classe',
        href: '/classrooms',
        icon: Building2,
        role: ['ADMIN']
      }
    ]
  },
  {
    title: 'Évaluations',
    href: '/evaluations',
    icon: BarChart3,
    role: ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT'],
    subItems: [
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
      }
    ]
  },
  {
    title: 'Scolarité',
    href: '/scolarite',
    icon: ClipboardList,
    role: ['ADMIN', 'TEACHER']
  },
  {
    title: 'Finances',
    href: '/finances',
    icon: DollarSign,
    role: ['ADMIN'],
    badge: 'Pro'
  }
]

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  // Gestion du responsive
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
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

  const getRoleColor = (role: string) => {
    switch(role) {
      case 'ADMIN': return 'bg-gradient-to-r from-purple-600 to-indigo-700'
      case 'TEACHER': return 'bg-gradient-to-r from-blue-600 to-blue-800'
      case 'STUDENT': return 'bg-gradient-to-r from-green-600 to-green-800'
      case 'PARENT': return 'bg-gradient-to-r from-amber-500 to-orange-600'
      default: return 'bg-gradient-to-r from-gray-600 to-gray-800'
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch(role) {
      case 'ADMIN': return 'badge-admin'
      case 'TEACHER': return 'badge-teacher'
      case 'STUDENT': return 'badge-student'
      case 'PARENT': return 'badge-parent'
      default: return 'badge-secondary'
    }
  }

  const getUserInitials = (user: any) => {
    if (!user) return 'U'
    const firstName = user.firstName || user.name || ''
    const lastName = user.lastName || ''
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'
  }

  return (
    <div className='app-container flex h-screen'>
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } sidebar z-50 flex flex-col transform transition-transform duration-300 lg:static lg:translate-x-0`}
      >
        {/* Logo et titre */}
        <div className='flex h-16 items-center justify-between px-6 border-b border-gray-100'>
          <Link href='/dashboard' className='flex items-center space-x-3'>
            <div className='w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center'>
              <GraduationCap className='h-5 w-5 text-white' />
            </div>
            <span className='text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent'>
              EcoleGestion
            </span>
          </Link>
          {isMobile && (
            <IconButton
              variant="ghost"
              size="icon-sm"
              icon={<X className='h-5 w-5' />}
              onClick={() => setIsSidebarOpen(false)}
            />
          )}
        </div>

        {/* Barre de recherche */}
        <div className='px-6 py-4 border-b border-gray-100'>
          <div className='relative'>
            <Search className='h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
            <Input
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='pl-10 h-9 bg-gray-50 border-gray-200 focus:bg-white'
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className='flex-1 overflow-y-auto p-4 space-y-2'>
          {status === 'loading' ? (
            <div className='py-4 text-center text-sm text-muted-foreground'>
              <div className='spinner w-5 h-5 mx-auto mb-2'></div>
              Chargement du menu...
            </div>
          ) : (
            filteredMenuItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              const hasSubItems = item.subItems && item.subItems.length > 0;
              const isExpanded = expandedItems.includes(item.href);
              
              return (
                <div key={item.href} className='space-y-1'>
                  {hasSubItems ? (
                    <button
                      className={`w-full flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-primary/10 text-primary border-r-2 border-primary'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                      onClick={() => toggleSubMenu(item.href)}
                    >
                      <div className='flex items-center space-x-3'>
                        <item.icon className='h-5 w-5 flex-shrink-0' />
                        <span className='truncate'>{item.title}</span>
                        {item.badge && (
                          <Badge variant="secondary" className='text-xs px-1.5 py-0.5'>
                            {item.badge}
                          </Badge>
                        )}
                      </div>
                      <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${
                        isExpanded ? 'rotate-180' : ''
                      }`} />
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      className={`nav-link ${
                        isActive ? 'nav-link-active' : 'nav-link-inactive'
                      }`}
                      onClick={() => isMobile && setIsSidebarOpen(false)}
                    >
                      <item.icon className='h-5 w-5 mr-3 flex-shrink-0' />
                      <span className='truncate'>{item.title}</span>
                      {item.badge && (
                        <Badge variant="secondary" className='ml-auto text-xs px-1.5 py-0.5'>
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  )}
                  
                  {hasSubItems && isExpanded && (
                    <div className='ml-6 space-y-1 animate-slide-in-from-top'>
                      {item.subItems!.filter(subItem => 
                        !session?.user?.role || subItem.role.includes(session.user.role)
                      ).map((subItem) => {
                        const subIsActive = pathname === subItem.href || pathname.startsWith(subItem.href + '/');
                        
                        return (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            className={`flex items-center space-x-3 rounded-lg px-3 py-2 text-sm transition-all duration-200 ${
                              subIsActive
                                ? 'bg-primary/10 text-primary font-medium'
                                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                            }`}
                            onClick={() => isMobile && setIsSidebarOpen(false)}
                          >
                            <subItem.icon className='h-4 w-4 flex-shrink-0' />
                            <span className='truncate'>{subItem.title}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </nav>

        {/* Informations utilisateur */}
        <div className='border-t border-gray-100 p-4'>
          {session?.user && (
            <div className='flex items-center space-x-3 mb-3'>
              <Avatar className='h-8 w-8'>
                <AvatarImage src={session.user.image || ''} />
                <AvatarFallback className='text-xs font-semibold'>
                  {getUserInitials(session.user)}
                </AvatarFallback>
              </Avatar>
              <div className='flex-1 min-w-0'>
                <p className='text-sm font-medium text-gray-900 truncate'>
                  {session.user.name || session.user.firstName + ' ' + session.user.lastName}
                </p>
                <Badge className={`text-xs ${getRoleBadgeColor(session.user.role)}`}>
                  {session.user.role === 'ADMIN' && 'Administrateur'}
                  {session.user.role === 'TEACHER' && 'Enseignant'}
                  {session.user.role === 'STUDENT' && 'Élève'}
                  {session.user.role === 'PARENT' && 'Parent'}
                </Badge>
              </div>
            </div>
          )}
          
          <div className='flex items-center justify-between'>
            <IconButton
              variant="ghost"
              size="icon-sm"
              icon={theme === 'dark' ? <Sun className='h-4 w-4' /> : <Moon className='h-4 w-4' />}
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <IconButton
                  variant="ghost"
                  size="icon-sm"
                  icon={<Settings className='h-4 w-4' />}
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className='w-48'>
                <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className='mr-2 h-4 w-4' />
                  Profil
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className='mr-2 h-4 w-4' />
                  Paramètres
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className='text-destructive focus:text-destructive'
                  onClick={() => signOut()}
                >
                  <LogOut className='mr-2 h-4 w-4' />
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </aside>

      {/* Overlay pour mobile */}
      {isMobile && isSidebarOpen && (
        <div 
          className='fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden'
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Contenu principal */}
      <main className='main-content flex flex-col flex-1'>
        {/* Header mobile */}
        <header className='flex items-center justify-between p-4 bg-white border-b border-gray-200 lg:hidden'>
          <IconButton
            variant="ghost"
            size="icon"
            icon={<Menu className='h-6 w-6' />}
            onClick={() => setIsSidebarOpen(true)}
          />
          
          <div className='flex items-center space-x-3'>
            <IconButton
              variant="ghost"
              size="icon-sm"
              icon={<Bell className='h-5 w-5' />}
            />
            {session?.user && (
              <Avatar className='h-8 w-8'>
                <AvatarImage src={session.user.image || ''} />
                <AvatarFallback className='text-xs font-semibold'>
                  {getUserInitials(session.user)}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        </header>

        {/* Contenu de la page */}
        <div className='flex-1 overflow-y-auto'>
          {children}
        </div>
      </main>
    </div>
  )
} 


