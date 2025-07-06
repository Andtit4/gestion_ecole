// Types pour les années scolaires
export interface AcademicYear {
  _id: string;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  periods: AcademicPeriod[];
  description?: string;
  status: 'active' | 'inactive' | 'archived';
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AcademicPeriod {
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  order: number;
}

export interface CreateAcademicYearDto {
  name: string;
  startDate: string;
  endDate: string;
  isActive?: boolean;
  periods?: CreateAcademicPeriodDto[];
  description?: string;
  status?: 'active' | 'inactive' | 'archived';
}

export interface CreateAcademicPeriodDto {
  name: string;
  startDate: string;
  endDate: string;
  isActive?: boolean;
  order: number;
}

// Types pour les classes
export interface Class {
  _id: string;
  name: string;
  level: string;
  section?: string;
  capacity: number;
  currentStudents: number;
  schoolType: 'primary' | 'middle' | 'high' | 'university';
  subjects: string[];
  mainTeacher?: string;
  academicYearId: string;
  classroom?: string;
  description?: string;
  weeklySchedule?: WeeklySchedule;
  status: 'active' | 'inactive' | 'archived';
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

export interface WeeklySchedule {
  monday: string[];
  tuesday: string[];
  wednesday: string[];
  thursday: string[];
  friday: string[];
  saturday: string[];
  sunday: string[];
}

export interface CreateClassDto {
  name: string;
  level: string;
  section?: string;
  capacity: number;
  schoolType: 'primary' | 'middle' | 'high' | 'university';
  subjects?: string[];
  mainTeacher?: string;
  academicYearId: string;
  classroom?: string;
  description?: string;
  status?: 'active' | 'inactive' | 'archived';
}

// Types pour les créneaux horaires
export interface Schedule {
  _id: string;
  name: string;
  dayOfWeek: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  startTime: string;
  endTime: string;
  duration: number;
  subjectId?: string;
  classId: string;
  teacherId?: string;
  academicYearId: string;
  classroom?: string;
  type: 'course' | 'td' | 'tp' | 'exam' | 'break' | 'other';
  description?: string;
  color?: string;
  isRecurring: boolean;
  startDate?: string;
  endDate?: string;
  exceptions?: ScheduleException[];
  status: 'active' | 'inactive' | 'cancelled';
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ScheduleException {
  date: string;
  reason: string;
  replacementScheduleId?: string;
}

export interface CreateScheduleDto {
  name: string;
  dayOfWeek: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  startTime: string;
  endTime: string;
  duration: number;
  subjectId?: string;
  classId: string;
  teacherId?: string;
  academicYearId: string;
  classroom?: string;
  type: 'course' | 'td' | 'tp' | 'exam' | 'break' | 'other';
  description?: string;
  color?: string;
  isRecurring?: boolean;
  startDate?: string;
  endDate?: string;
  status?: 'active' | 'inactive' | 'cancelled';
}

// ==================== SUBJECTS ====================

export interface Subject {
  _id: string;
  name: string;
  code: string;
  description?: string;
  credits: number;
  status: 'active' | 'inactive';
  color?: string;
  hoursPerWeek?: number;
  type?: 'theory' | 'practical' | 'mixed';
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSubjectDto {
  name: string;
  code: string;
  description?: string;
  credits?: number;
  status?: string;
  color?: string;
  hoursPerWeek?: number;
  type?: string;
}

// ==================== TEACHERS ====================

export interface Teacher {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  employeeId: string;
  hireDate: string;
  status: 'active' | 'inactive' | 'suspended';
  subjects: string[] | Subject[];
  education?: {
    degree?: string;
    field?: string;
    institution?: string;
    year?: number;
  };
  experience: number;
  salary?: number;
  employmentType: 'full-time' | 'part-time' | 'contract';
  department?: string;
  specialization?: string;
  profilePicture?: string;
  languages?: string[];
  emergencyContact?: string;
  emergencyPhone?: string;
  tenantId: string;
  userId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTeacherDto {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  employeeId: string;
  hireDate?: string;
  status?: string;
  subjects?: string[];
  education?: {
    degree?: string;
    field?: string;
    institution?: string;
    year?: number;
  };
  experience?: number;
  salary?: number;
  employmentType?: string;
  department?: string;
  specialization?: string;
  profilePicture?: string;
  languages?: string[];
  emergencyContact?: string;
  emergencyPhone?: string;
  userId?: string;
}

// Types pour les statistiques
export interface AcademicStats {
  academicYears: number;
  classes: number;
  schedules: number;
  subjects: number;
  teachers: number;
}

// Types pour les options de sélection
export interface SchoolTypeOption {
  value: 'primary' | 'middle' | 'high' | 'university';
  label: string;
}

export interface DayOfWeekOption {
  value: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  label: string;
}

export interface ScheduleTypeOption {
  value: 'course' | 'td' | 'tp' | 'exam' | 'break' | 'other';
  label: string;
}

// Utilitaires
export const SCHOOL_TYPE_OPTIONS: SchoolTypeOption[] = [
  { value: 'primary', label: 'Primaire' },
  { value: 'middle', label: 'Collège' },
  { value: 'high', label: 'Lycée' },
  { value: 'university', label: 'Université' },
];

export const DAY_OF_WEEK_OPTIONS: DayOfWeekOption[] = [
  { value: 'monday', label: 'Lundi' },
  { value: 'tuesday', label: 'Mardi' },
  { value: 'wednesday', label: 'Mercredi' },
  { value: 'thursday', label: 'Jeudi' },
  { value: 'friday', label: 'Vendredi' },
  { value: 'saturday', label: 'Samedi' },
  { value: 'sunday', label: 'Dimanche' },
];

export const SCHEDULE_TYPE_OPTIONS: ScheduleTypeOption[] = [
  { value: 'course', label: 'Cours' },
  { value: 'td', label: 'TD' },
  { value: 'tp', label: 'TP' },
  { value: 'exam', label: 'Examen' },
  { value: 'break', label: 'Pause' },
  { value: 'other', label: 'Autre' },
]; 