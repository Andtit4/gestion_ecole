export enum TenantStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended', 
  PENDING = 'pending',
  CANCELLED = 'cancelled',
}

export enum SubscriptionPlan {
  STARTER = 'starter',
  STANDARD = 'standard',
  ENTERPRISE = 'enterprise',
}

// Types pour la gestion des utilisateurs
export enum UserRole {
  ADMIN = 'admin',
  TEACHER = 'teacher',
  STUDENT = 'student',
  PARENT = 'parent'
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING = 'pending'
}

export enum Permission {
  // Gestion des élèves
  VIEW_STUDENTS = 'view_students',
  CREATE_STUDENTS = 'create_students',
  EDIT_STUDENTS = 'edit_students',
  DELETE_STUDENTS = 'delete_students',
  
  // Gestion des notes
  VIEW_GRADES = 'view_grades',
  CREATE_GRADES = 'create_grades',
  EDIT_GRADES = 'edit_grades',
  DELETE_GRADES = 'delete_grades',
  
  // Gestion des professeurs
  VIEW_TEACHERS = 'view_teachers',
  CREATE_TEACHERS = 'create_teachers',
  EDIT_TEACHERS = 'edit_teachers',
  DELETE_TEACHERS = 'delete_teachers',
  
  // Gestion des parents
  VIEW_PARENTS = 'view_parents',
  CREATE_PARENTS = 'create_parents',
  EDIT_PARENTS = 'edit_parents',
  DELETE_PARENTS = 'delete_parents',
  
  // Administration
  MANAGE_SETTINGS = 'manage_settings',
  MANAGE_USERS = 'manage_users',
  MANAGE_BILLING = 'manage_billing',
  VIEW_REPORTS = 'view_reports',
  
  // Communication
  SEND_MESSAGES = 'send_messages',
  VIEW_MESSAGES = 'view_messages',
  
  // Emploi du temps
  VIEW_SCHEDULE = 'view_schedule',
  MANAGE_SCHEDULE = 'manage_schedule'
}

export interface User {
  id: string;
  tenantId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  phone?: string;
  address?: Address;
  permissions: Permission[];
  
