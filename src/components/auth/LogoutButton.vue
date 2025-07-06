<template>
  <div class="relative">
    <!-- Bouton de déconnexion -->
    <button
      @click="showConfirm = true"
      :disabled="authStore.loading"
      class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
      </svg>
      <span v-if="!compact">Déconnexion</span>
    </button>

    <!-- Modal de confirmation -->
    <div
      v-if="showConfirm"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      @click.self="showConfirm = false"
    >
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
        <!-- En-tête -->
        <div class="flex items-center mb-4">
          <div class="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mr-3">
            <svg class="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">
            Confirmer la déconnexion
          </h3>
        </div>

        <!-- Message -->
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Êtes-vous sûr de vouloir vous déconnecter de votre session ? Vous devrez vous reconnecter pour accéder au dashboard.
        </p>

        <!-- Actions -->
        <div class="flex space-x-3">
          <button
            @click="showConfirm = false"
            :disabled="authStore.loading"
            class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Annuler
          </button>
          <button
            @click="handleLogout"
            :disabled="authStore.loading"
            class="flex-1 flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg v-if="authStore.loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
            Se déconnecter
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

// Props
interface Props {
  compact?: boolean // Mode compact (sans texte)
}

const props = withDefaults(defineProps<Props>(), {
  compact: false
})

const router = useRouter()
const authStore = useAuthStore()

// État local
const showConfirm = ref(false)

// Gestion de la déconnexion
async function handleLogout() {
  try {
    await authStore.logout()
    showConfirm.value = false
    
    // Rediriger vers la page de connexion
    router.push('/school-login')
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error)
    // Même en cas d'erreur, on redirige vers la page de connexion
    showConfirm.value = false
    router.push('/school-login')
  }
}
</script> 