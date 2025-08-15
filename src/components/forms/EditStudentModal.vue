<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto" @click.self="closeModal">
    <div class="flex min-h-screen items-center justify-center p-4">
      <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>
      
      <div class="relative w-full max-w-4xl transform rounded-2xl bg-white p-6 shadow-xl transition-all dark:bg-gray-800">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
              Modifier l'élève
            </h3>
            <p v-if="effectiveTenantName" class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Pour l'établissement: {{ effectiveTenantName }}
            </p>
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

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Informations personnelles -->
          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Informations personnelles
            </h4>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Prénom *
                </label>
                <input
                  v-model="form.firstName"
                  type="text"
                  required
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  placeholder="Prénom de l'élève"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nom de famille *
                </label>
                <input
                  v-model="form.lastName"
                  type="text"
                  required
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  placeholder="Nom de famille"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Numéro d'élève *
                </label>
                <input
                  v-model="form.studentNumber"
                  type="text"
                  required
                  readonly
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                  placeholder="Ex: STU20241234"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email *
                </label>
                <input
                  v-model="form.email"
                  type="email"
                  required
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  placeholder="email@exemple.com"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Téléphone
                </label>
                <input
                  v-model="form.phone"
                  type="tel"
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  placeholder="+33 1 23 45 67 89"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date de naissance *
                </label>
                <input
                  v-model="form.dateOfBirth"
                  type="date"
                  required
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Genre *
                </label>
                <select
                  v-model="form.gender"
                  required
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                >
                  <option value="">Sélectionner le genre</option>
                  <option value="M">Masculin</option>
                  <option value="F">Féminin</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Lieu de naissance
                </label>
                <input
                  v-model="form.placeOfBirth"
                  type="text"
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  placeholder="Ville de naissance"
                />
              </div>
            </div>
          </div>

          <!-- Informations académiques -->
          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Informations académiques
            </h4>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Classe *
                </label>
                <div class="relative">
                <select
                  v-model="form.academicInfo.className"
                  required
                  @change="updateClassInfo"
                    :disabled="loadingClasses"
                    class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white disabled:opacity-50"
                >
                    <option value="">
                      {{ loadingClasses ? 'Chargement des classes...' : 'Sélectionner une classe' }}
                    </option>
                  <option v-for="classOption in availableClasses" :key="classOption.id" :value="classOption.name">
                      {{ classOption.name }} ({{ classOption.level }})
                  </option>
                </select>
                  <div v-if="loadingClasses" class="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <svg class="w-4 h-4 animate-spin text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Section
                </label>
                <input
                  v-model="form.academicInfo.section"
                  type="text"
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  placeholder="Section (optionnel)"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Statut *
                </label>
                <select
                  v-model="form.academicInfo.status"
                  required
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                >
                  <option value="active">Actif</option>
                  <option value="inactive">Inactif</option>
                  <option value="transferred">Transféré</option>
                  <option value="graduated">Diplômé</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date d'inscription *
                </label>
                <input
                  v-model="form.academicInfo.enrollmentDate"
                  type="date"
                  required
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>
          </div>

          <!-- Gestion du mot de passe -->
          <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800/30">
            <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Gestion du mot de passe
            </h4>
            
            <div class="space-y-4">
              <!-- Statut du compte utilisateur -->
              <div class="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div class="flex items-center gap-3">
                  <div class="p-2 rounded-lg" :class="{
                    'bg-green-100 dark:bg-green-900/30': userAccountStatus.exists,
                    'bg-red-100 dark:bg-red-900/30': !userAccountStatus.exists
                  }">
                    <svg v-if="userAccountStatus.exists" class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <svg v-else class="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <div>
                    <p class="font-medium text-gray-900 dark:text-white">
                      {{ userAccountStatus.exists ? 'Compte utilisateur actif' : 'Aucun compte utilisateur' }}
                    </p>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                      {{ userAccountStatus.exists ? `Rôle: ${userAccountStatus.role}` : 'L\'étudiant ne peut pas se connecter' }}
                    </p>
                  </div>
                </div>
                <button
                  v-if="userAccountStatus.exists"
                  @click="checkUserAccount"
                  :disabled="checkingUserAccount"
                  class="px-3 py-1.5 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors disabled:opacity-50"
                >
                  <span v-if="checkingUserAccount" class="flex items-center gap-1">
                    <svg class="w-3 h-3 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                    </svg>
                    Vérification...
                  </span>
                  <span v-else>Actualiser</span>
                </button>
              </div>

              <!-- Actions de mot de passe -->
              <div v-if="userAccountStatus.exists" class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <!-- Générer un nouveau mot de passe -->
                <button
                  @click="generateNewPassword"
                  :disabled="passwordActionLoading"
                  class="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span v-if="passwordActionLoading && currentAction === 'generate'">
                    Génération...
                  </span>
                  <span v-else>Générer un nouveau mot de passe</span>
                </button>

                <!-- Réinitialiser le mot de passe -->
                <button
                  @click="resetPassword"
                  :disabled="passwordActionLoading"
                  class="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                  </svg>
                  <span v-if="passwordActionLoading && currentAction === 'reset'">
                    Réinitialisation...
                  </span>
                  <span v-else>Réinitialiser le mot de passe</span>
                </button>
              </div>

              <!-- Créer un compte utilisateur -->
              <div v-else class="text-center">
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Cet étudiant n'a pas de compte utilisateur pour se connecter au système.
                </p>
                <button
                  @click="createUserAccount"
                  :disabled="passwordActionLoading"
                  class="inline-flex items-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  <span v-if="passwordActionLoading && currentAction === 'create'">
                    Création...
                  </span>
                  <span v-else>Créer un compte utilisateur</span>
                </button>
              </div>

              <!-- Nouveau mot de passe affiché -->
              <div v-if="newPassword" class="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800/30 rounded-lg">
                <div class="flex items-center gap-2 mb-2">
                  <svg class="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"/>
                  </svg>
                  <span class="font-medium text-yellow-800 dark:text-yellow-200">Nouveau mot de passe généré</span>
                </div>
                <div class="flex items-center gap-2">
                  <input
                    :value="newPassword"
                    type="password"
                    readonly
                    class="flex-1 rounded-lg border border-yellow-300 px-3 py-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-900 dark:text-yellow-100 font-mono text-sm"
                  />
                  <button
                    @click="copyPassword"
                    class="p-2 text-yellow-600 hover:bg-yellow-100 dark:text-yellow-400 dark:hover:bg-yellow-900/30 rounded-lg transition-colors"
                    title="Copier le mot de passe"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
                <p class="text-xs text-yellow-700 dark:text-yellow-300 mt-2">
                  ⚠️ Notez ce mot de passe, il ne sera plus affiché après fermeture de cette fenêtre.
                </p>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-600">
            <button
              type="button"
              @click="closeModal"
              class="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
            >
              Annuler
            </button>
            
            <button
              type="submit"
              :disabled="loading"
              class="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="loading" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Modification...
              </span>
              <span v-else>Modifier l'élève</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