  // Champs spécifiques selon le rôle
  department?: string; // Pour les professeurs et admins
  subjects?: string[]; // Pour les professeurs
  class?: string; // Pour les élèves
  studentNumber?: string; // Pour les élèves
  parentIds?: string[]; // Pour les élèves
  childrenIds?: string[]; // Pour les parents
  
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface RolePermissions {
  role: UserRole;
  permissions: Permission[];
  description: string;
}

export interface UserActivity {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  resource: string;
  details?: string;
  timestamp: Date;
}

// Types pour la Structure Académique
export interface AcademicYear {
  id: string;
  tenantId: string;
  name: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  periods: EvaluationPeriod[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ClassLevel {
  id: string;
  tenantId: string;
  name: string;
  level: number; // 1 pour CP, 2 pour CE1, etc.
  capacity: number;
  schoolType: 'primary' | 'secondary' | 'university';
  subjects: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Subject {
  id: string;
  tenantId: string;
  name: string;
  code: string;
  description?: string;
  coefficient: number;
  color: string;
  isActive: boolean;
  classLevels: string[]; // IDs des niveaux
  createdAt: Date;
  updatedAt: Date;
}

export interface Schedule {
  id: string;
  tenantId: string;
  classId: string;
  subjectId: string;
  teacherId: string;
  dayOfWeek: number; // 1-7 (lundi-dimanche)
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  room?: string;
  academicYearId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface EvaluationPeriod {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
}

// Types pour la Gestion des Élèves
export enum StudentStatus {
  ENROLLED = 'enrolled',
  TRANSFERRED = 'transferred',
  GRADUATED = 'graduated',
  SUSPENDED = 'suspended',
  DROPPED_OUT = 'dropped_out'
}

export enum AbsenceType {
  JUSTIFIED = 'justified',
  UNJUSTIFIED = 'unjustified',
  LATE = 'late',
  SICK = 'sick',
  FAMILY = 'family'
}

export enum MedicalStatus {
  NORMAL = 'normal',
  ALLERGIES = 'allergies',
  CHRONIC = 'chronic',
  SPECIAL_NEEDS = 'special_needs'
}

export interface Student {
  id: string;
  tenantId: string;
  studentNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: 'male' | 'female';
  email?: string;
  phone?: string;
  address: Address;
  classId: string;
  academicYearId: string;
  status: StudentStatus;
  enrollmentDate: Date;
  parentIds: string[];
  
  // Dossier médical
  medicalInfo: MedicalInfo;
  
  // Historique académique
  academicHistory: AcademicRecord[];
  
  // Photos et documents
  photoUrl?: string;
  documents: StudentDocument[];
  
  createdAt: Date;
  updatedAt: Date;
}

export interface MedicalInfo {
  bloodType?: string;
  allergies: string[];
  medications: string[];
  medicalConditions: string[];
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  doctorName?: string;
  doctorPhone?: string;
  lastCheckupDate?: Date;
  vaccinations: Vaccination[];
  status: MedicalStatus;
}

export interface Vaccination {
  name: string;
  date: Date;
  nextDue?: Date;
  notes?: string;
}

export interface AcademicRecord {
  id: string;
  studentId: string;
  academicYearId: string;
  classId: string;
  finalGrade?: number;
  averageGrade?: number;
  rank?: number;
  totalStudents?: number;
  subjects: SubjectGrade[];
  behaviorNotes?: string;
  teacherComments?: string;
  status: 'passed' | 'failed' | 'repeated' | 'transferred';
}

export interface SubjectGrade {
  subjectId: string;
  subjectName: string;
  grades: Grade[];
  finalGrade?: number;
  coefficient: number;
}

export interface Grade {
  id: string;
  value: number;
  maxValue: number;
  date: Date;
  type: 'test' | 'exam' | 'homework' | 'project' | 'participation';
  description?: string;
  teacherId: string;
  periodId?: string;
}

export interface StudentDocument {
  id: string;
  name: string;
  type: 'birth_certificate' | 'photo' | 'medical' | 'transcript' | 'other';
  url: string;
  uploadedAt: Date;
  uploadedBy: string;
}

export interface Absence {
  id: string;
  studentId: string;
  date: Date;
  startTime?: string;
  endTime?: string;
  type: AbsenceType;
  reason?: string;
  justificationDocument?: string;
  isJustified: boolean;
  recordedBy: string;
  recordedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Types pour Évaluation & Notes
export enum EvaluationType {
  CONTROLE = 'controle',
  EXAMEN = 'examen',
  DEVOIR = 'devoir',
  ORAL = 'oral',
  PROJET = 'projet',
  TP = 'tp',
  PARTICIPATION = 'participation'
}

export enum GradeScale {
  TWENTY = 'twenty', // /20
  TEN = 'ten', // /10
  FIVE = 'five', // /5
  HUNDRED = 'hundred' // /100
}

export interface Evaluation {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  type: EvaluationType;
  subjectId: string;
  classId: string;
  teacherId: string;
  academicYearId: string;
  periodId?: string;
  date: Date;
  maxScore: number;
  coefficient: number;
  scale: GradeScale;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface StudentGrade {
  id: string;
  evaluationId: string;
  studentId: string;
  score: number;
  maxScore: number;
  comment?: string;
  isAbsent: boolean;
  gradedBy: string;
  gradedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface SubjectAverage {
  subjectId: string;
  subjectName: string;
  average: number;
  coefficient: number;
  grades: StudentGrade[];
  appreciation?: string;
}

export interface PeriodAverage {
  periodId: string;
  periodName: string;
  generalAverage: number;
  rank?: number;
  totalStudents?: number;
  subjects: SubjectAverage[];
  appreciation?: string;
  teacherComment?: string;
}

// Types pour Bulletins Scolaires
export enum BulletinStatus {
  DRAFT = 'draft',
  GENERATED = 'generated',
  SENT = 'sent',
  VIEWED = 'viewed'
}

export enum BulletinTemplate {
  STANDARD = 'standard',
  DETAILED = 'detailed',
  SIMPLIFIED = 'simplified',
  CUSTOM = 'custom'
}

export interface BulletinConfig {
  id: string;
  tenantId: string;
  name: string;
  template: BulletinTemplate;
  schoolInfo: {
    name: string;
    address: string;
    phone: string;
    email: string;
    logo?: string;
  };
  gradeScale: GradeScale;
  showRank: boolean;
  showAppreciations: boolean;
  showAbsences: boolean;
  customFields: BulletinCustomField[];
  createdAt: Date;
  updatedAt: Date;
}

export interface BulletinCustomField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'select' | 'textarea';
  options?: string[];
  required: boolean;
  position: number;
}

export interface Bulletin {
  id: string;
  tenantId: string;
  studentId: string;
  academicYearId: string;
  periodId: string;
  classId: string;
  configId: string;
  status: BulletinStatus;
  data: {
    student: {
      firstName: string;
      lastName: string;
      studentNumber: string;
      dateOfBirth: Date;
      photo?: string;
    };
    period: {
      name: string;
      startDate: Date;
      endDate: Date;
    };
    class: {
      name: string;
      level: number;
    };
    grades: PeriodAverage;
    absences: {
      total: number;
      justified: number;
      unjustified: number;
    };
    customData?: Record<string, any>;
  };
  pdfUrl?: string;
  sentAt?: Date;
  viewedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface BulletinSendLog {
  id: string;
  bulletinId: string;
  recipientType: 'parent' | 'student';
  recipientEmail: string;
  sentAt: Date;
  status: 'sent' | 'delivered' | 'failed';
  errorMessage?: string;
}

export interface Address {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface Theme {
  primaryColor?: string;
  secondaryColor?: string;
  logoUrl?: string;
}

export interface TenantSettings {
  schoolType: 'primary' | 'secondary' | 'university' | 'mixed';
  academicYearStart?: string;
  academicYearEnd?: string;
  gradeSystem: 'numeric' | 'letter' | 'points';
  maxGrade?: number;
  language?: string;
  timezone?: string;
  currency?: string;
  theme?: Theme;
}

// Nouvelle interface pour l'administrateur
export interface AdminUser {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  title?: string;
  username: string;
  isActive: boolean;
  lastLogin?: Date;
}

export interface Subscription {
  plan: SubscriptionPlan;
  startDate: string;
  endDate: string;
  maxStudents: number;
  maxTeachers: number;
  features: string[];
  pricePerMonth: number;
  isActive: boolean;
}

export interface Tenant {
  _id: string;
  name: string;
  domain: string;
  email: string;
  phone?: string;
  address?: Address;
  status: TenantStatus;
  settings: TenantSettings;
  subscription: Subscription;
  admin: AdminUser;
  createdAt: string;
  updatedAt: string;
}

// DTO pour l'administrateur
export interface CreateAdminDto {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  title?: string;
}

export interface CreateTenantDto {
  name: string;
  domain: string;
  email: string;
  phone?: string;
  address?: Address;
  settings: TenantSettings;
  subscription: Omit<Subscription, 'features' | 'isActive'>;
  admin: CreateAdminDto;
}

// Réponse de création avec les identifiants
export interface CreateTenantResponse {
  tenant: Tenant;
  adminCredentials: {
    username: string;
    password: string;
  };
}

// Interface pour l'authentification
export interface AdminLoginDto {
  domain: string;
  username: string;
  password: string;
}

export interface AdminLoginResponse {
  success: boolean;
  message?: string;
  tenant?: Tenant;
}

export interface PlanDetails {
  name: string;
  pricePerMonth: number;
  maxStudents: number;
  maxTeachers: number;
  features: string[];
  description: string;
}

export interface UsageStats {
  currentStudents: number;
  maxStudents: number;
  studentUsagePercent: number;
  currentTeachers: number;
  maxTeachers: number;
  teacherUsagePercent: number;
  subscription: Subscription;
  daysUntilExpiry: number;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

// Types pour Super Admin
export interface SuperAdmin {
  _id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'SUPER_ADMIN';
  isActive: boolean;
  isSuperAdmin: boolean;
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SuperAdminLoginResponse {
  success: boolean;
  message?: string;
  superAdmin?: SuperAdmin;
  token?: string;
} 