'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export function Navbar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  const navigation = [
    { name: 'Tableau de bord', href: '/' },
    { name: 'Élèves', href: '/students' },
    { name: 'Classes', href: '/classes' },
    { name: 'Professeurs', href: '/teachers' },
    { name: 'Matières', href: '/courses' },
    { name: 'Sessions', href: '/course-sessions' },
    { name: 'Notes', href: '/grades' },
    { name: 'Bulletins', href: '/report-cards' },
  ]

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">
              Gestion École
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary',
                  pathname === item.href
                    ? 'text-primary'
                    : 'text-muted-foreground'
                )}
              >
                {item.name}
              </Link>
            ))}
            {session ? (
              <Button variant="outline" asChild>
                <Link href="/api/auth/signout">Déconnexion</Link>
              </Button>
            ) : (
              <Button variant="outline" asChild>
                <Link href="/api/auth/signin">Connexion</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
} 