<!-- Notifications -->
<NotificationToast
  v-if="notification.show"
  :title="notification.title"
  :message="notification.message"
  :type="notification.type"
  @close="closeNotification"
/>
</template>

<script setup lang="ts">
import { reactive, ref, computed, watch } from 'vue'
import type { Student, UpdateStudentDto } from '@/types/student'
import userPasswordService from '@/services/userPasswordService'
import NotificationToast from '@/components/common/NotificationToast.vue'

interface Props {
  isOpen: boolean
  student: Student | null
  tenantId?: string
  tenantName?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  submit: [student: UpdateStudentDto]
}>()

const loading = ref(false)

// État pour la gestion des mots de passe
const userAccountStatus = ref<{
  exists: boolean
  userId?: string
  role?: string
}>({
  exists: false
})

const checkingUserAccount = ref(false)
const passwordActionLoading = ref(false)
const currentAction = ref<'generate' | 'reset' | 'create' | null>(null)
const newPassword = ref<string>('')

// État pour la gestion des notifications
const notification = reactive({
  show: false,
  title: '',
  message: '',
  type: 'info' as 'success' | 'danger' | 'warning' | 'info'
})

// Computed pour le tenant effectif
const effectiveTenantName = computed(() => {
  return props.tenantName || 'Établissement'
})

