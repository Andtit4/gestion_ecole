const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1'

// Types pour les réponses de l'API
interface ApiResponse<T = any> {
  data: T
  message?: string
}

interface ApiError {
  message: string
  status: number
  response?: {
    data?: {
      message?: string
    }
  }
}

export interface DashboardStats {
  totalTenants: number
  activeTenants: number
  pendingTenants: number
  trialTenants: number
}

export interface TenantListItem {
  id: string
  name: string
  domain: string
  status: 'ACTIVE' | 'PENDING' | 'TRIAL' | 'SUSPENDED'
  plan: 'basic' | 'standard' | 'premium' | 'enterprise'
  currentStudents: number
  maxStudents: number
  currentTeachers: number
  maxTeachers: number
  endDate: string
  createdAt: string
  adminEmail: string
  city: string
  type: string
}

// Helper pour créer les headers
const createHeaders = (additionalHeaders: Record<string, string> = {}) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...additionalHeaders,
  }
  
  // Ajouter le tenant si disponible
  const currentTenant = localStorage.getItem('currentTenant')
  if (currentTenant) {
    headers['X-Tenant-Domain'] = currentTenant
  }
  
  return headers
}

// Helper pour gérer les erreurs
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
    
    console.error(`HTTP ${response.status}: ${errorMessage}`)
    throw new Error(errorMessage)
  }
  
  // Vérifier si la réponse a du contenu avant de parser le JSON
  const contentType = response.headers.get('content-type')
  const hasContent = contentType && contentType.includes('application/json')
  
  // Si pas de contenu ou status 204 No Content, retourner null
  if (response.status === 204 || !hasContent) {
    return null as T
  }
  
  // Vérifier aussi si le body est vide
  const text = await response.text()
  if (!text || text.trim() === '') {
    return null as T
  }
  
  try {
    return JSON.parse(text)
  } catch (e) {
    console.warn('Impossible de parser le JSON:', text)
    return null as T
  }
}

// GET request
export async function get<T>(endpoint: string): Promise<ApiResponse<T>> {
  console.log(`GET ${API_BASE_URL}${endpoint}`)
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'GET',
    headers: createHeaders(),
  })
  
  const data = await handleResponse<T>(response)
  return { data }
}

// POST request
export async function post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
  console.log(`POST ${API_BASE_URL}${endpoint}`, data)
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: createHeaders(),
    body: data ? JSON.stringify(data) : undefined,
  })
  
  const responseData = await handleResponse<T>(response)
  return { data: responseData }
}

// PUT request
export const put = async <T>(url: string, data?: any): Promise<T> => {
  console.log(`PUT ${API_BASE_URL}${url}`, data)
  
  const response = await fetch(`${API_BASE_URL}${url}`, {
    method: 'PUT',
    headers: createHeaders(),
    body: data ? JSON.stringify(data) : undefined,
  })
  
  return await handleResponse(response)
}

// PATCH request
export async function patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
  console.log(`PATCH ${API_BASE_URL}${endpoint}`, data)
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'PATCH',
    headers: createHeaders(),
    body: data ? JSON.stringify(data) : undefined,
  })
  
  const responseData = await handleResponse<T>(response)
  return { data: responseData }
}

// DELETE request
export async function del<T>(endpoint: string): Promise<ApiResponse<T>> {
  console.log(`DELETE ${API_BASE_URL}${endpoint}`)
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'DELETE',
    headers: createHeaders(),
  })
  
  const responseData = await handleResponse<T>(response)
  return { data: responseData }
}

// Client API simplifié
export const apiClient = {
  get,
  post,
  put,
  patch,
  delete: del,
}

export default apiClient

// Fonction pour récupérer les statistiques du dashboard
export async function fetchDashboardStats(): Promise<DashboardStats> {
  const response = await get<DashboardStats>('/dashboard/stats')
  return response.data
}

// Helper pour mapper les types d'école
function mapSchoolType(schoolType: string): string {
  const typeMap: Record<string, string> = {
    'primary': 'École Primaire',
    'secondary': 'Collège',
    'university': 'Université',
    'mixed': 'Établissement Mixte'
  }
  return typeMap[schoolType] || schoolType || 'Établissement'
}

