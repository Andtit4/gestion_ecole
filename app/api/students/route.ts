import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import {
  withErrorHandling,
  requireAuth,
  createSuccessResponse,
  createPaginatedResponse,
  ApiError,
  ERROR_CODES,
  parsePaginationParams,
  parseSearchParams,
  commonSchemas,
  logApiCall,
} from '@/app/lib/api-utils'

// Schémas de validation
const createStudentSchema = z.object({
  firstName: commonSchemas.name,
  lastName: commonSchemas.name,
  email: commonSchemas.email,
  password: commonSchemas.password,
  classId: z.string().optional(),
  parentIds: z.array(z.string()).optional(),
  birthDate: z.string().datetime().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
})

const updateStudentSchema = createStudentSchema.partial().omit({ password: true })

const studentFiltersSchema = z.object({
  classId: z.string().optional(),
  search: z.string().optional(),
  status: z.enum(['active', 'inactive']).optional(),
})

// GET /api/students - Récupérer les étudiants avec pagination et filtres
export const GET = withErrorHandling(async (req: NextRequest) => {
  const startTime = Date.now()
  
  // Authentification et autorisation
  const session = await requireAuth(['ADMIN', 'TEACHER', 'PARENT'])
  
  // Parser les paramètres
  const { searchParams } = new URL(req.url)
  const { page, limit, offset } = parsePaginationParams(searchParams)
  const { q: searchQuery } = parseSearchParams(searchParams)
  const filters = studentFiltersSchema.parse({
    classId: searchParams.get('classId'),
    search: searchQuery,
    status: searchParams.get('status'),
  })

  // Construire les conditions de recherche
  let whereCondition: any = {}

  // Filtre par rôle
  if (session.user.role === 'PARENT') {
    const parent = await prisma.parent.findUnique({
      where: { userId: session.user.id },
      include: { students: { select: { studentId: true } } }
    })
    
    if (!parent) {
      throw new ApiError('Parent non trouvé', ERROR_CODES.NOT_FOUND, 404)
    }
    
    whereCondition.id = {
      in: parent.students.map(s => s.studentId)
    }
  }

  // Filtre par classe
  if (filters.classId) {
    whereCondition.classId = filters.classId
  }

  // Recherche textuelle
  if (filters.search) {
    whereCondition.OR = [
      { user: { firstName: { contains: filters.search, mode: 'insensitive' } } },
      { user: { lastName: { contains: filters.search, mode: 'insensitive' } } },
      { user: { email: { contains: filters.search, mode: 'insensitive' } } }
    ]
  }

  // Compter le total pour la pagination
  const total = await prisma.student.count({ where: whereCondition })

  // Récupérer les étudiants
  const students = await prisma.student.findMany({
    where: whereCondition,
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          address: true,
          birthDate: true,
          createdAt: true,
          updatedAt: true
        }
      },
      class: {
        select: {
          id: true,
          name: true,
          level: true,
          year: true
        }
      },
      parents: {
        include: {
          parent: {
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                  phone: true
                }
              }
            }
          }
        }
      },
      _count: {
        select: {
          grades: true,
          attendances: true
        }
      }
    },
    skip: offset,
    take: limit,
    orderBy: [
      { user: { lastName: 'asc' } },
      { user: { firstName: 'asc' } }
    ]
  })

  // Transformer les données
  const transformedStudents = students.map(student => ({
    id: student.id,
    userId: student.userId,
    firstName: student.user.firstName,
    lastName: student.user.lastName,
    email: student.user.email,
    phone: student.user.phone,
    address: student.user.address,
    birthDate: student.user.birthDate,
    classId: student.classId,
    class: student.class,
    parents: student.parents.map(p => ({
      id: p.parent.id,
      firstName: p.parent.user.firstName,
      lastName: p.parent.user.lastName,
      email: p.parent.user.email,
      phone: p.parent.user.phone,
    })),
    stats: {
      gradesCount: student._count.grades,
      attendancesCount: student._count.attendances
    },
    createdAt: student.user.createdAt,
    updatedAt: student.user.updatedAt
  }))

  const duration = Date.now() - startTime
  logApiCall('GET', '/api/students', session.user.id, duration, 200)

  return createPaginatedResponse(
    transformedStudents,
    page,
    limit,
    total,
    `${total} étudiants trouvés`
  )
})

