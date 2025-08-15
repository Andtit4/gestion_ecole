import type { User, UserRole, UserStatus } from '@/types/tenant'

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

// Types pour les DTOs
export interface CreateUserDto {
  email: string
  firstName: string
  lastName: string
  role: UserRole
  status?: UserStatus
  avatar?: string
  phone?: string
  address?: {
    street: string
    city: string
    postalCode: string
    country: string
  }
  permissions?: string[]
  department?: string
  subjects?: string[]
  class?: string
  studentNumber?: string
  parentIds?: string[]
  childrenIds?: string[]
}

export interface UpdateUserDto extends Partial<CreateUserDto> {}

export interface UserFilters {
  role?: UserRole
  status?: UserStatus
  search?: string
}

export interface UsersResponse {
  users: User[]
  total: number
  pages: number
  currentPage: number
}

export interface UserStats {
  total: number
  byRole: Record<string, number>
  byStatus: Record<string, number>
}

export interface RolePermissions {
  role: UserRole
  description: string
  permissions: string[]
}

// ==================== USERS ====================

export async function createUser(
  userData: CreateUserDto,
  tenantId: string
): Promise<User> {
  // console.log(userData, tenantId)
  const response = await fetch(`${API_BASE_URL}/users/quick-create`, {
    method: 'POST',
    headers: createHeaders(tenantId),
    body: JSON.stringify(userData),
  })
  console.log(response)
  
  return await handleResponse<User>(response)
}

export async function getUsers(
  tenantId: string,
  page: number = 1,
  limit: number = 10,
  filters: UserFilters = {}
): Promise<UsersResponse> {
  const params = new URLSearchParams()
  params.append('page', page.toString())
  params.append('limit', limit.toString())
  
  if (filters.role) params.append('role', filters.role)
  if (filters.status) params.append('status', filters.status)
  if (filters.search) params.append('search', filters.search)
  
  const response = await fetch(`${API_BASE_URL}/users?${params}`, {
    method: 'GET',
    headers: createHeaders(tenantId),
  })
  
  return await handleResponse<UsersResponse>(response)
}

export async function getUserById(
  id: string,
  tenantId: string
): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: 'GET',
    headers: createHeaders(tenantId),
  })
  
  return await handleResponse<User>(response)
}

export async function updateUser(
  id: string,
  userData: UpdateUserDto,
  tenantId: string
): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: 'PATCH',
    headers: createHeaders(tenantId),
    body: JSON.stringify(userData),
  })
  
  return await handleResponse<User>(response)
}

export async function deleteUser(
  id: string,
  tenantId: string
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: 'DELETE',
    headers: createHeaders(tenantId),
  })
  
  if (!response.ok) {
    await handleResponse(response)
  }
}

export async function getUsersByRole(
  role: UserRole,
  tenantId: string
): Promise<User[]> {
  const response = await fetch(`${API_BASE_URL}/users/by-role/${role}`, {
    method: 'GET',
    headers: createHeaders(tenantId),
  })
  
  return await handleResponse<User[]>(response)
}

export async function getUserStats(tenantId: string): Promise<UserStats> {
  const response = await fetch(`${API_BASE_URL}/users/stats`, {
    method: 'GET',
    headers: createHeaders(tenantId),
  })
  
  return await handleResponse<UserStats>(response)
}

export async function getRolePermissions(): Promise<RolePermissions[]> {
  const response = await fetch(`${API_BASE_URL}/users/roles/permissions`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })
  
  return await handleResponse<RolePermissions[]>(response)
}

export async function updateLastLogin(
  id: string,
  tenantId: string
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/users/${id}/last-login`, {
    method: 'PATCH',
    headers: createHeaders(tenantId),
  })
  
  if (!response.ok) {
    await handleResponse(response)
  }
} 