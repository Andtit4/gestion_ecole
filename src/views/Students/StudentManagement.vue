<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20">
    <!-- Header moderne avec glass effect -->
    <header class="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-white/20 dark:border-gray-700/30 shadow-lg shadow-blue-500/5">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Navigation avec breadcrumb moderne -->
          <div class="flex items-center space-x-4">
            <button 
              @click="$router.go(-1)"
              class="p-2 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group"
            >
              <svg class="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
            </button>
            <div>
              <h1 class="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Gestion des Élèves
              </h1>
                             <p class="text-sm text-blue-600 dark:text-blue-400">{{ tenantStore.selectedTenant?.name || 'Établissement' }}</p>
            </div>
          </div>

          <!-- Actions en-tête -->
          <div class="flex items-center space-x-3">
            <button
              @click="refreshData"
              :disabled="loading"
              class="p-2 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group"
            >
              <svg class="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" 
                   :class="{ 'animate-spin': loading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
            </button>
            
            <button
              @click="showCreateModal = true"
              :disabled="!tenantStore.currentTenantId"
              class="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
              Nouvel Élève
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Sélecteur de Tenant moderne -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      <TenantSelector />
    </div>

    <!-- Contenu principal -->
    <main class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      
      <!-- Statistiques avec design moderne -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="group relative overflow-hidden rounded-3xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-white/20 dark:border-gray-700/30">
          <!-- Gradient background -->
          <div class="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-br from-blue-500 to-indigo-600"></div>
          
          <div class="relative z-10">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 rounded-2xl shadow-lg transform group-hover:scale-110 transition-transform duration-200 bg-blue-100 dark:bg-blue-900/30">
                <svg class="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
                </svg>
              </div>
              <span class="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                +12
              </span>
            </div>
            
            <div class="space-y-2">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Élèves</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ stats.total }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">Inscrits cette année</p>
            </div>
          </div>
        </div>

        <div class="group relative overflow-hidden rounded-3xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-white/20 dark:border-gray-700/30">
          <div class="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-br from-green-500 to-emerald-600"></div>
          
          <div class="relative z-10">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 rounded-2xl shadow-lg transform group-hover:scale-110 transition-transform duration-200 bg-green-100 dark:bg-green-900/30">
                <svg class="h-6 w-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <span class="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                +8
              </span>
            </div>
            
            <div class="space-y-2">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Élèves Actifs</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ stats.active }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">Présents aujourd'hui</p>
            </div>
          </div>
        </div>

        <div class="group relative overflow-hidden rounded-3xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-white/20 dark:border-gray-700/30">
          <div class="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-br from-orange-500 to-red-600"></div>
          
          <div class="relative z-10">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 rounded-2xl shadow-lg transform group-hover:scale-110 transition-transform duration-200 bg-orange-100 dark:bg-orange-900/30">
                <svg class="h-6 w-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                </svg>
              </div>
              <span class="text-xs font-medium px-2 py-1 rounded-full bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400">
                -2
              </span>
            </div>
            
            <div class="space-y-2">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Élèves Inactifs</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ stats.inactive }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">Nécessitent attention</p>
            </div>
          </div>
        </div>

        <div class="group relative overflow-hidden rounded-3xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-white/20 dark:border-gray-700/30">
          <div class="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-br from-purple-500 to-pink-600"></div>
          
          <div class="relative z-10">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 rounded-2xl shadow-lg transform group-hover:scale-110 transition-transform duration-200 bg-purple-100 dark:bg-purple-900/30">
                <svg class="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
              </div>
            </div>
            
            <div class="space-y-2">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Classes</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ Object.keys(stats.byClass).length }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">Niveaux disponibles</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions rapides et filtres modernisés -->
      <div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/30 overflow-hidden">
        <div class="p-8">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Liste des Élèves</h3>
              <p class="text-gray-500 dark:text-gray-400">{{ filteredStudents.length }} élève(s) trouvé(s)</p>
            </div>
            <button class="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm">
              Exporter →
            </button>
          </div>
          
          <!-- Filtres avec design moderne -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Rechercher un élève..."
                class="w-full pl-10 pr-4 py-3 rounded-2xl border-0 bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-700 transition-all duration-200"
              />
            </div>
            
            <select
              v-model="selectedClass"
              class="w-full px-4 py-3 rounded-2xl border-0 bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-700 transition-all duration-200"
            >
              <option value="">Toutes les classes</option>
              <option v-for="className in availableClasses" :key="className" :value="className">{{ className }}</option>
            </select>
            
            <select
              v-model="selectedStatus"
              class="w-full px-4 py-3 rounded-2xl border-0 bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-700 transition-all duration-200"
            >
              <option value="">Tous les statuts</option>
              <option value="active">Actif</option>
              <option value="inactive">Inactif</option>
              <option value="transferred">Transféré</option>
              <option value="graduated">Diplômé</option>
            </select>

            <button
              @click="clearFilters"
              class="px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 font-medium"
            >
              Effacer filtres
            </button>
          </div>
        </div>
      </div>

      <!-- Liste des élèves avec cards modernes -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="student in filteredStudents"
          :key="student._id"
          class="group relative overflow-hidden rounded-3xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-white/20 dark:border-gray-700/30"
        >
          <!-- Header de l'étudiant -->
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-semibold shadow-lg">
                {{ getStudentInitials(student) }}
              </div>
              <div>
                <h3 class="font-semibold text-gray-900 dark:text-white">
                  {{ student.firstName }} {{ student.lastName }}
                </h3>
                                 <p class="text-sm text-gray-500 dark:text-gray-400">{{ student.studentNumber }}</p>
              </div>
            </div>
            
                         <span :class="getStatusBadgeClass(student.academicInfo.status)" class="px-3 py-1 text-xs font-medium rounded-full">
               {{ getStatusLabel(student.academicInfo.status) }}
             </span>
          </div>

          <!-- Informations de l'étudiant -->
          <div class="space-y-3 mb-4">
            <div class="flex items-center gap-2 text-sm">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h4"/>
              </svg>
                             <span class="text-gray-700 dark:text-gray-300">{{ student.academicInfo.className || 'Non assigné' }}</span>
             </div>

             <div class="flex items-center gap-2 text-sm">
               <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 9l6-6m-6 6l6 6"/>
               </svg>
               <span class="text-gray-700 dark:text-gray-300">{{ calculateAge(student.dateOfBirth) }} ans</span>
             </div>

             <div v-if="student.parentContact?.guardianEmail" class="flex items-center gap-2 text-sm">
               <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
               </svg>
               <span class="text-gray-700 dark:text-gray-300">{{ student.parentContact.guardianEmail }}</span>
             </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-2 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
            <button
              @click="viewStudent(student)"
              class="flex-1 inline-flex items-center justify-center px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-xl text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
              </svg>
              Voir
            </button>
            
            <button
              @click="editStudent(student)"
              class="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 dark:text-gray-400 dark:hover:text-blue-400 dark:hover:bg-blue-900/20 rounded-xl transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5M17.5 2.5a2.121 2.121 0 013 3L12 14l-4 1 1-4z"/>
              </svg>
            </button>
            
            <button
              @click="deleteStudent(student)"
              class="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-red-900/20 rounded-xl transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Card vide si aucun élève -->
        <div v-if="!filteredStudents.length" class="col-span-full">
          <div class="text-center py-12 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/30">
            <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
            </svg>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Aucun élève trouvé</h3>
            <p class="text-gray-500 dark:text-gray-400 mb-4">
              {{ !tenantStore.currentTenantId ? 'Sélectionnez un établissement pour voir les élèves' : 'Commencez par créer un nouvel élève.' }}
            </p>
            <button
              v-if="tenantStore.currentTenantId"
              @click="showCreateModal = true"
              class="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
              Créer un élève
            </button>
          </div>
        </div>
      </div>
    </main>

         <!-- Modal de création -->
     <AddStudentModal
       :isOpen="showCreateModal"
       @close="showCreateModal = false"
       @submit="onStudentCreated"
     />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useCurrentTenantStore } from '@/stores/currentTenantStore'
