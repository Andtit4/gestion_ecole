<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
    <!-- Header moderne -->
    <div class="max-w-7xl mx-auto">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
        <div>
          <div class="flex items-center mb-4">
            <!-- Bouton retour conditionnel -->
            <button
              v-if="shouldShowBackButton"
              @click="goBack"
              class="p-3 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors mr-4 group"
            >
              <svg class="w-6 h-6 text-gray-600 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div class="bg-gradient-to-r from-indigo-600 to-purple-600 p-3 rounded-2xl mr-4 shadow-lg">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
              </svg>
            </div>
            <div>
              <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
                Gestion des Matières
              </h1>
              <p class="text-gray-600 dark:text-gray-400 mt-1">
                {{ tenantName ? `${tenantName} - ` : '' }}Organisez et gérez les matières de votre établissement scolaire
              </p>
            </div>
          </div>
        </div>
        
        <div class="flex flex-col sm:flex-row gap-3">
          <button
            @click="exportSubjects"
            class="flex items-center justify-center px-6 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 font-medium"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            Exporter
          </button>
          <button
            @click="openAddModal"
            class="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
            Nouvelle Matière
          </button>
        </div>
      </div>

      <!-- Métriques en cartes -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">Total</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white mt-2">{{ subjects.length }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Matières créées</p>
            </div>
            <div class="bg-blue-500/10 p-4 rounded-2xl">
              <svg class="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">Actives</p>
              <p class="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">{{ activeSubjects }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">En cours d'utilisation</p>
            </div>
            <div class="bg-emerald-500/10 p-4 rounded-2xl">
              <svg class="w-8 h-8 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">Crédits</p>
              <p class="text-3xl font-bold text-purple-600 dark:text-purple-400 mt-2">{{ totalCredits }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Points au total</p>
            </div>
            <div class="bg-purple-500/10 p-4 rounded-2xl">
              <svg class="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">Heures</p>
              <p class="text-3xl font-bold text-orange-600 dark:text-orange-400 mt-2">{{ totalHours }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Par semaine</p>
            </div>
            <div class="bg-orange-500/10 p-4 rounded-2xl">
              <svg class="w-8 h-8 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Barre de recherche et filtres -->
      <div class="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 mb-8">
        <div class="flex flex-col lg:flex-row gap-4">
          <!-- Recherche -->
          <div class="flex-1">
            <div class="relative">
              <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Rechercher par nom, code ou description..."
                class="w-full pl-12 pr-4 py-4 border border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-lg"
              />
            </div>
          </div>

          <!-- Filtres -->
          <div class="flex flex-col sm:flex-row gap-4">
            <select
              v-model="filterStatus"
              class="px-4 py-4 border border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-lg min-w-40"
            >
              <option value="">Tous statuts</option>
              <option value="active">Actives</option>
              <option value="inactive">Inactives</option>
            </select>

            <select
              v-model="filterType"
              class="px-4 py-4 border border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-lg min-w-40"
            >
              <option value="">Tous types</option>
              <option value="theory">Théorique</option>
              <option value="practical">Pratique</option>
              <option value="mixed">Mixte</option>
            </select>
          </div>
        </div>
      </div>

      <!-- État de chargement -->
      <div v-if="loading" class="text-center py-16">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent mb-6"></div>
        <p class="text-xl text-gray-600 dark:text-gray-400">Chargement des matières...</p>
      </div>

      <!-- État vide -->
      <div v-else-if="filteredSubjects.length === 0" class="text-center py-16 bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700">
        <div class="bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-8">
          <svg class="w-16 h-16 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
          </svg>
        </div>
        <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {{ searchQuery || filterStatus || filterType ? 'Aucun résultat trouvé' : 'Aucune matière créée' }}
        </h3>
        <p class="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
          {{ searchQuery || filterStatus || filterType 
            ? 'Essayez de modifier vos critères de recherche ou de créer une nouvelle matière.' 
            : 'Commencez par créer votre première matière pour organiser l\'enseignement.' }}
        </p>
        <button
          v-if="!searchQuery && !filterStatus && !filterType"
          @click="openAddModal"
          class="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl text-lg"
        >
          Créer ma première matière
        </button>
      </div>

      <!-- Grille des matières -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        <div
          v-for="subject in filteredSubjects"
          :key="subject._id"
          class="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-300 group overflow-hidden"
        >
          <!-- Bande de couleur en haut -->
          <div 
            class="h-2"
            :style="`background: linear-gradient(90deg, ${subject.color || '#6366F1'}, ${adjustColor(subject.color || '#6366F1', 30)})`"
          ></div>
          
          <div class="p-8">
            <!-- En-tête avec avatar et actions -->
            <div class="flex items-start justify-between mb-6">
              <div class="flex items-center space-x-4">
                <div 
                  class="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg"
                  :style="`background: linear-gradient(135deg, ${subject.color || '#6366F1'}, ${adjustColor(subject.color || '#6366F1', -30)})`"
                >
                  {{ subject.code }}
                </div>
                <div>
                  <h3 class="font-bold text-xl text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {{ subject.name }}
                  </h3>
                  <div class="flex items-center space-x-3 mt-2">
                    <span 
                      class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                      :class="subject.status === 'active' 
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' 
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'"
                    >
                      <div 
                        class="w-2 h-2 rounded-full mr-2"
                        :class="subject.status === 'active' ? 'bg-emerald-500' : 'bg-gray-400'"
                      ></div>
                      {{ subject.status === 'active' ? 'Active' : 'Inactive' }}
                    </span>
                    <span class="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                      {{ getTypeLabel(subject.type) }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Menu d'actions -->
              <div class="relative">
                <button
                  @click="toggleMenu(subject._id)"
                  class="p-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
                  </svg>
                </button>

                <div
                  v-if="openMenuId === subject._id"
                  v-click-outside="() => openMenuId = null"
                  class="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-700 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-600 z-20 overflow-hidden"
                >
                  <button
                    @click="editSubject(subject)"
                    class="w-full px-6 py-4 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center transition-colors"
                  >
                    <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                    Modifier
                  </button>
                  <button
                    @click="duplicateSubject(subject)"
                    class="w-full px-6 py-4 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center transition-colors"
                  >
                    <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                    </svg>
                    Dupliquer
                  </button>
                  <hr class="border-gray-200 dark:border-gray-600">
                  <button
                    @click="deleteSubject(subject)"
                    class="w-full px-6 py-4 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center transition-colors"
                  >
                    <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                    Supprimer
                  </button>
                </div>
              </div>
            </div>

            <!-- Description -->
            <p v-if="subject.description" class="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
              {{ subject.description }}
            </p>

            <!-- Métriques de la matière -->
            <div class="grid grid-cols-3 gap-4 pt-6 border-t border-gray-100 dark:border-gray-600">
              <div class="text-center">
                <div class="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl mb-2">
                  <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ subject.credits || 1 }}</p>
                </div>
                <p class="text-sm text-gray-500 dark:text-gray-400 font-medium">Crédits</p>
              </div>
              <div class="text-center">
                <div class="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-xl mb-2">
                  <p class="text-2xl font-bold text-purple-600 dark:text-purple-400">{{ subject.hoursPerWeek || 0 }}</p>
                </div>
                <p class="text-sm text-gray-500 dark:text-gray-400 font-medium">H/Semaine</p>
              </div>
              <div class="text-center">
                <div class="bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-xl mb-2">
                  <p class="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{{ getTeacherCount(subject._id) }}</p>
                </div>
                <p class="text-sm text-gray-500 dark:text-gray-400 font-medium">Professeurs</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modaux -->
    <AddSubjectModal
      :show="showAddModal"
      :tenant-id="currentTenantId"
      :subject="selectedSubject"
      @close="closeModal"
      @created="onSubjectCreated"
      @updated="onSubjectUpdated"
    />

    <ConfirmModal
      :show="showDeleteModal"
      title="Supprimer la matière"
      :message="`Êtes-vous sûr de vouloir supprimer la matière '${subjectToDelete?.name}' ? Cette action est irréversible et affectera tous les professeurs assignés à cette matière.`"
      confirm-text="Supprimer définitivement"
      cancel-text="Annuler"
      type="danger"
      @confirm="confirmDelete"
      @cancel="showDeleteModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCurrentTenantStore } from '@/stores/currentTenantStore'
import { getSubjects, deleteSubject as deleteSubjectAPI, createSubject } from '@/services/academicService'
import AddSubjectModal from '@/components/academic/AddSubjectModal.vue'
import ConfirmModal from '@/components/common/ConfirmModal.vue'
import type { Subject } from '@/types/academic'

// Store, route et router
const currentTenantStore = useCurrentTenantStore()
const route = useRoute()
const router = useRouter()

// État
const loading = ref(false)
const subjects = ref<Subject[]>([])
const searchQuery = ref('')
const filterStatus = ref('')
const filterType = ref('')
const showAddModal = ref(false)
const showDeleteModal = ref(false)
const selectedSubject = ref<Subject | null>(null)
const subjectToDelete = ref<Subject | null>(null)
const openMenuId = ref<string | null>(null)

// Computed
const currentTenantId = computed(() => 
  route.params.tenantId as string || currentTenantStore.currentTenantId
)

// Détection si on doit afficher le bouton retour (si on a un tenantId dans l'URL)
const shouldShowBackButton = computed(() => !!route.params.tenantId)

// Nom du tenant pour l'affichage
const tenantName = computed(() => {
  // Essayer de récupérer le nom depuis les données de session ou l'URL
  if (route.params.tenantId) {
    // Récupérer depuis le localStorage ou une autre source
    const currentSchool = localStorage.getItem('currentSchool')
    if (currentSchool) {
      try {
        const school = JSON.parse(currentSchool)
        return school.name
      } catch (e) {
        // Ignore
      }
    }
    return `Établissement ${route.params.tenantId}`
  }
  return ''
})

// Fonction pour revenir en arrière
const goBack = () => {
  console.log('=== GoBack Function Called ===')
  console.log('Current route:', route)
  console.log('Route params:', route.params)
  console.log('Route name:', route.name)
  console.log('Route path:', route.path)
  
  try {
    const tenantId = route.params.tenantId as string
    console.log('Extracted tenantId:', tenantId, typeof tenantId)
    
    if (tenantId && tenantId !== 'undefined' && tenantId.trim() !== '') {
      // Retourner vers la page de détail du tenant
      const targetPath = `/tenant/${tenantId}`
      console.log('Navigating to tenant detail:', targetPath)
      router.push(targetPath).catch(err => {
        console.error('Router.push error:', err)
        // Fallback sur router.back si push échoue
        router.back()
      })
    } else {
      // Retour navigateur standard
      console.log('Using browser back - no valid tenantId')
      router.back()
    }
  } catch (error) {
    console.error('Erreur lors de la navigation retour:', error)
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack')
    
    // Fallback en cas d'erreur - essayer d'aller vers la gestion des comptes
    try {
      router.push('/admin/accounts')
    } catch (fallbackError) {
      console.error('Fallback navigation failed:', fallbackError)
      // En dernier recours, recharger la page vers l'accueil
      window.location.href = '/'
    }
  }
}

const filteredSubjects = computed(() => {
  let filtered = subjects.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(subject => 
      subject.name.toLowerCase().includes(query) ||
      subject.code.toLowerCase().includes(query) ||
      subject.description?.toLowerCase().includes(query)
    )
  }

  if (filterStatus.value) {
    filtered = filtered.filter(subject => subject.status === filterStatus.value)
  }

  if (filterType.value) {
    filtered = filtered.filter(subject => subject.type === filterType.value)
  }

  return filtered.sort((a, b) => a.name.localeCompare(b.name))
})

const activeSubjects = computed(() => 
  subjects.value.filter(s => s.status === 'active' || !s.status).length
)

const totalCredits = computed(() => 
  subjects.value.reduce((total, s) => total + (s.credits || 1), 0)
)

const totalHours = computed(() => 
  subjects.value.reduce((total, s) => total + (s.hoursPerWeek || 0), 0)
)

// Méthodes
const fetchSubjects = async () => {
  if (!currentTenantId.value) return

  loading.value = true
  try {
    subjects.value = await getSubjects(currentTenantId.value)
  } catch (error) {
    console.error('Erreur lors du chargement des matières:', error)
  } finally {
    loading.value = false
  }
}

const openAddModal = () => {
  selectedSubject.value = null
  showAddModal.value = true
}

const editSubject = (subject: Subject) => {
  selectedSubject.value = subject
  showAddModal.value = true
  openMenuId.value = null
}

const duplicateSubject = async (subject: Subject) => {
  try {
    const duplicatedData = {
      name: `${subject.name} (Copie)`,
      code: `${subject.code}_CP`,
      description: subject.description,
      credits: subject.credits,
      status: subject.status,
      color: subject.color,
      hoursPerWeek: subject.hoursPerWeek,
      type: subject.type
    }
    
    await createSubject(duplicatedData, currentTenantId.value)
    await fetchSubjects()
    openMenuId.value = null
  } catch (error) {
    console.error('Erreur lors de la duplication:', error)
    alert('Erreur lors de la duplication de la matière')
  }
}

const deleteSubject = (subject: Subject) => {
  subjectToDelete.value = subject
  showDeleteModal.value = true
  openMenuId.value = null
}

const confirmDelete = async () => {
  if (!subjectToDelete.value) return

  try {
    await deleteSubjectAPI(subjectToDelete.value._id, currentTenantId.value)
    await fetchSubjects()
    showDeleteModal.value = false
    subjectToDelete.value = null
  } catch (error) {
    console.error('Erreur lors de la suppression:', error)
    alert('Erreur lors de la suppression de la matière')
  }
}

const closeModal = () => {
  showAddModal.value = false
  selectedSubject.value = null
}

const onSubjectCreated = () => {
  fetchSubjects()
  closeModal()
}

const onSubjectUpdated = () => {
  fetchSubjects()
  closeModal()
}

const toggleMenu = (subjectId: string) => {
  openMenuId.value = openMenuId.value === subjectId ? null : subjectId
}

const exportSubjects = () => {
  const data = subjects.value.map(subject => ({
    Nom: subject.name,
    Code: subject.code,
    Description: subject.description || '',
    Crédits: subject.credits || 1,
    Statut: subject.status === 'active' ? 'Active' : 'Inactive',
    Type: getTypeLabel(subject.type),
    'Heures/Semaine': subject.hoursPerWeek || 0,
    Couleur: subject.color || ''
  }))
  
  console.log('Export des matières:', data)
  // Ici vous pourriez implémenter l'export CSV/Excel
}

const getTypeLabel = (type?: string) => {
  const labels = {
    theory: 'Théorique',
    practical: 'Pratique', 
    mixed: 'Mixte'
  }
  return labels[type as keyof typeof labels] || 'Non défini'
}

const getTeacherCount = (subjectId: string) => {
  return Math.floor(Math.random() * 5) + 1
}

const adjustColor = (color: string, amount: number) => {
  const usePound = color[0] === '#'
  const col = usePound ? color.slice(1) : color
  const num = parseInt(col, 16)
  let r = (num >> 16) + amount
  let g = (num >> 8 & 0x00FF) + amount
  let b = (num & 0x0000FF) + amount
  
  r = r > 255 ? 255 : r < 0 ? 0 : r
  g = g > 255 ? 255 : g < 0 ? 0 : g
  b = b > 255 ? 255 : b < 0 ? 0 : b
  
  return (usePound ? '#' : '') + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')
}

// Directive pour fermer le menu
const vClickOutside = {
  mounted(el: HTMLElement, binding: any) {
    el.clickOutsideEvent = (event: Event) => {
      if (!(el === event.target || el.contains(event.target as Node))) {
        binding.value()
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el: HTMLElement) {
    document.removeEventListener('click', el.clickOutsideEvent)
  }
}

// Lifecycle
watch(currentTenantId, fetchSubjects, { immediate: true })

onMounted(() => {
  if (currentTenantId.value) {
    fetchSubjects()
  }
})
</script> 