/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { 
  AcademicYear, 
  Class, 
  Schedule, 
  CreateAcademicYearDto, 
  CreateClassDto, 
  CreateScheduleDto,
  AcademicStats
} from '@/types/academic'

import {
  fetchAcademicYears,
  fetchActiveAcademicYear,
  fetchClasses,
  fetchSchedules,
  createAcademicYear,
  createClass,
  createSchedule,
  fetchAcademicStats
} from '@/services/academicService'

export const useAcademicStore = defineStore('academic', () => {
  // État
  const academicYears = ref<AcademicYear[]>([])
  const classes = ref<Class[]>([])
  const schedules = ref<Schedule[]>([])
  const stats = ref<AcademicStats | null>(null)
  
  const loading = ref({
    academicYears: false,
    classes: false,
    schedules: false,
    stats: false
  })
  
  const error = ref<string | null>(null)

  // Getters
  const activeAcademicYear = computed(() => {
    return academicYears.value.find(year => year.isActive) || null
  })

  const classesByYear = computed(() => {
    return (academicYearId: string) => {
      return classes.value.filter(cls => cls.academicYearId === academicYearId)
    }
  })

  const schedulesByClass = computed(() => {
    return (classId: string) => {
      return schedules.value.filter(schedule => schedule.classId === classId)
    }
  })

  const schedulesByDay = computed(() => {
    return (dayOfWeek: string) => {
      return schedules.value.filter(schedule => schedule.dayOfWeek === dayOfWeek)
    }
  })

  // Actions
  const setError = (message: string | null) => {
    error.value = message
    if (message) {
      setTimeout(() => {
        error.value = null
      }, 5000)
    }
  }

  // Academic Years
  const loadAcademicYears = async (tenantId: string) => {
    loading.value.academicYears = true
    try {
      academicYears.value = await fetchAcademicYears(tenantId)
    } catch (err: any) {
      console.error('Erreur lors du chargement des années scolaires:', err)
      setError('Erreur lors du chargement des années scolaires')
      throw err
    } finally {
      loading.value.academicYears = false
    }
  }

  const addAcademicYear = async (academicYearData: CreateAcademicYearDto, tenantId: string) => {
    try {
      const newAcademicYear = await createAcademicYear(academicYearData, tenantId)
      academicYears.value.push(newAcademicYear)
      
      // Si cette année est active, désactiver les autres
      if (newAcademicYear.isActive) {
        academicYears.value.forEach(year => {
          if (year._id !== newAcademicYear._id) {
            year.isActive = false
          }
        })
      }
      
      return newAcademicYear
    } catch (err: any) {
      console.error('Erreur lors de la création de l\'année scolaire:', err)
      setError('Erreur lors de la création de l\'année scolaire')
      throw err
    }
  }

  // Classes
  const loadClasses = async (tenantId: string, academicYearId?: string) => {
    loading.value.classes = true
    try {
      classes.value = await fetchClasses(tenantId, academicYearId)
    } catch (err: any) {
      console.error('Erreur lors du chargement des classes:', err)
      setError('Erreur lors du chargement des classes')
      throw err
    } finally {
      loading.value.classes = false
    }
  }

  const addClass = async (classData: CreateClassDto, tenantId: string) => {
    try {
      const newClass = await createClass(classData, tenantId)
      classes.value.push(newClass)
      return newClass
    } catch (err: any) {
      console.error('Erreur lors de la création de la classe:', err)
      setError('Erreur lors de la création de la classe')
      throw err
    }
  }

  // Schedules
  const loadSchedules = async (
    tenantId: string, 
    classId?: string, 
    academicYearId?: string, 
    dayOfWeek?: string
  ) => {
    loading.value.schedules = true
    try {
      schedules.value = await fetchSchedules(tenantId, classId, academicYearId, dayOfWeek)
    } catch (err: any) {
      console.error('Erreur lors du chargement des créneaux:', err)
      setError('Erreur lors du chargement des créneaux')
      throw err
    } finally {
      loading.value.schedules = false
    }
  }

  const addSchedule = async (scheduleData: CreateScheduleDto, tenantId: string) => {
    try {
      const newSchedule = await createSchedule(scheduleData, tenantId)
      schedules.value.push(newSchedule)
      return newSchedule
    } catch (err: any) {
      console.error('Erreur lors de la création du créneau:', err)
      setError('Erreur lors de la création du créneau')
      throw err
    }
  }

  // Stats
  const loadStats = async (tenantId: string) => {
    loading.value.stats = true
    try {
      stats.value = await fetchAcademicStats(tenantId)
    } catch (err: any) {
      console.error('Erreur lors du chargement des statistiques:', err)
      setError('Erreur lors du chargement des statistiques')
      throw err
    } finally {
      loading.value.stats = false
    }
  }

  // Utilitaires
  const loadAllData = async (tenantId: string) => {
    await Promise.all([
      loadAcademicYears(tenantId),
      loadClasses(tenantId),
      loadSchedules(tenantId),
      loadStats(tenantId)
    ])
  }

  const clearError = () => {
    error.value = null
  }

  const reset = () => {
    academicYears.value = []
    classes.value = []
    schedules.value = []
    stats.value = null
    error.value = null
    loading.value = {
      academicYears: false,
      classes: false,
      schedules: false,
      stats: false
    }
  }

  return {
    // État
    academicYears,
    classes,
    schedules,
    stats,
    loading,
    error,
    
    // Getters
    activeAcademicYear,
    classesByYear,
    schedulesByClass,
    schedulesByDay,
    
    // Actions
    setError,
    clearError,
    reset,
    
    // Academic Years
    loadAcademicYears,
    addAcademicYear,
    
    // Classes
    loadClasses,
    addClass,
    
    // Schedules
    loadSchedules,
    addSchedule,
    
    // Stats
    loadStats,
    
    // Utilitaires
    loadAllData
  }
}) 