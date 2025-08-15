<template>
  <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto" @click.self="closeModal">
    <div class="flex min-h-screen items-center justify-center p-4">
      <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>
      
      <div class="relative w-full max-w-md transform rounded-2xl bg-white p-6 shadow-xl transition-all dark:bg-gray-800">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-3">
            <div class="p-2 rounded-xl bg-green-100 dark:bg-green-900/30">
              <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                Identifiants générés
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Compte utilisateur créé avec succès
              </p>
            </div>
          </div>
          <button
            @click="closeModal"
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Contenu -->
        <div class="space-y-4">
          <!-- Avertissement -->
          <div class="p-4 bg-yellow-50 border border-yellow-200 rounded-lg dark:bg-yellow-900/20 dark:border-yellow-800/30">
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"/>
              </svg>
              <span class="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Notez ces identifiants, ils ne seront plus affichés après fermeture
              </span>
            </div>
          </div>

          <!-- Identifiants -->
          <div class="space-y-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <div class="flex items-center gap-2">
                <input
                  :value="credentials.email"
                  type="text"
                  readonly
                  class="flex-1 rounded-lg border border-gray-300 px-3 py-2 bg-gray-50 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white font-mono text-sm"
                />
                <button
                  @click="copyToClipboard(credentials.email)"
                  class="p-2 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                  title="Copier l'email"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Mot de passe
              </label>
              <div class="flex items-center gap-2">
                <input
                  :value="credentials.password"
                  :type="showPassword ? 'text' : 'password'"
                  readonly
                  class="flex-1 rounded-lg border border-gray-300 px-3 py-2 bg-gray-50 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white font-mono text-sm"
                />
                <button
                  @click="togglePasswordVisibility"
                  class="p-2 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                  :title="showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'"
                >
                  <svg v-if="showPassword" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                  <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
                <button
                  @click="copyToClipboard(credentials.password)"
                  class="p-2 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                  title="Copier le mot de passe"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Informations supplémentaires -->
          <div class="p-4 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-900/20 dark:border-blue-800/30">
            <div class="flex items-start gap-2">
              <svg class="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div class="text-sm text-blue-800 dark:text-blue-200">
                <p class="font-medium mb-1">Comment se connecter :</p>
                <ul class="space-y-1 text-xs">
                  <li>• Utilisez l'email et le mot de passe ci-dessus</li>
                  <li>• Connectez-vous sur votre portail établissement</li>
                  <li>• Changez votre mot de passe après la première connexion</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            @click="closeModal"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors"
          >
            Fermer
          </button>
          <button
            @click="copyAllCredentials"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Copier tout
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Credentials {
  email: string
  password: string
}

interface Props {
  show: boolean
  credentials: Credentials
}

interface Emits {
  (e: 'close'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const showPassword = ref(false)

const closeModal = () => {
  emit('close')
}

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    // Optionnel : afficher une notification de succès
    console.log('Copié dans le presse-papiers')
  } catch (err) {
    console.error('Erreur lors de la copie:', err)
    // Fallback pour les navigateurs plus anciens
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
  }
}

const copyAllCredentials = async () => {
  const allText = `Email: ${props.credentials.email}\nMot de passe: ${props.credentials.password}`
  await copyToClipboard(allText)
}
</script> 