<template>
  <div 
    v-if="show" 
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    @click="closeModal"
  >
    <div 
      class="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800 m-4"
      @click.stop
    >
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ subject ? 'Modifier la Matière' : 'Ajouter une Nouvelle Matière' }}
        </h2>
        <button
          @click="closeModal"
          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Vérification tenant -->
      <div v-if="!tenantId" class="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
        <div class="flex items-center">
          <svg class="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"/>
          </svg>
          <span class="text-yellow-800 dark:text-yellow-400 text-sm">Veuillez sélectionner un établissement avant de créer une matière.</span>
        </div>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Informations de base -->
        <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Informations de Base
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nom de la matière *
              </label>
              <input
                v-model="formData.name"
                type="text"
                required
                class="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                placeholder="Mathématiques, Français, Histoire..."
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Code de la matière *
              </label>
              <input
                v-model="formData.code"
                type="text"
                required
                class="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                placeholder="MATH, FR, HIST..."
                style="text-transform: uppercase"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Crédits
              </label>
              <input
                v-model.number="formData.credits"
                type="number"
                min="1"
                max="10"
                class="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                placeholder="1"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Statut
              </label>
              <select
                v-model="formData.status"
                class="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <!-- Description -->
          <div class="mt-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              v-model="formData.description"
              rows="3"
              class="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="Description de la matière..."
            />
          </div>
        </div>

        <!-- Paramètres académiques -->
        <div class="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <svg class="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            Paramètres Académiques
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Type de matière
              </label>
              <select
                v-model="formData.type"
                class="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="theory">Théorique</option>
                <option value="practical">Pratique</option>
                <option value="mixed">Mixte</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Heures par semaine
              </label>
              <input
                v-model.number="formData.hoursPerWeek"
                type="number"
                min="1"
                max="20"
                class="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                placeholder="4"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Couleur (pour l'emploi du temps)
              </label>
              <div class="flex items-center space-x-3">
                <input
                  v-model="formData.color"
                  type="color"
                  class="w-12 h-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:border-gray-600"
                />
                <div class="flex-1">
                  <input
                    v-model="formData.color"
                    type="text"
                    class="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    placeholder="#3B82F6"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Aperçu de la couleur -->
          <div class="mt-4 p-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
            <div class="flex items-center space-x-4">
              <div 
                class="w-16 h-16 rounded-xl shadow-lg flex items-center justify-center text-white font-bold text-sm"
                :style="`background: linear-gradient(135deg, ${formData.color}, ${adjustColor(formData.color, -20)})`"
              >
                {{ formData.code || 'XXX' }}
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-white">Aperçu de la carte matière</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ formData.name || 'Nom de la matière' }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ formData.credits || 1 }} crédit(s)</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Boutons d'action -->
        <div class="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            @click="closeModal"
            class="px-6 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            :disabled="loading || !tenantId"
            class="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            style="min-width: 120px; display: flex !important;"
            @click="() => console.log('Bouton cliqué! Loading:', loading, 'TenantId:', tenantId)"
          >
            <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ loading ? 'Traitement...' : (subject ? 'Modifier' : 'Créer') }}
          </button>
          <!-- Debug info -->
          <div class="text-xs text-gray-500 mt-2">
            Debug: Loading={{ loading }}, TenantId={{ tenantId }}, Disabled={{ loading || !tenantId }}
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { createSubject, updateSubject } from '@/services/academicService'
import type { Subject, CreateSubjectDto } from '@/types/academic'

interface Props {
  show: boolean
  tenantId: string
  subject?: Subject | null
}

interface Emits {
  (e: 'close'): void
  (e: 'created', subject: Subject): void
  (e: 'updated', subject: Subject): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const loading = ref(false)

const formData = ref<CreateSubjectDto>({
  name: '',
  code: '',
  description: '',
  credits: 1,
  status: 'active',
  color: '#3B82F6',
  hoursPerWeek: 4,
  type: 'theory'
})

const resetForm = () => {
  formData.value = {
    name: '',
    code: '',
    description: '',
    credits: 1,
    status: 'active',
    color: '#3B82F6',
    hoursPerWeek: 4,
    type: 'theory'
  }
}

const closeModal = () => {
  emit('close')
  resetForm()
}

const adjustColor = (color: string, amount: number) => {
  const usePound = color[0] === '#'
  const col = usePound ? color.slice(1) : color
  const num = parseInt(col, 16)
  let r = (num >> 16) + amount
  let g = (num >> 8 & 0x00FF) + amount
  let b = (num & 0x0000FF) + amount
  
  r = r > 255 ? 255 : r < 0 ? 0 : r
  g = g > 255 ? 255 : g < 0 ? 0 : g
  b = b > 255 ? 255 : b < 0 ? 0 : b
  
  return (usePound ? '#' : '') + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')
}

const handleSubmit = async () => {
  if (loading.value) return

  if (!props.tenantId) {
    alert('Veuillez sélectionner un établissement avant de créer une matière')
    return
  }

  try {
    loading.value = true

    // Convertir le code en majuscules
    const dataToSubmit = {
      ...formData.value,
      code: formData.value.code.toUpperCase()
    }

    if (props.subject) {
      // Mode modification
      const updatedSubject = await updateSubject(props.subject._id, dataToSubmit, props.tenantId)
      emit('updated', updatedSubject)
    } else {
      // Mode création
      const newSubject = await createSubject(dataToSubmit, props.tenantId)
      emit('created', newSubject)
    }

    closeModal()
  } catch (error) {
    console.error('Erreur lors de la sauvegarde de la matière:', error)
    alert('Une erreur est survenue lors de la sauvegarde')
  } finally {
    loading.value = false
  }
}

// Watcher pour remplir le formulaire en mode modification
watch(() => props.subject, (subject) => {
  if (subject) {
    formData.value = {
      name: subject.name || '',
      code: subject.code || '',
      description: subject.description || '',
      credits: subject.credits || 1,
      status: subject.status || 'active',
      color: subject.color || '#3B82F6',
      hoursPerWeek: subject.hoursPerWeek || 4,
      type: subject.type || 'theory'
    }
  }
}, { immediate: true })

watch(() => props.show, (show) => {
  if (!show) {
    resetForm()
  }
})

// Auto-générer le code basé sur le nom
watch(() => formData.value.name, (newName) => {
  if (newName && !props.subject) {
    // Générer un code automatique seulement en mode création
    const code = newName
      .split(' ')
      .map(word => word.substring(0, 2))
      .join('')
      .toUpperCase()
      .substring(0, 4)
    
    if (!formData.value.code) {
      formData.value.code = code
    }
  }
})
</script> 