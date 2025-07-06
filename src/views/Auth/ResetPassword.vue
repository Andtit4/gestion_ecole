<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- Logo et titre -->
      <div class="text-center mb-8">
        <div class="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Récupération du mot de passe
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Entrez votre domaine et email pour recevoir un nouveau mot de passe
        </p>
      </div>

      <!-- Formulaire -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
        <!-- Message de succès -->
        <div v-if="success" class="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div class="flex">
            <svg class="w-5 h-5 text-green-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <div>
              <h3 class="text-sm font-medium text-green-800 dark:text-green-200">Demande envoyée</h3>
              <p class="text-sm text-green-700 dark:text-green-300 mt-1">{{ successMessage }}</p>
            </div>
          </div>
        </div>

        <!-- Message d'erreur -->
        <div v-if="error" class="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div class="flex">
            <svg class="w-5 h-5 text-red-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <div>
              <h3 class="text-sm font-medium text-red-800 dark:text-red-200">Erreur</h3>
              <p class="text-sm text-red-700 dark:text-red-300 mt-1">{{ error }}</p>
            </div>
          </div>
        </div>

        <form v-if="!success" @submit.prevent="handleReset" class="space-y-6">
          <!-- Domaine -->
          <div>
            <label for="domain" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Domaine de l'établissement <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <input
                id="domain"
                v-model="resetForm.domain"
                type="text"
                required
                :disabled="loading"
                class="w-full px-4 py-3 pr-24 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="mon-ecole"
              />
              <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span class="text-gray-400 dark:text-gray-500 text-sm">.schools.com</span>
              </div>
            </div>
          </div>

          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email de l'administrateur <span class="text-red-500">*</span>
            </label>
            <input
              id="email"
              v-model="resetForm.email"
              type="email"
              required
              :disabled="loading"
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="admin@mon-ecole.fr"
            />
          </div>

          <!-- Bouton de soumission -->
          <button
            type="submit"
            :disabled="loading || !isFormValid"
            class="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
            {{ loading ? 'Envoi en cours...' : 'Réinitialiser le mot de passe' }}
          </button>
        </form>

        <!-- Retour à la connexion -->
        <div class="mt-6 text-center">
          <router-link
            to="/school-login"
            class="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
          >
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
            Retour à la connexion
          </router-link>
        </div>
      </div>

      <!-- Aide -->
      <div class="mt-6 text-center">
        <p class="text-xs text-gray-500 dark:text-gray-400">
          Un nouveau mot de passe sera envoyé par email. Assurez-vous de vérifier vos spams.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import tenantService from '@/services/tenantService'

// État local
const loading = ref(false)
const error = ref<string | null>(null)
const success = ref(false)
const successMessage = ref('')

// Données du formulaire
const resetForm = reactive({
  domain: '',
  email: ''
})

// Validation du formulaire
const isFormValid = computed(() => {
  return resetForm.domain.trim() !== '' && resetForm.email.trim() !== ''
})

// Gestion de la réinitialisation
async function handleReset() {
  if (!isFormValid.value || loading.value) {
    return
  }

  loading.value = true
  error.value = null

  try {
    // D'abord, vérifier que le tenant existe
    const tenant = await tenantService.getTenantByDomain(resetForm.domain.toLowerCase().trim())
    
    if (!tenant) {
      error.value = 'Domaine d\'établissement introuvable'
      return
    }

    // Vérifier que l'email correspond à l'admin
    if (tenant.admin.email.toLowerCase() !== resetForm.email.toLowerCase().trim()) {
      error.value = 'L\'email ne correspond pas à l\'administrateur de cet établissement'
      return
    }

    // Réinitialiser le mot de passe admin
    const credentials = await tenantService.resetAdminPassword(tenant._id)
    
    success.value = true
    successMessage.value = `Un nouveau mot de passe a été généré. Nom d'utilisateur: ${credentials.username}, Mot de passe: ${credentials.password}`
    
  } catch (err: any) {
    console.error('Erreur de réinitialisation:', err)
    
    if (err.response?.status === 404) {
      error.value = 'Domaine d\'établissement introuvable'
    } else if (err.response?.data?.message) {
      error.value = err.response.data.message
    } else {
      error.value = 'Erreur lors de la réinitialisation. Veuillez réessayer.'
    }
  } finally {
    loading.value = false
  }
}
</script> 