import { fetchStudents, deleteStudent as deleteStudentApi, createStudent } from '@/services/studentService'
import type { Student, CreateStudentDto } from '@/types/student'
import TenantSelector from '@/components/tenant/TenantSelector.vue'
import AddStudentModal from '@/components/forms/AddStudentModal.vue'

const tenantStore = useCurrentTenantStore()

// État local
const students = ref<Student[]>([])
const loading = ref(false)
const showCreateModal = ref(false)

// Filtres
const searchQuery = ref('')
const selectedClass = ref('')
const selectedStatus = ref('')

 // Computed properties
 const filteredStudents = computed(() => {
   let filtered = students.value
 
   if (searchQuery.value) {
     const search = searchQuery.value.toLowerCase()
     filtered = filtered.filter(student =>
       student.firstName?.toLowerCase().includes(search) ||
       student.lastName?.toLowerCase().includes(search) ||
       student.studentNumber?.toLowerCase().includes(search) ||
       student.parentContact?.guardianEmail?.toLowerCase().includes(search)
     )
   }
 
   if (selectedClass.value) {
     filtered = filtered.filter(student => student.academicInfo.className === selectedClass.value)
   }
 
   if (selectedStatus.value) {
     filtered = filtered.filter(student => student.academicInfo.status === selectedStatus.value)
   }
 
   return filtered
 })
 
 const stats = computed(() => {
   const total = students.value.length
   const active = students.value.filter(s => s.academicInfo.status === 'active').length
   const inactive = students.value.filter(s => s.academicInfo.status === 'inactive').length
   
   const byClass = students.value.reduce((acc, student) => {
     if (student.academicInfo.className) {
       acc[student.academicInfo.className] = (acc[student.academicInfo.className] || 0) + 1
     }
     return acc
   }, {} as Record<string, number>)
 
   const byGender = students.value.reduce((acc, student) => {
     if (student.gender) {
       acc[student.gender] = (acc[student.gender] || 0) + 1
     }
     return acc
   }, {} as Record<string, number>)
 
   return { total, active, inactive, byClass, byGender }
 })
 
 const availableClasses = computed(() => {
   const classes = [...new Set(students.value.map(s => s.academicInfo.className).filter(Boolean))]
   return classes.sort()
 })

