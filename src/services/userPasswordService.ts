import { get, post, patch } from './api'

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

/**
 * Service pour gérer les mots de passe des utilisateurs
 */
class UserPasswordService {
  /**
   * Réinitialiser le mot de passe d'un utilisateur
   */
  async resetUserPassword(
    userId: string,
    tenantId: string,
    newPassword?: string
  ): Promise<{
    success: boolean
    message: string
    newPassword?: string
  }> {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/reset-password`, {
      method: 'POST',
      headers: createHeaders(tenantId),
      body: JSON.stringify({
        newPassword
      }),
    })
    
    return await handleResponse(response)
  }

  /**
   * Changer le mot de passe d'un utilisateur (nécessite l'ancien mot de passe)
   */
  async changeUserPassword(
    userId: string,
    tenantId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<{
    success: boolean
    message: string
  }> {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/change-password`, {
      method: 'POST',
      headers: createHeaders(tenantId),
      body: JSON.stringify({
        currentPassword,
        newPassword
      }),
    })
    
    return await handleResponse(response)
  }

  /**
   * Générer un nouveau mot de passe pour un utilisateur
   */
  async generateNewPassword(
    userId: string,
    tenantId: string
  ): Promise<{
    success: boolean
    message: string
    newPassword: string
  }> {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/generate-password`, {
      method: 'POST',
      headers: createHeaders(tenantId),
    })
    
    return await handleResponse(response)
  }

  /**
   * Réinitialiser le mot de passe d'un étudiant par son email
   */
  async resetStudentPasswordByEmail(
    email: string,
    tenantId: string,
    newPassword?: string
  ): Promise<{
    success: boolean
    message: string
    newPassword?: string
  }> {
    const response = await fetch(`${API_BASE_URL}/users/reset-password-by-email`, {
      method: 'POST',
      headers: createHeaders(tenantId),
      body: JSON.stringify({
        email,
        newPassword
      }),
    })
    
    return await handleResponse(response)
  }

  /**
   * Vérifier si un utilisateur existe par email
   */
  async checkUserExists(
    email: string,
    tenantId: string
  ): Promise<{
    exists: boolean
    userId?: string
    role?: string
  }> {
    const response = await fetch(`${API_BASE_URL}/users/check-exists?email=${encodeURIComponent(email)}`, {
      method: 'GET',
      headers: createHeaders(tenantId),
    })
    
    return await handleResponse(response)
  }
}

// Instance singleton
export const userPasswordService = new UserPasswordService()
export default userPasswordService 