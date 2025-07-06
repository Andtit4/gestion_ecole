export interface Teacher {
  _id: string
  employeeNumber: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  dateOfBirth?: string
  gender: 'M' | 'F'
  placeOfBirth?: string
  address?: {
    street?: string
    city?: string
    postalCode?: string
    country?: string
  }
  hireDate: string
  status: 'active' | 'inactive' | 'on_leave' | 'terminated'
  subjects: string[]
  classes: string[]
  qualification?: string
  experience?: number
  salary?: number
  emergencyContact?: {
    name?: string
    phone?: string
    relationship?: string
  }
  createdAt: string
  updatedAt: string
}

export interface CreateTeacherDto {
  firstName: string
  lastName: string
  email: string
  phone?: string
  dateOfBirth?: string
  gender: 'M' | 'F'
  placeOfBirth?: string
  address?: {
    street?: string
    city?: string
    postalCode?: string
    country?: string
  }
  hireDate: string
  subjects: string[]
  classes?: string[]
  qualification?: string
  experience?: number
  salary?: number
  emergencyContact?: {
    name?: string
    phone?: string
    relationship?: string
  }
}

export interface UpdateTeacherDto {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  dateOfBirth?: string
  gender?: 'M' | 'F'
  placeOfBirth?: string
  address?: {
    street?: string
    city?: string
    postalCode?: string
    country?: string
  }
  hireDate?: string
  status?: 'active' | 'inactive' | 'on_leave' | 'terminated'
  subjects?: string[]
  classes?: string[]
  qualification?: string
  experience?: number
  salary?: number
  emergencyContact?: {
    name?: string
    phone?: string
    relationship?: string
  }
}

export interface TeacherListResponse {
  teachers: Teacher[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface CreateTeacherResponse {
  teacher: Teacher
  userCredentials?: {
    email: string
    password: string
  }
}

export interface TeacherStats {
  total: number
  active: number
  inactive: number
  onLeave: number
  recentHires: number
  bySubject: Record<string, number>
  averageExperience: number
}
