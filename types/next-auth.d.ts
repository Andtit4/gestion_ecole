import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface User {
    id: string
    email: string
    name: string
    role: 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT'
  }

  interface Session {
    user: User & {
      role: 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT'
    }
  }
} 