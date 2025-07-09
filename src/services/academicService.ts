import type { 
  AcademicYear, 
  CreateAcademicYearDto, 
  Class, 
  CreateClassDto,
  Schedule,
  CreateScheduleDto,
  Subject,
  CreateSubjectDto,
  Teacher,
  CreateTeacherDto,
  AcademicStats
} from '@/types/academic'

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
      console.error('Erreur API détaillée:', errorData)
      if (errorData.message) {
        if (Array.isArray(errorData.message)) {
          errorMessage = errorData.message.join(', ')
        } else {
          errorMessage = errorData.message
        }
      }
    } catch (e) {
      console.error('Erreur de parsing JSON:', e)
      if (errorText) {
        errorMessage = errorText
      }
    }
    
    console.error('Réponse d\'erreur complète:', errorText)
    throw new Error(errorMessage)
  }
  
  return await response.json()
}

// ==================== ACADEMIC YEARS ====================

export async function fetchAcademicYears(tenantId: string): Promise<AcademicYear[]> {
  const response = await fetch(`${API_BASE_URL}/academic/years`, {
    method: 'GET',
    headers: createHeaders(tenantId),
  })
  
  return await handleResponse<AcademicYear[]>(response)
}

export async function fetchAcademicYear(id: string, tenantId: string): Promise<AcademicYear> {
  const response = await fetch(`${API_BASE_URL}/academic/years/${id}`, {
    method: 'GET',
    headers: createHeaders(tenantId),
  })
  
  return await handleResponse<AcademicYear>(response)
}

export async function fetchActiveAcademicYear(tenantId: string): Promise<AcademicYear | null> {
  const response = await fetch(`${API_BASE_URL}/academic/years/active`, {
    method: 'GET',
    headers: createHeaders(tenantId),
  })
  
  return await handleResponse<AcademicYear | null>(response)
}

export async function createAcademicYear(
  academicYearData: CreateAcademicYearDto,
  tenantId: string
): Promise<AcademicYear> {
  const response = await fetch(`${API_BASE_URL}/academic/years`, {
    method: 'POST',
    headers: createHeaders(tenantId),
    body: JSON.stringify(academicYearData),
  })
  
  return await handleResponse<AcademicYear>(response)
}

// ==================== CLASSES ====================

export async function fetchClasses(
  tenantId: string,
  academicYearId?: string
): Promise<Class[]> {
  const params = new URLSearchParams()
  if (academicYearId) {
    params.append('academicYearId', academicYearId)
  }
  
  const response = await fetch(`${API_BASE_URL}/academic/classes?${params}`, {
    method: 'GET',
    headers: createHeaders(tenantId),
  })
  
  return await handleResponse<Class[]>(response)
}

export async function fetchClass(id: string, tenantId: string): Promise<Class> {
  const response = await fetch(`${API_BASE_URL}/academic/classes/${id}`, {
    method: 'GET',
    headers: createHeaders(tenantId),
  })
  
  return await handleResponse<Class>(response)
}

export async function createClass(
  classData: CreateClassDto,
  tenantId: string
): Promise<Class> {
  const response = await fetch(`${API_BASE_URL}/academic/classes`, {
    method: 'POST',
    headers: createHeaders(tenantId),
    body: JSON.stringify(classData),
  })
  
  return await handleResponse<Class>(response)
}

// ==================== SCHEDULES ====================

export async function fetchSchedules(
  tenantId: string,
  classId?: string,
  academicYearId?: string,
  dayOfWeek?: string
): Promise<Schedule[]> {
  const params = new URLSearchParams()
  if (classId) params.append('classId', classId)
  if (academicYearId) params.append('academicYearId', academicYearId)
  if (dayOfWeek) params.append('dayOfWeek', dayOfWeek)
  
  const response = await fetch(`${API_BASE_URL}/academic/schedules?${params}`, {
    method: 'GET',
    headers: createHeaders(tenantId),
  })
  
  return await handleResponse<Schedule[]>(response)
}

export async function fetchSchedule(id: string, tenantId: string): Promise<Schedule> {
  const response = await fetch(`${API_BASE_URL}/academic/schedules/${id}`, {
    method: 'GET',
    headers: createHeaders(tenantId),
  })
  
  return await handleResponse<Schedule>(response)
}