// Vérifier le statut du compte utilisateur
const checkUserAccount = async () => {
  if (!props.student?.email || !props.tenantId) return
  
  checkingUserAccount.value = true
  try {
    const result = await userPasswordService.checkUserExists(props.student.email, props.tenantId)
    userAccountStatus.value = result
  } catch (error) {
    console.error('❌ Erreur lors de la vérification du compte utilisateur:', error)
    userAccountStatus.value = { exists: false }
  } finally {
    checkingUserAccount.value = false
  }
}

// Générer un nouveau mot de passe
const generateNewPassword = async () => {
  if (!userAccountStatus.value.userId || !props.tenantId) return
  
  passwordActionLoading.value = true
  currentAction.value = 'generate'
  
  try {
    const result = await userPasswordService.generateNewPassword(userAccountStatus.value.userId, props.tenantId)
    newPassword.value = result.newPassword
    showNotification('Succès', 'Nouveau mot de passe généré avec succès', 'success')
  } catch (error) {
    console.error('❌ Erreur lors de la génération du mot de passe:', error)
    showNotification('Erreur', `Erreur lors de la génération: ${error instanceof Error ? error.message : String(error)}`, 'danger')
  } finally {
    passwordActionLoading.value = false
    currentAction.value = null
  }
}

// Réinitialiser le mot de passe
const resetPassword = async () => {
  if (!props.student?.email || !props.tenantId) return
  
  passwordActionLoading.value = true
  currentAction.value = 'reset'
  
  try {
    const result = await userPasswordService.resetStudentPasswordByEmail(props.student.email, props.tenantId)
    if (result.newPassword) {
      newPassword.value = result.newPassword
    }
    showNotification('Succès', 'Mot de passe réinitialisé avec succès', 'success')
  } catch (error) {
    console.error('❌ Erreur lors de la réinitialisation du mot de passe:', error)
    showNotification('Erreur', `Erreur lors de la réinitialisation: ${error instanceof Error ? error.message : String(error)}`, 'danger')
  } finally {
    passwordActionLoading.value = false
    currentAction.value = null
  }
}

// Créer un compte utilisateur
const createUserAccount = async () => {
  if (!props.student?.email || !props.tenantId) return
  
  passwordActionLoading.value = true
  currentAction.value = 'create'
  
  try {
    // Utiliser le service de création d'utilisateur existant
    const { createUser } = await import('@/services/userService')
    
    /* email: string;
          firstName: string;
          lastName: string;
          role: UserRole;
          tenantId: string;
          password?: string;
          phone?: string;
          department?: string; */
    const userData = {
      email: props.student.email,
      tenantId: props.tenantId,
      // role: 'student' as const,
      password: generateSecurePassword(), // Générer un mot de passe sécurisé
      firstName: props.student.firstName,
      lastName: props.student.lastName,
      role: 'student' as const,
      studentId: props.student._id
    }
    console.log("User data", userData)
    const result = await createUser(userData, props.tenantId)
    console.log("Result", result)
    if (result.user) {
      userAccountStatus.value = {
        exists: true,
        userId: result.user._id,
        role: 'student'
      }
      newPassword.value = userData.password
      showNotification('Succès', 'Compte utilisateur créé avec succès', 'success')
    }
  } catch (error) {
    console.error('❌ Erreur lors de la création du compte utilisateur:', error)
    showNotification('Erreur', `Erreur lors de la création: ${error instanceof Error ? error.message : String(error)}`, 'danger')
  } finally {
    passwordActionLoading.value = false
    currentAction.value = null
  }
}

