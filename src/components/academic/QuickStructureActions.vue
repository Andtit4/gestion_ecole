<template>
  <div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/30 overflow-hidden">
    <div class="p-6 bg-gradient-to-r from-indigo-600 to-purple-600">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-bold text-white flex items-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
            </svg>
            Structure Académique
          </h3>
          <p class="text-indigo-100 text-sm">Gestion des années, classes et emplois du temps</p>
        </div>
        <button
          @click="refreshData"
          :disabled="loading"
          class="p-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          <svg 
            class="w-5 h-5 text-white"
            :class="{ 'animate-spin': loading }"
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
        </button>
      </div>
    </div>

    <div class="p-6">
      <div v-if="loading" class="flex items-center justify-center py-8">
        <div class="text-center">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent"></div>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">Chargement de la structure...</p>
        </div>
      </div>

      <div v-else-if="error" class="text-center py-8">
        <svg class="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"/>
        </svg>
        <h4 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Erreur de chargement</h4>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ error }}</p>
        <button
          @click="refreshData"
          class="mt-3 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Réessayer
        </button>
      </div>

      <div v-else class="space-y-6">
        <div class="grid grid-cols-3 gap-4">
          <div class="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
            <div class="w-12 h-12 mx-auto mb-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
            </div>
            <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ totalYears }}</div>
            <div class="text-xs text-blue-600 dark:text-blue-400 font-medium">Années Scolaires</div>
          </div>

          <div class="text-center p-4 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-xl border border-emerald-100 dark:border-emerald-800">
            <div class="w-12 h-12 mx-auto mb-3 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m5 0v-4a1 1 0 011-1h2a1 1 0 011 1v4m-5 0v-6a1 1 0 011-1h2a1 1 0 011 1v6"/>
              </svg>
            </div>
            <div class="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{{ totalClasses }}</div>
            <div class="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Classes</div>
          </div>

          <div class="text-center p-4 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-xl border border-purple-100 dark:border-purple-800">
            <div class="w-12 h-12 mx-auto mb-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div class="text-2xl font-bold text-purple-600 dark:text-purple-400">{{ totalSchedules }}</div>
            <div class="text-xs text-purple-600 dark:text-purple-400 font-medium">Emplois du Temps</div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <button
            @click="openAddYearModal"
            class="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
            Année Scolaire
          </button>
          <button
            @click="openAddClassModal"
            class="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-4 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
            Classe
          </button>
          <button
            @click="openAddScheduleModal"
            class="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white px-4 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
            Emploi du Temps
          </button>
          <button
            @click="navigateToStructure"
            class="bg-white dark:bg-gray-700 border-2 border-indigo-200 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300 px-4 py-3 rounded-xl font-medium transition-all duration-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 flex items-center justify-center"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
            Gestion Complète
          </button>
        </div>

        <div v-if="hasData" class="space-y-4">
          <div class="flex items-center justify-between">
            <h4 class="text-sm font-semibold text-gray-900 dark:text-white flex items-center">
              <svg class="w-4 h-4 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
              </svg>
              Structure Récente
            </h4>
            <router-link
              :to="`/school/${tenantId}/structure`"
              class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium text-xs flex items-center"
            >
              Voir tout
              <svg class="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </router-link>
          </div>

          <div class="space-y-2">
            <div
              v-for="year in recentYears"
              :key="year._id"
              class="bg-gray-50 dark:bg-gray-700 rounded-xl p-3 hover:shadow-md transition-all duration-300 group border border-gray-100 dark:border-gray-600"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                  </div>
                  <div>
                    <h5 class="font-medium text-gray-900 dark:text-white text-sm group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {{ year.name }}
                    </h5>
                    <div class="flex items-center space-x-2 mt-1">
                      <span v-if="year.isActive" class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                        <div class="w-1 h-1 rounded-full bg-emerald-500 mr-1"></div>
                        Active
                      </span>
                      <span class="text-xs text-gray-500 dark:text-gray-400">
                        {{ formatDate(year.startDate) }} - {{ formatDate(year.endDate) }}
                      </span>
                    </div>
                  </div>
                </div>
                <svg class="w-4 h-4 text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </div>
            </div>

            <div
              v-for="classItem in recentClasses"
              :key="classItem._id"
              class="bg-gray-50 dark:bg-gray-700 rounded-xl p-3 hover:shadow-md transition-all duration-300 group border border-gray-100 dark:border-gray-600"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-sm">
                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m5 0v-4a1 1 0 011-1h2a1 1 0 011 1v4m-5 0v-6a1 1 0 011-1h2a1 1 0 011 1v6"/>
                    </svg>
                  </div>
                  <div>
                    <h5 class="font-medium text-gray-900 dark:text-white text-sm group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {{ classItem.name }}
                    </h5>
                    <div class="flex items-center space-x-2 mt-1">
                      <span class="text-xs text-gray-500 dark:text-gray-400">
                        {{ classItem.level }} • {{ classItem.studentsCount || 0 }} élèves
                      </span>
                    </div>
                  </div>
                </div>
                <svg class="w-4 h-4 text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-8">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
          </svg>
          <h4 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Aucune structure configurée</h4>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Commencez par créer une année scolaire et des classes.
          </p>
        </div>
      </div>
    </div>

    <AddAcademicYearModal
      :show="showAddYearModal"
      :tenant-id="tenantId"
      @close="showAddYearModal = false"
      @created="onYearCreated"
    />

    <AddClassModal
      :show="showAddClassModal"
      :tenant-id="tenantId"
      @close="showAddClassModal = false"
      @created="onClassCreated"
    />

    <AddScheduleModal
      :show="showAddScheduleModal"
      :tenant-id="tenantId"
      @close="showAddScheduleModal = false"
      @created="onScheduleCreated"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { fetchAcademicYears, fetchClasses, fetchSchedules } from '@/services/academicService'