// POST /api/students - Créer un nouvel étudiant
export const POST = withErrorHandling(async (req: NextRequest) => {
  const startTime = Date.now()
  
  // Authentification et autorisation
  const session = await requireAuth(['ADMIN'])
  
  // Validation des données
  const body = await req.json()
  const validatedData = createStudentSchema.parse(body)

  // Vérifier si l'email existe déjà
  const existingUser = await prisma.user.findUnique({
    where: { email: validatedData.email }
  })

  if (existingUser) {
    throw new ApiError(
      'Un utilisateur avec cet email existe déjà',
      ERROR_CODES.DUPLICATE_ENTRY,
      409
    )
  }

  // Vérifier si la classe existe (si fournie)
  if (validatedData.classId) {
    const classExists = await prisma.renamedclass.findUnique({
      where: { id: validatedData.classId }
    })

    if (!classExists) {
      throw new ApiError(
        'La classe spécifiée n\'existe pas',
        ERROR_CODES.NOT_FOUND,
        404
      )
    }
  }

  // Vérifier si les parents existent (si fournis)
  if (validatedData.parentIds && validatedData.parentIds.length > 0) {
    const parentsCount = await prisma.parent.count({
      where: { id: { in: validatedData.parentIds } }
    })

    if (parentsCount !== validatedData.parentIds.length) {
      throw new ApiError(
        'Un ou plusieurs parents spécifiés n\'existent pas',
        ERROR_CODES.NOT_FOUND,
        404
      )
    }
  }

  // Hacher le mot de passe
  const hashedPassword = await bcrypt.hash(validatedData.password, 12)

  // Transaction pour créer l'utilisateur et l'étudiant
  const result = await prisma.$transaction(async (tx) => {
    // Créer l'utilisateur
    const user = await tx.user.create({
      data: {
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        email: validatedData.email,
        password: hashedPassword,
        role: 'STUDENT',
        phone: validatedData.phone,
        address: validatedData.address,
        birthDate: validatedData.birthDate ? new Date(validatedData.birthDate) : null,
      }
    })

    // Créer l'étudiant
    const student = await tx.student.create({
      data: {
        userId: user.id,
        classId: validatedData.classId || null
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            address: true,
            birthDate: true,
            createdAt: true
          }
        },
        class: {
          select: {
            id: true,
            name: true,
            level: true
          }
        }
      }
    })

    // Créer les relations parent-étudiant si des parents sont fournis
    if (validatedData.parentIds && validatedData.parentIds.length > 0) {
      await tx.parentstudent.createMany({
        data: validatedData.parentIds.map(parentId => ({
          parentId,
          studentId: student.id
        }))
      })
    }

    return student
  })

  const duration = Date.now() - startTime
  logApiCall('POST', '/api/students', session.user.id, duration, 201)

  return createSuccessResponse(
    {
      id: result.id,
      userId: result.userId,
      firstName: result.user.firstName,
      lastName: result.user.lastName,
      email: result.user.email,
      phone: result.user.phone,
      address: result.user.address,
      birthDate: result.user.birthDate,
      classId: result.classId,
      class: result.class,
      createdAt: result.user.createdAt
    },
    'Étudiant créé avec succès',
    201
  )
})

