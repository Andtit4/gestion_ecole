import type { 
  Student, 
  CreateStudentDto, 
  UpdateStudentDto, 
  StudentListResponse, 
  StudentStats,
  BulkImportResult 
} from '@/types/student'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1'

// Helper pour créer les headers avec tenant ID
const createHeaders = (tenantId?: string) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  
  if (tenantId) {
    headers['X-Tenant-Id'] = tenantId
  }
  
  return headers
}

// Helper pour gérer les erreurs API
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorText = await response.text()
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`
    
    try {
      const errorData = JSON.parse(errorText)
      if (errorData.message) {
        errorMessage = errorData.message
      }
    } catch (e) {
      if (errorText) {
        errorMessage = errorText
      }
    }
    
    throw new Error(errorMessage)
  }
  
  return await response.json()
}

// Récupérer la liste des élèves avec pagination et filtres
export async function fetchStudents(
  tenantId: string,
  page: number = 1,
  limit: number = 20,
  search?: string,
  classId?: string,
  status?: string
): Promise<StudentListResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  })
  
  if (search) params.append('search', search)
  if (classId) params.append('classId', classId)
  if (status) params.append('status', status)
  
  const response = await fetch(`${API_BASE_URL}/students?${params}`, {
    method: 'GET',
    headers: createHeaders(tenantId),
  })
  
  return await handleResponse<StudentListResponse>(response)
}

// Récupérer un élève par ID
export async function fetchStudent(id: string, tenantId: string): Promise<Student> {
  const response = await fetch(`${API_BASE_URL}/students/${id}`, {
    method: 'GET',
    headers: createHeaders(tenantId),
  })
  
  return await handleResponse<Student>(response)
}

// Créer un nouvel élève
export async function createStudent(studentData: CreateStudentDto, tenantId: string): Promise<Student> {
  const response = await fetch(`${API_BASE_URL}/students`, {
    method: 'POST',
    headers: createHeaders(tenantId),
    body: JSON.stringify(studentData),
  })
  
  return await handleResponse<Student>(response)
}

// Mettre à jour un élève
export async function updateStudent(
  id: string, 
  studentData: UpdateStudentDto, 
  tenantId: string
): Promise<Student> {
  const response = await fetch(`${API_BASE_URL}/students/${id}`, {
    method: 'PATCH',
    headers: createHeaders(tenantId),
    body: JSON.stringify(studentData),
  })
  
  return await handleResponse<Student>(response)
}

// Supprimer un élève
export async function deleteStudent(id: string, tenantId: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/students/${id}`, {
    method: 'DELETE',
    headers: createHeaders(tenantId),
  })
  
  if (!response.ok) {
    throw new Error(`Erreur lors de la suppression: ${response.status}`)
  }
}

// Récupérer les statistiques des élèves
export async function fetchStudentStats(tenantId: string): Promise<StudentStats> {
  const response = await fetch(`${API_BASE_URL}/students/stats`, {
    method: 'GET',
    headers: createHeaders(tenantId),
  })
  
  return await handleResponse<StudentStats>(response)
}

// Récupérer les élèves d'une classe
export async function fetchStudentsByClass(classId: string, tenantId: string): Promise<Student[]> {
  const response = await fetch(`${API_BASE_URL}/students/by-class/${classId}`, {
    method: 'GET',
    headers: createHeaders(tenantId),
  })
  
  return await handleResponse<Student[]>(response)
}

// Import en masse d'élèves
export async function bulkImportStudents(
  studentsData: CreateStudentDto[], 
  tenantId: string
): Promise<BulkImportResult> {
  const response = await fetch(`${API_BASE_URL}/students/bulk-import`, {
    method: 'POST',
    headers: createHeaders(tenantId),
    body: JSON.stringify(studentsData),
  })
  
  return await handleResponse<BulkImportResult>(response)
}

// Générer un numéro d'élève unique
export function generateStudentNumber(prefix: string = 'STU'): string {
  const year = new Date().getFullYear()
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  return `${prefix}${year}${random}`
}

// Valider l'âge d'un élève
export function validateStudentAge(dateOfBirth: string, minAge: number = 3, maxAge: number = 25): boolean {
  const today = new Date()
  const birthDate = new Date(dateOfBirth)
  const age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    return age - 1 >= minAge && age - 1 <= maxAge
  }
  
  return age >= minAge && age <= maxAge
}

// Formater le nom complet d'un élève
export function getStudentFullName(student: Student): string {
  return `${student.firstName} ${student.lastName}`
}

// Calculer l'âge d'un élève
export function calculateAge(dateOfBirth: string): number {
  const today = new Date()
  const birthDate = new Date(dateOfBirth)
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  
  return age
}

// Alias simple pour récupérer tous les étudiants (sans pagination)
export async function getStudents(tenantId: string): Promise<Student[]> {
  try {
    const response = await fetchStudents(tenantId, 1, 1000) // Récupérer jusqu'à 1000 étudiants
    return response.students || []
  } catch (error) {
    console.error('Erreur lors de la récupération des étudiants:', error)
    return []
  }
}