export async function createSchedule(
  scheduleData: CreateScheduleDto,
  tenantId: string
): Promise<Schedule> {
  console.log('Données envoyées pour création de créneau:', scheduleData)
  console.log('Headers:', createHeaders(tenantId))
  
  const response = await fetch(`${API_BASE_URL}/academic/schedules`, {
    method: 'POST',
    headers: createHeaders(tenantId),
    body: JSON.stringify(scheduleData),
  })
  
  return await handleResponse<Schedule>(response)
}

// ==================== SUBJECTS ====================

export async function createSubject(
  subjectData: CreateSubjectDto,
  tenantId: string
): Promise<Subject> {
  console.log('Création d\'une matière:', subjectData)
  
  const response = await fetch(`${API_BASE_URL}/academic/subjects`, {
    method: 'POST',
    headers: createHeaders(tenantId),
    body: JSON.stringify(subjectData),
  })
  
  return await handleResponse<Subject>(response)
}

export async function getSubjects(tenantId: string): Promise<Subject[]> {
  const response = await fetch(`${API_BASE_URL}/academic/subjects`, {
    method: 'GET',
    headers: createHeaders(tenantId),
  })
  
  return await handleResponse<Subject[]>(response)
}

export async function getSubjectById(
  id: string,
  tenantId: string
): Promise<Subject> {
  const response = await fetch(`${API_BASE_URL}/academic/subjects/${id}`, {
    method: 'GET',
    headers: createHeaders(tenantId),
  })
  
  return await handleResponse<Subject>(response)
}

export async function updateSubject(
  id: string,
  subjectData: Partial<CreateSubjectDto>,
  tenantId: string
): Promise<Subject> {
  console.log('Mise à jour d\'une matière:', subjectData)
  
  const response = await fetch(`${API_BASE_URL}/academic/subjects/${id}`, {
    method: 'PUT',
    headers: createHeaders(tenantId),
    body: JSON.stringify(subjectData),
  })
  
  return await handleResponse<Subject>(response)
}

export async function deleteSubject(
  id: string,
  tenantId: string
): Promise<void> {
  console.log('Suppression d\'une matière:', id)
  
  const response = await fetch(`${API_BASE_URL}/academic/subjects/${id}`, {
    method: 'DELETE',
    headers: createHeaders(tenantId),
  })
  
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
}

// ==================== TEACHERS ====================

export async function createTeacher(
  teacherData: CreateTeacherDto,
  tenantId: string
): Promise<Teacher> {
  console.log('Création d\'un professeur:', teacherData)
  
  const response = await fetch(`${API_BASE_URL}/academic/teachers`, {
    method: 'POST',
    headers: createHeaders(tenantId),
    body: JSON.stringify(teacherData),
  })
  
  return await handleResponse<Teacher>(response)
}

// Fonction pour récupérer les enseignants depuis l'API teachers (gestion)
export async function getTeachersFromManagement(tenantId: string): Promise<any[]> {
  const response = await fetch(`${API_BASE_URL}/teachers`, {
    method: 'GET',
    headers: createHeaders(tenantId),
  })
  
  const result = await handleResponse<any>(response)
  // L'API teachers retourne { teachers: [...], total, page, etc. }
  return result.teachers || []
}

export async function getTeachers(tenantId: string): Promise<Teacher[]> {
  // Utiliser l'API teachers au lieu d'academic/teachers pour avoir les enseignants de la gestion
  return await getTeachersFromManagement(tenantId)
}

export async function getTeacherById(
  id: string,
  tenantId: string
): Promise<Teacher> {
  const response = await fetch(`${API_BASE_URL}/academic/teachers/${id}`, {
    method: 'GET',
    headers: createHeaders(tenantId),
  })
  
  return await handleResponse<Teacher>(response)
}

export async function updateTeacher(
  id: string,
  teacherData: Partial<CreateTeacherDto>,
  tenantId: string
): Promise<Teacher> {
  console.log('Modification d\'un professeur:', id, teacherData)
  
  const response = await fetch(`${API_BASE_URL}/academic/teachers/${id}`, {
    method: 'PUT',
    headers: createHeaders(tenantId),
    body: JSON.stringify(teacherData),
  })
  
  return await handleResponse<Teacher>(response)
}

