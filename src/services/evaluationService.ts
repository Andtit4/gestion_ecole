

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

export interface Evaluation {
  _id: string
  tenantId: string
  name: string
  description?: string
  type: 'controle' | 'examen' | 'devoir' | 'oral' | 'projet' | 'tp' | 'participation'
  subjectId: string
  classId: string
  teacherId: string
  academicYearId: string
  periodId?: string
  date: string
  maxScore: number
  coefficient: number
  scale: 'twenty' | 'ten' | 'five' | 'letter'
  isPublished: boolean
  status: string
  createdAt: string
  updatedAt: string
}

export interface StudentGrade {
  _id: string
  tenantId: string
  evaluationId: string
  studentId: string
  score: number
  maxScore: number
  comment?: string
  isAbsent: boolean
  gradedBy: string
  gradedAt: string
  status: string
  createdAt: string
  updatedAt: string
}

export interface CreateEvaluationDto {
  name: string
  description?: string
  type: 'controle' | 'examen' | 'devoir' | 'oral' | 'projet' | 'tp' | 'participation'
  subjectId: string
  classId: string
  teacherId: string
  academicYearId: string
  periodId?: string
  date: string
  maxScore: number
  coefficient: number
  scale?: 'twenty' | 'ten' | 'five' | 'letter'
  isPublished?: boolean
}

export interface CreateStudentGradeDto {
  evaluationId: string
  studentId: string
  score: number
  maxScore: number
  comment?: string
  isAbsent?: boolean
  gradedBy: string
}

export interface EvaluationStats {
  totalEvaluations: number
  publishedEvaluations: number
  totalGrades: number
  averageGrade: number
  pendingEvaluations: number
}



export interface SubjectAverage {
  subjectId: string
  average: number
  totalGrades: number
  grades: StudentGrade[]
}

// === EVALUATIONS ===

export const createEvaluation = async (tenantId: string, data: CreateEvaluationDto): Promise<Evaluation> => {
  const response = await fetch(`${API_BASE_URL}/evaluations`, {
    method: 'POST',
    headers: createHeaders(tenantId),
    body: JSON.stringify(data),
  })
  
  return await handleResponse<Evaluation>(response)
}

export const fetchEvaluations = async (
  tenantId: string,
  params: {
    page?: number
    limit?: number
    classId?: string
    subjectId?: string
    teacherId?: string
    type?: string
    academicYearId?: string
    periodId?: string
  } = {}
) => {
  const queryParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      queryParams.append(key, String(value))
    }
  })
  const queryString = queryParams.toString()
  const endpoint = queryString ? `/evaluations?${queryString}` : '/evaluations'
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'GET',
    headers: createHeaders(tenantId),
  })
  
  return await handleResponse(response)
}

export const fetchEvaluation = async (tenantId: string, id: string): Promise<Evaluation> => {
  const response = await fetch(`${API_BASE_URL}/evaluations/${id}`, {
    method: 'GET',
    headers: createHeaders(tenantId),
  })
  
  return await handleResponse<Evaluation>(response)
}

export const updateEvaluation = async (
  tenantId: string,
  id: string,
  data: Partial<CreateEvaluationDto>
): Promise<Evaluation> => {
  const response = await fetch(`${API_BASE_URL}/evaluations/${id}`, {
    method: 'PATCH',
    headers: createHeaders(tenantId),
    body: JSON.stringify(data),
  })
  
  return await handleResponse<Evaluation>(response)
}

export const deleteEvaluation = async (tenantId: string, id: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/evaluations/${id}`, {
    method: 'DELETE',
    headers: createHeaders(tenantId),
  })
  
  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText || `HTTP ${response.status}`)
  }
}



// === STATISTIQUES ===

export const fetchEvaluationStats = async (
  tenantId: string,
  params: {
    classId?: string
    academicYearId?: string
  } = {}
): Promise<EvaluationStats> => {
  const queryParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      queryParams.append(key, String(value))
    }
  })
  const queryString = queryParams.toString()
  const endpoint = queryString ? `/evaluations/stats?${queryString}` : '/evaluations/stats'
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'GET',
    headers: createHeaders(tenantId),
  })
  
  return await handleResponse<EvaluationStats>(response)
}

// === GRADES/NOTES ===

export const createStudentGrade = async (tenantId: string, data: CreateStudentGradeDto): Promise<StudentGrade> => {
  const response = await fetch(`${API_BASE_URL}/evaluations/grades`, {
    method: 'POST',
    headers: createHeaders(tenantId),
    body: JSON.stringify(data),
  })
  
  return await handleResponse<StudentGrade>(response)
}

export const findGradesByEvaluation = async (evaluationId: string, tenantId: string): Promise<StudentGrade[]> => {
  const response = await fetch(`${API_BASE_URL}/evaluations/${evaluationId}/grades`, {
    method: 'GET',
    headers: createHeaders(tenantId),
  })
  
  return await handleResponse<StudentGrade[]>(response)
}

export const fetchGradesByStudent = async (
  tenantId: string,
  studentId: string,
  params: {
    evaluationId?: string
    subjectId?: string
  } = {}
): Promise<StudentGrade[]> => {
  const queryParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      queryParams.append(key, String(value))
    }
  })
  const queryString = queryParams.toString()
  const endpoint = queryString ? `/evaluations/students/${studentId}/grades?${queryString}` : `/evaluations/students/${studentId}/grades`
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'GET',
    headers: createHeaders(tenantId),
  })
  
  return await handleResponse<StudentGrade[]>(response)
}

export const updateStudentGrade = async (gradeId: string, tenantId: string, data: Partial<CreateStudentGradeDto>): Promise<StudentGrade> => {
  const response = await fetch(`${API_BASE_URL}/evaluations/grades/${gradeId}`, {
    method: 'PATCH',
    headers: createHeaders(tenantId),
    body: JSON.stringify(data),
  })
  
  return await handleResponse<StudentGrade>(response)
}

export const deleteStudentGrade = async (gradeId: string, tenantId: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/evaluations/grades/${gradeId}`, {
    method: 'DELETE',
    headers: createHeaders(tenantId),
  })
  
  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText || `HTTP ${response.status}`)
  }
}

export const fetchSubjectAverages = async (
  tenantId: string,
  params: {
    studentId?: string
    classId?: string
  } = {}
): Promise<SubjectAverage[]> => {
  const queryParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      queryParams.append(key, String(value))
    }
  })
  const queryString = queryParams.toString()
  const endpoint = queryString ? `/evaluations/subject-averages?${queryString}` : '/evaluations/subject-averages'
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'GET',
    headers: createHeaders(tenantId),
  })
  
  return await handleResponse<SubjectAverage[]>(response)
}

// Alias pour fetchGradesByStudent pour la compatibilité avec BulletinManagement
export const fetchStudentGrades = fetchGradesByStudent