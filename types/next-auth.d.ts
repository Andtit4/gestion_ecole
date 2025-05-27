import NextAuth from 'next-auth'
import { JWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface User {
    id: string
    email: string
    name: string
    firstName: string
    lastName: string
    role: 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT'
  }

  interface Session {
    user: User & {
      id: string
      firstName: string
      lastName: string
      role: 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT'
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    firstName: string
    lastName: string
    role: 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT'
  }
} 