<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20">
    <!-- Header moderne avec glass effect -->
    <header class="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-white/20 dark:border-gray-700/30 shadow-lg shadow-blue-500/5">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-20">
          <!-- Navigation Breadcrumb -->
          <div class="flex items-center gap-3">
            <button 
              @click="$router.go(-1)"
              class="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all duration-200"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
              Retour
            </button>
            
            <div class="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <span>Établissements</span>
              <svg class="w-4 h-4 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
              <span v-if="currentSchool" class="text-gray-900 dark:text-white font-medium">{{ currentSchool.name }}</span>
              <span v-else class="animate-pulse bg-gray-200 dark:bg-gray-700 h-4 w-32 rounded"></span>
              <svg class="w-4 h-4 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
              <span class="text-green-600 dark:text-green-400 font-medium">Professeurs</span>
            </div>
          </div>

          <!-- Actions du header -->
          <div class="flex items-center gap-3">
            <div v-if="loadingSchool" class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <svg class="animate-spin w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              Chargement...
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Contenu principal -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <!-- En-tête de page avec statistiques -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl shadow-xl mb-6">
          <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
        </div>
        
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Gestion des Professeurs
        </h1>
        
        <p v-if="currentSchool" class="text-xl text-gray-600 dark:text-gray-400 mb-6">
          {{ currentSchool.name }}
        </p>
        
        <div v-if="!loadingSchool && currentSchool" class="inline-flex items-center gap-2 px-4 py-2 bg-green-100/80 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm font-medium">
          <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          Établissement actif
        </div>
      </div>

      <!-- Cartes de statistiques -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Total Professeurs -->
        <div class="group relative overflow-hidden rounded-3xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-white/20 dark:border-gray-700/30">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Professeurs</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white mt-2">{{ stats.total }}</p>
            </div>
            <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
            </div>
          </div>
          <div class="mt-4 flex items-center text-sm">
            <span class="text-green-600 dark:text-green-400">↗</span>
            <span class="text-green-600 dark:text-green-400 ml-1">Corps enseignant</span>
          </div>
        </div>

        <!-- Professeurs Actifs -->
        <div class="group relative overflow-hidden rounded-3xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-white/20 dark:border-gray-700/30">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Actifs</p>
              <p class="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">{{ stats.active }}</p>
            </div>
            <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
          <div class="mt-4 flex items-center text-sm">
            <span class="text-gray-500 dark:text-gray-400">En service</span>
          </div>
        </div>

        <!-- Nouveaux professeurs -->
        <div class="group relative overflow-hidden rounded-3xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-white/20 dark:border-gray-700/30">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Nouvelles recrues</p>
              <p class="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">{{ stats.recentHires }}</p>
            </div>
            <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
              </svg>
            </div>
          </div>
          <div class="mt-4 flex items-center text-sm">
            <span class="text-gray-500 dark:text-gray-400">30 derniers jours</span>
          </div>
        </div>

        <!-- Expérience moyenne -->
        <div class="group relative overflow-hidden rounded-3xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-white/20 dark:border-gray-700/30">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Exp. Moyenne</p>
              <p class="text-3xl font-bold text-purple-600 dark:text-purple-400 mt-2">{{ stats.averageExperience }} ans</p>
            </div>
            <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
          </div>
          <div class="mt-4 flex items-center text-sm">
            <span class="text-gray-500 dark:text-gray-400">Équipe expérimentée</span>
          </div>
        </div>
      </div>

      <!-- Section principale avec filtres et liste -->
      <div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/20 dark:border-gray-700/30">
        <!-- Header de section avec filtres -->
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          <div>
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
              Liste des Professeurs
            </h2>
            <p class="text-gray-600 dark:text-gray-400 mt-1">
              {{ filteredTeachers.length }} professeur(s) trouvé(s)
            </p>
          </div>
          
          <div class="flex flex-col sm:flex-row gap-4">
            <!-- Recherche -->
            <div class="relative">
              <svg class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Rechercher un professeur..."
                class="pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all w-64"
              />
            </div>
            
            <!-- Filtre par matière -->
            <select
              v-model="selectedSubjectFilter"
              class="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            >
              <option value="">Toutes les matières</option>
              <option v-for="subject in availableSubjects" :key="subject" :value="subject">
                {{ subject }}
              </option>
            </select>
            
            <!-- Bouton d'ajout -->
            <button
              @click="openAddModal"
              class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-medium"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
              Ajouter un professeur
            </button>
          </div>
        </div>

        <!-- Chargement -->
        <div v-if="loading" class="flex items-center justify-center py-12">
          <div class="text-center">
            <svg class="animate-spin w-10 h-10 text-green-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            <p class="text-gray-600 dark:text-gray-400">Chargement des professeurs...</p>
          </div>
        </div>

        <!-- Liste des professeurs en grille -->
        <div v-else-if="filteredTeachers.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="teacher in filteredTeachers"
            :key="teacher._id"
            class="group relative bg-white/80 dark:bg-gray-800/80 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200/50 dark:border-gray-700/50"
          >
            <!-- Avatar et informations principales -->
            <div class="flex items-start space-x-4 mb-4">
              <div class="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl">
                {{ teacher.firstName[0] }}{{ teacher.lastName[0] }}
              </div>
              
              <div class="flex-1 min-w-0">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white truncate">
                  {{ teacher.firstName }} {{ teacher.lastName }}
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-400 truncate">
                  {{ teacher.email }}
                </p>
                <div class="flex items-center mt-1">
                  <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                        :class="getStatusColor(teacher.status)">
                    {{ getStatusLabel(teacher.status) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Informations académiques -->
            <div class="space-y-2 mb-4">
              <div class="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                </svg>
                {{ teacher.subjects.slice(0, 2).join(', ') }}
                <span v-if="teacher.subjects.length > 2" class="text-gray-400">
                  (+{{ teacher.subjects.length - 2 }})
                </span>
              </div>
              
              <div class="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                Depuis {{ formatDate(teacher.hireDate) }}
              </div>
              
              <div v-if="teacher.experience" class="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
                {{ teacher.experience }} ans d'expérience
              </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <div class="flex space-x-2">
                <button
                  @click="viewTeacher(teacher)"
                  class="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                  title="Voir les détails"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                </button>
                
                <button
                  @click="editTeacher(teacher)"
                  class="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                  title="Modifier"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                  </svg>
                </button>
                
                <button
                  @click="deleteTeacher(teacher)"
                  class="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  title="Supprimer"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                </button>
              </div>
              
              <span class="text-xs text-gray-500 dark:text-gray-400">
                ID: {{ teacher.employeeNumber || teacher._id?.slice(-8) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Message si aucun professeur -->
        <div v-else class="text-center py-12">
          <div class="inline-flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full mb-6">
            <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Aucun professeur trouvé
          </h3>
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            {{ searchQuery ? 'Aucun résultat pour votre recherche.' : 'Commencez par ajouter votre premier professeur.' }}
          </p>
          <button
            v-if="!searchQuery"
            @click="openAddModal"
            class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-medium"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
            Ajouter le premier professeur
          </button>
        </div>
      </div>
      
      <!-- Modals -->
      <AddTeacherModal
        :show="showAddModal"
        :tenant-id="tenantId"
        @close="showAddModal = false"
        @created="onTeacherCreated"
      />
      
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import type { Teacher } from '@/types/teacher'
import AddTeacherModal from '@/components/teachers/AddTeacherModal.vue'
import { fetchTeachers, createTeacher } from '@/services/teacherService'

interface School {
  _id: string
  name: string
  [key: string]: any
}

const route = useRoute()

// État local
const teachers = ref<Teacher[]>([])
const currentSchool = ref<School | null>(null)
const loading = ref(false)
const loadingSchool = ref(false)
const searchQuery = ref('')
const selectedSubjectFilter = ref('')

// États des modals
const showAddModal = ref(false)

// Récupérer l'ID du tenant depuis les paramètres de route
const tenantId = computed(() => route.params.tenantId as string)

// Matières disponibles pour le filtre
const availableSubjects = ref([
  'Mathématiques',
  'Français',
  'Anglais',
  'Histoire-Géographie',
  'Sciences Physiques',
  'Sciences de la Vie et de la Terre',
  'Éducation Physique et Sportive',
  'Arts Plastiques',
  'Musique',
  'Technologie'
])

// Professeurs filtrés
const filteredTeachers = computed(() => {
  let filtered = teachers.value

  // Filtre par recherche
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(teacher =>
      teacher.firstName.toLowerCase().includes(query) ||
      teacher.lastName.toLowerCase().includes(query) ||
      teacher.email.toLowerCase().includes(query) ||
      teacher.subjects.some(subject => subject.toLowerCase().includes(query))
    )
  }

  // Filtre par matière
  if (selectedSubjectFilter.value) {
    filtered = filtered.filter(teacher =>
      teacher.subjects.includes(selectedSubjectFilter.value)
    )
  }

  return filtered
})

// Statistiques temporaires (à remplacer par de vraies données)
const stats = computed(() => ({
  total: teachers.value.length,
  active: teachers.value.filter(t => t.status === 'active').length,
  inactive: teachers.value.filter(t => t.status === 'inactive').length,
  onLeave: teachers.value.filter(t => t.status === 'on_leave').length,
  recentHires: teachers.value.filter(t => {
    const hireDate = new Date(t.hireDate)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    return hireDate >= thirtyDaysAgo
  }).length,
  averageExperience: teachers.value.length > 0 
    ? Math.round(teachers.value.reduce((sum, t) => sum + (t.experience || 0), 0) / teachers.value.length)
    : 0
}))

// Fonctions utilitaires
const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
    case 'inactive':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    case 'on_leave':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
    case 'terminated':
      return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
  }
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'active': return 'Actif'
    case 'inactive': return 'Inactif'
    case 'on_leave': return 'En congé'
    case 'terminated': return 'Licencié'
    default: return 'Non défini'
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', { 
    year: 'numeric', 
    month: 'long'
  })
}

