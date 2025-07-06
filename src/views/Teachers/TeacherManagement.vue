<template>
  <AdminLayout>
    <!-- En-tête de la page -->
    <div class="mb-8">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Gestion des Professeurs</h1>
          <p class="mt-2 text-sm text-gray-700 dark:text-gray-300">
            Gérez le personnel enseignant et leurs assignations
          </p>
        </div>
        <div class="mt-4 sm:mt-0">
          <button
            @click="showCreateModal = true"
            class="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
            Nouveau Professeur
          </button>
        </div>
      </div>
    </div>

    <!-- Statistiques rapides -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <div class="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Professeurs</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ teachers.length }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <div class="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
            <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Actifs</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ activeTeachers }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <div class="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
            <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Matières</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ subjects.length }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <div class="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
            <svg class="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Classes</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ classes.length }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filtres et recherche -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <!-- Recherche -->
        <div class="flex flex-1 max-w-md">
          <div class="relative w-full">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Rechercher un professeur..."
              class="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
            />
          </div>
        </div>

        <!-- Filtres -->
        <div class="flex flex-wrap gap-3">
          <select
            v-model="selectedDepartment"
            class="px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm"
          >
            <option value="">Tous les départements</option>
            <option v-for="dept in departments" :key="dept" :value="dept">{{ dept }}</option>
          </select>

          <select
            v-model="selectedStatus"
            class="px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm"
          >
            <option value="">Tous les statuts</option>
            <option value="active">Actifs</option>
            <option value="inactive">Inactifs</option>
            <option value="suspended">Suspendus</option>
          </select>

          <select
            v-model="selectedEmploymentType"
            class="px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm"
          >
            <option value="">Tous les types</option>
            <option value="full-time">Temps plein</option>
            <option value="part-time">Temps partiel</option>
            <option value="contract">Contractuel</option>
          </select>

          <button
            @click="clearFilters"
            class="px-4 py-2.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            Effacer
          </button>
        </div>
      </div>
    </div>

    <!-- Message si aucun établissement sélectionné -->
    <div v-if="!tenantStore.currentTenantId" class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6 mb-8">
      <div class="flex items-center">
        <svg class="w-6 h-6 text-yellow-600 dark:text-yellow-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.864-.833-2.634 0L4.168 16.5c-.77.833.192 2.5 1.732 2.5z"/>
        </svg>
        <div>
          <h3 class="text-sm font-medium text-yellow-800 dark:text-yellow-200">
            Aucun établissement sélectionné
          </h3>
          <p class="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
            Veuillez sélectionner un établissement pour voir et gérer les professeurs.
          </p>
        </div>
      </div>
    </div>

    <!-- Liste des professeurs -->
    <div v-else-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <div v-else class="space-y-6">
      <!-- Grille des professeurs -->
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <div
          v-for="teacher in filteredTeachers"
          :key="teacher._id"
          class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
        >
          <!-- En-tête de la carte -->
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-semibold text-lg">
                {{ teacher.firstName[0] }}{{ teacher.lastName[0] }}
              </div>
              <div class="ml-3">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                  {{ teacher.firstName }} {{ teacher.lastName }}
                </h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ teacher.employeeId }}</p>
              </div>
            </div>
            
            <!-- Statut -->
            <span
              :class="{
                'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400': teacher.status === 'active',
                'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400': teacher.status === 'inactive',
                'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400': teacher.status === 'suspended'
              }"
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
            >
              {{ getStatusLabel(teacher.status) }}
            </span>
          </div>

          <!-- Informations de contact -->
          <div class="space-y-2 mb-4">
            <div class="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
              {{ teacher.email }}
            </div>
            <div v-if="teacher.phone" class="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
              {{ teacher.phone }}
            </div>
            <div v-if="teacher.department" class="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
              </svg>
              {{ teacher.department }}
            </div>
          </div>

          <!-- Matières enseignées -->
          <div class="mb-4">
            <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Matières enseignées</h4>
            <div class="flex flex-wrap gap-1">
              <span
                v-for="subject in getTeacherSubjects(teacher)"
                :key="subject._id || subject"
                class="inline-block px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
              >
                {{ typeof subject === 'string' ? subject : subject.name }}
              </span>
              <span
                v-if="!getTeacherSubjects(teacher).length"
                class="inline-block px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
              >
                Aucune matière assignée
              </span>
            </div>
          </div>

          <!-- Type d'emploi et expérience -->
          <div class="mb-4 text-sm text-gray-600 dark:text-gray-400">
            <div class="flex justify-between">
              <span>{{ getEmploymentTypeLabel(teacher.employmentType) }}</span>
              <span>{{ teacher.experience }} ans d'exp.</span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              @click="openAssignmentModal(teacher)"
              class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
            >
              Assigner classes
            </button>
            <div class="flex space-x-2">
              <button
                @click="editTeacher(teacher)"
                class="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                title="Modifier"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                </svg>
              </button>
              <button
                @click="deleteTeacherConfirm(teacher)"
                class="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                title="Supprimer"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Message si aucun professeur -->
      <div v-if="!filteredTeachers.length" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Aucun professeur trouvé</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {{ searchQuery || selectedDepartment || selectedStatus || selectedEmploymentType ? 
             'Aucun professeur ne correspond aux critères de recherche.' : 
             'Commencez par créer un nouveau professeur.' }}
        </p>
        <div class="mt-6">
          <button
            @click="showCreateModal = true"
            class="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-blue-700"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
            Nouveau Professeur
          </button>
        </div>
      </div>
    </div>

    <!-- Modal d'ajout/modification -->
    <TeacherModal
      :show="showCreateModal"
      :availableSubjects="subjects"
      @close="closeCreateModal"
      @submit="onTeacherCreated"
      @subjectsCreated="refreshData"
    />

    <!-- Modal d'assignation classe/matière -->
    <ClassSubjectAssignmentModal
      :show="showAssignmentModal"
      :teacher="selectedTeacher"
      :classes="classes"
      :subjects="subjects"
      :assignments="classAssignments"
      @close="closeAssignmentModal"
      @assigned="onTeacherAssigned"
    />
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useCurrentTenantStore } from '@/stores/currentTenantStore'
import { getTeachers, deleteTeacher as deleteTeacherApi, createTeacher, getSubjects, fetchClasses } from '@/services/academicService'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import TeacherModal from '@/components/teachers/TeacherModal.vue'
import ClassSubjectAssignmentModal from '@/components/forms/ClassSubjectAssignmentModal.vue'
import type { Teacher, Subject, Class, CreateTeacherDto } from '@/types/academic'

