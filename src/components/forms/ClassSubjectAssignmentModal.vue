<template>
  <div v-if="show" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-2xl bg-white dark:bg-gray-800">
      <div class="mt-3">
        <!-- En-tête -->
        <div class="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              Assigner Classes et Matières
            </h3>
            <p v-if="teacher" class="text-sm text-gray-500 dark:text-gray-400">
              Professeur: {{ teacher.firstName }} {{ teacher.lastName }}
            </p>
          </div>
          <button
            @click="closeModal"
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Assignations actuelles -->
        <div v-if="currentAssignments.length" class="py-4 border-b border-gray-200 dark:border-gray-700">
          <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Assignations actuelles</h4>
          <div class="space-y-2">
            <div
              v-for="assignment in currentAssignments"
              :key="`${assignment.classId}-${assignment.subjectId}`"
              class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <svg class="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                  </svg>
                </div>
                <div>
                  <p class="font-medium text-gray-900 dark:text-white">{{ assignment.className }}</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">{{ assignment.subjectName }}</p>
                </div>
              </div>
              <button
                @click="removeAssignment(assignment)"
                class="p-1 text-red-600 hover:bg-red-50 rounded dark:text-red-400 dark:hover:bg-red-900/20"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Formulaire d'ajout -->
        <form @submit.prevent="addAssignment" class="py-4">
          <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Nouvelle assignation</h4>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Classe *
              </label>
              <select
                v-model="newAssignment.classId"
                required
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Sélectionner une classe</option>
                <option v-for="cls in classes" :key="cls._id" :value="cls._id">
                  {{ cls.name }} ({{ cls.level }})
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Matière *
              </label>
              <select
                v-model="newAssignment.subjectId"
                required
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Sélectionner une matière</option>
                <option v-for="subject in subjects" :key="subject._id" :value="subject._id">
                  {{ subject.name }} ({{ subject.code }})
                </option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Heures par semaine
              </label>
              <input
                v-model.number="newAssignment.hoursPerWeek"
                type="number"
                min="1"
                max="20"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                placeholder="4"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Type d'enseignement
              </label>
              <select
                v-model="newAssignment.teachingType"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="main">Professeur principal</option>
                <option value="secondary">Professeur secondaire</option>
                <option value="substitute">Remplaçant</option>
              </select>
            </div>
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Notes (optionnel)
            </label>
            <textarea
              v-model="newAssignment.notes"
              rows="2"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="Notes sur cette assignation..."
            />
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                v-model="newAssignment.isMainTeacher"
                type="checkbox"
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label class="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Professeur principal de la classe
              </label>
            </div>

            <button
              type="submit"
              :disabled="!newAssignment.classId || !newAssignment.subjectId"
              class="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
              Ajouter
            </button>
          </div>
        </form>

        <!-- Actions -->
        <div class="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            @click="closeModal"
            class="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Teacher } from '@/types/academic'

interface Props {
  show: boolean
  teacher: Teacher | null
  classes: any[]
  subjects: any[]
  assignments: any[]
}

interface Emits {
  (e: 'close'): void
  (e: 'assigned', assignment: any): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const newAssignment = ref({
  classId: '',
  subjectId: '',
  hoursPerWeek: 4,
  teachingType: 'main',
  notes: '',
  isMainTeacher: false
})

const currentAssignments = computed(() => {
  if (!props.teacher) return []
  return props.assignments.filter(assignment => assignment.teacherId === props.teacher?._id)
    .map(assignment => ({
      ...assignment,
      className: getClassName(assignment.classId),
      subjectName: getSubjectName(assignment.subjectId)
    }))
})

function getClassName(classId: string): string {
  const cls = props.classes.find(c => c._id === classId)
  return cls ? `${cls.name} (${cls.level})` : 'Classe inconnue'
}

function getSubjectName(subjectId: string): string {
  const subject = props.subjects.find(s => s._id === subjectId)
  return subject ? subject.name : 'Matière inconnue'
}

function addAssignment() {
  if (!props.teacher || !newAssignment.value.classId || !newAssignment.value.subjectId) return

  // Vérifier si cette combinaison classe/matière existe déjà
  const existingAssignment = currentAssignments.value.find(
    a => a.classId === newAssignment.value.classId && a.subjectId === newAssignment.value.subjectId
  )

  if (existingAssignment) {
    alert('Cette assignation existe déjà pour ce professeur')
    return
  }

  const assignment = {
    id: Date.now().toString(),
    teacherId: props.teacher._id,
    teacherName: `${props.teacher.firstName} ${props.teacher.lastName}`,
    classId: newAssignment.value.classId,
    className: getClassName(newAssignment.value.classId),
    subjectId: newAssignment.value.subjectId,
    subjectName: getSubjectName(newAssignment.value.subjectId),
    hoursPerWeek: newAssignment.value.hoursPerWeek,
    teachingType: newAssignment.value.teachingType,
    notes: newAssignment.value.notes,
    isMainTeacher: newAssignment.value.isMainTeacher,
    createdAt: new Date().toISOString()
  }

  emit('assigned', assignment)
  resetForm()
}

function removeAssignment(assignment: any) {
  if (confirm(`Supprimer l'assignation ${assignment.className} - ${assignment.subjectName} ?`)) {
    // TODO: Implémenter la suppression via API
    console.log('Suppression assignation:', assignment)
  }
}

function resetForm() {
  newAssignment.value = {
    classId: '',
    subjectId: '',
    hoursPerWeek: 4,
    teachingType: 'main',
    notes: '',
    isMainTeacher: false
  }
}

function closeModal() {
  emit('close')
  resetForm()
}

// Reset form when modal closes
watch(() => props.show, (show) => {
  if (!show) {
    resetForm()
  }
})
</script> 