// Méthodes utilitaires
function getStudentInitials(student: Student): string {
  return `${student.firstName?.charAt(0) || ''}${student.lastName?.charAt(0) || ''}`.toUpperCase()
}

function getStatusBadgeClass(status: string): string {
  const classes = {
    'active': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    'inactive': 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
    'transferred': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    'graduated': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
  }
  return classes[status as keyof typeof classes] || classes.inactive
}

function getStatusLabel(status: string): string {
  const labels = {
    'active': 'Actif',
    'inactive': 'Inactif',
    'transferred': 'Transféré',
    'graduated': 'Diplômé'
  }
  return labels[status as keyof typeof labels] || 'Inconnu'
}

function calculateAge(dateOfBirth: string): number {
  if (!dateOfBirth) return 0
  const today = new Date()
  const birthDate = new Date(dateOfBirth)
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age
}

// Actions
async function refreshData() {
  if (!tenantStore.currentTenantId) return

  loading.value = true
  try {
    const response = await fetchStudents(tenantStore.currentTenantId)
    students.value = response.students || []
  } catch (error) {
    console.error('Erreur lors du chargement des élèves:', error)
    alert('Erreur lors du chargement des élèves')
  } finally {
    loading.value = false
  }
}

function clearFilters() {
  searchQuery.value = ''
  selectedClass.value = ''
  selectedStatus.value = ''
}

function viewStudent(student: Student) {
  console.log('Voir élève:', student)
  // TODO: Implémenter la vue détaillée
}

function editStudent(student: Student) {
  console.log('Modifier élève:', student)
  // TODO: Implémenter la modification
}

async function deleteStudent(student: Student) {
  if (!tenantStore.currentTenantId) return

  if (confirm(`Êtes-vous sûr de vouloir supprimer l'élève ${student.firstName} ${student.lastName} ?`)) {
    try {
      await deleteStudentApi(student._id, tenantStore.currentTenantId)
      students.value = students.value.filter(s => s._id !== student._id)
      alert('Élève supprimé avec succès')
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
      alert('Erreur lors de la suppression de l\'élève')
    }
  }
}

async function onStudentCreated(studentData: CreateStudentDto) {
  console.log('Création d\'élève avec les données:', studentData)
  
  if (!tenantStore.currentTenantId) {
    alert('Erreur: Aucun établissement sélectionné')
    return
  }

  try {
    loading.value = true
    
    // Appeler l'API pour créer l'élève
    const newStudent = await createStudent(studentData, tenantStore.currentTenantId)
    console.log('Élève créé avec succès:', newStudent)
    
    // Fermer le modal
    showCreateModal.value = false
    
    // Recharger la liste des élèves
    await refreshData()
    
    alert('Élève créé avec succès !')
  } catch (error) {
    console.error('Erreur lors de la création de l\'élève:', error)
    alert(`Erreur lors de la création de l'élève: ${error instanceof Error ? error.message : 'Erreur inconnue'}`)
  } finally {
    loading.value = false
  }
}

// Watcher pour recharger les données quand le tenant change
watch(() => tenantStore.currentTenantId, (newTenantId) => {
  if (newTenantId) {
    refreshData()
  } else {
    students.value = []
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