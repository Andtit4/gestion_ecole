<template>
  <div class="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700">
    <!-- En-tête moderne -->
    <div class="flex items-center justify-between mb-8">
      <div class="flex items-center space-x-4">
        <div class="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 rounded-2xl shadow-lg">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
          </svg>
        </div>
        <div>
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Matières</h3>
          <p class="text-gray-600 dark:text-gray-400">Gestion rapide des matières</p>
        </div>
      </div>
      <div v-if="!loading && subjects.length > 0" class="text-right">
        <p class="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{{ subjects.length }}</p>
        <p class="text-sm text-gray-500 dark:text-gray-400">Total</p>
      </div>
    </div>

    <!-- Métriques compactes -->
    <div v-if="!loading && subjects.length > 0" class="grid grid-cols-3 gap-6 mb-8">
      <div class="text-center bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl p-4">
        <div class="bg-emerald-100 dark:bg-emerald-900/50 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
          <svg class="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <p class="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{{ activeSubjects }}</p>
        <p class="text-sm text-gray-600 dark:text-gray-400 font-medium">Actives</p>
      </div>

      <div class="text-center bg-purple-50 dark:bg-purple-900/20 rounded-2xl p-4">
        <div class="bg-purple-100 dark:bg-purple-900/50 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
          <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
          </svg>
        </div>
        <p class="text-2xl font-bold text-purple-600 dark:text-purple-400">{{ totalCredits }}</p>
        <p class="text-sm text-gray-600 dark:text-gray-400 font-medium">Crédits</p>
      </div>

      <div class="text-center bg-orange-50 dark:bg-orange-900/20 rounded-2xl p-4">
        <div class="bg-orange-100 dark:bg-orange-900/50 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
          <svg class="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <p class="text-2xl font-bold text-orange-600 dark:text-orange-400">{{ totalCredits * 2 }}</p>
        <p class="text-sm text-gray-600 dark:text-gray-400 font-medium">H/Semaine</p>
      </div>
    </div>

    <!-- Actions principales -->
    <div class="space-y-6 mb-8">
      <h4 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
        <svg class="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
        </svg>
        Actions Rapides
      </h4>

      <div class="grid grid-cols-1 gap-4">
        <!-- Nouvelle matière -->
        <button
          @click="openAddModal"
          class="group bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white p-6 rounded-2xl transition-all duration-300 hover:shadow-xl flex items-center justify-between"
        >
          <div class="flex items-center space-x-4">
            <div class="bg-white/20 p-3 rounded-xl">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
            </div>
            <div class="text-left">
              <p class="font-semibold text-lg">Nouvelle Matière</p>
              <p class="text-white/80 text-sm">Créer une matière personnalisée</p>
            </div>
          </div>
          <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </button>

        <!-- Matières par défaut -->
        <button
          @click="createDefaultSubjects"
          :disabled="loading"
          class="group bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border-2 border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-600 text-gray-700 dark:text-gray-300 p-6 rounded-2xl transition-all duration-300 flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div class="flex items-center space-x-4">
            <div class="bg-indigo-100 dark:bg-indigo-900/50 p-3 rounded-xl">
              <svg v-if="loading" class="w-6 h-6 animate-spin text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <svg v-else class="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
              </svg>
            </div>
            <div class="text-left">
              <p class="font-semibold text-lg">{{ loading ? 'Création...' : 'Matières par Défaut' }}</p>
              <p class="text-gray-500 dark:text-gray-400 text-sm">10 matières pré-configurées</p>
            </div>
          </div>
          <svg v-if="!loading" class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </button>

        <!-- Gestion complète -->
        <button
          @click="navigateToSubjects"
          class="group bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border-2 border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-600 text-gray-700 dark:text-gray-300 p-6 rounded-2xl transition-all duration-300 flex items-center justify-between"
        >
          <div class="flex items-center space-x-4">
            <div class="bg-purple-100 dark:bg-purple-900/50 p-3 rounded-xl">
              <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
            </div>
            <div class="text-left">
              <p class="font-semibold text-lg">Gestion Complète</p>
              <p class="text-gray-500 dark:text-gray-400 text-sm">Voir toutes les matières</p>
            </div>
          </div>
          <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- État de chargement -->
    <div v-if="loading && subjects.length === 0" class="text-center py-12">
      <div class="bg-indigo-100 dark:bg-indigo-900/50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
        <div class="animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent"></div>
      </div>
      <p class="text-gray-600 dark:text-gray-400">Chargement des matières...</p>
    </div>

    <!-- État vide avec design moderne -->
    <div v-else-if="!loading && subjects.length === 0" class="text-center py-12">
      <div class="bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
        <svg class="w-12 h-12 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
        </svg>
      </div>
      <h4 class="text-xl font-bold text-gray-900 dark:text-white mb-3">Aucune matière</h4>
      <p class="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
        Commencez par créer des matières pour organiser l'enseignement dans votre établissement.
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          @click="openAddModal"
          class="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-2xl font-medium transition-all duration-300 hover:shadow-lg"
        >
          Créer une Matière
        </button>
        <button
          @click="createDefaultSubjects"
          class="bg-white dark:bg-gray-700 border-2 border-indigo-200 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300 px-6 py-3 rounded-2xl font-medium transition-all duration-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
        >
          Matières par Défaut
        </button>
      </div>
    </div>

    <!-- Liste des matières récentes avec design moderne -->
    <div v-else-if="subjects.length > 0" class="space-y-6">
      <div class="flex items-center justify-between">
        <h4 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <svg class="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
          </svg>
          Matières Récentes
        </h4>
        <router-link
          to="/subjects"
          class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium flex items-center text-sm"
        >
          Voir tout
          <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </router-link>
      </div>

      <div class="space-y-3">
        <div
          v-for="subject in recentSubjects"
          :key="subject._id"
          class="bg-gray-50 dark:bg-gray-700 rounded-2xl p-4 hover:shadow-md transition-all duration-300 group border border-gray-100 dark:border-gray-600"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div 
                class="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md"
                :style="`background: linear-gradient(135deg, ${subject.color || '#6366F1'}, ${adjustColor(subject.color || '#6366F1', -20)})`"
              >
                {{ subject.code }}
              </div>
              <div>
                <h5 class="font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {{ subject.name }}
                </h5>
                <div class="flex items-center space-x-3 mt-1">
                  <span class="text-sm text-gray-500 dark:text-gray-400">
                    {{ subject.credits || 1 }} crédit(s)
                  </span>
                  <span v-if="subject.status" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium" 
                    :class="subject.status === 'active' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'">
                    <div 
                      class="w-1.5 h-1.5 rounded-full mr-1"
                      :class="subject.status === 'active' ? 'bg-emerald-500' : 'bg-gray-400'"
                    ></div>
                    {{ subject.status === 'active' ? 'Active' : 'Inactive' }}
                  </span>
                </div>
              </div>
            </div>
            <svg class="w-5 h-5 text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal d'ajout de matière -->
    <AddSubjectModal
      :show="showAddModal"
      :tenant-id="tenantId"
      @close="showAddModal = false"
      @created="onSubjectCreated"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { getSubjects, createSubject } from '@/services/academicService'
