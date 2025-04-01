import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return new NextResponse('Non autorisé', { status: 401 })
    }

    const [
      totalStudents,
      totalTeachers,
      totalClasses,
      totalParents
    ] = await Promise.all([
      prisma.user.count({ where: { role: 'STUDENT' } }),
      prisma.user.count({ where: { role: 'TEACHER' } }),
      prisma.class.count(),
      prisma.user.count({ where: { role: 'PARENT' } })
    ])

    return NextResponse.json({
      totalStudents,
      totalTeachers,
      totalClasses,
      totalParents
    })
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error)
    return new NextResponse('Erreur serveur', { status: 500 })
  }
} 