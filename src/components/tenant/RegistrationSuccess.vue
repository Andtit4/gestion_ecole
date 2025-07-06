<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-boxdark rounded-2xl p-8 max-w-lg w-full mx-4 text-center">
      <!-- Icône de succès -->
      <div class="w-20 h-20 bg-success rounded-full flex items-center justify-center mx-auto mb-6">
        <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
        </svg>
      </div>
      
      <!-- Titre -->
      <h3 class="text-3xl font-bold text-black dark:text-white mb-4">
        🎉 Félicitations !
      </h3>
      
      <p class="text-lg text-gray-600 dark:text-gray-400 mb-6">
        Votre établissement <strong>{{ tenantName }}</strong> a été créé avec succès !
      </p>
      
      <!-- Identifiants administrateur -->
      <div class="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 mb-6 text-left">
        <h4 class="font-bold text-black dark:text-white mb-4 text-center">
          Identifiants d'administration
        </h4>
        
        <div class="space-y-4">
          <div class="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg">
            <div class="flex-1">
              <label class="text-sm font-medium text-gray-600 dark:text-gray-400">Domaine</label>
              <p class="font-mono text-black dark:text-white">{{ credentials.domain }}.schools.com</p>
            </div>
            <button 
              @click="copyToClipboard(credentials.domain + '.schools.com')"
              class="ml-2 p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
              </svg>
            </button>
          </div>
          
          <div class="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg">
            <div class="flex-1">
              <label class="text-sm font-medium text-gray-600 dark:text-gray-400">Nom d'utilisateur</label>
              <p class="font-mono text-black dark:text-white">{{ credentials.username }}</p>
            </div>
            <button 
              @click="copyToClipboard(credentials.username)"
              class="ml-2 p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
              </svg>
            </button>
          </div>
          
          <div class="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg">
            <div class="flex-1">
              <label class="text-sm font-medium text-gray-600 dark:text-gray-400">Mot de passe</label>
              <p class="font-mono text-black dark:text-white">{{ showPassword ? credentials.password : '••••••••••••' }}</p>
            </div>
            <div class="flex items-center space-x-2">
              <button 
                @click="showPassword = !showPassword"
                class="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg v-if="showPassword" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"/>
                </svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
              </button>
              <button 
                @click="copyToClipboard(credentials.password)"
                class="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Actions -->
      <div class="flex flex-col sm:flex-row gap-3">
        <button
          @click="copyAllCredentials"
          class="flex-1 flex items-center justify-center px-6 py-3 border border-stroke dark:border-strokedark rounded-lg text-black dark:text-white hover:bg-gray-2 transition-colors"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
          </svg>
          Tout copier
        </button>
        
        <button
          @click="goToLogin"
          class="flex-1 flex items-center justify-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Se connecter
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

// Props
interface Props {
  tenantName: string
  credentials: {
    domain: string
    username: string
    password: string
  }
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
}>()

const router = useRouter()
const showPassword = ref(false)

// Méthodes de copie
async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    // Vous pouvez ajouter une notification ici
    console.log('Copié dans le presse-papiers')
  } catch (error) {
    console.error('Erreur de copie:', error)
    // Fallback pour anciens navigateurs
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
  }
}

async function copyAllCredentials() {
  const text = `Identifiants pour ${props.tenantName}

Domaine: ${props.credentials.domain}.schools.com
Nom d'utilisateur: ${props.credentials.username}
Mot de passe: ${props.credentials.password}

⚠️ Gardez ces informations en sécurité !`

  await copyToClipboard(text)
}

function goToLogin() {
  emit('close')
  router.push('/school-login')
}
</script>

<style scoped>
/* Animation pour l'icône de succès */
@keyframes checkmark {
  0% {
    stroke-dasharray: 0 100;
  }
  100% {
    stroke-dasharray: 100 0;
  }
}

/* Transitions */
.transition-colors {
  transition-property: color, background-color, border-color;
  transition-duration: 150ms;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
</style> 