const tenantStore = useCurrentTenantStore()

// État
const loading = ref(false)
const teachers = ref<Teacher[]>([])
const subjects = ref<Subject[]>([])
const classes = ref<Class[]>([])
const classAssignments = ref<any[]>([])

// Modals
const showCreateModal = ref(false)
const showAssignmentModal = ref(false)
const selectedTeacher = ref<Teacher | null>(null)

// Filtres
const searchQuery = ref('')
const selectedDepartment = ref('')
const selectedStatus = ref('')
const selectedEmploymentType = ref('')

// Computed
const activeTeachers = computed(() => {
  return teachers.value.filter(teacher => teacher.status === 'active').length
})

const departments = computed(() => {
  const deps = new Set(teachers.value.map(t => t.department).filter(Boolean))
  return Array.from(deps).sort()
})

const filteredTeachers = computed(() => {
  let filtered = teachers.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(teacher => 
      teacher.firstName.toLowerCase().includes(query) ||
      teacher.lastName.toLowerCase().includes(query) ||
      teacher.email.toLowerCase().includes(query) ||
      teacher.employeeId.toLowerCase().includes(query)
    )
  }

  if (selectedDepartment.value) {
    filtered = filtered.filter(teacher => teacher.department === selectedDepartment.value)
  }

  if (selectedStatus.value) {
    filtered = filtered.filter(teacher => teacher.status === selectedStatus.value)
  }

  if (selectedEmploymentType.value) {
    filtered = filtered.filter(teacher => teacher.employmentType === selectedEmploymentType.value)
  }

  return filtered
})

// Méthodes
function getStatusLabel(status: string): string {
  const labels = {
    'active': 'Actif',
    'inactive': 'Inactif', 
    'suspended': 'Suspendu'
  }
  return labels[status] || status
}

function getEmploymentTypeLabel(type: string): string {
  const labels = {
    'full-time': 'Temps plein',
    'part-time': 'Temps partiel',
    'contract': 'Contractuel'
  }
  return labels[type] || type
}

function getTeacherSubjects(teacher: Teacher): Subject[] {
  if (!teacher.subjects) return []
  return teacher.subjects as Subject[]
}

function clearFilters() {
  searchQuery.value = ''
  selectedDepartment.value = ''
  selectedStatus.value = ''
  selectedEmploymentType.value = ''
}

function openAssignmentModal(teacher: Teacher) {
  selectedTeacher.value = teacher
  showAssignmentModal.value = true
}

function closeAssignmentModal() {
  showAssignmentModal.value = false
  selectedTeacher.value = null
}

function editTeacher(teacher: Teacher) {
  selectedTeacher.value = teacher
  showCreateModal.value = true
}

function closeCreateModal() {
  showCreateModal.value = false
  selectedTeacher.value = null
}

async function onTeacherCreated(teacherData: CreateTeacherDto) {
  try {
    loading.value = true
    await createTeacher(teacherData, tenantStore.currentTenantId!)
    await refreshData()
    closeCreateModal()
  } catch (error) {
    console.error('Erreur lors de la création du professeur:', error)
    alert('Erreur lors de la création du professeur')
  } finally {
    loading.value = false
  }
}

function onTeacherAssigned() {
  // Refresh les assignations
  refreshData()
  closeAssignmentModal()
}

async function deleteTeacherConfirm(teacher: Teacher) {
  if (confirm(`Êtes-vous sûr de vouloir supprimer ${teacher.firstName} ${teacher.lastName} ?`)) {
    try {
      await deleteTeacherApi(teacher._id, tenantStore.currentTenantId!)
      await refreshData()
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
      alert('Erreur lors de la suppression du professeur')
    }
  }
}

async function refreshData() {
  if (!tenantStore.currentTenantId) return

  loading.value = true
  try {
    const [teachersData, subjectsData, classesData] = await Promise.all([
      getTeachers(tenantStore.currentTenantId),
      getSubjects(tenantStore.currentTenantId),
      fetchClasses(tenantStore.currentTenantId)
    ])

    teachers.value = teachersData || []
    subjects.value = subjectsData || []
    classes.value = classesData || []
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error)
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(() => {
  refreshData()
})

watch(() => tenantStore.currentTenantId, () => {
  refreshData()
})
</script> 