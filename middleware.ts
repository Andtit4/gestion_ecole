import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { NextRequestWithAuth } from 'next-auth/middleware'

export default async function middleware(request: NextRequestWithAuth) {
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  })
  
  console.log('Middleware: Path:', request.nextUrl.pathname);
  console.log('Middleware: Token présent:', !!token);
  
  // Page d'accueil - redirection vers le tableau de bord si connecté
  if (request.nextUrl.pathname === '/') {
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // Pages d'authentification
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth')
  if (isAuthPage) {
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.next()
  }

  // Pages protégées
  if (!token) {
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Vérification des rôles pour certaines routes
  if (request.nextUrl.pathname.startsWith('/admin') && token.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/',
    '/dashboard/:path*',
    '/admin/:path*',
    '/auth/:path*',
    '/classes/:path*',
    '/courses/:path*',
    '/grades/:path*',
    '/students/:path*',
    '/teachers/:path*',
    '/schedule/:path*',
    '/report-cards/:path*',
    '/parents/:path*',
    '/attendance/:path*',
    '/users/:path*',
    '/settings/:path*',
  ],
} 