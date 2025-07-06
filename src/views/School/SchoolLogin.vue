<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- Logo et titre -->
      <div class="text-center mb-8">
        <div class="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Connexion Établissement
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Connectez-vous à votre espace de gestion scolaire
        </p>
      </div>

      <!-- Formulaire de connexion -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
        <!-- Message d'erreur -->
        <div v-if="authStore.error" class="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div class="flex">
            <svg class="w-5 h-5 text-red-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <div>
              <h3 class="text-sm font-medium text-red-800 dark:text-red-200">Erreur de connexion</h3>
              <p class="text-sm text-red-700 dark:text-red-300 mt-1">{{ authStore.error }}</p>
            </div>
          </div>
        </div>

        <!-- Message de succès -->
        <div v-if="successMessage" class="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
          {{ successMessage }}
        </div>

        <!-- Debug info -->
        <div v-if="showDebugInfo" class="mb-6 p-4 bg-gray-100 border border-gray-400 text-gray-700 rounded-lg text-sm">
          <h4 class="font-semibold mb-2">🔧 Informations de débogage</h4>
          <pre>{{ JSON.stringify(debugInfo, null, 2) }}</pre>
          <button 
            @click="checkAuthStatus"
            class="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
          >
            Vérifier l'état d'authentification
          </button>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-6" :class="{ 'pointer-events-none opacity-50': authStore.loading }">
          <!-- Domaine -->
          <div>
            <label for="domain" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Domaine de l'établissement <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <input
                id="domain"
                v-model="loginForm.domain"
                type="text"
                required
                :disabled="authStore.loading"
                class="w-full px-4 py-3 pr-24 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="mon-ecole"
                autocomplete="organization"
              />
              <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span class="text-gray-400 dark:text-gray-500 text-sm">.schools.com</span>
              </div>
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Le domaine unique de votre établissement
            </p>
          </div>

          <!-- Nom d'utilisateur -->
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nom d'utilisateur <span class="text-red-500">*</span>
            </label>
            <input
              id="username"
              v-model="loginForm.username"
              type="text"
              required
              :disabled="authStore.loading"
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="admin"
              autocomplete="username"
            />
          </div>

          <!-- Mot de passe -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Mot de passe <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <input
                id="password"
                v-model="loginForm.password"
                :type="showPassword ? 'text' : 'password'"
                required
                :disabled="authStore.loading"
                class="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="••••••••"
                autocomplete="current-password"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                :disabled="authStore.loading"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg v-if="showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"/>
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Options -->
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember-me"
                v-model="rememberMe"
                type="checkbox"
                :disabled="authStore.loading"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <label for="remember-me" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Se souvenir de moi
              </label>
            </div>
            
            <router-link
              to="/reset-password"
              class="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Mot de passe oublié?
            </router-link>
          </div>

          <!-- Bouton de connexion -->
          <button
            type="submit"
            :disabled="authStore.loading || !isFormValid"
            class="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg v-if="authStore.loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
            {{ authStore.loading ? 'Connexion en cours...' : 'Se connecter' }}
          </button>
        </form>

        <!-- Lien vers l'inscription -->
        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Pas encore d'établissement?
            <router-link 
              to="/tenant/register" 
              class="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
            >
              Créez votre compte
            </router-link>
          </p>
        </div>
      </div>

      <!-- Aide -->
      <div class="mt-6 text-center">
        <p class="text-xs text-gray-500 dark:text-gray-400">
          Besoin d'aide? Contactez le 
          <a href="tel:+33123456789" class="text-blue-600 hover:text-blue-500 dark:text-blue-400">
            01 23 45 67 89
          </a>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import authService from '@/services/authService'
import type { LoginCredentials } from '@/services/authService'

const router = useRouter()
const authStore = useAuthStore()

// État local
const showPassword = ref(false)
const rememberMe = ref(false)
const successMessage = ref('')

// Debug
const showDebugInfo = ref(process.env.NODE_ENV === 'development')
const debugInfo = ref({})

// Données du formulaire
const loginForm = reactive<LoginCredentials>({
  domain: '',
  username: '',
  password: ''
})

// Validation du formulaire
const isFormValid = computed(() => {
  return loginForm.domain.trim() !== '' &&
         loginForm.username.trim() !== '' &&
         loginForm.password !== ''
})

// Gestion de la connexion
async function handleLogin() {
  if (!isFormValid.value || authStore.loading) {
    return
  }

  authStore.clearError()

  const success = await authStore.login({
      domain: loginForm.domain.toLowerCase().trim(),
      username: loginForm.username.trim(),
      password: loginForm.password
    })

  if (success) {
    successMessage.value = 'Connexion réussie! Redirection en cours...'
    
    // Mettre à jour les infos de debug
    if (showDebugInfo.value) {
      await checkAuthStatus()
    }
    
    // Petit délai pour voir les infos de debug
    setTimeout(() => {
      router.push('/school/dashboard')
    }, showDebugInfo.value ? 2000 : 0)
  }
}

// Fonction de diagnostic
async function checkAuthStatus() {
  try {
    debugInfo.value = {
      store: {
        isAuthenticated: authStore.isAuthenticated,
        currentSchool: authStore.currentSchool,
        isSuperAdmin: authStore.isSuperAdmin,
        loading: authStore.loading,
        error: authStore.error
      },
      service: {
        isAuthenticated: authService.isAuthenticated(),
        currentSchool: authService.getCurrentSchool(),
        isSuperAdmin: authService.isSuperAdmin(),
        authState: authService.getAuthState()
      },
      localStorage: localStorage.getItem('auth_state') ? JSON.parse(localStorage.getItem('auth_state') || '{}') : null,
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    debugInfo.value = { error: 'Erreur lors du diagnostic: ' + (error as Error).message }
  }
}

// Vérifier si l'utilisateur est déjà connecté
onMounted(() => {
  if (authStore.isAuthenticated) {
    router.push('/school/dashboard')
  }
})
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style> 