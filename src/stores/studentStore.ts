import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { 
  Student, 
  CreateStudentDto, 
  UpdateStudentDto, 
  StudentStats,
  BulkImportResult 
} from '@/types/student'
import * as studentService from '@/services/studentService'

export const useStudentStore = defineStore('student', () => {
  // État
  const students = ref<Student[]>([])
  const currentStudent = ref<Student | null>(null)
  const stats = ref<StudentStats>({
    total: 0,
    active: 0,
    inactive: 0,
    byLevel: {},
    byGender: {}
  })
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  // Pagination
  const currentPage = ref(1)
  const totalPages = ref(1)
  const totalStudents = ref(0)
  const itemsPerPage = ref(20)
  
  // Filtres
  const searchQuery = ref('')
  const selectedClass = ref('')
  const selectedStatus = ref('')
  
  // Computed
  const activeStudents = computed(() => 
    students.value.filter(s => s.academicInfo.status === 'active')
  )
  
  const inactiveStudents = computed(() => 
    students.value.filter(s => s.academicInfo.status !== 'active')
  )
  
  const studentsByLevel = computed(() => {
    const grouped: Record<string, Student[]> = {}
    students.value.forEach(student => {
      const level = student.academicInfo.level
      if (!grouped[level]) {
        grouped[level] = []
      }
      grouped[level].push(student)
    })
    return grouped
  })
  
  const studentsByClass = computed(() => {
    const grouped: Record<string, Student[]> = {}
    students.value.forEach(student => {
      const className = student.academicInfo.className
      if (!grouped[className]) {
        grouped[className] = []
      }
      grouped[className].push(student)
    })
    return grouped
  })
  
  // Actions
  async function fetchStudents(tenantId: string, page: number = 1) {
    loading.value = true
    error.value = null
    
    try {
      const response = await studentService.fetchStudents(
        tenantId,
        page,
        itemsPerPage.value,
        searchQuery.value || undefined,
        selectedClass.value || undefined,
        selectedStatus.value || undefined
      )
      
      students.value = response.students
      currentPage.value = response.currentPage
      totalPages.value = response.pages
      totalStudents.value = response.total
      
      return response
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la récupération des élèves'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function fetchStudent(id: string, tenantId: string) {
    loading.value = true
    error.value = null
    
    try {
      const student = await studentService.fetchStudent(id, tenantId)
      currentStudent.value = student
      return student
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la récupération de l\'élève'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function createStudent(studentData: CreateStudentDto, tenantId: string) {
    loading.value = true
    error.value = null
    
    try {
      const newStudent = await studentService.createStudent(studentData, tenantId)
      students.value.unshift(newStudent)
      totalStudents.value++
      
      // Mettre à jour les statistiques
      await fetchStats(tenantId)
      
      return newStudent
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la création de l\'élève'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function updateStudent(id: string, studentData: UpdateStudentDto, tenantId: string) {
    loading.value = true
    error.value = null
    
    try {
      const updatedStudent = await studentService.updateStudent(id, studentData, tenantId)
      
      // Mettre à jour dans la liste
      const index = students.value.findIndex(s => s._id === id)
      if (index !== -1) {
        students.value[index] = updatedStudent
      }
      
      // Mettre à jour l'élève courant si c'est le même
      if (currentStudent.value?._id === id) {
        currentStudent.value = updatedStudent
      }
      
      return updatedStudent
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la mise à jour de l\'élève'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function deleteStudent(id: string, tenantId: string) {
    loading.value = true
    error.value = null
    
    try {
      await studentService.deleteStudent(id, tenantId)
      
      // Supprimer de la liste
      students.value = students.value.filter(s => s._id !== id)
      totalStudents.value--
      
      // Réinitialiser l'élève courant si c'est le même
      if (currentStudent.value?._id === id) {
        currentStudent.value = null
      }
      
      // Mettre à jour les statistiques
      await fetchStats(tenantId)
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la suppression de l\'élève'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function fetchStats(tenantId: string) {
    try {
      const studentStats = await studentService.fetchStudentStats(tenantId)
      stats.value = studentStats
      return studentStats
    } catch (err: any) {
      console.error('Erreur lors de la récupération des statistiques:', err)
      // Ne pas lever l'erreur pour ne pas bloquer l'interface
    }
  }
  
  async function fetchStudentsByClass(classId: string, tenantId: string) {
    try {
      return await studentService.fetchStudentsByClass(classId, tenantId)
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la récupération des élèves de la classe'
      throw err
    }
  }
  
  async function bulkImportStudents(studentsData: CreateStudentDto[], tenantId: string): Promise<BulkImportResult> {
    loading.value = true
    error.value = null
    
    try {
      const result = await studentService.bulkImportStudents(studentsData, tenantId)
      
      // Ajouter les élèves créés avec succès
      students.value.unshift(...result.success)
      totalStudents.value += result.success.length
      
      // Mettre à jour les statistiques
      await fetchStats(tenantId)
      
      return result
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de l\'import en masse'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  // Filtres et recherche
  function setSearchQuery(query: string) {
    searchQuery.value = query
  }
  
  function setClassFilter(classId: string) {
    selectedClass.value = classId
  }
  
  function setStatusFilter(status: string) {
    selectedStatus.value = status
  }
  
  function clearFilters() {
    searchQuery.value = ''
    selectedClass.value = ''
    selectedStatus.value = ''
  }
  
  function setItemsPerPage(items: number) {
    itemsPerPage.value = items
  }
  
  // Utilitaires
  function getStudentById(id: string): Student | undefined {
    return students.value.find(s => s._id === id)
  }
  
  function getStudentByNumber(studentNumber: string): Student | undefined {
    return students.value.find(s => s.studentNumber === studentNumber)
  }
  
  function resetState() {
    students.value = []
    currentStudent.value = null
    stats.value = {
      total: 0,
      active: 0,
      inactive: 0,
      byLevel: {},
      byGender: {}
    }
    error.value = null
    currentPage.value = 1
    totalPages.value = 1
    totalStudents.value = 0
    clearFilters()
  }
  
  return {
    // État
    students,
    currentStudent,
    stats,
    loading,
    error,
    currentPage,
    totalPages,
    totalStudents,
    itemsPerPage,
    searchQuery,
    selectedClass,
    selectedStatus,
    
    // Computed
    activeStudents,
    inactiveStudents,
    studentsByLevel,
    studentsByClass,
    
    // Actions
    fetchStudents,
    fetchStudent,
    createStudent,
    updateStudent,
    deleteStudent,
    fetchStats,
    fetchStudentsByClass,
    bulkImportStudents,
    
    // Filtres
    setSearchQuery,
    setClassFilter,
    setStatusFilter,
    clearFilters,
    setItemsPerPage,
    
    // Utilitaires
    getStudentById,
    getStudentByNumber,
    resetState
  }
}) 