// Données mockées pour tester l'interface sans backend
import type { 
  Tenant, 
  SubscriptionPlan, 
  TenantStatus, 
  User, 
  RolePermissions, 
  UserActivity,
  AcademicYear,
  ClassLevel,
  Subject,
  Schedule,
  Student,
  MedicalInfo,
  AcademicRecord,
  Absence,
  Evaluation,
  StudentGrade,
  SubjectAverage,
  PeriodAverage,
  BulletinConfig,
  Bulletin,
  BulletinSendLog
} from '@/types/tenant'
import { 
  UserRole, 
  UserStatus, 
  Permission, 
  StudentStatus, 
  AbsenceType, 
  MedicalStatus,
  EvaluationType,
  GradeScale,
  BulletinStatus,
  BulletinTemplate
} from '@/types/tenant'

export const mockTenants: Tenant[] = [
  {
    id: '1',
    name: 'École Primaire Les Roses',
    domain: 'ecole-roses',
    email: 'admin@ecole-roses.fr',
    phone: '01 23 45 67 89',
    address: {
      street: '15 rue des Roses',
      city: 'Paris',
      postalCode: '75001',
      country: 'France'
    },
    status: 'ACTIVE' as TenantStatus,
    settings: {
      schoolType: 'primary',
      academicYearStart: '09-01',
      academicYearEnd: '06-30',
      gradeSystem: 'numeric',
      maxGrade: 20,
      language: 'fr',
      timezone: 'Europe/Paris',
      currency: 'EUR',
      logoUrl: '/images/schools/ecole-roses.png',
      theme: {
        primaryColor: '#3b82f6',
        secondaryColor: '#1e40af'
      }
    },
    subscription: {
      plan: 'STANDARD' as SubscriptionPlan,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      maxStudents: 500,
      maxTeachers: 50,
      features: ['gestion_eleves', 'gestion_notes', 'emploi_temps', 'communication_parents'],
      pricePerMonth: 59,
      isActive: true,
      paymentHistory: [
        {
          id: '1',
          date: new Date('2024-01-01'),
          description: 'Abonnement Standard - Janvier 2024',
          amount: 59,
          status: 'completed'
        }
      ]
    },
    currentStudents: 320,
    currentTeachers: 25,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    name: 'Collège Saint-Martin',
    domain: 'college-saint-martin',
    email: 'direction@college-saint-martin.fr',
    phone: '01 98 76 54 32',
    address: {
      street: '42 avenue Saint-Martin',
      city: 'Lyon',
      postalCode: '69000',
      country: 'France'
    },
    status: 'ACTIVE' as TenantStatus,
    settings: {
      schoolType: 'secondary',
      academicYearStart: '09-01',
      academicYearEnd: '06-30',
      gradeSystem: 'numeric',
      maxGrade: 20,
      language: 'fr',
      timezone: 'Europe/Paris',
      currency: 'EUR',
      theme: {
        primaryColor: '#059669',
        secondaryColor: '#047857'
      }
    },
    subscription: {
      plan: 'PREMIUM' as SubscriptionPlan,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      maxStudents: 1000,
      maxTeachers: 100,
      features: ['gestion_eleves', 'gestion_notes', 'emploi_temps', 'communication_parents', 'bulletins_avances', 'rapports_detailles', 'api_complete'],
      pricePerMonth: 99,
      isActive: true,
      paymentHistory: [
        {
          id: '2',
          date: new Date('2024-01-01'),
          description: 'Abonnement Premium - Janvier 2024',
          amount: 99,
          status: 'completed'
        }
      ]
    },
    currentStudents: 750,
    currentTeachers: 65,
    createdAt: new Date('2023-09-01'),
    updatedAt: new Date('2024-01-10')
  },
  {
    id: '3',
    name: 'Université Technologique',
    domain: 'univ-tech',
    email: 'admin@univ-tech.fr',
    phone: '01 11 22 33 44',
    address: {
      street: '123 boulevard de la Technologie',
      city: 'Toulouse',
      postalCode: '31000',
      country: 'France'
    },
    status: 'TRIAL' as TenantStatus,
    settings: {
      schoolType: 'university',
      academicYearStart: '09-01',
      academicYearEnd: '06-30',
      gradeSystem: 'numeric',
      maxGrade: 20,
      language: 'fr',
      timezone: 'Europe/Paris',
      currency: 'EUR',
      theme: {
        primaryColor: '#dc2626',
        secondaryColor: '#b91c1c'
      }
    },
    subscription: {
      plan: 'ENTERPRISE' as SubscriptionPlan,
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-02-14'),
      maxStudents: 999999,
      maxTeachers: 999999,
      features: ['toutes_fonctionnalites', 'multi_etablissements', 'integrations_personnalisees', 'formation_dediee', 'support_24_7'],
      pricePerMonth: 199,
      isActive: true,
      paymentHistory: []
    },
    currentStudents: 0,
    currentTeachers: 0,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  }
]

export const mockSubscriptionPlans = [
  {
    key: 'BASIC' as SubscriptionPlan,
    name: 'Basique',
    description: 'Parfait pour débuter',
    monthlyPrice: 29,
    features: ['100 élèves', '10 professeurs', 'Gestion notes', 'Support email'],
    popular: false
  },
  {
    key: 'STANDARD' as SubscriptionPlan,
    name: 'Standard',
    description: 'Le choix idéal',
    monthlyPrice: 59,
    features: ['500 élèves', '50 professeurs', 'Emplois du temps', 'Communication parents', 'Support prioritaire'],
    popular: true
  },
  {
    key: 'PREMIUM' as SubscriptionPlan,
    name: 'Premium',
    description: 'Pour les grands établissements',
    monthlyPrice: 99,
    features: ['1000 élèves', '100 professeurs', 'Rapports avancés', 'API complète', 'Support téléphonique'],
    popular: false
  },
  {
    key: 'ENTERPRISE' as SubscriptionPlan,
    name: 'Entreprise',
    description: 'Solutions sur mesure',
    monthlyPrice: 199,
    features: ['Utilisateurs illimités', 'Multi-établissements', 'Intégrations personnalisées', 'Support 24/7'],
    popular: false
  }
]

// Simuler les délais d'API
export const delay = (ms: number = 1000) => new Promise(resolve => setTimeout(resolve, ms))

