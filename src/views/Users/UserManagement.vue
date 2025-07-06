<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    
    <!-- Sélecteur de Tenant -->
    <TenantSelector />
    
    <!-- En-tête avec statistiques -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white">{{ userStats.total }}</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">Total Utilisateurs</p>
          </div>
          <div class="text-green-600 dark:text-green-400 text-sm font-medium">+5.2%</div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <div class="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white">{{ teachers.length }}</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">Professeurs</p>
          </div>
          <div class="text-green-600 dark:text-green-400 text-sm font-medium">+3.1%</div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white">{{ availableClasses.length }}</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">Classes</p>
          </div>
          <div class="text-green-600 dark:text-green-400 text-sm font-medium">+2.5%</div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <div class="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white">{{ availableSubjects.length }}</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">Matières</p>
          </div>
          <div class="text-green-600 dark:text-green-400 text-sm font-medium">+1.8%</div>
        </div>
      </div>
    </div>

    <!-- Barre d'actions principale -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-8">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Gestion des Utilisateurs</h2>
          <p class="text-gray-500 dark:text-gray-400">Gérez les professeurs, leurs classes et matières</p>
        </div>
        
        <div class="flex items-center gap-3">
          <button
            @click="refreshData"
            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            Actualiser
          </button>
          
          <button
            @click="showCreateModal = true"
            :disabled="!tenantStore.currentTenantId"
            class="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
            Nouvel Utilisateur
          </button>

          <button
            @click="showTeacherModal = true"
            :disabled="!tenantStore.currentTenantId"
            class="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z"/>
            </svg>
            Nouveau Professeur
          </button>
        </div>
      </div>
    </div>

    <!-- Filtres et recherche -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Rechercher</label>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Nom, email, département..."
            class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Département</label>
          <select
            v-model="selectedDepartment"
            class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="">Tous les départements</option>
            <option v-for="dept in departments" :key="dept" :value="dept">{{ dept }}</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Statut</label>
          <select
            v-model="selectedStatus"
            class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="">Tous les statuts</option>
            <option value="active">Actif</option>
            <option value="inactive">Inactif</option>
            <option value="suspended">Suspendu</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Actions</label>
          <button
            @click="clearFilters"
            class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Effacer les filtres
          </button>
        </div>
      </div>
    </div>

    <!-- Grille des professeurs -->
    <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      <div
        v-for="teacher in filteredTeachers"
        :key="teacher._id"
        class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-200"
      >
        <!-- En-tête du professeur -->
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-semibold">
              {{ getInitials(teacher.firstName, teacher.lastName) }}
            </div>
            <div>
              <h3 class="font-semibold text-gray-900 dark:text-white">
                {{ teacher.firstName }} {{ teacher.lastName }}
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ teacher.email }}</p>
            </div>
          </div>
          
          <div class="flex items-center gap-2">
            <span :class="getStatusBadgeClass(teacher.status)" class="px-2 py-1 text-xs font-medium rounded-full">
              {{ getStatusLabel(teacher.status) }}
            </span>
          </div>
        </div>

        <!-- Informations du professeur -->
        <div class="space-y-3 mb-4">
          <div v-if="teacher.department" class="flex items-center gap-2 text-sm">
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h4"/>
            </svg>
            <span class="text-gray-700 dark:text-gray-300">{{ teacher.department }}</span>
          </div>

          <div v-if="teacher.phone" class="flex items-center gap-2 text-sm">
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
            </svg>
            <span class="text-gray-700 dark:text-gray-300">{{ teacher.phone }}</span>
          </div>

          <div v-if="teacher.employeeId" class="flex items-center gap-2 text-sm">
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V4a2 2 0 114 0v2m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-6 0"/>
            </svg>
            <span class="text-gray-700 dark:text-gray-300">ID: {{ teacher.employeeId }}</span>
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

        <!-- Classes assignées -->
        <div class="mb-4">
          <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Classes assignées</h4>
          <div class="flex flex-wrap gap-1">
            <span
              v-for="assignment in getTeacherClassAssignments(teacher._id)"
              :key="`${assignment.classId}-${assignment.subjectId}`"
              class="inline-block px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
            >
              {{ assignment.className }} - {{ assignment.subjectName }}
            </span>
            <span
              v-if="!getTeacherClassAssignments(teacher._id).length"
              class="inline-block px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
            >
              Aucune classe assignée
            </span>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            @click="openAssignmentModal(teacher)"
            class="flex-1 inline-flex items-center justify-center px-3 py-2 border border-blue-300 rounded-lg text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800"
          >
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
            Assigner Classes
          </button>
          
          <button
            @click="editTeacher(teacher)"
            class="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg dark:text-gray-400 dark:hover:text-blue-400 dark:hover:bg-blue-900/20"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5M17.5 2.5a2.121 2.121 0 013 3L12 14l-4 1 1-4z"/>
            </svg>
          </button>
          
          <button
            @click="deleteTeacher(teacher)"
            class="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-red-900/20"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Carte vide si aucun professeur -->
      <div v-if="!filteredTeachers.length" class="col-span-full">
        <div class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Aucun professeur trouvé</h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {{ !tenantStore.currentTenantId ? 'Sélectionnez un établissement pour voir les professeurs' : 'Commencez par créer un nouveau professeur.' }}
          </p>
        </div>
      </div>
    </div>

    <!-- Modal d'assignation classe/matière -->
    <ClassSubjectAssignmentModal
      :show="showAssignmentModal"
      :teacher="selectedTeacher"
      :classes="availableClasses"
      :subjects="availableSubjects"
      :assignments="classAssignments"
      @close="closeAssignmentModal"
      @assigned="onTeacherAssigned"
    />

    <!-- Modals existants -->
    <AddUserModal
      :show="showCreateModal"
      @close="showCreateModal = false"
      @created="onUserCreated"
    />

    <!-- <TeacherModal
      :show="showTeacherModal"
      @close="showTeacherModal = false"
      @created="onTeacherCreated"
    /> -->
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useCurrentTenantStore } from '@/stores/currentTenantStore'
import { getUsers } from '@/services/userService'
import { getTeachers, deleteTeacher as deleteTeacherApi } from '@/services/academicService'
import { fetchClasses } from '@/services/academicService'
import { getSubjects } from '@/services/academicService'
import type { Teacher, Class, Subject } from '@/types/academic'
import type { User } from '@/types/tenant'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import TenantSelector from '@/components/tenant/TenantSelector.vue'
import AddUserModal from '@/components/forms/AddUserModal.vue'
import AddTeacherUserModal from '@/components/forms/AddTeacherUserModal.vue'
// import TeacherModal from '@/components/teachers/TeacherModal.vue'
import TeacherManagement from '../Teachers/TeacherManagement.vue'
import ClassSubjectAssignmentModal from '@/components/forms/ClassSubjectAssignmentModal.vue'

