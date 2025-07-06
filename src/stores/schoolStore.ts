import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Tenant } from '@/types/tenant'

export const useSchoolStore = defineStore('school', () => {
  // État
  const currentSchool = ref<Tenant | null>(null)
  const isAuthenticated = ref(false)
  const loading = ref(false)

  // Getters
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
      studentsUsage: Math.min(324 / subscription.value.maxStudents * 100, 100), // Données fictives
      teachersUsage: Math.min(28 / subscription.value.maxTeachers * 100, 100),
      currentStudents: 324,
      currentTeachers: 28,
      maxStudents: subscription.value.maxStudents,
      maxTeachers: subscription.value.maxTeachers
    }
  })

  // Actions
  async function setCurrentSchool(school: Tenant) {
    currentSchool.value = school
    isAuthenticated.value = true
    
    // Persister dans localStorage
    localStorage.setItem('currentSchool', JSON.stringify(school))
  }

  function loadSchoolFromStorage() {
    const stored = localStorage.getItem('currentSchool')
    if (stored) {
      try {
        const school = JSON.parse(stored)
        currentSchool.value = school
        isAuthenticated.value = true
        return true
      } catch (error) {
        console.error('Erreur lors du chargement de l\'école depuis le localStorage:', error)
        localStorage.removeItem('currentSchool')
      }
    }
    return false
  }

  function logout() {
    currentSchool.value = null
    isAuthenticated.value = false
    localStorage.removeItem('currentSchool')
  }

  function updateSchoolSettings(settings: Partial<typeof currentSchool.value.settings>) {
    if (currentSchool.value) {
      currentSchool.value.settings = { ...currentSchool.value.settings, ...settings }
      localStorage.setItem('currentSchool', JSON.stringify(currentSchool.value))
    }
  }

  function updateSubscription(subscription: Partial<typeof currentSchool.value.subscription>) {
    if (currentSchool.value) {
      currentSchool.value.subscription = { ...currentSchool.value.subscription, ...subscription }
      localStorage.setItem('currentSchool', JSON.stringify(currentSchool.value))
    }
  }

  // Initialisation
  function initialize() {
    loadSchoolFromStorage()
  }

  return {
    // État
    currentSchool,
    isAuthenticated,
    loading,
    
    // Getters
    schoolName,
    schoolDomain,
    adminUser,
    subscription,
    schoolSettings,
    adminInitials,
    subscriptionStatus,
    usageStats,
    
    // Actions
    setCurrentSchool,
    loadSchoolFromStorage,
    logout,
    updateSchoolSettings,
    updateSubscription,
    initialize
  }
}) 