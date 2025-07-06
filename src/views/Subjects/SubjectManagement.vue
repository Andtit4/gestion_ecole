<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    
    <!-- Sélecteur de Tenant -->
    <TenantSelector />
    
    <!-- En-tête avec statistiques -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
              </svg>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Matières</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ subjects.length }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
              </svg>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Matières Actives</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ activeSubjects }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Heures/Semaine</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ totalHoursPerWeek }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
              </svg>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Départements</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ uniqueDepartments }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Barre d'actions -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div class="flex items-center space-x-4">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Rechercher une matière..."
              class="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
          </div>

          <select
            v-model="selectedDepartment"
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="">Tous les départements</option>
            <option v-for="dept in departments" :key="dept" :value="dept">{{ dept }}</option>
          </select>

          <select
            v-model="selectedType"
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="">Tous les types</option>
            <option value="core">Matière principale</option>
            <option value="elective">Matière optionnelle</option>
            <option value="specialty">Spécialité</option>
          </select>
        </div>

        <div class="flex items-center space-x-3">
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
            Nouvelle Matière
          </button>
        </div>
      </div>
    </div>

    <!-- Tableau des matières -->
    <div class="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Matière
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Code
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Département
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Type
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Heures/Semaine
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Coefficient
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Statut
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-if="loading">
              <td colspan="8" class="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                Chargement des matières...
              </td>
            </tr>
            <tr v-else-if="filteredSubjects.length === 0">
              <td colspan="8" class="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                <div class="text-center py-8">
                  <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                  </svg>
                  <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Aucune matière</h3>
                  <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {{ !tenantStore.currentTenantId ? 'Sélectionnez un établissement pour voir les matières' : 'Commencez par créer une nouvelle matière.' }}
                  </p>
                </div>
              </td>
            </tr>
            <tr v-else v-for="subject in filteredSubjects" :key="subject._id" class="hover:bg-gray-50 dark:hover:bg-gray-800/50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div 
                    class="flex-shrink-0 h-10 w-10 rounded-lg flex items-center justify-center text-white font-medium text-sm"
                    :style="{ backgroundColor: subject.color || '#3B82F6' }"
                  >
                    {{ getSubjectInitials(subject.name) }}
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ subject.name }}
                    </div>
                    <div v-if="subject.description" class="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                      {{ subject.description }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-mono">
                {{ subject.code }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ subject.department || 'Non défini' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getTypeBadgeClass(subject.type)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                  {{ getTypeLabel(subject.type) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ subject.hoursPerWeek || 0 }}h
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ subject.coefficient || 1 }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusBadgeClass(subject.isActive)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                  {{ subject.isActive ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-2">
                  <button
                    @click="viewSubject(subject)"
                    class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    title="Voir détails"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                  </button>
                  <button
                    @click="editSubject(subject)"
                    class="text-orange-600 hover:text-orange-900 dark:text-orange-400 dark:hover:text-orange-300"
                    title="Modifier"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                  </button>
                  <button
                    @click="deleteSubject(subject)"
                    class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    title="Supprimer"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal d'ajout/modification de matière -->
    <AddSubjectModal
      :show="showCreateModal"
      :subject="selectedSubject"
      @close="closeSubjectModal"
      @created="onSubjectCreated"
      @updated="onSubjectUpdated"
    />
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useCurrentTenantStore } from '@/stores/currentTenantStore'
import { getSubjects, deleteSubject as deleteSubjectApi } from '@/services/academicService'
import type { Subject } from '@/types/academic'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import TenantSelector from '@/components/tenant/TenantSelector.vue'
import AddSubjectModal from '@/components/academic/AddSubjectModal.vue'

const currentPageTitle = ref('Gestion des Matières')
const tenantStore = useCurrentTenantStore()

// État local
const subjects = ref<Subject[]>([])
const loading = ref(false)
const showCreateModal = ref(false)
const selectedSubject = ref<Subject | null>(null)

// Filtres
const searchQuery = ref('')
const selectedDepartment = ref('')
const selectedType = ref('')

// Computed properties
const filteredSubjects = computed(() => {
  let filtered = subjects.value

  if (searchQuery.value) {
    const search = searchQuery.value.toLowerCase()
    filtered = filtered.filter(subject =>
      subject.name.toLowerCase().includes(search) ||
      subject.code.toLowerCase().includes(search) ||
      subject.description?.toLowerCase().includes(search)
    )
  }

  if (selectedDepartment.value) {
    filtered = filtered.filter(subject => subject.department === selectedDepartment.value)
  }

  if (selectedType.value) {
    filtered = filtered.filter(subject => subject.type === selectedType.value)
  }

  return filtered
})

const activeSubjects = computed(() => 
  subjects.value.filter(subject => subject.isActive).length
)

const totalHoursPerWeek = computed(() => 
  subjects.value.reduce((total, subject) => total + (subject.hoursPerWeek || 0), 0)
)

const departments = computed(() => {
  const depts = [...new Set(subjects.value.map(s => s.department).filter(Boolean))]
  return depts.sort()
})

const uniqueDepartments = computed(() => departments.value.length)

// Méthodes utilitaires
function getSubjectInitials(name: string): string {
  return name.split(' ').map(word => word.charAt(0)).join('').substring(0, 2).toUpperCase()
}

function getTypeBadgeClass(type: string): string {
  const classes = {
    'core': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    'elective': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    'specialty': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
  }
  return classes[type as keyof typeof classes] || classes.core
}

function getTypeLabel(type: string): string {
  const labels = {
    'core': 'Principale',
    'elective': 'Optionnelle',
    'specialty': 'Spécialité'
  }
  return labels[type as keyof typeof labels] || 'Principale'
}

function getStatusBadgeClass(isActive: boolean): string {
  return isActive
    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
    : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
}

// Actions
async function refreshData() {
  if (!tenantStore.currentTenantId) return

  loading.value = true
  try {
    subjects.value = await getSubjects(tenantStore.currentTenantId)
  } catch (error) {
    console.error('Erreur lors du chargement des matières:', error)
    alert('Erreur lors du chargement des matières')
  } finally {
    loading.value = false
  }

}

function viewSubject(subject: Subject) {
  console.log('Voir matière:', subject)
  // TODO: Implémenter la vue détaillée
}

function editSubject(subject: Subject) {
  selectedSubject.value = subject
  showCreateModal.value = true
}

async function deleteSubject(subject: Subject) {
  if (!tenantStore.currentTenantId) return

  if (confirm(`Êtes-vous sûr de vouloir supprimer la matière "${subject.name}" ?`)) {
    try {
      await deleteSubjectApi(subject._id, tenantStore.currentTenantId)
      subjects.value = subjects.value.filter(s => s._id !== subject._id)
      alert('Matière supprimée avec succès')
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
      alert('Erreur lors de la suppression de la matière')
    }
  }
}

function closeSubjectModal() {
  showCreateModal.value = false
  selectedSubject.value = null
}

function onSubjectCreated(subject: Subject) {
  subjects.value.push(subject)
  console.log('Matière créée:', subject.name)
}

function onSubjectUpdated(updatedSubject: Subject) {
  const index = subjects.value.findIndex(s => s._id === updatedSubject._id)
  if (index !== -1) {
    subjects.value[index] = updatedSubject
  }
  console.log('Matière modifiée:', updatedSubject.name)
}

// Watcher pour recharger les données quand le tenant change
watch(() => tenantStore.currentTenantId, (newTenantId) => {
  if (newTenantId) {
    refreshData()
  } else {
    subjects.value = []
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