import type { AcademicYear, Class, Schedule } from '@/types/academic'
import AddAcademicYearModal from './AddAcademicYearModal.vue'
import AddClassModal from './AddClassModal.vue'
import AddScheduleModal from './AddScheduleModal.vue'

interface Props {
  tenantId: string
}

const props = defineProps<Props>()
const router = useRouter()

const loading = ref(false)
const error = ref('')
const years = ref<AcademicYear[]>([])
const classes = ref<Class[]>([])
const schedules = ref<Schedule[]>([])

const showAddYearModal = ref(false)
const showAddClassModal = ref(false)
const showAddScheduleModal = ref(false)

const totalYears = computed(() => years.value.length)
const totalClasses = computed(() => classes.value.length)
const totalSchedules = computed(() => schedules.value.length)

const hasData = computed(() => 
  years.value.length > 0 || classes.value.length > 0 || schedules.value.length > 0
)

const recentYears = computed(() => years.value.slice(0, 2))
const recentClasses = computed(() => classes.value.slice(0, 2))

const fetchData = async () => {
  if (!props.tenantId) return

  loading.value = true
  error.value = ''
  
  try {
    const [yearsData, classesData, schedulesData] = await Promise.allSettled([
      fetchAcademicYears(props.tenantId),
      fetchClasses(props.tenantId),
      fetchSchedules(props.tenantId)
    ])

    if (yearsData.status === 'fulfilled') {
      years.value = yearsData.value
    }
    if (classesData.status === 'fulfilled') {
      classes.value = classesData.value
    }
    if (schedulesData.status === 'fulfilled') {
      schedules.value = schedulesData.value
    }
  } catch (err) {
    console.error('Erreur lors du chargement de la structure:', err)
    error.value = 'Erreur lors du chargement de la structure'
  } finally {
    loading.value = false
  }
}

const refreshData = () => {
  fetchData()
}

const openAddYearModal = () => {
  showAddYearModal.value = true
}

const openAddClassModal = () => {
  showAddClassModal.value = true
}

const openAddScheduleModal = () => {
  showAddScheduleModal.value = true
}

const navigateToStructure = () => {
  router.push(`/school/${props.tenantId}/structure`)
}

const onYearCreated = () => {
  fetchData()
  showAddYearModal.value = false
}

const onClassCreated = () => {
  fetchData()
  showAddClassModal.value = false
}

const onScheduleCreated = () => {
  fetchData()
  showAddScheduleModal.value = false
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'short'
  })
}

watch(() => props.tenantId, fetchData, { immediate: true })

onMounted(() => {
  if (props.tenantId) {
    fetchData()
  }
})
</script>