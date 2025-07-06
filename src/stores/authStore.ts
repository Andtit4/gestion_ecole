import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import authService, { type LoginCredentials, type AuthState } from '@/services/authService'
import type { Tenant } from '@/types/tenant'

export const useAuthStore = defineStore('auth', () => {
  // État réactif
  const loading = ref(false)
  const error = ref<string | null>(null)

  // État calculé basé sur le service
  const authState = computed<AuthState>(() => authService.getAuthState())
  const isAuthenticated = computed(() => authService.isAuthenticated())
  const currentSchool = computed(() => authService.getCurrentSchool())

  // Getters dérivés
  const schoolName = computed(() => currentSchool.value?.name || '')
  const schoolDomain = computed(() => currentSchool.value?.domain || '')
  const adminUser = computed(() => currentSchool.value?.admin || null)
  const subscription = computed(() => currentSchool.value?.subscription || null)
  const schoolSettings = computed(() => currentSchool.value?.settings || null)

  const adminInitials = computed(() => {
    if (!adminUser.value) return 'AD'
    const firstName = adminUser.value.firstName || ''
    const lastName = adminUser.value.lastName || ''
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase()
  })

  const subscriptionStatus = computed(() => {
    if (!subscription.value) return 'unknown'
    
    const endDate = new Date(subscription.value.endDate)
    const now = new Date()
    const daysUntilExpiry = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    
    if (daysUntilExpiry < 0) return 'expired'
    if (daysUntilExpiry < 7) return 'expiring-soon'
    if (daysUntilExpiry < 30) return 'expiring'
    return 'active'
  })

  const usageStats = computed(() => {
    if (!subscription.value) return null
    
    return {
      studentsUsage: Math.min(324 / subscription.value.maxStudents * 100, 100),
      teachersUsage: Math.min(28 / subscription.value.maxTeachers * 100, 100),
      currentStudents: 324,
      currentTeachers: 28,
      maxStudents: subscription.value.maxStudents,
      maxTeachers: subscription.value.maxTeachers
    }
  })

  // Actions d'authentification
  async function login(credentials: LoginCredentials): Promise<boolean> {
    loading.value = true
    error.value = null

    try {
      const response = await authService.login(credentials)
      
      if (response.success) {
        return true
      } else {
        error.value = response.message || 'Identifiants invalides'
        return false
      }
    } catch (err: any) {
      console.error('Erreur de connexion:', err)
      
      if (err.response?.data?.message) {
        error.value = err.response.data.message
      } else if (err.message) {
        error.value = err.message
      } else {
        error.value = 'Erreur de connexion. Veuillez réessayer.'
      }
      
      return false
    } finally {
      loading.value = false
    }
  }

  async function logout(): Promise<void> {
    loading.value = true
    error.value = null

    try {
      await authService.logout()
    } catch (err: any) {
      console.error('Erreur de déconnexion:', err)
      error.value = 'Erreur lors de la déconnexion'
    } finally {
      loading.value = false
    }
  }

  async function validateSession(): Promise<boolean> {
    if (!isAuthenticated.value) {
      return false
    }

    loading.value = true
    try {
      const isValid = await authService.validateSession()
      if (!isValid) {
        error.value = 'Session expirée'
      }
      return isValid
    } catch (err) {
      console.error('Erreur de validation de session:', err)
      error.value = 'Erreur de validation de session'
      return false
    } finally {
      loading.value = false
    }
  }

  async function refreshCurrentSchool(): Promise<Tenant | null> {
    loading.value = true
    try {
      return await authService.refreshCurrentSchool()
    } catch (err) {
      console.error('Erreur de rafraîchissement:', err)
      error.value = 'Erreur lors du rafraîchissement des données'
      return null
    } finally {
      loading.value = false
    }
  }

  async function updateSchoolSettings(settings: Partial<Tenant['settings']>): Promise<boolean> {
    loading.value = true
    error.value = null

    try {
      await authService.updateSchoolSettings(settings)
      return true
    } catch (err: any) {
      console.error('Erreur de mise à jour:', err)
      error.value = err.message || 'Erreur lors de la mise à jour'
      return false
    } finally {
      loading.value = false
    }
  }

  async function changeAdminPassword(currentPassword: string, newPassword: string): Promise<boolean> {
    loading.value = true
    error.value = null

    try {
      await authService.changeAdminPassword(currentPassword, newPassword)
      return true
    } catch (err: any) {
      console.error('Erreur de changement de mot de passe:', err)
      error.value = err.message || 'Erreur lors du changement de mot de passe'
      return false
    } finally {
      loading.value = false
    }
  }

  // Initialisation automatique
  function initialize(): void {
    // Le service s'initialise automatiquement
    // On peut ajouter de la logique supplémentaire ici si nécessaire
  }

  // Actions utilitaires
  function clearError(): void {
    error.value = null
  }

  function setLoading(state: boolean): void {
    loading.value = state
  }

  // Auto-initialisation
  initialize()

  return {
    // État
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    authState,
    isAuthenticated,
    currentSchool,
    
    // Getters dérivés
    schoolName,
    schoolDomain,
    adminUser,
    subscription,
    schoolSettings,
    adminInitials,
    subscriptionStatus,
    usageStats,
    
    // Actions
    login,
    logout,
    validateSession,
    refreshCurrentSchool,
    updateSchoolSettings,
    changeAdminPassword,
    initialize,
    clearError,
    setLoading
  }
}) 