export async function deleteTeacher(
  id: string,
  tenantId: string
): Promise<void> {
  console.log('Suppression d\'un professeur:', id)
  
  const response = await fetch(`${API_BASE_URL}/academic/teachers/${id}`, {
    method: 'DELETE',
    headers: createHeaders(tenantId),
  })
  
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
}

// ==================== SUPER ADMIN ====================

export async function assignSubjectsToTenant(
  targetTenantId: string,
  subjectIds: string[]
): Promise<Subject[]> {
  const response = await fetch(`${API_BASE_URL}/academic/super-admin/assign-subjects/${targetTenantId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ subjectIds }),
  })
  
  return await handleResponse<Subject[]>(response)
}

export async function assignTeachersToTenant(
  targetTenantId: string,
  teacherIds: string[]
): Promise<Teacher[]> {
  const response = await fetch(`${API_BASE_URL}/academic/super-admin/assign-teachers/${targetTenantId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ teacherIds }),
  })
  
  return await handleResponse<Teacher[]>(response)
}

export async function getAllSubjectsForSuperAdmin(): Promise<Subject[]> {
  const response = await fetch(`${API_BASE_URL}/academic/super-admin/subjects`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  
  return await handleResponse<Subject[]>(response)
}

export async function getAllTeachersForSuperAdmin(): Promise<Teacher[]> {
  const response = await fetch(`${API_BASE_URL}/academic/super-admin/teachers`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  
  return await handleResponse<Teacher[]>(response)
}

// ==================== STATS ====================

export async function fetchAcademicStats(tenantId: string): Promise<AcademicStats> {
  const response = await fetch(`${API_BASE_URL}/academic/stats`, {
    method: 'GET',
    headers: createHeaders(tenantId),
  })
  
  return await handleResponse<AcademicStats>(response)
}

// ==================== UTILITY FUNCTIONS ====================

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function formatTime(timeString: string): string {
  return timeString
}

export function calculateDuration(startTime: string, endTime: string): number {
  const [startHour, startMinute] = startTime.split(':').map(Number)
  const [endHour, endMinute] = endTime.split(':').map(Number)
  
  const startTotalMinutes = startHour * 60 + startMinute
  const endTotalMinutes = endHour * 60 + endMinute
  
  return endTotalMinutes - startTotalMinutes
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  
  if (hours === 0) {
    return `${remainingMinutes}min`
  } else if (remainingMinutes === 0) {
    return `${hours}h`
  } else {
    return `${hours}h${remainingMinutes}min`
  }
}

export function getSchoolTypeLabel(schoolType: string): string {
  const labels: Record<string, string> = {
    'primary': 'Primaire',
    'middle': 'Collège',
    'high': 'Lycée',
    'university': 'Université'
  }
  return labels[schoolType] || schoolType
}

export function getDayOfWeekLabel(dayOfWeek: string): string {
  const labels: Record<string, string> = {
    'monday': 'Lundi',
    'tuesday': 'Mardi',
    'wednesday': 'Mercredi',
    'thursday': 'Jeudi',
    'friday': 'Vendredi',
    'saturday': 'Samedi',
    'sunday': 'Dimanche'
  }
  return labels[dayOfWeek] || dayOfWeek
}

export function getScheduleTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    'course': 'Cours',
    'td': 'TD',
    'tp': 'TP',
    'exam': 'Examen',
    'break': 'Pause',
    'other': 'Autre'
  }
  return labels[type] || type
}

export function generateDefaultPeriods(): CreateAcademicYearDto['periods'] {
  return [
    {
      name: 'Premier Trimestre',
      startDate: '',
      endDate: '',
      isActive: false,
      order: 1
    },
    {
      name: 'Deuxième Trimestre', 
      startDate: '',
      endDate: '',
      isActive: false,
      order: 2
    },
    {
      name: 'Troisième Trimestre',
      startDate: '',
      endDate: '',
      isActive: false,
      order: 3
    }
  ]
} 