// Actions
const openAddModal = () => {
  showAddModal.value = true
}

const viewTeacher = (teacher: Teacher) => {
  console.log('Voir professeur:', teacher)
}

const editTeacher = (teacher: Teacher) => {
  console.log('Modifier professeur:', teacher)
}

const deleteTeacher = (teacher: Teacher) => {
  console.log('Supprimer professeur:', teacher)
}

// Gestionnaires d'événements des modals
const onTeacherCreated = async (teacherData: any) => {
  console.log('Nouveau professeur à créer:', teacherData)
  
  try {
    const createdTeacher = await createTeacher(teacherData, tenantId.value)
    console.log('Professeur créé avec succès:', createdTeacher)
    
    // Recharger la liste des professeurs
    await loadTeachers()
    showAddModal.value = false
  } catch (error) {
    console.error('Erreur lors de la création:', error)
    alert(`Erreur lors de la création du professeur: ${error.message}`)
  }
}

// Lifecycle
onMounted(async () => {
  console.log('Page de gestion des professeurs chargée pour l\'établissement:', tenantId.value)
  
  // Valeur temporaire pour currentSchool
  currentSchool.value = {
    _id: tenantId.value,
    name: 'École Exemple'
  }
  
  // Charger les professeurs depuis l'API
  await loadTeachers()
})

// Fonction pour charger les professeurs
const loadTeachers = async () => {
  loading.value = true
  try {
    const response = await fetchTeachers(tenantId.value)
    teachers.value = response.teachers || []
    console.log('Professeurs chargés:', teachers.value.length)
  } catch (error) {
    console.warn('Erreur lors du chargement des professeurs:', error)
    teachers.value = []
  } finally {
    loading.value = false
  }
}
</script>
