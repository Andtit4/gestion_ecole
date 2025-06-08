import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Vérification de l'état de la base de données
export async function GET() {
  try {
    // Effectuer une requête simple pour vérifier la connexion
    await prisma.$queryRaw`SELECT 1`
    
    return NextResponse.json({ status: 'ok', message: 'Base de données connectée' })
  } catch (error) {
    console.error('Erreur de connexion à la base de données:', error)
    
    return NextResponse.json(
      { status: 'error', message: 'Impossible de se connecter à la base de données' },
      { status: 503 }
    )
  }
} 