// PUT /api/students/[id] - Mettre à jour un étudiant
export const PUT = withErrorHandling(async (req: NextRequest) => {
  const startTime = Date.now()
  
  // Authentification et autorisation
  const session = await requireAuth(['ADMIN', 'TEACHER'])
  
  // Extraire l'ID de l'URL
  const url = new URL(req.url)
  const studentId = url.pathname.split('/').pop()
  
  if (!studentId) {
    throw new ApiError('ID étudiant requis', ERROR_CODES.VALIDATION_ERROR, 400)
  }

  // Validation des données
  const body = await req.json()
  const validatedData = updateStudentSchema.parse(body)

  // Vérifier si l'étudiant existe
  const existingStudent = await prisma.student.findUnique({
    where: { id: studentId },
    include: { user: true }
  })

  if (!existingStudent) {
    throw new ApiError('Étudiant non trouvé', ERROR_CODES.NOT_FOUND, 404)
  }

  // Vérifier si l'email existe déjà (si modifié)
  if (validatedData.email && validatedData.email !== existingStudent.user.email) {
    const emailExists = await prisma.user.findUnique({
      where: { email: validatedData.email }
    })

    if (emailExists) {
      throw new ApiError(
        'Un utilisateur avec cet email existe déjà',
        ERROR_CODES.DUPLICATE_ENTRY,
        409
      )
    }
  }

  // Vérifier si la classe existe (si fournie)
  if (validatedData.classId) {
    const classExists = await prisma.renamedclass.findUnique({
      where: { id: validatedData.classId }
    })

    if (!classExists) {
      throw new ApiError(
        'La classe spécifiée n\'existe pas',
        ERROR_CODES.NOT_FOUND,
        404
      )
    }
  }

  // Mise à jour dans une transaction
  const result = await prisma.$transaction(async (tx) => {
    // Mettre à jour l'utilisateur
    const updatedUser = await tx.user.update({
      where: { id: existingStudent.userId },
      data: {
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        email: validatedData.email,
        phone: validatedData.phone,
        address: validatedData.address,
        birthDate: validatedData.birthDate ? new Date(validatedData.birthDate) : undefined,
      }
    })

    // Mettre à jour l'étudiant
    const updatedStudent = await tx.student.update({
      where: { id: studentId },
      data: {
        classId: validatedData.classId
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            address: true,
            birthDate: true,
            updatedAt: true
          }
        },
        class: {
          select: {
            id: true,
            name: true,
            level: true
          }
        }
      }
    })

    return updatedStudent
  })

  const duration = Date.now() - startTime
  logApiCall('PUT', '/api/students', session.user.id, duration, 200)

  return createSuccessResponse(
    {
      id: result.id,
      userId: result.userId,
      firstName: result.user.firstName,
      lastName: result.user.lastName,
      email: result.user.email,
      phone: result.user.phone,
      address: result.user.address,
      birthDate: result.user.birthDate,
      classId: result.classId,
      class: result.class,
      updatedAt: result.user.updatedAt
    },
    'Étudiant mis à jour avec succès'
  )
})

// DELETE /api/students/[id] - Supprimer un étudiant
export const DELETE = withErrorHandling(async (req: NextRequest) => {
  const startTime = Date.now()
  
  // Authentification et autorisation
  const session = await requireAuth(['ADMIN'])
  
  // Extraire l'ID de l'URL
  const url = new URL(req.url)
  const studentId = url.pathname.split('/').pop()
  
  if (!studentId) {
    throw new ApiError('ID étudiant requis', ERROR_CODES.VALIDATION_ERROR, 400)
  }

  // Vérifier si l'étudiant existe
  const existingStudent = await prisma.student.findUnique({
    where: { id: studentId },
    include: {
      user: true,
      grades: true,
      attendances: true
    }
  })

  if (!existingStudent) {
    throw new ApiError('Étudiant non trouvé', ERROR_CODES.NOT_FOUND, 404)
  }

  // Vérifier s'il y a des données liées
  if (existingStudent.grades.length > 0 || existingStudent.attendances.length > 0) {
    throw new ApiError(
      'Impossible de supprimer un étudiant avec des notes ou des présences enregistrées',
      ERROR_CODES.VALIDATION_ERROR,
      400
    )
  }

  // Suppression en cascade
  await prisma.$transaction(async (tx) => {
    // Supprimer les relations parent-étudiant
    await tx.parentstudent.deleteMany({
      where: { studentId }
    })

    // Supprimer l'étudiant
    await tx.student.delete({
      where: { id: studentId }
    })

    // Supprimer l'utilisateur
    await tx.user.delete({
      where: { id: existingStudent.userId }
    })
  })

  const duration = Date.now() - startTime
  logApiCall('DELETE', '/api/students', session.user.id, duration, 200)

  return createSuccessResponse(
    null,
    'Étudiant supprimé avec succès'
  )
}) 


