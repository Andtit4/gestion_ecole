<template>
  <div
    v-if="isVisible"
    class="fixed inset-0 z-50 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20 backdrop-blur-sm"
    @click.self="closeModal"
  >
    <div class="min-h-screen flex items-center justify-center p-4">
      <div class="relative w-full max-w-5xl max-h-[90vh] overflow-hidden">
        <!-- Modal Content -->
        <div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/30">
          <!-- Header moderne avec glass effect -->
          <div class="sticky top-0 z-10 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-white/20 dark:border-gray-700/30 shadow-lg shadow-blue-500/5 px-8 py-6 rounded-t-3xl">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  Saisie des notes
                </h2>
                <p class="text-blue-600 dark:text-blue-400 mt-1 font-medium">{{ evaluation?.name }}</p>
              </div>
              <button
                @click="closeModal"
                class="p-3 rounded-2xl bg-gray-100/80 dark:bg-gray-800/80 hover:bg-gray-200/80 dark:hover:bg-gray-700/80 transition-all duration-200 transform hover:scale-105"
              >
                <svg class="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>

          <!-- Content -->
          <div class="p-8 max-h-[70vh] overflow-y-auto">
            <!-- Evaluation Info avec design moderne -->
            <div class="mb-8 p-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/30">
              <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Informations de l'évaluation</h3>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="flex items-center space-x-3">
                  <div class="p-2 rounded-2xl bg-blue-100 dark:bg-blue-900/30">
                    <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Date</p>
                    <p class="text-lg font-bold text-gray-900 dark:text-white">{{ formatDate(evaluation?.date) }}</p>
                  </div>
                </div>
                <div class="flex items-center space-x-3">
                  <div class="p-2 rounded-2xl bg-green-100 dark:bg-green-900/30">
                    <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Note max</p>
                    <p class="text-lg font-bold text-gray-900 dark:text-white">{{ evaluation?.maxScore }}</p>
                  </div>
                </div>
                <div class="flex items-center space-x-3">
                  <div class="p-2 rounded-2xl bg-purple-100 dark:bg-purple-900/30">
                    <svg class="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Coefficient</p>
                    <p class="text-lg font-bold text-gray-900 dark:text-white">{{ evaluation?.coefficient }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Loading avec design moderne -->
            <div v-if="loading" class="text-center py-12">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p class="text-gray-600 dark:text-gray-400 mt-4 font-medium">Chargement des étudiants...</p>
            </div>

            <!-- Students Grid avec design moderne -->
            <div v-else>
              <div class="mb-8 flex justify-between items-center">
                <div>
                  <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Notes des étudiants</h3>
                  <p class="text-gray-500 dark:text-gray-400">{{ students.length }} étudiant(s) dans cette évaluation</p>
                </div>
                <div class="flex gap-3">
                  <!-- Indicateur de progression -->
                  <div class="flex items-center px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-2xl">
                    <svg class="w-5 h-5 mr-2 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {{ students.filter(s => s.gradeStatus === 'saved').length }}/{{ students.length }} sauvées
                    </span>
                  </div>

                  <!-- Badge notes en attente -->
                  <div v-if="pendingGradesCount > 0" class="flex items-center px-3 py-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 rounded-2xl">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01"></path>
                    </svg>
                    <span class="text-xs font-medium">{{ pendingGradesCount }} en attente</span>
                  </div>

                  <!-- Bouton sauvegarder tout -->
                  <button
                    @click="saveAllGrades"
                    :disabled="saving || pendingGradesCount === 0"
                    class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg v-if="saving" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    {{ saving ? 'Sauvegarde...' : `Sauvegarder tout (${pendingGradesCount})` }}
                  </button>
                </div>
              </div>

              <!-- Message si aucun étudiant -->
              <div v-if="students.length === 0 && !loading" class="text-center py-12">
                <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                </svg>
                <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Aucun étudiant trouvé</h3>
                <p class="text-gray-500 dark:text-gray-400">
                  Aucun étudiant n'est inscrit dans cette classe ou cette évaluation n'a pas de classe assignée.
                </p>
              </div>

              <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div
                  v-for="student in students"
                  :key="student._id"
                  class="group relative overflow-hidden rounded-3xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-white/20 dark:border-gray-700/30"
                >
                  <!-- Gradient background -->
                  <div class="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-br from-blue-500 to-indigo-600"></div>
                  
                  <div class="relative z-10">
                    <div class="flex items-center justify-between mb-4">
                      <div class="flex items-center space-x-4">
                        <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg transform group-hover:scale-110 transition-transform duration-200">
                          {{ getInitials(student.firstName, student.lastName) }}
                        </div>
                        <div>
                          <h4 class="font-bold text-gray-900 dark:text-white text-lg">
                            {{ student.firstName }} {{ student.lastName }}
                          </h4>
                          <p class="text-sm text-blue-600 dark:text-blue-400 font-medium">{{ student.studentNumber || 'N/A' }}</p>
                        </div>
                      </div>
                      <div class="text-right">
                        <span
                          v-if="student.gradeStatus === 'saved'"
                          class="inline-flex px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 text-xs font-medium rounded-full"
                        >
                          ✓ Sauvé
                        </span>
                        <span
                          v-else-if="student.gradeStatus === 'saving'"
                          class="inline-flex px-3 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 text-xs font-medium rounded-full"
                        >
                          <svg class="animate-spin -ml-1 mr-2 h-3 w-3" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sauvegarde...
                        </span>
                        <span
                          v-else-if="student.gradeStatus === 'error'"
                          class="inline-flex px-3 py-1 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 text-xs font-medium rounded-full"
                        >
                          ✗ Erreur
                        </span>
                        <span
                          v-else
                          class="inline-flex px-3 py-1 bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400 text-xs font-medium rounded-full"
                        >
                          En attente
                        </span>
                      </div>
                    </div>

                    <!-- Saisie de note avec design moderne -->
                    <div class="bg-white/50 dark:bg-gray-900/50 rounded-2xl p-4 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 space-y-4">
                      
                      <!-- Checkbox Absent -->
                      <div class="flex items-center space-x-3">
                        <input
                          v-model="student.isAbsent"
                          type="checkbox"
                          :id="`absent-${student._id}`"
                          class="w-4 h-4 text-red-600 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded focus:ring-red-500 dark:focus:ring-red-600 focus:ring-2"
                          @change="updateGrade(student)"
                        >
                        <label :for="`absent-${student._id}`" class="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Élève absent
                        </label>
                      </div>
                      
                      <!-- Saisie de note (désactivée si absent) -->
                      <div v-if="!student.isAbsent">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Note sur {{ evaluation?.maxScore }}
                        </label>
                        <div class="flex items-center space-x-3">
                          <input
                            v-model.number="student.grade"
                            type="number"
                            :min="0"
                            :max="evaluation?.maxScore"
                            step="0.25"
                            placeholder="0.00"
                            class="flex-1 px-4 py-3 border-0 bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-700 transition-all duration-200 text-center text-lg font-bold"
                            @blur="updateGrade(student)"
                          >
                          <div class="text-2xl font-bold text-gray-400 dark:text-gray-500">/</div>
                          <div class="text-lg font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-3 rounded-2xl">
                            {{ evaluation?.maxScore }}
                          </div>
                        </div>
                        
                        <!-- Barre de progression -->
                        <div class="mt-3" v-if="student.grade !== undefined">
                          <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              class="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-300"
                              :style="{ width: student.grade ? Math.min((student.grade / evaluation?.maxScore) * 100, 100) + '%' : '0%' }"
                            ></div>
                          </div>
                          <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                            <span>0</span>
                            <span v-if="student.grade" class="font-medium">{{ ((student.grade / evaluation?.maxScore) * 100).toFixed(1) }}%</span>
                            <span>{{ evaluation?.maxScore }}</span>
                          </div>
                        </div>
                      </div>

                      <!-- Message si absent -->
                      <div v-else class="text-center py-4">
                        <div class="text-red-600 dark:text-red-400 font-medium">
                          <svg class="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          Élève absent
                        </div>
                        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          La note sera automatiquement mise à 0
                        </p>
                      </div>
                      
                      <!-- Commentaire -->
                      <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Commentaire (optionnel)
                        </label>
                        <textarea
                          v-model="student.comment"
                          placeholder="Ajouter un commentaire sur cette note..."
                          rows="2"
                          class="w-full px-3 py-2 border-0 bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-700 transition-all duration-200 text-sm resize-none"
                          @blur="updateGrade(student)"
                        ></textarea>
                      </div>

                      <!-- Bouton de sauvegarde individuelle -->
                      <div class="flex justify-end">
                        <button
                          @click="updateGrade(student)"
                          :disabled="student.gradeStatus === 'saving'"
                          class="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <svg v-if="student.gradeStatus === 'saving'" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                          {{ student.gradeStatus === 'saving' ? 'Sauvegarde...' : 'Sauvegarder' }}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
          </div>
        </div>

          <!-- Footer moderne -->
          <div class="sticky bottom-0 z-10 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-t border-white/20 dark:border-gray-700/30 shadow-lg shadow-blue-500/5 px-8 py-6 rounded-b-3xl">
            <div class="flex justify-end space-x-4">
              <button
                @click="closeModal"
                class="px-6 py-3 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 font-medium"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { createStudentGrade, updateStudentGrade, findGradesByEvaluation } from '@/services/evaluationService'

interface Props {
  isVisible: boolean
  evaluation: any
  tenantId: string
}

interface Student {
  _id: string
  firstName: string
  lastName: string
  studentNumber?: string
  grade?: number
  gradeId?: string
  gradeStatus?: 'saved' | 'saving' | 'error' | 'pending'
  comment?: string
  isAbsent?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  gradesUpdated: []
}>()

const loading = ref(false)
const saving = ref(false)
const students = ref<Student[]>([])

const getInitials = (firstName: string, lastName: string) => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}

