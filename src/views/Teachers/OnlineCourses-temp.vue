<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
    <!-- Header moderne -->
    <header class="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-white/20 dark:border-gray-700/30 shadow-lg shadow-blue-500/5">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-20">
          <div class="flex items-center gap-3">
            <button 
              @click="$router.go(-1)"
              class="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
              Retour
            </button>
            <span class="text-gray-400 dark:text-gray-500">/</span>
            <span class="text-gray-900 dark:text-white font-medium">Cours en Ligne</span>
          </div>

          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
              </svg>
            </div>
            <div>
              <h1 class="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">Cours en Ligne</h1>
              <p class="text-sm text-blue-600 dark:text-blue-400">Vidéoconférence et enseignement à distance</p>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Contenu principal -->
    <main class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      
      <!-- Actions rapides -->
      <div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/30 overflow-hidden">
        <div class="p-8">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Actions Rapides</h3>
              <p class="text-gray-500 dark:text-gray-400">Gérez vos cours en ligne</p>
            </div>
            <button
              @click="createNewCourse"
              class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
              Nouveau Cours en Ligne
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Démarrer cours immédiat -->
            <button
              @click="startImmediateCourse"
              class="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 p-6 text-left shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-green-200 dark:border-green-800/30"
            >
              <div class="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div class="relative z-10">
                <div class="mb-4">
                  <div class="p-3 rounded-xl bg-green-100 dark:bg-green-900/30 w-fit group-hover:scale-110 transition-transform duration-200">
                    <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m2-10v18a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2h8l4 4z"/>
                    </svg>
                  </div>
                </div>
                <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Cours Immédiat</h4>
                <p class="text-sm text-gray-600 dark:text-gray-400">Démarrer un cours maintenant sans planification</p>
              </div>
            </button>

            <!-- Rejoindre cours en direct -->
            <button
              @click="handleJoinCourse"
              class="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-900/20 dark:to-violet-900/20 p-6 text-left shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-purple-200 dark:border-purple-800/30"
            >
              <div class="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-violet-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div class="relative z-10">
                <div class="mb-4">
                  <div class="p-3 rounded-xl bg-purple-100 dark:bg-purple-900/30 w-fit group-hover:scale-110 transition-transform duration-200">
                    <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                    </svg>
                  </div>
                </div>
                <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Rejoindre un Cours</h4>
                <p class="text-sm text-gray-600 dark:text-gray-400">Participer à un cours en direct en tant qu'invité</p>
              </div>
            </button>

            <!-- Test Jitsi Meet -->
            <button
              @click="testJitsiMeet"
              class="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-50 to-red-100 dark:from-orange-900/20 dark:to-red-900/20 p-6 text-left shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-orange-200 dark:border-orange-800/30"
            >
              <div class="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div class="relative z-10">
                <div class="mb-4">
                  <div class="p-3 rounded-xl bg-orange-100 dark:bg-orange-900/30 w-fit group-hover:scale-110 transition-transform duration-200">
                    <svg class="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
                    </svg>
                  </div>
                </div>
                <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Test Jitsi Meet</h4>
                <p class="text-sm text-gray-600 dark:text-gray-400">Tester la connexion vidéo</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      <!-- Informations -->
      <div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/30 p-8">
        <div class="text-center">
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Plateforme de Cours en Ligne</h3>
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            Créez et gérez vos cours en ligne avec la technologie Jitsi Meet. 
            Profitez de la vidéoconférence haute qualité pour vos élèves.
          </p>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div class="text-center">
              <div class="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                </svg>
              </div>
              <h4 class="font-semibold text-gray-900 dark:text-white">Vidéoconférence HD</h4>
              <p class="text-sm text-gray-600 dark:text-gray-400">Qualité vidéo et audio optimale</p>
            </div>

            <div class="text-center">
              <div class="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
                </svg>
              </div>
              <h4 class="font-semibold text-gray-900 dark:text-white">Multi-participants</h4>
              <p class="text-sm text-gray-600 dark:text-gray-400">Jusqu'à 50 participants simultanés</p>
            </div>

            <div class="text-center">
              <div class="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                </svg>
              </div>
              <h4 class="font-semibold text-gray-900 dark:text-white">Sécurisé</h4>
              <p class="text-sm text-gray-600 dark:text-gray-400">Connexions chiffrées end-to-end</p>
            </div>
          </div>
        </div>
      </div>
      
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useCurrentTenantStore } from '@/stores/currentTenantStore'
import onlineCourseService from '@/services/onlineCourseService'

// Route and store
const route = useRoute()
const currentTenantStore = useCurrentTenantStore()
const tenantId = computed(() => currentTenantStore.currentTenantId || route.params.tenantId as string || '')

// Fonction pour créer un nouveau cours
const createNewCourse = async () => {
  const courseName = prompt('Nom du cours:')
  if (!courseName) return
  
  const courseSubject = prompt('Matière:', 'Mathématiques')
  if (!courseSubject) return
  
  const className = prompt('Classe:', '6ème A')
  if (!className) return
  
  try {
    // Créer une URL de meeting temporaire pour test
    const meetingUrl = `https://meet.jit.si/course-${courseName.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`
    
    // Ouvrir directement Jitsi Meet
    onlineCourseService.openMeeting(meetingUrl, 'Professeur')
    
    console.log('✅ Nouveau cours créé et démarré:', courseName)
    
  } catch (error) {
    console.error('❌ Erreur lors de la création du cours:', error)
    alert('Erreur lors de la création du cours: ' + error.message)
  }
}

const startImmediateCourse = async () => {
  // Créer un cours immédiat avec des données de base
  const courseName = prompt('Nom du cours en ligne:', 'Cours immédiat - ' + new Date().toLocaleString('fr-FR'))
  if (!courseName) return
  
  try {
    // Créer une URL de meeting temporaire pour test
    const meetingUrl = `https://meet.jit.si/immediate-course-${Date.now()}`
    
    // Ouvrir directement Jitsi Meet
    onlineCourseService.openMeeting(meetingUrl, 'Professeur')
    
    console.log('✅ Cours immédiat démarré')
    
  } catch (error) {
    console.error('❌ Erreur lors de la création du cours immédiat:', error)
    alert('Erreur lors de la création du cours: ' + error.message)
  }
}

// Méthode simplifiée pour rejoindre un cours
const handleJoinCourse = () => {
  const courseId = prompt('ID du cours à rejoindre:')
  if (!courseId) return
  
  try {
    // Créer une URL de meeting temporaire pour test
    const meetingUrl = `https://meet.jit.si/course-${courseId}-${Date.now()}`
    
    // Ouvrir directement Jitsi Meet
    onlineCourseService.openMeeting(meetingUrl, 'Professeur')
    
    console.log('✅ Participation au cours:', courseId)
    
  } catch (error) {
    console.error('❌ Erreur lors de la participation au cours:', error)
    alert('Erreur lors de la participation au cours: ' + error.message)
  }
}

// Test simple de Jitsi Meet
const testJitsiMeet = () => {
  try {
    const meetingUrl = `https://meet.jit.si/test-meeting-${Date.now()}`
    onlineCourseService.openMeeting(meetingUrl, 'Test User')
    console.log('✅ Test Jitsi Meet lancé')
  } catch (error) {
    console.error('❌ Erreur lors du test:', error)
    alert('Erreur lors du test: ' + error.message)
  }
}

onMounted(() => {
  console.log('🎥 Module cours en ligne chargé')
  console.log('Tenant ID:', tenantId.value)
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 