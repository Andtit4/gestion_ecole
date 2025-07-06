import { get, post, patch, del } from './api'
import type { 
  AdminLoginDto,
  AdminLoginResponse,
  SuperAdminLoginResponse,
  Tenant,
  SuperAdmin
} from '../types/tenant'

export interface AuthState {
  isAuthenticated: boolean
  currentSchool: Tenant | null
  superAdmin: SuperAdmin | null
  isSuperAdmin: boolean
  token?: string
}

export interface LoginCredentials {
  domain: string
  username: string
  password: string
}

class AuthService {
  private static instance: AuthService
  private authState: AuthState = {
    isAuthenticated: false,
    currentSchool: null,
    superAdmin: null,
    isSuperAdmin: false
  }

  constructor() {
    if (AuthService.instance) {
      return AuthService.instance
    }
    AuthService.instance = this
    this.initializeFromStorage()
  }

  /**
   * Connexion avec domaine, nom d'utilisateur et mot de passe
   */
  async login(credentials: LoginCredentials): Promise<AdminLoginResponse | SuperAdminLoginResponse> {
    try {
      // Déterminer si c'est une connexion super admin
      if (credentials.domain.toUpperCase() === 'SUPER_ADMIN') {
        return await this.loginSuperAdmin(credentials)
      }

      // Connexion normale pour les admins d'établissement
      const response = await post<AdminLoginResponse>('/tenants/auth/login', {
        domain: credentials.domain.toLowerCase().trim(),
        username: credentials.username.trim(),
        password: credentials.password
      })

      if (response.data.success && response.data.tenant) {
        await this.setAuthenticated(response.data.tenant)
      }

      return response.data
    } catch (error) {
      console.error('Erreur lors de la connexion:', error)
      throw error
    }
  }

  /**
   * Connexion super admin
   */
  async loginSuperAdmin(credentials: LoginCredentials): Promise<SuperAdminLoginResponse> {
    try {
      const response = await post<SuperAdminLoginResponse>('/super-admin/auth/login', {
        domain: credentials.domain,
        username: credentials.username.trim(),
        password: credentials.password
      })

      if (response.data.success && response.data.superAdmin) {
        await this.setSuperAdminAuthenticated(response.data.superAdmin, response.data.token)
      }

      return response.data
    } catch (error) {
      console.error('Erreur lors de la connexion super admin:', error)
      throw error
    }
  }

  /**
   * Déconnexion
   */
  async logout(): Promise<void> {
    try {
      // Appeler l'API de déconnexion si nécessaire
      // await post('/tenants/auth/logout')
      
      this.clearAuthentication()
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
      // Même en cas d'erreur, on déconnecte localement
      this.clearAuthentication()
    }
  }

  /**
   * Vérifier si l'utilisateur est authentifié
   */
  isAuthenticated(): boolean {
    return this.authState.isAuthenticated && 
           (this.authState.currentSchool !== null || this.authState.superAdmin !== null)
  }

  /**
   * Vérifier si l'utilisateur est un super admin
   */
  isSuperAdmin(): boolean {
    return this.authState.isSuperAdmin && this.authState.superAdmin !== null
  }

  /**
   * Obtenir l'école actuelle
   */
  getCurrentSchool(): Tenant | null {
    return this.authState.currentSchool
  }

  /**
   * Obtenir le super admin actuel
   */
  getCurrentSuperAdmin(): SuperAdmin | null {
    return this.authState.superAdmin
  }

  /**
   * Obtenir l'état d'authentification complet
   */
  getAuthState(): AuthState {
    return { ...this.authState }
  }

  /**
   * Vérifier la validité de la session
   */
  async validateSession(): Promise<boolean> {
    // Validation pour super admin
    if (this.authState.isSuperAdmin && this.authState.superAdmin) {
      try {
        const response = await get<SuperAdmin>('/super-admin/profile', {
          headers: {
            Authorization: `Bearer ${this.authState.token}`
          }
        })
        
        if (response.data) {
          this.authState.superAdmin = response.data
          this.saveToStorage()
          return true
        }
        
        return false
      } catch (error) {
        console.error('Session super admin invalide:', error)
        this.clearAuthentication()
        return false
      }
    }

    // Validation pour admin d'établissement
    if (!this.authState.currentSchool) {
      return false
    }

    try {
      // Vérifier la validité du tenant
      const response = await get<Tenant>(`/tenants/${this.authState.currentSchool._id}`)
      
      // Mettre à jour les données si nécessaire
      if (response.data) {
        this.authState.currentSchool = response.data
        this.saveToStorage()
        return true
      }
      
      return false
    } catch (error) {
      console.error('Session invalide:', error)
      this.clearAuthentication()
      return false
    }
  }