const formatDate = (date: string | Date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('fr-FR')
}

const loadStudents = async () => {
  if (!props.evaluation?._id || !props.tenantId) {
    console.error('❌ Paramètres manquants:', { evaluationId: props.evaluation?._id, tenantId: props.tenantId })
    return
  }

  loading.value = true
  console.log('🔍 Chargement des étudiants pour l\'évaluation:', props.evaluation)
  console.log('🔑 TenantId:', props.tenantId)
  console.log('🏫 ClassId:', props.evaluation.classId)

  try {
    // Récupérer les étudiants de la classe
    let classStudents = []
    
    if (props.evaluation.classId && props.evaluation.classId !== 'default-class-id') {
      console.log('📚 Récupération des étudiants par classe:', props.evaluation.classId)
      try {
        // Import du service étudiant
        const { fetchStudentsByClass } = await import('@/services/studentService')
        classStudents = await fetchStudentsByClass(props.evaluation.classId, props.tenantId)
        console.log('✅ Étudiants récupérés par classe:', classStudents.length)
      } catch (classError) {
        console.warn('⚠️ Erreur récupération par classe, fallback vers tous les étudiants:', classError.message)
        const { fetchStudents } = await import('@/services/studentService')
        const response = await fetchStudents(props.tenantId, 1, 100)
        classStudents = response.students || []
        console.log('✅ Fallback - Tous les étudiants récupérés:', classStudents.length)
      }
    } else {
      console.log('📚 Récupération de tous les étudiants (pas de classe spécifique ou classe par défaut)')
      // Fallback: récupérer tous les étudiants si pas de classe spécifique
      const { fetchStudents } = await import('@/services/studentService')
      const response = await fetchStudents(props.tenantId, 1, 100)
      classStudents = response.students || []
      console.log('✅ Tous les étudiants récupérés:', classStudents.length)
    }

    console.log('👥 Étudiants trouvés:', classStudents)

    // Récupérer les notes existantes pour cette évaluation
    console.log('📊 Récupération des notes existantes...')
    const existingGrades = await findGradesByEvaluation(props.evaluation._id, props.tenantId)
    console.log('✅ Notes existantes récupérées:', existingGrades.length)
    
    // Combiner étudiants et notes
    students.value = classStudents.map(student => {
      const existingGrade = existingGrades.find(g => g.studentId === student._id)
      return {
        _id: student._id,
        firstName: student.firstName,
        lastName: student.lastName,
        studentNumber: student.studentNumber || student.academicInfo?.studentNumber,
        grade: existingGrade?.score || undefined,
        gradeId: existingGrade?._id,
        gradeStatus: existingGrade ? 'saved' : 'pending',
        comment: existingGrade?.comment || '',
        isAbsent: existingGrade?.isAbsent || false
      }
    })

    console.log('✅ Étudiants combinés final:', students.value.length)
    console.log('📝 Liste des étudiants:', students.value)
  } catch (err) {
    console.error('❌ Erreur lors du chargement des étudiants:', err)
    console.error('❌ Détails de l\'erreur:', err.message)
    console.error('❌ Stack trace:', err.stack)
    
    // En cas d'erreur API, essayer de récupérer tous les étudiants sans filtre
    try {
      console.log('🔄 Tentative de récupération de tous les étudiants...')
      const { fetchStudents } = await import('@/services/studentService')
      const response = await fetchStudents(props.tenantId, 1, 100)
      const allStudents = response.students || []
      
      if (allStudents.length > 0) {
        students.value = allStudents.map(student => ({
          _id: student._id,
          firstName: student.firstName,
          lastName: student.lastName,
          studentNumber: student.studentNumber || student.academicInfo?.studentNumber,
          gradeStatus: 'pending'
        }))
        console.log('✅ Étudiants récupérés en fallback:', students.value.length)
      } else {
        // Utiliser des données de test en dernier recours
        students.value = [
          { _id: '1', firstName: 'Pierre', lastName: 'Martin', studentNumber: 'ST001', gradeStatus: 'pending' },
          { _id: '2', firstName: 'Marie', lastName: 'Dubois', studentNumber: 'ST002', gradeStatus: 'pending' },
          { _id: '3', firstName: 'Paul', lastName: 'Bernard', studentNumber: 'ST003', gradeStatus: 'pending' }
        ]
        console.log('⚠️ Utilisation de données de test')
      }
    } catch (fallbackErr) {
      console.error('❌ Erreur même en fallback:', fallbackErr)
      students.value = []
    }
  } finally {
    loading.value = false
  }
}