// Mock des services API
export const mockTenantService = {
  async getAll(page = 1, limit = 10, filters: any = {}) {
    await delay(500)
    let filteredTenants = [...mockTenants]
    
    if (filters.status) {
      filteredTenants = filteredTenants.filter(t => t.status === filters.status)
    }
    if (filters.plan) {
      filteredTenants = filteredTenants.filter(t => t.subscription.plan === filters.plan)
    }
    
    const total = filteredTenants.length
    const start = (page - 1) * limit
    const tenants = filteredTenants.slice(start, start + limit)
    
    return {
      tenants,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page
    }
  },

  async getById(id: string) {
    await delay(300)
    const tenant = mockTenants.find(t => t.id === id)
    if (!tenant) {
      throw new Error('Tenant non trouvé')
    }
    return tenant
  },

  async create(data: any) {
    await delay(800)
    const newTenant: Tenant = {
      id: Date.now().toString(),
      ...data,
      status: 'PENDING' as TenantStatus,
      currentStudents: 0,
      currentTeachers: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    mockTenants.push(newTenant)
    return newTenant
  },

  async update(id: string, data: any) {
    await delay(500)
    const index = mockTenants.findIndex(t => t.id === id)
    if (index === -1) {
      throw new Error('Tenant non trouvé')
    }
    mockTenants[index] = { ...mockTenants[index], ...data, updatedAt: new Date() }
    return mockTenants[index]
  },

  async delete(id: string) {
    await delay(500)
    const index = mockTenants.findIndex(t => t.id === id)
    if (index === -1) {
      throw new Error('Tenant non trouvé')
    }
    mockTenants.splice(index, 1)
    return true
  }
}

export const mockSubscriptionService = {
  async getPlans() {
    await delay(300)
    return mockSubscriptionPlans
  },

  async upgrade(tenantId: string, newPlan: SubscriptionPlan) {
    await delay(800)
    const tenant = mockTenants.find(t => t.id === tenantId)
    if (tenant) {
      tenant.subscription.plan = newPlan
      tenant.updatedAt = new Date()
    }
    return tenant
  },

  async downgrade(tenantId: string, newPlan: SubscriptionPlan) {
    await delay(800)
    const tenant = mockTenants.find(t => t.id === tenantId)
    if (tenant) {
      tenant.subscription.plan = newPlan
      tenant.updatedAt = new Date()
    }
    return tenant
  },

  async renew(tenantId: string) {
    await delay(500)
    const tenant = mockTenants.find(t => t.id === tenantId)
    if (tenant) {
      const currentEnd = new Date(tenant.subscription.endDate)
      currentEnd.setFullYear(currentEnd.getFullYear() + 1)
      tenant.subscription.endDate = currentEnd
      tenant.updatedAt = new Date()
    }
    return tenant
  }
}

// Permissions par rôle
export const mockRolePermissions: RolePermissions[] = [
  {
    role: UserRole.ADMIN,
    description: 'Accès complet à toutes les fonctionnalités',
    permissions: [
      Permission.VIEW_STUDENTS, Permission.CREATE_STUDENTS, Permission.EDIT_STUDENTS, Permission.DELETE_STUDENTS,
      Permission.VIEW_GRADES, Permission.CREATE_GRADES, Permission.EDIT_GRADES, Permission.DELETE_GRADES,
      Permission.VIEW_TEACHERS, Permission.CREATE_TEACHERS, Permission.EDIT_TEACHERS, Permission.DELETE_TEACHERS,
      Permission.VIEW_PARENTS, Permission.CREATE_PARENTS, Permission.EDIT_PARENTS, Permission.DELETE_PARENTS,
      Permission.MANAGE_SETTINGS, Permission.MANAGE_USERS, Permission.MANAGE_BILLING, Permission.VIEW_REPORTS,
      Permission.SEND_MESSAGES, Permission.VIEW_MESSAGES,
      Permission.VIEW_SCHEDULE, Permission.MANAGE_SCHEDULE
    ]
  },
  {
    role: UserRole.TEACHER,
    description: 'Gestion des élèves et des notes de ses classes',
    permissions: [
      Permission.VIEW_STUDENTS, Permission.EDIT_STUDENTS,
      Permission.VIEW_GRADES, Permission.CREATE_GRADES, Permission.EDIT_GRADES,
      Permission.VIEW_PARENTS,
      Permission.SEND_MESSAGES, Permission.VIEW_MESSAGES,
      Permission.VIEW_SCHEDULE
    ]
  },
  {
    role: UserRole.STUDENT,
    description: 'Consultation de ses notes et emploi du temps',
    permissions: [
      Permission.VIEW_GRADES,
      Permission.VIEW_MESSAGES,
      Permission.VIEW_SCHEDULE
    ]
  },
  {
    role: UserRole.PARENT,
    description: 'Suivi de ses enfants',
    permissions: [
      Permission.VIEW_STUDENTS, // Uniquement ses enfants
      Permission.VIEW_GRADES, // Uniquement ses enfants
      Permission.SEND_MESSAGES, Permission.VIEW_MESSAGES,
      Permission.VIEW_SCHEDULE // Uniquement ses enfants
    ]
  }
]

// Utilisateurs mockés
export const mockUsers: User[] = [
  // Administrateurs
  {
    id: '1',
    tenantId: '1',
    email: 'admin@ecole-roses.fr',
    firstName: 'Marie',
    lastName: 'Dubois',
    role: UserRole.ADMIN,
    status: UserStatus.ACTIVE,
    phone: '01 23 45 67 89',
    department: 'Direction',
    permissions: mockRolePermissions.find(r => r.role === UserRole.ADMIN)?.permissions || [],
    lastLogin: new Date('2024-01-16T09:30:00'),
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-16')
  },
  {
    id: '11',
    tenantId: '2',
    email: 'direction@college-saint-martin.fr',
    firstName: 'Pierre',
    lastName: 'Martin',
    role: UserRole.ADMIN,
    status: UserStatus.ACTIVE,
    phone: '01 98 76 54 32',
    department: 'Direction',
    permissions: mockRolePermissions.find(r => r.role === UserRole.ADMIN)?.permissions || [],
    lastLogin: new Date('2024-01-16T08:15:00'),
    createdAt: new Date('2023-09-01'),
    updatedAt: new Date('2024-01-16')
  },

  // Professeurs
  {
    id: '2',
    tenantId: '1',
    email: 'sophie.martin@ecole-roses.fr',
    firstName: 'Sophie',
    lastName: 'Martin',
    role: UserRole.TEACHER,
    status: UserStatus.ACTIVE,
    phone: '01 23 45 67 90',
    department: 'Primaire',
    subjects: ['Mathématiques', 'Sciences'],
    permissions: mockRolePermissions.find(r => r.role === UserRole.TEACHER)?.permissions || [],
    lastLogin: new Date('2024-01-16T08:45:00'),
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-16')
  },
  {
    id: '3',
    tenantId: '1',
    email: 'jean.dupont@ecole-roses.fr',
    firstName: 'Jean',
    lastName: 'Dupont',
    role: UserRole.TEACHER,
    status: UserStatus.ACTIVE,
    phone: '01 23 45 67 91',
    department: 'Primaire',
    subjects: ['Français', 'Histoire'],
    permissions: mockRolePermissions.find(r => r.role === UserRole.TEACHER)?.permissions || [],
    lastLogin: new Date('2024-01-15T16:30:00'),
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '12',
    tenantId: '2',
    email: 'claire.bernard@college-saint-martin.fr',
    firstName: 'Claire',
    lastName: 'Bernard',
    role: UserRole.TEACHER,
    status: UserStatus.ACTIVE,
    phone: '01 98 76 54 33',
    department: 'Mathématiques',
    subjects: ['Mathématiques', 'Physique'],
    permissions: mockRolePermissions.find(r => r.role === UserRole.TEACHER)?.permissions || [],
    lastLogin: new Date('2024-01-16T09:00:00'),
    createdAt: new Date('2023-09-01'),
    updatedAt: new Date('2024-01-16')
  },
  {
    id: '13',
    tenantId: '2',
    email: 'michel.rousseau@college-saint-martin.fr',
    firstName: 'Michel',
    lastName: 'Rousseau',
    role: UserRole.TEACHER,
    status: UserStatus.INACTIVE,
    phone: '01 98 76 54 34',
    department: 'Français',
    subjects: ['Français', 'Latin'],
    permissions: mockRolePermissions.find(r => r.role === UserRole.TEACHER)?.permissions || [],
    lastLogin: new Date('2024-01-10T14:20:00'),
    createdAt: new Date('2023-09-01'),
    updatedAt: new Date('2024-01-10')
  },

  // Élèves
  {
    id: '4',
    tenantId: '1',
    email: 'lucas.petit@ecole-roses.fr',
    firstName: 'Lucas',
    lastName: 'Petit',
    role: UserRole.STUDENT,
    status: UserStatus.ACTIVE,
    class: 'CM2-A',
    studentNumber: 'ER2024001',
    parentIds: ['7', '8'],
    permissions: mockRolePermissions.find(r => r.role === UserRole.STUDENT)?.permissions || [],
    lastLogin: new Date('2024-01-15T17:00:00'),
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '5',
    tenantId: '1',
    email: 'emma.moreau@ecole-roses.fr',
    firstName: 'Emma',
    lastName: 'Moreau',
    role: UserRole.STUDENT,
    status: UserStatus.ACTIVE,
    class: 'CM1-B',
    studentNumber: 'ER2024002',
    parentIds: ['9', '10'],
    permissions: mockRolePermissions.find(r => r.role === UserRole.STUDENT)?.permissions || [],
    lastLogin: new Date('2024-01-16T16:45:00'),
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-16')
  },
  {
    id: '14',
    tenantId: '2',
    email: 'julien.garcia@college-saint-martin.fr',
    firstName: 'Julien',
    lastName: 'Garcia',
    role: UserRole.STUDENT,
    status: UserStatus.ACTIVE,
    class: '3ème-A',
    studentNumber: 'CSM2024001',
    parentIds: ['16', '17'],
    permissions: mockRolePermissions.find(r => r.role === UserRole.STUDENT)?.permissions || [],
    lastLogin: new Date('2024-01-16T18:30:00'),
    createdAt: new Date('2023-09-01'),
    updatedAt: new Date('2024-01-16')
  },
  {
    id: '15',
    tenantId: '2',
    email: 'lea.thomas@college-saint-martin.fr',
    firstName: 'Léa',
    lastName: 'Thomas',
    role: UserRole.STUDENT,
    status: UserStatus.SUSPENDED,
    class: '4ème-B',
    studentNumber: 'CSM2024002',
    parentIds: ['18'],
    permissions: mockRolePermissions.find(r => r.role === UserRole.STUDENT)?.permissions || [],
    lastLogin: new Date('2024-01-10T15:20:00'),
    createdAt: new Date('2023-09-01'),
    updatedAt: new Date('2024-01-10')
  },

  // Parents
  {
    id: '7',
    tenantId: '1',
    email: 'paul.petit@email.fr',
    firstName: 'Paul',
    lastName: 'Petit',
    role: UserRole.PARENT,
    status: UserStatus.ACTIVE,
    phone: '06 12 34 56 78',
    childrenIds: ['4'],
    permissions: mockRolePermissions.find(r => r.role === UserRole.PARENT)?.permissions || [],
    lastLogin: new Date('2024-01-16T19:00:00'),
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-16')
  },
  {
    id: '8',
    tenantId: '1',
    email: 'marie.petit@email.fr',
    firstName: 'Marie',
    lastName: 'Petit',
    role: UserRole.PARENT,
    status: UserStatus.ACTIVE,
    phone: '06 12 34 56 79',
    childrenIds: ['4'],
    permissions: mockRolePermissions.find(r => r.role === UserRole.PARENT)?.permissions || [],
    lastLogin: new Date('2024-01-15T20:30:00'),
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '9',
    tenantId: '1',
    email: 'david.moreau@email.fr',
    firstName: 'David',
    lastName: 'Moreau',
    role: UserRole.PARENT,
    status: UserStatus.ACTIVE,
    phone: '06 98 76 54 32',
    childrenIds: ['5'],
    permissions: mockRolePermissions.find(r => r.role === UserRole.PARENT)?.permissions || [],
    lastLogin: new Date('2024-01-16T18:15:00'),
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-16')
  },
  {
    id: '10',
    tenantId: '1',
    email: 'sarah.moreau@email.fr',
    firstName: 'Sarah',
    lastName: 'Moreau',
    role: UserRole.PARENT,
    status: UserStatus.PENDING,
    phone: '06 98 76 54 33',
    childrenIds: ['5'],
    permissions: mockRolePermissions.find(r => r.role === UserRole.PARENT)?.permissions || [],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '16',
    tenantId: '2',
    email: 'carlos.garcia@email.fr',
    firstName: 'Carlos',
    lastName: 'Garcia',
    role: UserRole.PARENT,
    status: UserStatus.ACTIVE,
    phone: '06 11 22 33 44',
    childrenIds: ['14'],
    permissions: mockRolePermissions.find(r => r.role === UserRole.PARENT)?.permissions || [],
    lastLogin: new Date('2024-01-16T19:45:00'),
    createdAt: new Date('2023-09-01'),
    updatedAt: new Date('2024-01-16')
  },
  {
    id: '17',
    tenantId: '2',
    email: 'isabelle.garcia@email.fr',
    firstName: 'Isabelle',
    lastName: 'Garcia',
    role: UserRole.PARENT,
    status: UserStatus.ACTIVE,
    phone: '06 11 22 33 45',
    childrenIds: ['14'],
    permissions: mockRolePermissions.find(r => r.role === UserRole.PARENT)?.permissions || [],
    lastLogin: new Date('2024-01-15T21:00:00'),
    createdAt: new Date('2023-09-01'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '18',
    tenantId: '2',
    email: 'christine.thomas@email.fr',
    firstName: 'Christine',
    lastName: 'Thomas',
    role: UserRole.PARENT,
    status: UserStatus.ACTIVE,
    phone: '06 55 66 77 88',
    childrenIds: ['15'],
    permissions: mockRolePermissions.find(r => r.role === UserRole.PARENT)?.permissions || [],
    lastLogin: new Date('2024-01-14T22:15:00'),
    createdAt: new Date('2023-09-01'),
    updatedAt: new Date('2024-01-14')
  }
]

// Activité récente des utilisateurs
export const mockUserActivity: UserActivity[] = [
  {
    id: '1',
    userId: '2',
    userName: 'Sophie Martin',
    userRole: UserRole.TEACHER,
    action: 'Création de note',
    resource: 'Note de Lucas Petit en Mathématiques',
    details: 'Note: 15/20',
    timestamp: new Date('2024-01-16T10:30:00')
  },
  {
    id: '2',
    userId: '1',
    userName: 'Marie Dubois',
    userRole: UserRole.ADMIN,
    action: 'Création d\'utilisateur',
    resource: 'Nouveau professeur ajouté',
    details: 'Jean Dupont - Français',
    timestamp: new Date('2024-01-16T09:15:00')
  },
  {
    id: '3',
    userId: '7',
    userName: 'Paul Petit',
    userRole: UserRole.PARENT,
    action: 'Consultation de notes',
    resource: 'Notes de Lucas Petit',
    timestamp: new Date('2024-01-16T19:00:00')
  },
  {
    id: '4',
    userId: '12',
    userName: 'Claire Bernard',
    userRole: UserRole.TEACHER,
    action: 'Modification d\'emploi du temps',
    resource: 'Cours de Mathématiques 3ème-A',
    details: 'Déplacé de 14h à 15h',
    timestamp: new Date('2024-01-16T08:45:00')
  },
  {
    id: '5',
    userId: '11',
    userName: 'Pierre Martin',
    userRole: UserRole.ADMIN,
    action: 'Suspension d\'utilisateur',
    resource: 'Léa Thomas',
    details: 'Suspension temporaire - 3 jours',
    timestamp: new Date('2024-01-15T14:20:00')
  },
  {
    id: '6',
    userId: '14',
    userName: 'Julien Garcia',
    userRole: UserRole.STUDENT,
    action: 'Connexion',
    resource: 'Plateforme élève',
    timestamp: new Date('2024-01-16T18:30:00')
  }
]

// Service mock pour les utilisateurs
export const mockUserService = {
  async getAll(tenantId: string, page = 1, limit = 10, filters: any = {}) {
    await delay(500)
    let filteredUsers = mockUsers.filter(u => u.tenantId === tenantId)
    
    if (filters.role) {
      filteredUsers = filteredUsers.filter(u => u.role === filters.role)
    }
    if (filters.status) {
      filteredUsers = filteredUsers.filter(u => u.status === filters.status)
    }
    if (filters.search) {
      const search = filters.search.toLowerCase()
      filteredUsers = filteredUsers.filter(u => 
        u.firstName.toLowerCase().includes(search) ||
        u.lastName.toLowerCase().includes(search) ||
        u.email.toLowerCase().includes(search)
      )
    }
    
    const total = filteredUsers.length
    const start = (page - 1) * limit
    const users = filteredUsers.slice(start, start + limit)
    
    return {
      users,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page
    }
  },

  async getById(id: string) {
    await delay(300)
    const user = mockUsers.find(u => u.id === id)
    if (!user) {
      throw new Error('Utilisateur non trouvé')
    }
    return user
  },

  async create(data: any) {
    await delay(800)
    const newUser: User = {
      id: Date.now().toString(),
      ...data,
      permissions: mockRolePermissions.find(r => r.role === data.role)?.permissions || [],
      createdAt: new Date(),
      updatedAt: new Date()
    }
    mockUsers.push(newUser)
    return newUser
  },

  async update(id: string, data: any) {
    await delay(500)
    const index = mockUsers.findIndex(u => u.id === id)
    if (index === -1) {
      throw new Error('Utilisateur non trouvé')
    }
    mockUsers[index] = { ...mockUsers[index], ...data, updatedAt: new Date() }
    return mockUsers[index]
  },

  async delete(id: string) {
    await delay(500)
    const index = mockUsers.findIndex(u => u.id === id)
    if (index === -1) {
      throw new Error('Utilisateur non trouvé')
    }
    mockUsers.splice(index, 1)
    return true
  },

  async getActivity(tenantId: string, page = 1, limit = 10) {
    await delay(300)
    const tenantUsers = mockUsers.filter(u => u.tenantId === tenantId)
    const tenantUserIds = tenantUsers.map(u => u.id)
    const filteredActivity = mockUserActivity.filter(a => tenantUserIds.includes(a.userId))
    
    const total = filteredActivity.length
    const start = (page - 1) * limit
    const activity = filteredActivity
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(start, start + limit)
    
    return {
      activity,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page
    }
  },

  async getRoles() {
    await delay(200)
    return mockRolePermissions
  }
}

// === STRUCTURE ACADÉMIQUE ===

// Années scolaires mockées
export const mockAcademicYears: AcademicYear[] = [
  {
    id: '1',
    tenantId: '1',
    name: '2023-2024',
    startDate: new Date('2023-09-01'),
    endDate: new Date('2024-06-30'),
    isActive: true,
    periods: [
      {
        id: '1',
        name: 'Trimestre 1',
        startDate: new Date('2023-09-01'),
        endDate: new Date('2023-12-22'),
        isActive: false
      },
      {
        id: '2',
        name: 'Trimestre 2',
        startDate: new Date('2024-01-08'),
        endDate: new Date('2024-04-05'),
        isActive: true
      },
      {
        id: '3',
        name: 'Trimestre 3',
        startDate: new Date('2024-04-22'),
        endDate: new Date('2024-06-30'),
        isActive: false
      }
    ],
    createdAt: new Date('2023-06-01'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    tenantId: '2',
    name: '2023-2024',
    startDate: new Date('2023-09-04'),
    endDate: new Date('2024-07-05'),
    isActive: true,
    periods: [
      {
        id: '4',
        name: 'Semestre 1',
        startDate: new Date('2023-09-04'),
        endDate: new Date('2024-02-02'),
        isActive: false
      },
      {
        id: '5',
        name: 'Semestre 2',
        startDate: new Date('2024-02-19'),
        endDate: new Date('2024-07-05'),
        isActive: true
      }
    ],
    createdAt: new Date('2023-06-15'),
    updatedAt: new Date('2024-01-20')
  }
]

// Classes/Niveaux mockés
export const mockClassLevels: ClassLevel[] = [
  {
    id: '1',
    tenantId: '1',
    name: 'CM2-A',
    level: 5,
    capacity: 25,
    schoolType: 'primary',
    subjects: ['1', '2', '3', '4', '5'],
    createdAt: new Date('2023-06-01'),
    updatedAt: new Date('2023-09-01')
  },
  {
    id: '2',
    tenantId: '1',
    name: 'CM1-B',
    level: 4,
    capacity: 22,
    schoolType: 'primary',
    subjects: ['1', '2', '3', '4', '5'],
    createdAt: new Date('2023-06-01'),
    updatedAt: new Date('2023-09-01')
  },
  {
    id: '3',
    tenantId: '2',
    name: '3ème-A',
    level: 9,
    capacity: 30,
    schoolType: 'secondary',
    subjects: ['6', '7', '8', '9', '10', '11'],
    createdAt: new Date('2023-06-15'),
    updatedAt: new Date('2023-09-04')
  },
  {
    id: '4',
    tenantId: '2',
    name: '4ème-B',
    level: 8,
    capacity: 28,
    schoolType: 'secondary',
    subjects: ['6', '7', '8', '9', '10', '11'],
    createdAt: new Date('2023-06-15'),
    updatedAt: new Date('2023-09-04')
  }
]

// Matières/Disciplines mockées
export const mockSubjects: Subject[] = [
  // Matières primaire
  {
    id: '1',
    tenantId: '1',
    name: 'Mathématiques',
    code: 'MATH',
    description: 'Mathématiques élémentaires',
    coefficient: 3,
    color: '#3b82f6',
    isActive: true,
    classLevels: ['1', '2'],
    createdAt: new Date('2023-06-01'),
    updatedAt: new Date('2023-09-01')
  },
  {
    id: '2',
    tenantId: '1',
    name: 'Français',
    code: 'FR',
    description: 'Langue française et littérature',
    coefficient: 3,
    color: '#ef4444',
    isActive: true,
    classLevels: ['1', '2'],
    createdAt: new Date('2023-06-01'),
    updatedAt: new Date('2023-09-01')
  },
  {
    id: '3',
    tenantId: '1',
    name: 'Sciences',
    code: 'SCI',
    description: 'Sciences et découverte du monde',
    coefficient: 2,
    color: '#10b981',
    isActive: true,
    classLevels: ['1', '2'],
    createdAt: new Date('2023-06-01'),
    updatedAt: new Date('2023-09-01')
  },
  {
    id: '4',
    tenantId: '1',
    name: 'Histoire-Géographie',
    code: 'HG',
    description: 'Histoire et géographie',
    coefficient: 2,
    color: '#f59e0b',
    isActive: true,
    classLevels: ['1', '2'],
    createdAt: new Date('2023-06-01'),
    updatedAt: new Date('2023-09-01')
  },
  {
    id: '5',
    tenantId: '1',
    name: 'Éducation Physique',
    code: 'EPS',
    description: 'Éducation physique et sportive',
    coefficient: 1,
    color: '#8b5cf6',
    isActive: true,
    classLevels: ['1', '2'],
    createdAt: new Date('2023-06-01'),
    updatedAt: new Date('2023-09-01')
  },
  
  // Matières collège
  {
    id: '6',
    tenantId: '2',
    name: 'Mathématiques',
    code: 'MATH',
    description: 'Mathématiques niveau collège',
    coefficient: 4,
    color: '#3b82f6',
    isActive: true,
    classLevels: ['3', '4'],
    createdAt: new Date('2023-06-15'),
    updatedAt: new Date('2023-09-04')
  },
  {
    id: '7',
    tenantId: '2',
    name: 'Français',
    code: 'FR',
    description: 'Français niveau collège',
    coefficient: 4,
    color: '#ef4444',
    isActive: true,
    classLevels: ['3', '4'],
    createdAt: new Date('2023-06-15'),
    updatedAt: new Date('2023-09-04')
  },
  {
    id: '8',
    tenantId: '2',
    name: 'Physique-Chimie',
    code: 'PC',
    description: 'Physique et chimie',
    coefficient: 3,
    color: '#10b981',
    isActive: true,
    classLevels: ['3', '4'],
    createdAt: new Date('2023-06-15'),
    updatedAt: new Date('2023-09-04')
  },
  {
    id: '9',
    tenantId: '2',
    name: 'Histoire-Géographie',
    code: 'HG',
    description: 'Histoire et géographie niveau collège',
    coefficient: 3,
    color: '#f59e0b',
    isActive: true,
    classLevels: ['3', '4'],
    createdAt: new Date('2023-06-15'),
    updatedAt: new Date('2023-09-04')
  },
  {
    id: '10',
    tenantId: '2',
    name: 'Anglais',
    code: 'ANG',
    description: 'Langue anglaise',
    coefficient: 3,
    color: '#6366f1',
    isActive: true,
    classLevels: ['3', '4'],
    createdAt: new Date('2023-06-15'),
    updatedAt: new Date('2023-09-04')
  },
  {
    id: '11',
    tenantId: '2',
    name: 'Éducation Physique',
    code: 'EPS',
    description: 'Éducation physique et sportive',
    coefficient: 2,
    color: '#8b5cf6',
    isActive: true,
    classLevels: ['3', '4'],
    createdAt: new Date('2023-06-15'),
    updatedAt: new Date('2023-09-04')
  }
]

// Emplois du temps mockés
export const mockSchedules: Schedule[] = [
  // Emploi du temps CM2-A
  {
    id: '1',
    tenantId: '1',
    classId: '1',
    subjectId: '1',
    teacherId: '2',
    dayOfWeek: 1, // Lundi
    startTime: '08:30',
    endTime: '09:30',
    room: 'Salle 101',
    academicYearId: '1',
    isActive: true,
    createdAt: new Date('2023-09-01'),
    updatedAt: new Date('2023-09-01')
  },
  {
    id: '2',
    tenantId: '1',
    classId: '1',
    subjectId: '2',
    teacherId: '3',
    dayOfWeek: 1,
    startTime: '09:45',
    endTime: '10:45',
    room: 'Salle 101',
    academicYearId: '1',
    isActive: true,
    createdAt: new Date('2023-09-01'),
    updatedAt: new Date('2023-09-01')
  },
  {
    id: '3',
    tenantId: '1',
    classId: '1',
    subjectId: '3',
    teacherId: '2',
    dayOfWeek: 2, // Mardi
    startTime: '08:30',
    endTime: '09:30',
    room: 'Salle 101',
    academicYearId: '1',
    isActive: true,
    createdAt: new Date('2023-09-01'),
    updatedAt: new Date('2023-09-01')
  },
  
  // Emploi du temps 3ème-A
  {
    id: '4',
    tenantId: '2',
    classId: '3',
    subjectId: '6',
    teacherId: '12',
    dayOfWeek: 1,
    startTime: '08:00',
    endTime: '09:00',
    room: 'Salle Math 1',
    academicYearId: '2',
    isActive: true,
    createdAt: new Date('2023-09-04'),
    updatedAt: new Date('2023-09-04')
  },
  {
    id: '5',
    tenantId: '2',
    classId: '3',
    subjectId: '8',
    teacherId: '12',
    dayOfWeek: 1,
    startTime: '09:15',
    endTime: '10:15',
    room: 'Labo Physique',
    academicYearId: '2',
    isActive: true,
    createdAt: new Date('2023-09-04'),
    updatedAt: new Date('2023-09-04')
  }
]

// === GESTION DES ÉLÈVES ===

// Étudiants mockés
export const mockStudents: Student[] = [
  {
    id: '1',
    tenantId: '1',
    studentNumber: 'ER2024001',
    firstName: 'Lucas',
    lastName: 'Petit',
    dateOfBirth: new Date('2012-03-15'),
    gender: 'male',
    email: 'lucas.petit@ecole-roses.fr',
    address: {
      street: '12 rue des Fleurs',
      city: 'Paris',
      postalCode: '75001',
      country: 'France'
    },
    classId: '1',
    academicYearId: '1',
    status: StudentStatus.ENROLLED,
    enrollmentDate: new Date('2023-09-01'),
    parentIds: ['7', '8'],
    medicalInfo: {
      bloodType: 'A+',
      allergies: ['Arachides'],
      medications: [],
      medicalConditions: [],
      emergencyContact: {
        name: 'Paul Petit',
        relationship: 'Père',
        phone: '06 12 34 56 78'
      },
      doctorName: 'Dr. Martin',
      doctorPhone: '01 23 45 67 89',
      lastCheckupDate: new Date('2024-01-10'),
      vaccinations: [
        {
          name: 'DTP',
          date: new Date('2023-09-01'),
          nextDue: new Date('2024-09-01')
        }
      ],
      status: MedicalStatus.ALLERGIES
    },
    academicHistory: [
      {
        id: '1',
        studentId: '1',
        academicYearId: '1',
        classId: '1',
        averageGrade: 15.2,
        rank: 3,
        totalStudents: 24,
        subjects: [
          {
            subjectId: '1',
            subjectName: 'Mathématiques',
            grades: [
              {
                id: '1',
                value: 15,
                maxValue: 20,
                date: new Date('2024-01-15'),
                type: 'test',
                description: 'Test multiplication',
                teacherId: '2'
              }
            ],
            finalGrade: 15,
            coefficient: 3
          }
        ],
        teacherComments: 'Élève sérieux et appliqué',
        status: 'passed'
      }
    ],
    photoUrl: '/images/students/lucas-petit.jpg',
    documents: [
      {
        id: '1',
        name: 'Acte de naissance',
        type: 'birth_certificate',
        url: '/documents/lucas-birth.pdf',
        uploadedAt: new Date('2023-08-15'),
        uploadedBy: '1'
      }
    ],
    createdAt: new Date('2023-08-15'),
    updatedAt: new Date('2024-01-16')
  },
  {
    id: '2',
    tenantId: '1',
    studentNumber: 'ER2024002',
    firstName: 'Emma',
    lastName: 'Moreau',
    dateOfBirth: new Date('2013-07-22'),
    gender: 'female',
    email: 'emma.moreau@ecole-roses.fr',
    address: {
      street: '8 avenue de la Paix',
      city: 'Paris',
      postalCode: '75002',
      country: 'France'
    },
    classId: '2',
    academicYearId: '1',
    status: StudentStatus.ENROLLED,
    enrollmentDate: new Date('2023-09-01'),
    parentIds: ['9', '10'],
    medicalInfo: {
      bloodType: 'O-',
      allergies: [],
      medications: ['Ventoline'],
      medicalConditions: ['Asthme léger'],
      emergencyContact: {
        name: 'David Moreau',
        relationship: 'Père',
        phone: '06 98 76 54 32'
      },
      doctorName: 'Dr. Durand',
      doctorPhone: '01 98 76 54 32',
      lastCheckupDate: new Date('2023-12-05'),
      vaccinations: [
        {
          name: 'DTP',
          date: new Date('2023-09-01'),
          nextDue: new Date('2024-09-01')
        },
        {
          name: 'ROR',
          date: new Date('2023-09-01')
        }
      ],
      status: MedicalStatus.CHRONIC
    },
    academicHistory: [],
    photoUrl: '/images/students/emma-moreau.jpg',
    documents: [],
    createdAt: new Date('2023-08-20'),
    updatedAt: new Date('2024-01-12')
  },
  {
    id: '3',
    tenantId: '2',
    studentNumber: 'CSM2024001',
    firstName: 'Julien',
    lastName: 'Garcia',
    dateOfBirth: new Date('2009-11-08'),
    gender: 'male',
    email: 'julien.garcia@college-saint-martin.fr',
    address: {
      street: '25 rue de Lyon',
      city: 'Lyon',
      postalCode: '69002',
      country: 'France'
    },
    classId: '3',
    academicYearId: '2',
    status: StudentStatus.ENROLLED,
    enrollmentDate: new Date('2023-09-04'),
    parentIds: ['16', '17'],
    medicalInfo: {
      bloodType: 'B+',
      allergies: [],
      medications: [],
      medicalConditions: [],
      emergencyContact: {
        name: 'Carlos Garcia',
        relationship: 'Père',
        phone: '06 11 22 33 44'
      },
      vaccinations: [],
      status: MedicalStatus.NORMAL
    },
    academicHistory: [],
    documents: [],
    createdAt: new Date('2023-08-25'),
    updatedAt: new Date('2024-01-16')
  }
]

// Absences mockées
export const mockAbsences: Absence[] = [
  {
    id: '1',
    studentId: '1',
    date: new Date('2024-01-15'),
    startTime: '08:30',
    endTime: '12:00',
    type: AbsenceType.SICK,
    reason: 'Fièvre',
    justificationDocument: '/documents/justif-lucas-15-01.pdf',
    isJustified: true,
    recordedBy: '2',
    recordedAt: new Date('2024-01-15T09:00:00'),
    createdAt: new Date('2024-01-15T09:00:00'),
    updatedAt: new Date('2024-01-15T09:00:00')
  },
  {
    id: '2',
    studentId: '2',
    date: new Date('2024-01-10'),
    type: AbsenceType.LATE,
    reason: 'Retard transport',
    isJustified: true,
    recordedBy: '3',
    recordedAt: new Date('2024-01-10T08:45:00'),
    createdAt: new Date('2024-01-10T08:45:00'),
    updatedAt: new Date('2024-01-10T08:45:00')
  },
  {
    id: '3',
    studentId: '3',
    date: new Date('2024-01-12'),
    type: AbsenceType.UNJUSTIFIED,
    reason: '',
    isJustified: false,
    recordedBy: '12',
    recordedAt: new Date('2024-01-12T08:00:00'),
    createdAt: new Date('2024-01-12T08:00:00'),
    updatedAt: new Date('2024-01-12T08:00:00')
  }
]

// Services mockés pour Structure Académique
export const mockAcademicService = {
  async getAcademicYears(tenantId: string) {
    await delay(300)
    return mockAcademicYears.filter(y => y.tenantId === tenantId)
  },

  async getClassLevels(tenantId: string) {
    await delay(300)
    return mockClassLevels.filter(c => c.tenantId === tenantId)
  },

  async getSubjects(tenantId: string) {
    await delay(300)
    return mockSubjects.filter(s => s.tenantId === tenantId)
  },

  async getSchedules(tenantId: string, classId?: string) {
    await delay(300)
    let schedules = mockSchedules.filter(s => s.tenantId === tenantId)
    if (classId) {
      schedules = schedules.filter(s => s.classId === classId)
    }
    return schedules
  },

  async createSchedule(data: any) {
    await delay(500)
    const newSchedule: Schedule = {
      id: Date.now().toString(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    mockSchedules.push(newSchedule)
    return newSchedule
  }
}

// Services mockés pour Gestion des Élèves
export const mockStudentService = {
  async getStudents(tenantId: string, page = 1, limit = 10, filters: any = {}) {
    await delay(500)
    let filteredStudents = mockStudents.filter(s => s.tenantId === tenantId)
    
    if (filters.classId) {
      filteredStudents = filteredStudents.filter(s => s.classId === filters.classId)
    }
    if (filters.status) {
      filteredStudents = filteredStudents.filter(s => s.status === filters.status)
    }
    if (filters.search) {
      const search = filters.search.toLowerCase()
      filteredStudents = filteredStudents.filter(s =>
        s.firstName.toLowerCase().includes(search) ||
        s.lastName.toLowerCase().includes(search) ||
        s.studentNumber.toLowerCase().includes(search)
      )
    }
    
    const total = filteredStudents.length
    const start = (page - 1) * limit
    const students = filteredStudents.slice(start, start + limit)
    
    return {
      students,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page
    }
  },

  async getStudentById(id: string) {
    await delay(300)
    const student = mockStudents.find(s => s.id === id)
    if (!student) {
      throw new Error('Élève non trouvé')
    }
    return student
  },

  async getAbsences(studentId: string) {
    await delay(300)
    return mockAbsences.filter(a => a.studentId === studentId)
  },

  async createAbsence(data: any) {
    await delay(500)
    const newAbsence: Absence = {
      id: Date.now().toString(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    mockAbsences.push(newAbsence)
    return newAbsence
  },

  async updateStudent(id: string, data: any) {
    await delay(500)
    const index = mockStudents.findIndex(s => s.id === id)
    if (index === -1) {
      throw new Error('Élève non trouvé')
    }
    mockStudents[index] = { ...mockStudents[index], ...data, updatedAt: new Date() }
    return mockStudents[index]
  }
}

// === ÉVALUATION & NOTES ===

// Évaluations mockées
export const mockEvaluations: Evaluation[] = [
  {
    id: '1',
    tenantId: '1',
    name: 'Contrôle Tables de Multiplication',
    description: 'Évaluation des tables de multiplication 1 à 10',
    type: EvaluationType.CONTROLE,
    subjectId: '1', // Mathématiques
    classId: '1', // CM2-A
    teacherId: '2', // Sophie Martin
    academicYearId: '1',
    periodId: '2', // Trimestre 2
    date: new Date('2024-01-20'),
    maxScore: 20,
    coefficient: 2,
    scale: GradeScale.TWENTY,
    isPublished: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-22')
  },
  {
    id: '2',
    tenantId: '1',
    name: 'Dictée Préparée',
    description: 'Dictée sur les mots invariables',
    type: EvaluationType.CONTROLE,
    subjectId: '2', // Français
    classId: '1', // CM2-A
    teacherId: '3', // Jean Dupont
    academicYearId: '1',
    periodId: '2',
    date: new Date('2024-01-18'),
    maxScore: 20,
    coefficient: 1.5,
    scale: GradeScale.TWENTY,
    isPublished: true,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: '3',
    tenantId: '2',
    name: 'Examen Mathématiques',
    description: 'Examen sur les fonctions linéaires',
    type: EvaluationType.EXAMEN,
    subjectId: '6', // Mathématiques collège
    classId: '3', // 3ème-A
    teacherId: '12', // Claire Bernard
    academicYearId: '2',
    periodId: '5', // Semestre 2
    date: new Date('2024-01-25'),
    maxScore: 20,
    coefficient: 3,
    scale: GradeScale.TWENTY,
    isPublished: true,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-27')
  },
  {
    id: '4',
    tenantId: '2',
    name: 'Devoir Physique-Chimie',
    description: 'Expérience sur les réactions chimiques',
    type: EvaluationType.DEVOIR,
    subjectId: '8', // Physique-Chimie
    classId: '3', // 3ème-A
    teacherId: '12', // Claire Bernard
    academicYearId: '2',
    periodId: '5',
    date: new Date('2024-01-15'),
    maxScore: 20,
    coefficient: 2,
    scale: GradeScale.TWENTY,
    isPublished: true,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-17')
  }
]

// Notes des élèves mockées
export const mockStudentGrades: StudentGrade[] = [
  // Notes pour Lucas Petit (CM2-A)
  {
    id: '1',
    evaluationId: '1', // Contrôle Maths
    studentId: '1', // Lucas
    score: 16,
    maxScore: 20,
    comment: 'Très bon travail, quelques erreurs de calcul',
    isAbsent: false,
    gradedBy: '2',
    gradedAt: new Date('2024-01-22'),
    createdAt: new Date('2024-01-22'),
    updatedAt: new Date('2024-01-22')
  },
  {
    id: '2',
    evaluationId: '2', // Dictée
    studentId: '1', // Lucas
    score: 14,
    maxScore: 20,
    comment: 'Attention aux accords',
    isAbsent: false,
    gradedBy: '3',
    gradedAt: new Date('2024-01-20'),
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20')
  },
  
  // Notes pour Emma Moreau (CM1-B)
  {
    id: '3',
    evaluationId: '1',
    studentId: '2', // Emma
    score: 18,
    maxScore: 20,
    comment: 'Excellent travail !',
    isAbsent: false,
    gradedBy: '2',
    gradedAt: new Date('2024-01-22'),
    createdAt: new Date('2024-01-22'),
    updatedAt: new Date('2024-01-22')
  },
  
  // Notes pour Julien Garcia (3ème-A)
  {
    id: '4',
    evaluationId: '3', // Examen Maths
    studentId: '3', // Julien
    score: 15,
    maxScore: 20,
    comment: 'Bon niveau, continue tes efforts',
    isAbsent: false,
    gradedBy: '12',
    gradedAt: new Date('2024-01-27'),
    createdAt: new Date('2024-01-27'),
    updatedAt: new Date('2024-01-27')
  },
  {
    id: '5',
    evaluationId: '4', // Devoir Physique
    studentId: '3', // Julien
    score: 12,
    maxScore: 20,
    comment: 'Travail correct, revoir les équations',
    isAbsent: false,
    gradedBy: '12',
    gradedAt: new Date('2024-01-17'),
    createdAt: new Date('2024-01-17'),
    updatedAt: new Date('2024-01-17')
  }
]

// Moyennes par matière mockées
export const mockSubjectAverages: SubjectAverage[] = [
  {
    subjectId: '1',
    subjectName: 'Mathématiques',
    average: 16.0,
    coefficient: 3,
    grades: mockStudentGrades.filter(g => ['1'].includes(g.evaluationId)),
    appreciation: 'Très bons résultats, continue ainsi'
  },
  {
    subjectId: '2',
    subjectName: 'Français',
    average: 14.0,
    coefficient: 3,
    grades: mockStudentGrades.filter(g => ['2'].includes(g.evaluationId)),
    appreciation: 'Bon niveau, attention à l\'orthographe'
  }
]

// Moyennes par période mockées
export const mockPeriodAverages: PeriodAverage[] = [
  {
    periodId: '2',
    periodName: 'Trimestre 2',
    generalAverage: 15.2,
    rank: 3,
    totalStudents: 24,
    subjects: mockSubjectAverages,
    appreciation: 'Trimestre satisfaisant',
    teacherComment: 'Lucas fait des efforts constants et progresse bien. Continue sur cette voie.'
  }
]

// === BULLETINS SCOLAIRES ===

// Configurations de bulletins mockées
export const mockBulletinConfigs: BulletinConfig[] = [
  {
    id: '1',
    tenantId: '1',
    name: 'Bulletin Standard Primaire',
    template: BulletinTemplate.STANDARD,
    schoolInfo: {
      name: 'École Primaire Les Roses',
      address: '123 rue de la Paix, 75001 Paris',
      phone: '01 23 45 67 89',
      email: 'contact@ecole-roses.fr',
      logo: '/images/logo-roses.png'
    },
    gradeScale: GradeScale.TWENTY,
    showRank: true,
    showAppreciations: true,
    showAbsences: true,
    customFields: [
      {
        id: '1',
        name: 'Comportement',
        type: 'select',
        options: ['Excellent', 'Bien', 'Satisfaisant', 'À améliorer'],
        required: true,
        position: 1
      },
      {
        id: '2',
        name: 'Remarques générales',
        type: 'textarea',
        required: false,
        position: 2
      }
    ],
    createdAt: new Date('2023-09-01'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    tenantId: '2',
    name: 'Bulletin Détaillé Collège',
    template: BulletinTemplate.DETAILED,
    schoolInfo: {
      name: 'Collège Saint-Martin',
      address: '456 avenue des Écoles, 69002 Lyon',
      phone: '04 78 12 34 56',
      email: 'secretariat@college-saint-martin.fr',
      logo: '/images/logo-saint-martin.png'
    },
    gradeScale: GradeScale.TWENTY,
    showRank: true,
    showAppreciations: true,
    showAbsences: true,
    customFields: [
      {
        id: '3',
        name: 'Mention',
        type: 'select',
        options: ['Très bien', 'Bien', 'Assez bien', 'Passable', 'Insuffisant'],
        required: true,
        position: 1
      }
    ],
    createdAt: new Date('2023-09-01'),
    updatedAt: new Date('2024-01-20')
  }
]

// Bulletins mockés
export const mockBulletins: Bulletin[] = [
  {
    id: '1',
    tenantId: '1',
    studentId: '1', // Lucas Petit
    academicYearId: '1',
    periodId: '2', // Trimestre 2
    classId: '1', // CM2-A
    configId: '1',
    status: BulletinStatus.SENT,
    data: {
      student: {
        firstName: 'Lucas',
        lastName: 'Petit',
        studentNumber: 'ER2024001',
        dateOfBirth: new Date('2012-03-15'),
        photo: '/images/students/lucas-petit.jpg'
      },
      period: {
        name: 'Trimestre 2',
        startDate: new Date('2024-01-08'),
        endDate: new Date('2024-04-05')
      },
      class: {
        name: 'CM2-A',
        level: 5
      },
      grades: mockPeriodAverages[0],
      absences: {
        total: 1,
        justified: 1,
        unjustified: 0
      },
      customData: {
        comportement: 'Bien',
        remarquesGenerales: 'Élève sérieux et appliqué'
      }
    },
    pdfUrl: '/bulletins/lucas-petit-t2-2024.pdf',
    sentAt: new Date('2024-01-30'),
    viewedAt: new Date('2024-02-01'),
    createdAt: new Date('2024-01-28'),
    updatedAt: new Date('2024-02-01')
  },
  {
    id: '2',
    tenantId: '2',
    studentId: '3', // Julien Garcia
    academicYearId: '2',
    periodId: '5', // Semestre 2
    classId: '3', // 3ème-A
    configId: '2',
    status: BulletinStatus.GENERATED,
    data: {
      student: {
        firstName: 'Julien',
        lastName: 'Garcia',
        studentNumber: 'CSM2024001',
        dateOfBirth: new Date('2009-11-08')
      },
      period: {
        name: 'Semestre 2',
        startDate: new Date('2024-02-19'),
        endDate: new Date('2024-07-05')
      },
      class: {
        name: '3ème-A',
        level: 9
      },
      grades: {
        periodId: '5',
        periodName: 'Semestre 2',
        generalAverage: 13.5,
        rank: 8,
        totalStudents: 30,
        subjects: [
          {
            subjectId: '6',
            subjectName: 'Mathématiques',
            average: 15.0,
            coefficient: 4,
            grades: [],
            appreciation: 'Bon niveau'
          },
          {
            subjectId: '8',
            subjectName: 'Physique-Chimie',
            average: 12.0,
            coefficient: 3,
            grades: [],
            appreciation: 'Peut mieux faire'
          }
        ],
        appreciation: 'Résultats corrects',
        teacherComment: 'Julien doit fournir plus d\'efforts en sciences.'
      },
      absences: {
        total: 2,
        justified: 1,
        unjustified: 1
      },
      customData: {
        mention: 'Assez bien'
      }
    },
    pdfUrl: '/bulletins/julien-garcia-s2-2024.pdf',
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-02-15')
  }
]

// Logs d'envoi de bulletins mockés
export const mockBulletinSendLogs: BulletinSendLog[] = [
  {
    id: '1',
    bulletinId: '1',
    recipientType: 'parent',
    recipientEmail: 'paul.petit@email.com',
    sentAt: new Date('2024-01-30T10:30:00'),
    status: 'delivered'
  },
  {
    id: '2',
    bulletinId: '1',
    recipientType: 'parent',
    recipientEmail: 'marie.petit@email.com',
    sentAt: new Date('2024-01-30T10:30:00'),
    status: 'delivered'
  }
]

// Périodes d'évaluation mockées
export const mockEvaluationPeriods = [
  {
    id: '2',
    tenantId: '1',
    academicYearId: '1',
    name: 'Trimestre 2',
    startDate: new Date('2024-01-08'),
    endDate: new Date('2024-04-05'),
    isActive: true,
    createdAt: new Date('2023-09-01'),
    updatedAt: new Date('2024-01-08')
  },
  {
    id: '3',
    tenantId: '1',
    academicYearId: '1',
    name: 'Trimestre 3',
    startDate: new Date('2024-04-22'),
    endDate: new Date('2024-07-05'),
    isActive: false,
    createdAt: new Date('2023-09-01'),
    updatedAt: new Date('2024-04-22')
  },
  {
    id: '5',
    tenantId: '2',
    academicYearId: '2',
    name: 'Semestre 2',
    startDate: new Date('2024-02-19'),
    endDate: new Date('2024-07-05'),
    isActive: true,
    createdAt: new Date('2023-09-01'),
    updatedAt: new Date('2024-02-19')
  }
]

// Services mockés pour Évaluation & Notes
export const mockEvaluationService = {
  async getEvaluations(tenantId: string, filters: any = {}) {
    await delay(300)
    let evaluations = mockEvaluations.filter(e => e.tenantId === tenantId)
    
    if (filters.classId) {
      evaluations = evaluations.filter(e => e.classId === filters.classId)
    }
    if (filters.subjectId) {
      evaluations = evaluations.filter(e => e.subjectId === filters.subjectId)
    }
    if (filters.type) {
      evaluations = evaluations.filter(e => e.type === filters.type)
    }
    
    return evaluations
  },

  async getStudentGrades(studentId: string, evaluationId?: string) {
    await delay(300)
    let grades = mockStudentGrades.filter(g => g.studentId === studentId)
    if (evaluationId) {
      grades = grades.filter(g => g.evaluationId === evaluationId)
    }
    return grades
  },

  async createEvaluation(data: any) {
    await delay(500)
    const newEvaluation: Evaluation = {
      id: Date.now().toString(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    mockEvaluations.push(newEvaluation)
    return newEvaluation
  },

  async saveGrade(data: any) {
    await delay(500)
    const newGrade: StudentGrade = {
      id: Date.now().toString(),
      ...data,
      gradedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    }
    mockStudentGrades.push(newGrade)
    return newGrade
  },

  async calculateAverages(studentId: string, periodId: string) {
    await delay(400)
    // Simulation du calcul de moyennes
    return mockPeriodAverages.find(p => p.periodId === periodId) || mockPeriodAverages[0]
  }
}

// Services mockés pour Bulletins Scolaires
export const mockBulletinService = {
  async getBulletinConfigs(tenantId: string) {
    await delay(300)
    return mockBulletinConfigs.filter(c => c.tenantId === tenantId)
  },

  async getBulletins(tenantId: string, filters: any = {}) {
    await delay(300)
    let bulletins = mockBulletins.filter(b => b.tenantId === tenantId)
    
    if (filters.studentId) {
      bulletins = bulletins.filter(b => b.studentId === filters.studentId)
    }
    if (filters.periodId) {
      bulletins = bulletins.filter(b => b.periodId === filters.periodId)
    }
    if (filters.status) {
      bulletins = bulletins.filter(b => b.status === filters.status)
    }
    
    return bulletins
  },

  async generateBulletin(data: any) {
    await delay(1000) // Simulation génération PDF
    const newBulletin: Bulletin = {
      id: Date.now().toString(),
      ...data,
      status: BulletinStatus.GENERATED,
      pdfUrl: `/bulletins/${data.studentId}-${data.periodId}-${Date.now()}.pdf`,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    mockBulletins.push(newBulletin)
    return newBulletin
  },

  async sendBulletin(bulletinId: string, recipients: string[]) {
    await delay(800)
    const bulletin = mockBulletins.find(b => b.id === bulletinId)
    if (!bulletin) throw new Error('Bulletin non trouvé')
    
    bulletin.status = BulletinStatus.SENT
    bulletin.sentAt = new Date()
    bulletin.updatedAt = new Date()
    
    // Créer les logs d'envoi
    const logs = recipients.map(email => ({
      id: Date.now().toString() + Math.random(),
      bulletinId,
      recipientType: 'parent' as const,
      recipientEmail: email,
      sentAt: new Date(),
      status: 'sent' as const
    }))
    
    mockBulletinSendLogs.push(...logs)
    
    return { success: true, logs }
  },

  async getBulletinSendLogs(bulletinId: string) {
    await delay(200)
    return mockBulletinSendLogs.filter(log => log.bulletinId === bulletinId)
  }
} 