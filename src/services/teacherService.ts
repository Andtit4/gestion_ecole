import type { 
  Teacher, 
  CreateTeacherDto, 
  UpdateTeacherDto, 
  TeacherListResponse, 
  TeacherStats,
  CreateTeacherResponse
} from '@/types/teacher'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1'

// Helper pour créer les headers avec tenant ID
const createHeaders = (tenantId?: string) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  
  if (tenantId) {
    headers['x-tenant-id'] = tenantId
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

// Récupérer la liste des professeurs avec pagination et filtres
export async function fetchTeachers(
  tenantId: string,
  page: number = 1,
  limit: number = 20,
  search?: string,
  subject?: string,
  status?: string
): Promise<TeacherListResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  })
  
  if (search) params.append('search', search)
  if (subject) params.append('subject', subject)
  if (status) params.append('status', status)
  
  const response = await fetch(`${API_BASE_URL}/teachers?${params}`, {
    method: 'GET',
    headers: createHeaders(tenantId),
  })
  
  return await handleResponse<TeacherListResponse>(response)
}

// Récupérer un professeur par ID
export async function fetchTeacher(id: string, tenantId: string): Promise<Teacher> {
  const response = await fetch(`${API_BASE_URL}/teachers/${id}`, {
    method: 'GET',
    headers: createHeaders(tenantId),
  })
  
  return await handleResponse<Teacher>(response)
}

// Créer un nouveau professeur
export async function createTeacher(teacherData: CreateTeacherDto, tenantId: string): Promise<CreateTeacherResponse> {
  const response = await fetch(`${API_BASE_URL}/teachers`, {
    method: 'POST',
    headers: createHeaders(tenantId),
    body: JSON.stringify(teacherData),
  })
  
  return await handleResponse<CreateTeacherResponse>(response)
}

// Mettre à jour un professeur
export async function updateTeacher(
  id: string, 
  teacherData: UpdateTeacherDto, 
  tenantId: string
): Promise<Teacher> {
  const response = await fetch(`${API_BASE_URL}/teachers/${id}`, {
    method: 'PATCH',
    headers: createHeaders(tenantId),
    body: JSON.stringify(teacherData),
  })
  
  return await handleResponse<Teacher>(response)
}

// Supprimer un professeur
export async function deleteTeacher(id: string, tenantId: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/teachers/${id}`, {
    method: 'DELETE',
    headers: createHeaders(tenantId),
  })
  
  if (!response.ok) {
    throw new Error(`Erreur lors de la suppression: ${response.status}`)
  }
}

// Récupérer les statistiques des professeurs
export async function fetchTeacherStats(tenantId: string): Promise<TeacherStats> {
  const response = await fetch(`${API_BASE_URL}/teachers/stats`, {
    method: 'GET',
    headers: createHeaders(tenantId),
  })
  
  return await handleResponse<TeacherStats>(response)
}

// Récupérer les professeurs par matière
export async function fetchTeachersBySubject(subject: string, tenantId: string): Promise<Teacher[]> {
  const response = await fetch(`${API_BASE_URL}/teachers/by-subject/${subject}`, {
    method: 'GET',
    headers: createHeaders(tenantId),
  })
  
  return await handleResponse<Teacher[]>(response)
}

// Générer un numéro d'employé unique
export function generateEmployeeNumber(prefix: string = 'EMP'): string {
  const year = new Date().getFullYear()
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  return `${prefix}${year}${random}`
}

// Calculer l'ancienneté d'un professeur
export function calculateSeniority(hireDate: string): number {
  const today = new Date()
  const hire = new Date(hireDate)
  let years = today.getFullYear() - hire.getFullYear()
  const monthDiff = today.getMonth() - hire.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < hire.getDate())) {
    years--
  }
  
  return years
}

// Formater le nom complet d'un professeur
export function getTeacherFullName(teacher: Teacher): string {
  return `${teacher.firstName} ${teacher.lastName}`
}

// Calculer l'âge d'un professeur
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