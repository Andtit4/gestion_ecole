import './assets/main.css'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'jsvectormap/dist/jsvectormap.css'
import 'flatpickr/dist/flatpickr.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import VueApexCharts from 'vue3-apexcharts'
import Toast, { POSITION } from 'vue-toastification'
import 'vue-toastification/dist/index.css'

// Import du store d'authentification pour l'initialisation
import { useAuthStore } from './stores/authStore'
import authService from './services/authService'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(VueApexCharts)
app.use(Toast, {
  position: POSITION.TOP_RIGHT,
  timeout: 5000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: "button",
  icon: true,
  rtl: false
})

// Initialiser l'authentification au démarrage
const authStore = useAuthStore()
authStore.initialize()

// Charger l'état d'authentification au démarrage
authService

// Fonction de diagnostic globale (accessible dans la console)
if (typeof window !== 'undefined') {
  window.authDebug = {
    // Vérifier l'état d'authentification
    checkAuth: () => {
      const authState = authService.getAuthState()
      console.log('=== DIAGNOSTIC AUTHENTIFICATION ===')
      console.log('État d\'authentification complet:', authState)
      console.log('isAuthenticated():', authService.isAuthenticated())
      console.log('isSuperAdmin():', authService.isSuperAdmin())
      console.log('getCurrentSchool():', authService.getCurrentSchool())
      console.log('getCurrentSuperAdmin():', authService.getCurrentSuperAdmin())
      
      // Vérifier le localStorage
      const stored = localStorage.getItem('auth_state')
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          console.log('Données dans localStorage:', parsed)
          
          // Vérifier l'âge des données
          if (parsed.timestamp) {
            const age = Date.now() - parsed.timestamp
            const ageHours = age / (1000 * 60 * 60)
            console.log(`Âge des données: ${ageHours.toFixed(2)} heures`)
          }
        } catch (e) {
          console.error('Erreur parsing localStorage:', e)
        }
      } else {
        console.log('Aucune donnée dans localStorage')
      }
      
      console.log('=====================================')
      return authState
    },
    
    // Valider la session manuellement
    validateSession: async () => {
      console.log('Validation de session...')
      try {
        const isValid = await authService.validateSession()
        console.log('Session valide:', isValid)
        return isValid
      } catch (error) {
        console.error('Erreur validation session:', error)
        return false
      }
    },
    
    // Forcer la déconnexion
    logout: () => {
      authService.logout()
      console.log('Déconnexion forcée')
    },
    
    // Nettoyer le localStorage
    clearStorage: () => {
      localStorage.clear()
      console.log('localStorage vidé')
    }
  }
  
  console.log('🔧 Fonctions de diagnostic disponibles:')
  console.log('- window.authDebug.checkAuth() : Vérifier l\'état d\'authentification')
  console.log('- window.authDebug.validateSession() : Valider la session')
  console.log('- window.authDebug.logout() : Forcer la déconnexion')
  console.log('- window.authDebug.clearStorage() : Nettoyer le localStorage')
}

app.mount('#app')
