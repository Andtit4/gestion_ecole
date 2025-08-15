export interface OnlineCourse {
  id: string
  title: string
  description: string
  subject: string
  teacherId: string
  teacherName: string
  classId: string
  className: string
  students: string[] // IDs des étudiants
  
  // Planification
  scheduledAt: string // Date/heure de début
  duration: number // Durée en minutes
  recurring?: {
    type: 'daily' | 'weekly' | 'monthly'
    interval: number // Tous les X jours/semaines/mois
    endDate?: string
  }
  
  // Statut
  status: 'scheduled' | 'live' | 'ended' | 'cancelled'
  
  // Vidéoconférence
  meetingId: string // ID unique de la réunion
  meetingUrl: string // Lien Jitsi Meet
  meetingPassword?: string
  
  // Enregistrement
  recordingEnabled: boolean
  recordingUrl?: string
  
  // Participants
  attendees: CourseAttendee[]
  maxParticipants?: number
  
  // Métadonnées
  tenantId: string
  createdAt: string
  updatedAt: string
}

export interface CourseAttendee {
  userId: string
  userName: string
  userType: 'teacher' | 'student'
  joinedAt?: string
  leftAt?: string
  duration?: number // Temps de présence en minutes
}

export interface CreateOnlineCourse {
  title: string
  description: string
  subject: string
  classId: string
  scheduledAt: string
  duration: number
  recurring?: {
    type: 'daily' | 'weekly' | 'monthly'
    interval: number
    endDate?: string
  }
  recordingEnabled: boolean
  maxParticipants?: number
}

export interface JoinCourseRequest {
  courseId: string
  userId: string
  userName: string
  userType: 'teacher' | 'student'
}

export interface CourseFilters {
  subject?: string
  className?: string
  teacherId?: string
  status?: 'scheduled' | 'live' | 'ended' | 'cancelled'
  dateFrom?: string
  dateTo?: string
  search?: string
}

export interface CourseStatistics {
  totalCourses: number
  liveCourses: number
  scheduledCourses: number
  completedCourses: number
  totalStudents: number
  averageAttendance: number
  totalDuration: number // Minutes
  popularSubjects: Array<{
    subject: string
    count: number
  }>
} 