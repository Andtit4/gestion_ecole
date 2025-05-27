import { NextResponse } from 'next/server'

export async function GET() {
  // Liste des routes API disponibles
  const apiRoutes = [
    {
      path: '/api/students',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      description: 'API pour gérer les élèves',
      params: {
        GET: ['search', 'classId'],
        DELETE: ['id']
      }
    },
    {
      path: '/api/periods',
      methods: ['GET', 'POST', 'PATCH', 'DELETE'],
      description: 'API pour gérer les périodes scolaires',
      params: {
        GET: ['status', 'schoolYear'],
        DELETE: ['id']
      }
    },
    {
      path: '/api/classes',
      methods: ['GET', 'POST', 'PATCH', 'DELETE'],
      description: 'API pour gérer les classes',
      params: {
        GET: ['year', 'level', 'teacherId'],
        DELETE: ['id']
      }
    },
    {
      path: '/api/report-cards',
      methods: ['GET', 'POST', 'PATCH', 'DELETE'],
      description: 'API pour gérer les bulletins',
      params: {
        GET: ['studentId', 'periodId', 'status'],
        DELETE: ['id']
      }
    },
    {
      path: '/api/debug',
      methods: ['GET'],
      description: 'Informations sur les routes API disponibles',
      params: {}
    }
  ]

  // Informations de débogage
  const debugInfo = {
    server: {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    },
    apiRoutes
  }

  return NextResponse.json(debugInfo)
} 