interface ClassAssignment {
  teacherId: string
  classId: string
  subjectId: string
  hoursPerWeek: number
  type: string
}

const currentPageTitle = ref('Gestion des Utilisateurs')
const tenantStore = useCurrentTenantStore()

// État local
const users = ref<User[]>([])
const teachers = ref<Teacher[]>([])
const availableClasses = ref<Class[]>([])
const availableSubjects = ref<Subject[]>([])
const classAssignments = ref<ClassAssignment[]>([])
const loading = ref(false)

// Modals
const showCreateModal = ref(false)
const showTeacherModal = ref(false)
const showAssignmentModal = ref(false)
const selectedTeacher = ref<Teacher | null>(null)

// Filtres
const searchQuery = ref('')
const selectedDepartment = ref('')
const selectedStatus = ref('')

// Computed properties
const filteredTeachers = computed(() => {
  let filtered = teachers.value

  if (searchQuery.value) {
    const search = searchQuery.value.toLowerCase()
    filtered = filtered.filter(teacher =>
      teacher.firstName?.toLowerCase().includes(search) ||
      teacher.lastName?.toLowerCase().includes(search) ||
      teacher.email?.toLowerCase().includes(search) ||
      teacher.department?.toLowerCase().includes(search)
    )
  }

  if (selectedDepartment.value) {
    filtered = filtered.filter(teacher => teacher.department === selectedDepartment.value)
  }

  if (selectedStatus.value) {
    filtered = filtered.filter(teacher => teacher.status === selectedStatus.value)
  }

  return filtered
})

