<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" @click="$emit('close')">
    <div class="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800 m-4" @click.stop>
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
          Ajouter un Nouveau Professeur
        </h2>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Vérification tenant -->
      <div v-if="!tenantId" class="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div class="flex items-center">
          <svg class="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"/>
          </svg>
          <span class="text-yellow-800 text-sm">Veuillez sélectionner un établissement avant de créer un professeur.</span>
        </div>
      </div>

      <!-- Form -->
      <form @submit.prevent="submitForm" class="space-y-6">
        <!-- Informations personnelles -->
        <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Informations Personnelles</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Prénom -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Prénom *
              </label>
              <input
                v-model="form.firstName"
                type="text"
                required
                class="w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                placeholder="Entrez le prénom"
              />
            </div>

            <!-- Nom -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nom *
              </label>
              <input
                v-model="form.lastName"
                type="text"
                required
                class="w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                placeholder="Entrez le nom"
              />
            </div>

            <!-- Email -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email *
              </label>
              <input
                v-model="form.email"
                type="email"
                required
                class="w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                placeholder="professeur@ecole.com"
              />
            </div>

            <!-- Téléphone -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Téléphone
              </label>
              <input
                v-model="form.phone"
                type="tel"
                class="w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                placeholder="+33 1 23 45 67 89"
              />
            </div>

            <!-- Genre -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Genre *
              </label>
              <select
                v-model="form.gender"
                required
                class="w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Sélectionner un genre</option>
                <option value="male">Masculin</option>
                <option value="female">Féminin</option>
                <option value="other">Autre</option>
              </select>
            </div>

            <!-- Date d'embauche -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date d'embauche *
              </label>
              <input
                v-model="form.hireDate"
                type="date"
                required
                class="w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        </div>

        <!-- Matières enseignées -->
        <div class="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
              </svg>
              Matières Enseignées *
            </h3>
            <span class="text-sm text-blue-600 dark:text-blue-400 font-medium">
              {{ form.subjects.length }} sélectionnée(s)
            </span>
          </div>

          <!-- Message de chargement -->
          <div v-if="loadingSubjects" class="text-center py-8">
            <div class="inline-block animate-spin rounded-full h-6 w-6 border-4 border-blue-600 border-t-transparent"></div>
            <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">Chargement des matières...</p>
          </div>

          <!-- Aucune matière -->
          <div v-else-if="availableSubjects.length === 0" class="text-center py-8">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
            </svg>
            <h4 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Aucune matière disponible</h4>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Veuillez d'abord créer des matières dans votre établissement.
            </p>
            <button
              type="button"
              @click="navigateToSubjects"
              class="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Créer des matières
            </button>
          </div>

          <!-- Liste des matières -->
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <label
              v-for="subject in availableSubjects"
              :key="subject._id"
              class="flex items-center p-4 border-2 rounded-xl transition-all duration-200 cursor-pointer hover:shadow-md"
              :class="form.subjects.includes(subject._id) 
                ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                : 'border-gray-200 dark:border-gray-600 hover:border-green-300 dark:hover:border-green-600'"
            >
              <input
                v-model="form.subjects"
                :value="subject._id"
                type="checkbox"
                class="rounded border-gray-300 text-green-600 focus:ring-green-500 mr-3"
              />
              <div class="flex-1">
                <div class="flex items-center">
                  <div 
                    class="w-4 h-4 rounded-full mr-2" 
                    :style="`background-color: ${subject.color || '#3B82F6'}`"
                  ></div>
                  <span class="font-medium text-gray-900 dark:text-white">{{ subject.name }}</span>
                  <span class="ml-2 text-xs font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-600 dark:text-gray-300">
                    {{ subject.code }}
                  </span>
                </div>
                <div class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {{ subject.credits || 1 }} crédit(s)
                  <span v-if="subject.description" class="ml-2">• {{ subject.description }}</span>
                </div>
              </div>
            </label>
          </div>

          <!-- Erreur sélection -->
          <div v-if="showSubjectError" class="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div class="flex items-center">
              <svg class="w-4 h-4 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"/>
              </svg>
              <span class="text-red-800 dark:text-red-400 text-sm">Veuillez sélectionner au moins une matière</span>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            @click="$emit('close')"
            class="px-6 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            :disabled="loading || !tenantId"
            class="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
          >
            <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ loading ? 'Création...' : 'Créer le Professeur' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { getSubjects } from '@/services/academicService'
import type { Subject } from '@/types/academic'

interface Props {
  show: boolean
  tenantId: string
}

const props = defineProps<Props>()
const emit = defineEmits(['close', 'created'])
const router = useRouter()

const loading = ref(false)
const loadingSubjects = ref(false)
const availableSubjects = ref<Subject[]>([])
const showSubjectError = ref(false)

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  gender: '',
  hireDate: new Date().toISOString().split('T')[0],
  subjects: [] as string[]
})

// Récupérer les matières
const fetchSubjects = async () => {
  if (!props.tenantId) return

  loadingSubjects.value = true
  try {
    availableSubjects.value = await getSubjects(props.tenantId)
  } catch (error) {
    console.error('Erreur lors du chargement des matières:', error)
    availableSubjects.value = []
  } finally {
    loadingSubjects.value = false
  }
}

const submitForm = async () => {
  showSubjectError.value = false

  if (form.subjects.length === 0) {
    showSubjectError.value = true
    return
  }

  if (!props.tenantId) {
    alert('Veuillez sélectionner un établissement')
    return
  }

  loading.value = true
  try {
    // Envoyer directement les IDs de matières
    const teacherData = {
      ...form,
      subjects: form.subjects
    }

    const { createTeacher } = await import('@/services/teacherService')
    const result = await createTeacher(teacherData, props.tenantId)
    
    console.log('Professeur créé avec succès:', result)
    
    // Afficher les identifiants de connexion s'ils sont fournis
    if (result.userCredentials) {
      alert(`Professeur créé avec succès!\n\nIdentifiants de connexion:\nEmail: ${result.userCredentials.email}\nMot de passe: ${result.userCredentials.password}`)
    } else {
      alert('Professeur créé avec succès!')
    }
    
    emit('created', result.teacher || result)
    resetForm()
  } catch (error) {
    console.error('Erreur création professeur:', error)
    alert(`Erreur lors de la création: ${error.message}`)
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  Object.assign(form, {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: '',
    hireDate: new Date().toISOString().split('T')[0],
    subjects: []
  })
  showSubjectError.value = false
}

const navigateToSubjects = () => {
  emit('close')
  router.push('/subjects')
}

// Watchers
watch(() => props.show, (newValue) => {
  if (newValue) {
    fetchSubjects()
    resetForm()
  }
})

watch(() => props.tenantId, fetchSubjects)

// Lifecycle
onMounted(() => {
  if (props.show && props.tenantId) {
    fetchSubjects()
  }
})
</script> 