const updateGrade = async (student: Student) => {
  // Valider les données avant de sauvegarder
  if (!student.isAbsent && (student.grade === undefined || student.grade === null)) {
    return // Ne pas sauvegarder si pas de note et pas absent
  }

  student.gradeStatus = 'saving'
  try {
    const gradeData = {
      evaluationId: props.evaluation._id,
      studentId: student._id,
      score: student.isAbsent ? 0 : (student.grade || 0),
      maxScore: props.evaluation.maxScore,
      comment: student.comment || '',
      isAbsent: student.isAbsent || false,
      gradedBy: 'current-teacher' // TODO: récupérer l'ID du professeur connecté
    }

    if (student.gradeId) {
      // Mettre à jour la note existante
      await updateStudentGrade(student.gradeId, props.tenantId, gradeData)
      console.log('✅ Note mise à jour pour', student.firstName, student.lastName)
    } else {
      // Créer une nouvelle note
      const newGrade = await createStudentGrade(props.tenantId, gradeData)
      student.gradeId = newGrade._id
      console.log('✅ Nouvelle note créée pour', student.firstName, student.lastName)
    }

    student.gradeStatus = 'saved'
    emit('gradesUpdated')
  } catch (err) {
    console.error('❌ Erreur lors de la sauvegarde de la note:', err)
    student.gradeStatus = 'error'
    // Afficher un message d'erreur à l'utilisateur
    alert(`Erreur lors de la sauvegarde de la note pour ${student.firstName} ${student.lastName}: ${err.message}`)
  }
}