const departments = computed(() => {
  const depts = [...new Set(teachers.value.map(t => t.department).filter(Boolean))]
  return depts.sort()
})

const userStats = computed(() => ({
  total: (users.value?.length || 0) + (teachers.value?.length || 0),
  teachers: teachers.value?.length || 0,
  students: users.value?.filter(u => u.role === 'student')?.length || 0,
  parents: users.value?.filter(u => u.role === 'parent')?.length || 0
}))

// Méthodes utilitaires
function getInitials(firstName: string, lastName: string): string {
  return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase()
}

function getStatusBadgeClass(status: string): string {
  const classes = {
    'active': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    'inactive': 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
    'suspended': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
  }
  return classes[status as keyof typeof classes] || classes.inactive
}

function getStatusLabel(status: string): string {
  const labels = {
    'active': 'Actif',
    'inactive': 'Inactif',
    'suspended': 'Suspendu'
  }
  return labels[status as keyof typeof labels] || 'Inconnu'
}

function getTeacherSubjects(teacher: Teacher): Subject[] {
  return teacher.subjects || []
}

function getTeacherClassAssignments(teacherId: string): ClassAssignment[] {
  return classAssignments.value.filter((assignment: ClassAssignment) => assignment.teacherId === teacherId)
}

// Actions
async function refreshData() {
  if (!tenantStore.currentTenantId) return

  loading.value = true
  try {
    const [usersResponse, teachersData, classesData, subjectsData] = await Promise.all([
      getUsers(tenantStore.currentTenantId),
      getTeachers(tenantStore.currentTenantId),
      fetchClasses(tenantStore.currentTenantId),
      getSubjects(tenantStore.currentTenantId)
    ])

    users.value = usersResponse.users || []
    teachers.value = teachersData || []
    availableClasses.value = classesData || []
    availableSubjects.value = subjectsData || []
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error)
    alert('Erreur lors du chargement des données')
  } finally {
    loading.value = false
  }
}

function clearFilters() {
  searchQuery.value = ''
  selectedDepartment.value = ''
  selectedStatus.value = ''
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
  console.log('Modifier professeur:', teacher)
  // TODO: Implémenter la modification
}

async function deleteTeacher(teacher: Teacher) {
  if (!tenantStore.currentTenantId) return

  if (confirm(`Êtes-vous sûr de vouloir supprimer le professeur ${teacher.firstName} ${teacher.lastName} ?`)) {
    try {
      await deleteTeacherApi(teacher._id, tenantStore.currentTenantId)
      teachers.value = teachers.value.filter(t => t._id !== teacher._id)
      alert('Professeur supprimé avec succès')
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
      alert('Erreur lors de la suppression du professeur')
    }
  }
}

function onUserCreated(userData: unknown) {
  // Convert userData to User type if needed
  const user = userData as User
  users.value.push(user)
  console.log('Utilisateur créé:', user)
}

function onTeacherCreated(teacher: Teacher) {
  teachers.value.push(teacher)
  console.log('Professeur créé:', teacher)
}

function onTeacherAssigned(assignment: ClassAssignment) {
  classAssignments.value.push(assignment)
  console.log('Assignation créée:', assignment)
}

// Watcher pour recharger les données quand le tenant change
watch(() => tenantStore.currentTenantId, (newTenantId) => {
  if (newTenantId) {
    refreshData()
  } else {
    users.value = []
    teachers.value = []
    availableClasses.value = []
    availableSubjects.value = []
    classAssignments.value = []
  }
})

// Lifecycle
onMounted(() => {
  tenantStore.loadFromStorage()
  if (tenantStore.currentTenantId) {
    refreshData()
  }
})
</script> 