import type { Subject } from '@/types/academic'
import AddSubjectModal from './AddSubjectModal.vue'

interface Props {
  tenantId: string
}

const props = defineProps<Props>()
const router = useRouter()

const loading = ref(false)
const error = ref('')
const subjects = ref<Subject[]>([])
const showAddModal = ref(false)

// Matières par défaut
const defaultSubjects = [
  { name: 'Mathématiques', code: 'MATH', color: '#3B82F6', credits: 4, description: 'Mathématiques générales et appliquées', status: 'active', type: 'theory', hoursPerWeek: 5 },
  { name: 'Français', code: 'FR', color: '#10B981', credits: 4, description: 'Langue et littérature françaises', status: 'active', type: 'theory', hoursPerWeek: 4 },
  { name: 'Histoire-Géographie', code: 'HG', color: '#F59E0B', credits: 3, description: 'Histoire et géographie', status: 'active', type: 'theory', hoursPerWeek: 3 },
  { name: 'Sciences Physiques', code: 'PHY', color: '#8B5CF6', credits: 3, description: 'Physique et chimie', status: 'active', type: 'mixed', hoursPerWeek: 4 },
  { name: 'SVT', code: 'SVT', color: '#EF4444', credits: 2, description: 'Sciences de la vie et de la terre', status: 'active', type: 'mixed', hoursPerWeek: 3 },
  { name: 'Anglais', code: 'ANG', color: '#06B6D4', credits: 3, description: 'Langue anglaise', status: 'active', type: 'theory', hoursPerWeek: 3 },
  { name: 'EPS', code: 'EPS', color: '#84CC16', credits: 2, description: 'Éducation physique et sportive', status: 'active', type: 'practical', hoursPerWeek: 2 },
  { name: 'Arts Plastiques', code: 'ART', color: '#F97316', credits: 1, description: 'Arts visuels et plastiques', status: 'active', type: 'practical', hoursPerWeek: 2 },
  { name: 'Musique', code: 'MUS', color: '#EC4899', credits: 1, description: 'Éducation musicale', status: 'active', type: 'practical', hoursPerWeek: 1 },
  { name: 'Technologie', code: 'TECH', color: '#6B7280', credits: 2, description: 'Sciences et technologie', status: 'active', type: 'mixed', hoursPerWeek: 3 }
]

// Computed
const activeSubjects = computed(() => subjects.value.filter(s => s.status === 'active' || !s.status).length)
const totalCredits = computed(() => subjects.value.reduce((total, s) => total + (s.credits || 1), 0))
const recentSubjects = computed(() => subjects.value.slice(0, 4))

// Méthodes
const fetchSubjects = async () => {
  if (!props.tenantId) return

  loading.value = true
  error.value = ''
  
  try {
    subjects.value = await getSubjects(props.tenantId)
  } catch (err) {
    console.error('Erreur lors du chargement des matières:', err)
    error.value = 'Erreur lors du chargement des matières'
    subjects.value = []
  } finally {
    loading.value = false
  }
}

const createDefaultSubjects = async () => {
  if (!props.tenantId) return

  loading.value = true
  error.value = ''

  try {
    for (const subjectData of defaultSubjects) {
      try {
        await createSubject(subjectData, props.tenantId)
      } catch (err) {
        console.warn(`Matière ${subjectData.name} déjà existante ou erreur:`, err)
      }
    }
    
    await fetchSubjects()
    alert('Matières par défaut créées avec succès!')
  } catch (err) {
    console.error('Erreur lors de la création des matières par défaut:', err)
    error.value = 'Erreur lors de la création des matières par défaut'
  } finally {
    loading.value = false
  }
}

const openAddModal = () => {
  showAddModal.value = true
}

const onSubjectCreated = () => {
  fetchSubjects()
  showAddModal.value = false
}

const navigateToSubjects = () => {
  router.push('/subjects')
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

// Watchers
watch(() => props.tenantId, fetchSubjects, { immediate: true })

// Lifecycle
onMounted(() => {
  if (props.tenantId) {
    fetchSubjects()
  }
})
</script> 