// Fonction pour récupérer la liste des tenants
export async function fetchTenants(): Promise<TenantListItem[]> {
  const response = await get<{ tenants: any[]; total: number; pages: number }>('/tenants')
  
  if (response.data.tenants && Array.isArray(response.data.tenants)) {
    return response.data.tenants.map((tenant: any) => ({
      id: String(tenant._id || tenant.id),
      name: String(tenant.name || 'Nom non défini'),
      domain: String(tenant.domain || 'domaine-inconnu'),
      status: String(tenant.status?.toUpperCase() || 'PENDING') as 'ACTIVE' | 'PENDING' | 'TRIAL' | 'SUSPENDED',
      plan: String(tenant.subscription?.plan || 'basic') as 'basic' | 'standard' | 'premium' | 'enterprise',
      currentStudents: Number(tenant.subscription?.currentStudents || 0),
      maxStudents: Number(tenant.subscription?.maxStudents || 100),
      currentTeachers: Number(tenant.subscription?.currentTeachers || 0),
      maxTeachers: Number(tenant.subscription?.maxTeachers || 10),
      endDate: tenant.subscription?.endDate ? 
        new Date(tenant.subscription.endDate).toLocaleDateString('fr-FR') : 
        '31/12/2024',
      createdAt: tenant.createdAt ? 
        new Date(tenant.createdAt).toLocaleDateString('fr-FR') : 
        new Date().toLocaleDateString('fr-FR'),
      adminEmail: String(tenant.admin?.email || tenant.email || 'admin@example.com'),
      city: String(tenant.address?.city || tenant.settings?.city || 'Ville non définie'),
      type: String(mapSchoolType(tenant.settings?.schoolType) || 'Établissement')
    }))
  }
  
  return []
}

// Fonction pour récupérer un tenant spécifique
export async function fetchTenant(id: string): Promise<TenantListItem> {
  if (!id || id === 'undefined' || id === 'null') {
    throw new Error('ID tenant invalide')
  }

  const response = await get<any>(`/tenants/${id}`)
  const tenant = response.data
  
  return {
    id: String(tenant._id || tenant.id || id),
    name: String(tenant.name || 'Nom non défini'),
    domain: String(tenant.domain || 'domaine-inconnu'),
    status: String(tenant.status?.toUpperCase() || 'PENDING') as 'ACTIVE' | 'PENDING' | 'TRIAL' | 'SUSPENDED',
    plan: String(tenant.subscription?.plan || 'basic') as 'basic' | 'standard' | 'premium' | 'enterprise',
    currentStudents: Number(tenant.subscription?.currentStudents || 0),
    maxStudents: Number(tenant.subscription?.maxStudents || 100),
    currentTeachers: Number(tenant.subscription?.currentTeachers || 0),
    maxTeachers: Number(tenant.subscription?.maxTeachers || 10),
    endDate: tenant.subscription?.endDate ? 
      new Date(tenant.subscription.endDate).toLocaleDateString('fr-FR') : 
      '31/12/2024',
    createdAt: tenant.createdAt ? 
      new Date(tenant.createdAt).toLocaleDateString('fr-FR') : 
      new Date().toLocaleDateString('fr-FR'),
    adminEmail: String(tenant.admin?.email || tenant.email || 'admin@example.com'),
    city: String(tenant.address?.city || tenant.settings?.city || 'Ville non définie'),
    type: String(mapSchoolType(tenant.settings?.schoolType) || 'Établissement')
  }
}

// Fonction pour suspendre/activer un tenant
export async function updateTenantStatus(id: string, status: 'ACTIVE' | 'SUSPENDED'): Promise<void> {
  if (!id || id === 'undefined' || id === 'null') {
    throw new Error('ID tenant invalide')
  }

  const endpoint = status === 'ACTIVE' ? 'activate' : 'suspend'
  await patch(`/tenants/${id}/${endpoint}`)
}

// Fonction pour supprimer un tenant
export async function deleteTenant(id: string): Promise<void> {
  if (!id || id === 'undefined' || id === 'null') {
    throw new Error('ID tenant invalide')
  }

  await del(`/tenants/${id}`)
}