// Copier le mot de passe dans le presse-papiers
const copyPassword = async () => {
  if (!newPassword.value) return
  
  try {
    await navigator.clipboard.writeText(newPassword.value)
    showNotification('Copié', 'Mot de passe copié dans le presse-papiers', 'success')
  } catch (error) {
    console.error('❌ Erreur lors de la copie:', error)
    showNotification('Erreur', 'Impossible de copier le mot de passe', 'danger')
  }
}

// Générer un mot de passe sécurisé
const generateSecurePassword = (length: number = 12): string => {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const lowercase = 'abcdefghijklmnopqrstuvwxyz'
  const numbers = '0123456789'
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?'
  
  const allChars = uppercase + lowercase + numbers + symbols
  let password = ''
  
  // Assurer au moins un caractère de chaque type
  password += uppercase[Math.floor(Math.random() * uppercase.length)]
  password += lowercase[Math.floor(Math.random() * lowercase.length)]
  password += numbers[Math.floor(Math.random() * numbers.length)]
  password += symbols[Math.floor(Math.random() * symbols.length)]
  
  // Remplir le reste
  for (let i = 4; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)]
  }
  
  // Mélanger le mot de passe
  return password.split('').sort(() => Math.random() - 0.5).join('')
}

// Afficher une notification
const showNotification = (title: string, message: string, type: 'success' | 'danger' | 'warning' | 'info') => {
  notification.title = title
  notification.message = message
  notification.type = type
  notification.show = true
}

// Fermer la notification
const closeNotification = () => {
  notification.show = false
}

// Initialiser le formulaire avec les données de l'élève
const initForm = (): UpdateStudentDto => {
  if (!props.student) {
    return {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      gender: '',
      placeOfBirth: '',
      address: {
        street: '',
        city: '',
        postalCode: '',
        country: 'France'
      },
      parentContact: {
        fatherName: '',
        fatherPhone: '',
        fatherEmail: '',
        motherName: '',
        motherPhone: '',
        motherEmail: '',
        guardianName: '',
        guardianPhone: '',
        guardianEmail: ''
      },
      academicInfo: {
        classId: '',
        className: '',
        level: '',
        section: '',
        enrollmentDate: '',
        status: 'active' as const
      }
    }
  }

  const student = props.student
  return {
    firstName: student.firstName || '',
    lastName: student.lastName || '',
    email: student.email || '',
    phone: student.phone || '',
    dateOfBirth: student.dateOfBirth || '',
    gender: student.gender || '',
    placeOfBirth: student.placeOfBirth || '',
    address: {
      street: student.address?.street || '',
      city: student.address?.city || '',
      postalCode: student.address?.postalCode || '',
      country: student.address?.country || 'France'
    },
    parentContact: {
      fatherName: student.parentContact?.fatherName || '',
      fatherPhone: student.parentContact?.fatherPhone || '',
      fatherEmail: student.parentContact?.fatherEmail || '',
      motherName: student.parentContact?.motherName || '',
      motherPhone: student.parentContact?.motherPhone || '',
      motherEmail: student.parentContact?.motherEmail || '',
      guardianName: student.parentContact?.guardianName || '',
      guardianPhone: student.parentContact?.guardianPhone || '',
      guardianEmail: student.parentContact?.guardianEmail || ''
    },
    academicInfo: {
      classId: student.academicInfo?.classId || '',
      className: student.academicInfo?.className || '',
      level: student.academicInfo?.level || '',
      section: student.academicInfo?.section || '',
      enrollmentDate: student.academicInfo?.enrollmentDate || '',
      status: (student.academicInfo?.status as 'active' | 'inactive' | 'transferred' | 'graduated') || 'active'
    }
  }
}

const form = reactive<UpdateStudentDto & { studentNumber?: string }>(initForm())

// Classes disponibles - chargées dynamiquement depuis l'API
const availableClasses = ref<Array<{ id: string; name: string; level: string }>>([])
const loadingClasses = ref(false)

