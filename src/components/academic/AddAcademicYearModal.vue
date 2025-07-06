<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto" @click.self="closeModal">
    <div class="flex min-h-screen items-center justify-center p-4">
      <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>
      
      <div class="relative w-full max-w-2xl transform rounded-2xl bg-white p-6 shadow-xl transition-all dark:bg-gray-800">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
            Nouvelle Année Scolaire
          </h3>
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
          <!-- Informations générales -->
          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Informations générales
            </h4>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nom de l'année scolaire *
                </label>
                <input
                  v-model="form.name"
                  type="text"
                  required
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  placeholder="Ex: 2024-2025"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date de début *
                </label>
                <input
                  v-model="form.startDate"
                  type="date"
                  required
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date de fin *
                </label>
                <input
                  v-model="form.endDate"
                  type="date"
                  required
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
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
                  placeholder="Description de l'année scolaire..."
                ></textarea>
              </div>

              <div class="md:col-span-2">
                <label class="flex items-center">
                  <input
                    v-model="form.isActive"
                    type="checkbox"
                    class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Marquer comme année active (désactivera les autres années)
                  </span>
                </label>
              </div>
            </div>
          </div>

          <!-- Périodes d'évaluation -->
          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <div class="flex items-center justify-between mb-4">
              <h4 class="text-lg font-medium text-gray-900 dark:text-white">
                Périodes d'évaluation
              </h4>
              <button
                type="button"
                @click="addPeriod"
                class="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                </svg>
                Ajouter une période
              </button>
            </div>
            
            <div class="space-y-4">
              <div
                v-for="(period, index) in form.periods"
                :key="index"
                class="border border-gray-200 dark:border-gray-600 rounded-lg p-3"
              >
                <div class="flex items-center justify-between mb-3">
                  <h5 class="font-medium text-gray-800 dark:text-gray-200">
                    Période {{ index + 1 }}
                  </h5>
                  <button
                    v-if="form.periods!.length > 1"
                    type="button"
                    @click="removePeriod(index)"
                    class="text-red-600 hover:text-red-700 dark:text-red-400"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    v-model="period.name"
                    type="text"
                    placeholder="Nom de la période"
                    class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    required
                  />
                  <input
                    v-model="period.startDate"
                    type="date"
                    class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    required
                  />
                  <input
                    v-model="period.endDate"
                    type="date"
                    class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    required
                  />
                </div>
                
                <div class="mt-3">
                  <label class="flex items-center">
                    <input
                      v-model="period.isActive"
                      type="checkbox"
                      class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                    <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Période active
                    </span>
                  </label>
                </div>
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
              class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="loading" class="flex items-center gap-2">
                <svg class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
                Création...
              </span>
              <span v-else>Créer l'année scolaire</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import type { CreateAcademicYearDto, CreateAcademicPeriodDto } from '@/types/academic'
import { generateDefaultPeriods } from '@/services/academicService'

interface Props {
  isOpen: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'submit', academicYear: CreateAcademicYearDto): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const loading = ref(false)

// Initialiser le formulaire
const initForm = (): CreateAcademicYearDto => ({
  name: '',
  startDate: '',
  endDate: '',
  isActive: false,
  periods: generateDefaultPeriods(),
  description: '',
  status: 'active'
})

const form = reactive<CreateAcademicYearDto>(initForm())

// Ajouter une période
const addPeriod = () => {
  if (!form.periods) {
    form.periods = []
  }
  
  const newPeriod: CreateAcademicPeriodDto = {
    name: `Période ${form.periods.length + 1}`,
    startDate: '',
    endDate: '',
    isActive: false,
    order: form.periods.length + 1
  }
  
  form.periods.push(newPeriod)
}

// Supprimer une période
const removePeriod = (index: number) => {
  if (form.periods && form.periods.length > 1) {
    form.periods.splice(index, 1)
    // Réorganiser les ordres
    form.periods.forEach((period, idx) => {
      period.order = idx + 1
    })
  }
}

// Soumettre le formulaire
const handleSubmit = async () => {
  loading.value = true
  try {
    // Nettoyer les données avant envoi
    const submitData = { ...form }
    
    // S'assurer que les périodes ont les bons ordres
    if (submitData.periods) {
      submitData.periods = submitData.periods.map((period, index) => ({
        ...period,
        order: index + 1
      }))
    }
    
    // Supprimer la description si vide
    if (!submitData.description?.trim()) {
      delete submitData.description
    }
    
    console.log('Données à envoyer:', JSON.stringify(submitData, null, 2))
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
  }
})
</script> 