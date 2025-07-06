<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <!-- En-tête -->
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
            ✨ Nouveau Professeur
          </h2>
          <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            ✕
          </button>
        </div>
      </div>

      <!-- Contenu -->
      <div class="p-6">
        <form @submit.prevent="submitForm" class="space-y-6">
          <!-- Section Informations Personnelles -->
          <div class="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-lg">
            <h3 class="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">
              👤 Informations Personnelles
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Prénom <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="form.firstName"
                  type="text"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Prénom du professeur"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nom <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="form.lastName"
                  type="text"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Nom du professeur"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="form.email"
                  type="email"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="+33 1 23 45 67 89"
                />
              </div>
            </div>
          </div>

          <!-- Section Informations Professionnelles -->
          <div class="bg-green-50 dark:bg-green-900/20 p-5 rounded-lg">
            <h3 class="text-lg font-semibold text-green-900 dark:text-green-100 mb-4">
              💼 Informations Professionnelles
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  ID Employé <span class="text-red-500">*</span>
                </label>
                <div class="flex">
                  <input
                    v-model="form.employeeId"
                    type="text"
                    required
                    class="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="PROF001"
                  />
                  <button
                    type="button"
                    @click="generateEmployeeId"
                    class="px-4 py-3 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700"
                    title="Générer automatiquement"
                  >
                    🔄
                  </button>
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Département
                </label>
                <input
                  v-model="form.department"
                  type="text"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="ex: Mathématiques"
                />
              </div>
            </div>
          </div>

          <!-- Section Matières -->
          <div class="bg-purple-50 dark:bg-purple-900/20 p-5 rounded-lg">
            <h3 class="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-4">
              📚 Matières Enseignées
            </h3>
            
            <div v-if="availableSubjects.length === 0" class="text-center py-8">
              <div class="text-6xl mb-4">📚</div>
              <p class="text-gray-600 dark:text-gray-400 mb-4">Aucune matière disponible</p>
              <button
                type="button"
                @click="createDefaultSubjects"
                :disabled="creatingSubjects"
                class="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
              >
                {{ creatingSubjects ? '⏳ Création...' : '✨ Créer matières par défaut' }}
              </button>
            </div>

            <div v-else>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                <label
                  v-for="subject in availableSubjects"
                  :key="subject._id"
                  class="flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md"
                  :class="form.subjects.includes(subject._id) 
                    ? 'bg-blue-50 border-blue-300 dark:bg-blue-900/30 dark:border-blue-700' 
                    : 'border-gray-200 dark:border-gray-600'"
                >
                  <input
                    type="checkbox"
                    :value="subject._id"
                    v-model="form.subjects"
                    class="mr-3 w-4 h-4 text-blue-600 rounded"
                  />
                  <div>
                    <div class="font-medium text-gray-900 dark:text-white">{{ subject.name }}</div>
                    <div class="text-sm text-gray-600 dark:text-gray-400">{{ subject.code }}</div>
                  </div>
                </label>
              </div>
              
              <div class="text-sm text-gray-600 dark:text-gray-400">
                {{ form.subjects.length }} matière(s) sélectionnée(s)
              </div>
            </div>
          </div>
        </form>
      </div>

      <!-- Boutons -->
      <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
        <button
          type="button"
          @click="$emit('close')"
          class="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
        >
          Annuler
        </button>
        <button
          type="button"
          @click="submitForm"
          :disabled="loading || !canSubmit"
          class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {{ loading ? '⏳ Création...' : '✨ Créer le professeur' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useCurrentTenantStore } from '@/stores/currentTenantStore'
import { createSubject } from '@/services/academicService'
import type { CreateTeacherDto, Subject, CreateSubjectDto } from '@/types/academic'

interface Props {
  show: boolean
  availableSubjects: Subject[]
}

const emit = defineEmits<{
  close: []
  submit: [teacherData: CreateTeacherDto]
  subjectsCreated: []
}>()

const props = defineProps<Props>()
const tenantStore = useCurrentTenantStore()

const loading = ref(false)
const creatingSubjects = ref(false)

const form = reactive<CreateTeacherDto>({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  employeeId: '',
  department: '',
  employmentType: 'full-time',
  experience: 0,
  subjects: [],
  hireDate: new Date().toISOString().split('T')[0],
  status: 'active'
})

const canSubmit = computed(() => {
  return form.firstName && form.lastName && form.email && form.employeeId
})

const defaultSubjects: CreateSubjectDto[] = [
  { name: 'Mathématiques', code: 'MATH', description: 'Mathématiques', credits: 4, color: '#3B82F6' },
  { name: 'Français', code: 'FR', description: 'Français', credits: 4, color: '#EF4444' },
  { name: 'Histoire-Géographie', code: 'HG', description: 'Histoire-Géographie', credits: 3, color: '#F59E0B' },
  { name: 'Sciences Physiques', code: 'PC', description: 'Physique-Chimie', credits: 3, color: '#10B981' },
  { name: 'SVT', code: 'SVT', description: 'Sciences de la Vie et de la Terre', credits: 3, color: '#22C55E' },
  { name: 'Anglais', code: 'ANG', description: 'Anglais', credits: 3, color: '#6366F1' },
  { name: 'EPS', code: 'EPS', description: 'Éducation Physique', credits: 2, color: '#8B5CF6' },
  { name: 'Arts Plastiques', code: 'ART', description: 'Arts Plastiques', credits: 2, color: '#EC4899' }
]

function generateEmployeeId() {
  const timestamp = Date.now().toString().slice(-6)
  form.employeeId = `PROF${timestamp}`
}

async function createDefaultSubjects() {
  if (!tenantStore.currentTenantId) {
    alert('Sélectionnez un établissement d\'abord')
    return
  }

  creatingSubjects.value = true
  try {
    let created = 0
    for (const subject of defaultSubjects) {
      try {
        await createSubject(subject, tenantStore.currentTenantId)
        created++
      } catch (error) {
        console.warn(`Matière ${subject.name} existe peut-être déjà`)
      }
    }
    
    if (created > 0) {
      alert(`🎉 ${created} matière(s) créée(s) avec succès !`)
      emit('subjectsCreated')
    } else {
      alert('ℹ️ Toutes les matières existent déjà')
    }
  } catch (error) {
    console.error('Erreur:', error)
    alert('❌ Erreur lors de la création des matières')
  } finally {
    creatingSubjects.value = false
  }
}

async function submitForm() {
  if (!canSubmit.value) return

  loading.value = true
  try {
    const data = { ...form }
    if (!data.phone) delete data.phone
    if (!data.department) delete data.department
    if (!data.subjects.length) delete data.subjects

    emit('submit', data)
  } finally {
    loading.value = false
  }
}
</script> 