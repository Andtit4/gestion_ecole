import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'

// Types pour les réponses API standardisées
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  code?: string
  details?: any
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// Codes d'erreur standardisés
export const ERROR_CODES = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  RATE_LIMIT: 'RATE_LIMIT',
  DUPLICATE_ENTRY: 'DUPLICATE_ENTRY',
} as const

// Créer une réponse de succès standardisée
export function createSuccessResponse<T>(
  data: T,
  message?: string,
  status: number = 200
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      message,
    },
    { status }
  )
}

// Créer une réponse d'erreur standardisée
export function createErrorResponse(
  error: string,
  code?: string,
  status: number = 400,
  details?: any
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error,
      code,
      details,
    },
    { status }
  )
}

// Créer une réponse paginée
export function createPaginatedResponse<T>(
  data: T[],
  page: number,
  limit: number,
  total: number,
  message?: string
): NextResponse<PaginatedResponse<T>> {
  const totalPages = Math.ceil(total / limit)
  
  return NextResponse.json({
    success: true,
    data,
    message,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  })
}

// Middleware pour vérifier l'authentification
export async function requireAuth(allowedRoles?: string[]) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    throw new ApiError('Non autorisé', ERROR_CODES.UNAUTHORIZED, 401)
  }
  
  if (allowedRoles && !allowedRoles.includes(session.user.role)) {
    throw new ApiError(
      'Accès refusé pour ce rôle',
      ERROR_CODES.FORBIDDEN,
      403
    )
  }
  
  return session
}

// Classe d'erreur personnalisée
export class ApiError extends Error {
  constructor(
    public message: string,
    public code: string = ERROR_CODES.INTERNAL_ERROR,
    public status: number = 500,
    public details?: any
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// Gestionnaire d'erreurs global
export function handleApiError(error: unknown): NextResponse<ApiResponse> {
  console.error('API Error:', error)
  
  if (error instanceof ApiError) {
    return createErrorResponse(error.message, error.code, error.status, error.details)
  }
  
  if (error instanceof z.ZodError) {
    return createErrorResponse(
      'Données invalides',
      ERROR_CODES.VALIDATION_ERROR,
      400,
      error.errors
    )
  }
  
  // Erreurs Prisma
  if (error && typeof error === 'object' && 'code' in error) {
    const prismaError = error as any
    
    switch (prismaError.code) {
      case 'P2002':
        return createErrorResponse(
          'Cette entrée existe déjà',
          ERROR_CODES.DUPLICATE_ENTRY,
          409,
          prismaError.meta
        )
      case 'P2025':
        return createErrorResponse(
          'Enregistrement non trouvé',
          ERROR_CODES.NOT_FOUND,
          404
        )
      default:
        return createErrorResponse(
          'Erreur de base de données',
          ERROR_CODES.DATABASE_ERROR,
          500
        )
    }
  }
  
  return createErrorResponse(
    'Erreur interne du serveur',
    ERROR_CODES.INTERNAL_ERROR,
    500
  )
}

// Wrapper pour les routes API avec gestion d'erreurs
export function withErrorHandling<T extends any[]>(
  handler: (...args: T) => Promise<NextResponse>
) {
  return async (...args: T): Promise<NextResponse> => {
    try {
      return await handler(...args)
    } catch (error) {
      return handleApiError(error)
    }
  }
}

// Schémas de validation communs
export const commonSchemas = {
  id: z.string().min(1, 'ID requis'),
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  pagination: z.object({
    page: z.number().min(1).default(1),
    limit: z.number().min(1).max(100).default(10),
  }),
  search: z.object({
    q: z.string().optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).default('asc'),
  }),
}

// Fonction utilitaire pour parser les paramètres de pagination
export function parsePaginationParams(searchParams: URLSearchParams) {
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')
  
  return {
    page: Math.max(1, page),
    limit: Math.min(100, Math.max(1, limit)),
    offset: (Math.max(1, page) - 1) * Math.min(100, Math.max(1, limit)),
  }
}

// Fonction utilitaire pour parser les paramètres de recherche
export function parseSearchParams(searchParams: URLSearchParams) {
  return {
    q: searchParams.get('q') || undefined,
    sortBy: searchParams.get('sortBy') || undefined,
    sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'asc',
  }
}

// Validation des rôles
export const ROLES = ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT'] as const
export type Role = typeof ROLES[number]

export function validateRole(role: string): role is Role {
  return ROLES.includes(role as Role)
}

// Logs structurés pour les APIs
export function logApiCall(
  method: string,
  endpoint: string,
  userId?: string,
  duration?: number,
  status?: number
) {
  console.log(JSON.stringify({
    type: 'api_call',
    method,
    endpoint,
    userId,
    duration,
    status,
    timestamp: new Date().toISOString(),
  }))
}

// Rate limiting simple (pour un vrai projet, utiliser Redis)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export function checkRateLimit(
  identifier: string,
  maxRequests: number = 100,
  windowMs: number = 15 * 60 * 1000 // 15 minutes
): boolean {
  const now = Date.now()
  const limit = rateLimitMap.get(identifier)
  
  if (!limit || now > limit.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs })
    return true
  }
  
  if (limit.count >= maxRequests) {
    return false
  }
  
  limit.count++
  return true
} 