// Fonction pour mettre à jour un tenant
export async function updateTenant(id: string, updateData: Partial<{
  name: string;
  domain: string;
  email: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  settings?: {
    schoolType?: 'primary' | 'secondary' | 'university' | 'mixed';
    academicYearStart?: string;
    academicYearEnd?: string;
    gradeSystem?: 'numeric' | 'letter' | 'points';
    maxGrade?: number;
    language?: string;
    timezone?: string;
    currency?: string;
    logoUrl?: string;
    theme?: {
      primaryColor: string;
      secondaryColor: string;
    };
  };
  status?: 'ACTIVE' | 'SUSPENDED' | 'PENDING' | 'CANCELLED';
  subscription?: any;
}>): Promise<TenantListItem> {
  if (!id || id === 'undefined' || id === 'null') {
    throw new Error('ID tenant invalide')
  }

  const response = await patch<any>(`/tenants/${id}`, updateData)
  const tenant = response.data
  
  // Transformer la réponse dans le format attendu
  return {
    id: String(tenant._id || tenant.id || id),
    name: String(tenant.name || updateData.name || 'Nom non défini'),
    domain: String(tenant.domain || updateData.domain || 'domaine-inconnu'),
    status: String(tenant.status?.toUpperCase() || 'PENDING') as 'ACTIVE' | 'PENDING' | 'TRIAL' | 'SUSPENDED',
    plan: String(tenant.subscription?.plan || 'basic') as 'basic' | 'standard' | 'premium' | 'enterprise',
    currentStudents: Number(tenant.subscription?.currentStudents || 0),
    maxStudents: Number(tenant.subscription?.maxStudents || 100),
    currentTeachers: Number(tenant.subscription?.currentTeachers || 0),
    maxTeachers: Number(tenant.subscription?.maxTeachers || 10),
    endDate: tenant.subscription?.endDate ? 
      new Date(tenant.subscription.endDate).toLocaleDateString('fr-FR') : 
      '31/12/2024',
    createdAt: tenant.createdAt ? 
      new Date(tenant.createdAt).toLocaleDateString('fr-FR') : 
      new Date().toLocaleDateString('fr-FR'),
    adminEmail: String(tenant.admin?.email || tenant.email || updateData.email || 'admin@example.com'),
    city: String(tenant.address?.city || updateData.address?.city || 'Ville non définie'),
    type: String(mapSchoolType(tenant.settings?.schoolType || updateData.settings?.schoolType) || 'Établissement')
  }
}

// ======================
// SUBSCRIPTION API FUNCTIONS
// ======================

// Interfaces pour les abonnements
export interface PlanDetails {
  name: string
  pricePerMonth: number
  maxStudents: number
  maxTeachers: number
  features: string[]
  description: string
}

export interface UsageStats {
  tenantId: string
  subscription: {
    plan: string
    status: string
    startDate: string
    endDate: string
    pricePerMonth: number
    isActive: boolean
    currentStudents: number
    maxStudents: number
    currentTeachers: number
    maxTeachers: number
  }
  daysUntilExpiry: number
  usagePercentage: {
    students: number
    teachers: number
  }
}

export interface BillingHistoryItem {
  id: string
  invoiceNumber: string
  date: string
  plan: string
  duration: number
  amount: number
  status: 'paid' | 'pending' | 'failed'
}

export interface Invoice {
  invoiceNumber: string
  date: string
  plan: string
  duration: number
  unitPrice: number
  subtotal: number
  tax: number
  total: number
  currency: string
}

// Fonction pour récupérer les détails des plans
export async function fetchPlanDetails(): Promise<Record<string, PlanDetails>> {
  const response = await get<Record<string, PlanDetails>>('/subscriptions/plans')
  return response.data
}

// Interface pour un plan personnalisé créé via PlanManagement
export interface CustomPlan {
  id: string
  name: string
  description: string
  monthlyPrice: number
  maxStudents: number
  maxTeachers: number
  features: string[]
  popular: boolean
  createdAt: string
  updatedAt: string
}

// Fonction pour récupérer les plans personnalisés créés via PlanManagement
export async function fetchCustomPlans(): Promise<CustomPlan[]> {
  const response = await get<CustomPlan[]>('/subscriptions/plans/custom')
  return response.data
}