const saveAllGrades = async () => {
  saving.value = true
  try {
    // Filtrer les étudiants qui ont besoin d'être sauvegardés
    const studentsToSave = students.value.filter(s => 
      s.gradeStatus !== 'saved' && 
      (s.isAbsent || s.grade !== undefined)
    )
    
    if (studentsToSave.length === 0) {
      alert('Aucune note à sauvegarder')
      return
    }

    // Sauvegarder toutes les notes en parallèle
    const promises = studentsToSave.map(student => updateGrade(student))
    await Promise.all(promises)
    
    const successCount = studentsToSave.filter(s => s.gradeStatus === 'saved').length
    const errorCount = studentsToSave.filter(s => s.gradeStatus === 'error').length
    
    console.log(`✅ Sauvegarde terminée: ${successCount} réussies, ${errorCount} erreurs`)
    
    if (errorCount > 0) {
      alert(`Sauvegarde terminée avec ${errorCount} erreur(s). Vérifiez les notes marquées en rouge.`)
    } else {
      alert(`✅ Toutes les notes ont été sauvegardées avec succès ! (${successCount} notes)`)
    }
  } catch (err) {
    console.error('❌ Erreur lors de la sauvegarde groupée:', err)
    alert('Erreur lors de la sauvegarde groupée. Veuillez réessayer.')
  } finally {
    saving.value = false
  }
}

// Computed pour compter les notes en attente
const pendingGradesCount = computed(() => {
  return students.value.filter(s => 
    s.gradeStatus !== 'saved' && 
    (s.isAbsent || s.grade !== undefined)
  ).length
})

// Computed pour vérifier si toutes les notes sont saisies
const allGradesEntered = computed(() => {
  return students.value.every(s => s.isAbsent || s.grade !== undefined)
})

const closeModal = () => {
  emit('close')
}

watch(() => props.isVisible, (newValue) => {
  if (newValue && props.evaluation) {
    loadStudents()
  }
})
</script> 