  /**
   * Rafraîchir les données de l'école actuelle
   */
  async refreshCurrentSchool(): Promise<Tenant | null> {
    if (!this.authState.currentSchool) {
      return null
    }

    try {
      const response = await get<Tenant>(`/tenants/${this.authState.currentSchool._id}`)
      if (response.data) {
        this.authState.currentSchool = response.data
        this.saveToStorage()
        return response.data
      }
    } catch (error) {
      console.error('Erreur lors du rafraîchissement:', error)
    }

    return null
  }

  /**
   * Définir l'état d'authentification pour admin d'établissement
   */
  private async setAuthenticated(school: Tenant): Promise<void> {
    this.authState = {
      isAuthenticated: true,
      currentSchool: school,
      superAdmin: null,
      isSuperAdmin: false
    }

    this.saveToStorage()
  }

  /**
   * Définir l'état d'authentification pour super admin
   */
  private async setSuperAdminAuthenticated(superAdmin: SuperAdmin, token?: string): Promise<void> {
    this.authState = {
      isAuthenticated: true,
      currentSchool: null,
      superAdmin: superAdmin,
      isSuperAdmin: true,
      token: token
    }

    this.saveToStorage()
  }

  /**
   * Effacer l'authentification
   */
  private clearAuthentication(): void {
    this.authState = {
      isAuthenticated: false,
      currentSchool: null,
      superAdmin: null,
      isSuperAdmin: false
    }

    this.clearStorage()
  }

  /**
   * Sauvegarder dans le localStorage
   */
  private saveToStorage(): void {
    try {
      localStorage.setItem('auth_state', JSON.stringify({
        isAuthenticated: this.authState.isAuthenticated,
        currentSchool: this.authState.currentSchool,
        superAdmin: this.authState.superAdmin,
        isSuperAdmin: this.authState.isSuperAdmin,
        token: this.authState.token,
        timestamp: Date.now()
      }))
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
    }
  }

  /**
   * Charger depuis le localStorage
   */
  private initializeFromStorage(): void {
    try {
      const stored = localStorage.getItem('auth_state')
      if (stored) {
        const data = JSON.parse(stored)
        
        // Vérifier si les données ne sont pas trop anciennes (24h)
        const maxAge = 24 * 60 * 60 * 1000 // 24 heures
        if (data.timestamp && (Date.now() - data.timestamp) < maxAge) {
          this.authState = {
            isAuthenticated: data.isAuthenticated || false,
            currentSchool: data.currentSchool || null,
            superAdmin: data.superAdmin || null,
            isSuperAdmin: data.isSuperAdmin || false,
            token: data.token || undefined
          }
        } else {
          this.clearStorage()
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement depuis le storage:', error)
      this.clearStorage()
    }
  }

  /**
   * Effacer le localStorage
   */
  private clearStorage(): void {
    localStorage.removeItem('auth_state')
    localStorage.removeItem('currentSchool') // Ancien format
  }

  /**
   * Mettre à jour les paramètres de l'école
   */
  async updateSchoolSettings(settings: Partial<Tenant['settings']>): Promise<void> {
    if (!this.authState.currentSchool) {
      throw new Error('Aucune école connectée')
    }

    try {
      const response = await patch<Tenant>(
        `/tenants/${this.authState.currentSchool._id}`, 
        { settings }
      )
      
      if (response.data) {
        this.authState.currentSchool = response.data
        this.saveToStorage()
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error)
      throw error
    }
  }

  /**
   * Changer le mot de passe admin
   */
  async changeAdminPassword(currentPassword: string, newPassword: string): Promise<void> {
    if (!this.authState.currentSchool) {
      throw new Error('Aucune école connectée')
    }

    try {
      await patch(`/tenants/${this.authState.currentSchool._id}/change-password`, {
        currentPassword,
        newPassword
      })
    } catch (error) {
      console.error('Erreur lors du changement de mot de passe:', error)
      throw error
    }
  }
}

// Instance singleton
export const authService = new AuthService()
export default authService 