// Fonction pour créer un plan personnalisé
export async function createCustomPlan(planData: {
  name: string;
  description: string;
  monthlyPrice: number;
  maxStudents: number;
  maxTeachers: number;
  features: string[];
}): Promise<CustomPlan> {
  const response = await post<CustomPlan>('/subscriptions/plans/custom', planData)
  return response.data
}

// Fonction pour assigner un plan personnalisé à un tenant
export async function assignCustomPlan(tenantId: string, planId: string, duration: number = 12): Promise<{
  tenant: any
  subscription: any
  invoice: any
}> {
  if (!tenantId || !planId) {
    throw new Error('ID tenant et ID plan sont obligatoires')
  }

  const response = await post<any>(`/subscriptions/${tenantId}/assign-custom-plan`, {
    tenantId,
    planId,
    duration
  })
  
  return response.data
}

// Fonction pour récupérer les statistiques d'utilisation d'un tenant
export async function fetchUsageStats(tenantId: string): Promise<UsageStats> {
  if (!tenantId || tenantId === 'undefined' || tenantId === 'null') {
    throw new Error('ID tenant invalide')
  }

  const response = await get<UsageStats>(`/subscriptions/${tenantId}/usage`)
  return response.data
}

// Fonction pour récupérer l'historique de facturation
export async function fetchBillingHistory(tenantId: string): Promise<BillingHistoryItem[]> {
  if (!tenantId || tenantId === 'undefined' || tenantId === 'null') {
    throw new Error('ID tenant invalide')
  }

  const response = await get<BillingHistoryItem[]>(`/subscriptions/${tenantId}/billing-history`)
  return response.data
}

// Fonction pour mettre à niveau un plan
export async function upgradePlan(tenantId: string, plan: string, duration: number = 12): Promise<{tenant: any, invoice: Invoice}> {
  if (!tenantId || tenantId === 'undefined' || tenantId === 'null') {
    throw new Error('ID tenant invalide')
  }

  const response = await post<any>(`/subscriptions/${tenantId}/upgrade`, { plan, duration })
  return response.data
}

// Fonction pour rétrograder un plan
export async function downgradePlan(tenantId: string, plan: string): Promise<{message: string, changeDate: string}> {
  if (!tenantId || tenantId === 'undefined' || tenantId === 'null') {
    throw new Error('ID tenant invalide')
  }

  const response = await post<any>(`/subscriptions/${tenantId}/downgrade`, { plan })
  return response.data
}

// Fonction pour renouveler un abonnement
export async function renewSubscription(tenantId: string, duration: number = 12): Promise<{invoice: Invoice}> {
  if (!tenantId || tenantId === 'undefined' || tenantId === 'null') {
    throw new Error('ID tenant invalide')
  }

  const response = await post<any>(`/subscriptions/${tenantId}/renew`, { duration })
  return response.data
}

// Fonction pour annuler un abonnement
export async function cancelSubscription(tenantId: string): Promise<{message: string, note: string}> {
  if (!tenantId || tenantId === 'undefined' || tenantId === 'null') {
    throw new Error('ID tenant invalide')
  }

  const response = await patch<any>(`/subscriptions/${tenantId}/cancel`)
  return response.data
}

// Interface pour la création d'abonnement
export interface CreateSubscriptionRequest {
  tenantId: string
  plan: string
  duration: number
  startDate?: string
}

// Fonction pour créer un nouvel abonnement
export async function createSubscription(data: CreateSubscriptionRequest): Promise<{
  subscription: any
  invoice: Invoice
}> {
  if (!data.tenantId || data.tenantId === 'undefined' || data.tenantId === 'null') {
    throw new Error('ID tenant invalide')
  }

  if (!data.plan || !data.duration) {
    throw new Error('Plan et durée sont obligatoires')
  }

  const response = await post<any>('/subscriptions/create', data)
  return response.data
}

// Fonction utilitaire pour nettoyer le localStorage des anciennes données mock
export function clearMockData(): void {
  try {
    localStorage.removeItem('mockTenants_v1')
    localStorage.removeItem('mockTenants')
    console.log('🧹 Données mock supprimées du localStorage')
  } catch (error) {
    console.warn('Erreur lors du nettoyage des données mock:', error)
  }
}

// Nettoyer automatiquement les données mock au chargement
clearMockData() 