// Charger les classes depuis l'API académique
const loadClasses = async () => {
  if (!props.tenantId) return
  
  loadingClasses.value = true
  try {
    // Import du service académique
    const { fetchClasses } = await import('@/services/academicService')
    const classes = await fetchClasses(props.tenantId)
    
    // Transformer les données pour le composant
    availableClasses.value = classes.map(classItem => ({
      id: classItem._id,
      name: classItem.name,
      level: classItem.level || classItem.grade || 'Non défini'
    }))
    
    console.log('✅ Classes chargées pour édition:', availableClasses.value.length)
  } catch (error) {
    console.error('❌ Erreur lors du chargement des classes:', error)
    // Fallback vers quelques classes par défaut en cas d'erreur
    availableClasses.value = [
      { id: 'temp-1', name: '6ème A', level: '6ème' },
      { id: 'temp-2', name: '5ème A', level: '5ème' },
      { id: 'temp-3', name: '4ème A', level: '4ème' },
      { id: 'temp-4', name: '3ème A', level: '3ème' }
    ]
  } finally {
    loadingClasses.value = false
  }
}

// Mettre à jour les informations de classe
const updateClassInfo = () => {
  if (form.academicInfo.className) {
    const selectedClass = availableClasses.value.find(c => c.name === form.academicInfo.className)
    if (selectedClass) {
      form.academicInfo.level = selectedClass.level
      form.academicInfo.classId = selectedClass.id
    }
  }
}

// Soumettre le formulaire
const handleSubmit = async () => {
  loading.value = true
  try {
    // Créer une copie des données à envoyer
    const submitData = { ...form }
    
    // Nettoyer les champs vides dans parentContact
    const cleanedParentContact = { ...submitData.parentContact }
    // Nettoyer les emails vides
    if (cleanedParentContact.fatherEmail === '') {
      delete cleanedParentContact.fatherEmail
    }
    if (cleanedParentContact.motherEmail === '') {
      delete cleanedParentContact.motherEmail
    }
    if (cleanedParentContact.guardianEmail === '') {
      delete cleanedParentContact.guardianEmail
    }
    // Nettoyer les champs vides (optionnels)
    if (cleanedParentContact.fatherName === '') {
      delete cleanedParentContact.fatherName
    }
    if (cleanedParentContact.fatherPhone === '') {
      delete cleanedParentContact.fatherPhone
    }
    if (cleanedParentContact.motherName === '') {
      delete cleanedParentContact.motherName
    }
    if (cleanedParentContact.motherPhone === '') {
      delete cleanedParentContact.motherPhone
    }
    if (cleanedParentContact.guardianName === '') {
      delete cleanedParentContact.guardianName
    }
    if (cleanedParentContact.guardianPhone === '') {
      delete cleanedParentContact.guardianPhone
    }
    submitData.parentContact = cleanedParentContact
    
    // Nettoyer le téléphone personnel s'il est vide
    if (submitData.phone === '') {
      delete submitData.phone
    }
    
    // Nettoyer la section si elle est vide
    if (submitData.academicInfo.section === '') {
      delete submitData.academicInfo.section
    }

    // Retirer le studentNumber des données à envoyer (readonly)
    delete submitData.studentNumber

    console.log('Données de modification à envoyer:', JSON.stringify(submitData, null, 2))
    console.log('Pour l\'établissement:', effectiveTenantName.value)
    emit('submit', submitData)
  } finally {
    loading.value = false
  }
}

// Fermer le modal
const closeModal = () => {
  // Réinitialiser les états de mot de passe
  newPassword.value = ''
  currentAction.value = null
  emit('close')
}

// Réinitialiser le formulaire quand le modal s'ouvre avec un nouvel élève
watch(() => [props.isOpen, props.student], ([isOpen, student]) => {
  if (isOpen && student) {
    Object.assign(form, initForm())
    // Ajouter le numéro d'élève pour l'affichage (readonly)
    form.studentNumber = student.studentNumber
    // Charger les classes
    loadClasses()
    // Vérifier le statut du compte utilisateur
    checkUserAccount()
  }
}, { immediate: true })

// Charger les classes aussi quand le tenant change
watch(() => props.tenantId, (newTenantId) => {
  if (newTenantId && props.isOpen) {
    loadClasses()
  }
})
</script>
