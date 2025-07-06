<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto" @click.self="closeModal">
    <div class="flex min-h-screen items-center justify-center p-4">
      <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>
      
      <div class="relative w-full max-w-2xl transform rounded-2xl bg-white p-6 shadow-xl transition-all dark:bg-gray-800">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
              Nouvelle Classe
            </h3>
            <p v-if="tenantName" class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Pour l'établissement: {{ tenantName }}
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

        <!-- Vérification tenant -->
        <div v-if="!props.tenantId" class="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"/>
            </svg>
            <span class="text-yellow-800 text-sm">Veuillez sélectionner un établissement avant de créer une classe.</span>
          </div>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Informations générales -->
          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Informations générales
            </h4>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nom de la classe *
                </label>
                <input
                  v-model="form.name"
                  type="text"
                  required
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  placeholder="Ex: 6ème A, CM2 B, Terminal S1"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Niveau *
                </label>
                <input
                  v-model="form.level"
                  type="text"
                  required
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  placeholder="Ex: 6ème, CM2, Terminal"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Section
                </label>
                <input
                  v-model="form.section"
                  type="text"
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  placeholder="Ex: A, B, Scientifique"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Type d'école *
                </label>
                <select
                  v-model="form.schoolType"
                  required
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                >
                  <option value="">Sélectionner un type</option>
                  <option v-for="option in schoolTypeOptions" :key="option.value" :value="option.value">
                    {{ option.label }}
                  </option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Capacité maximale *
                </label>
                <input
                  v-model.number="form.capacity"
                  type="number"
                  min="1"
                  max="100"
                  required
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  placeholder="25"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Année scolaire *
                </label>
                <select
                  v-model="form.academicYearId"
                  required
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                >
                  <option value="">Sélectionner une année</option>
                  <option v-for="year in academicYears" :key="year._id" :value="year._id">
                    {{ year.name }} {{ year.isActive ? '(Active)' : '' }}
                  </option>
                </select>
              </div>

              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Salle de classe
                </label>
                <input
                  v-model="form.classroom"
                  type="text"
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  placeholder="Ex: Salle 101, Amphi A"
                />
              </div>
              
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  v-model="form.description"
                  rows="3"
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  placeholder="Description de la classe..."
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Boutons d'action -->
          <div class="flex justify-end gap-3 pt-4">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              Annuler
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="loading" class="flex items-center gap-2">
                <svg class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
                Création...
              </span>
              <span v-else>Créer la classe</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import type { CreateClassDto, AcademicYear } from '@/types/academic'
import { SCHOOL_TYPE_OPTIONS } from '@/types/academic'

interface Props {
  isOpen: boolean
  academicYears: AcademicYear[]
  tenantId?: string
  tenantName?: string
}

interface Emits {
  (e: 'close'): void
  (e: 'submit', classData: CreateClassDto): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const loading = ref(false)
const schoolTypeOptions = SCHOOL_TYPE_OPTIONS

// Initialiser le formulaire
const initForm = (): CreateClassDto => ({
  name: '',
  level: '',
  section: '',
  capacity: 25,
  schoolType: 'middle' as any,
  subjects: [],
  academicYearId: '',
  classroom: '',
  description: '',
  status: 'active'
})

const form = reactive<CreateClassDto>(initForm())

// Soumettre le formulaire
const handleSubmit = async () => {
  if (!props.tenantId) {
    alert('Veuillez sélectionner un établissement avant de créer une classe')
    return
  }

  loading.value = true
  try {
    // Nettoyer les données avant envoi
    const submitData = { ...form }
    
    // Supprimer les champs vides
    if (!submitData.section?.trim()) {
      delete submitData.section
    }
    if (!submitData.classroom?.trim()) {
      delete submitData.classroom
    }
    if (!submitData.description?.trim()) {
      delete submitData.description
    }
    if (!submitData.subjects?.length) {
      delete submitData.subjects
    }
    
    console.log('Données de classe à envoyer:', JSON.stringify(submitData, null, 2))
    console.log('Pour l\'établissement ID:', props.tenantId)
    emit('submit', submitData)
  } finally {
    loading.value = false
  }
}

// Fermer le modal
const closeModal = () => {
  emit('close')
}

// Réinitialiser le formulaire quand le modal se ferme
watch(() => props.isOpen, (isOpen) => {
  if (!isOpen) {
    Object.assign(form, initForm())
    loading.value = false
  } else {
    // Pré-sélectionner l'année active si disponible
    const activeYear = props.academicYears.find(year => year.isActive)
    if (activeYear && !form.academicYearId) {
      form.academicYearId = activeYear._id
    }
  }
})
</script> 