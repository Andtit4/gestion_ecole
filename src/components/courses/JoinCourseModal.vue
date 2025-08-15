<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto">
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" @click="$emit('close')"></div>
        
        <!-- Modal -->
        <div class="flex min-h-full items-center justify-center p-4">
          <Transition
            enter-active-class="transition ease-out duration-300"
            enter-from-class="opacity-0 scale-95 translate-y-4"
            enter-to-class="opacity-100 scale-100 translate-y-0"
            leave-active-class="transition ease-in duration-200"
            leave-from-class="opacity-100 scale-100 translate-y-0"
            leave-to-class="opacity-0 scale-95 translate-y-4"
          >
            <div v-if="show" class="relative w-full max-w-md bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/30">
              
              <!-- Header -->
              <div class="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center">
                      <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                      </svg>
                    </div>
                    <div>
                      <h3 class="text-xl font-bold text-gray-900 dark:text-white">
                        Rejoindre un Cours
                      </h3>
                      <p class="text-sm text-gray-500 dark:text-gray-400">
                        Participez à un cours en direct
                      </p>
                    </div>
                  </div>
                  
                  <button
                    @click="$emit('close')"
                    class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                </div>
              </div>
              
              <!-- Form -->
              <div class="p-6 space-y-6">
                <!-- ID du cours -->
                <div>
                  <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    ID du cours ou Nom de la salle *
                  </label>
                  <input
                    v-model="formData.courseId"
                    type="text"
                    placeholder="Ex: math-6eme-a ou 12345"
                    class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                  />
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Entrez l'identifiant du cours fourni par votre professeur
                  </p>
                </div>

                <!-- Nom du participant -->
                <div>
                  <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Votre nom *
                  </label>
                  <input
                    v-model="formData.participantName"
                    type="text"
                    placeholder="Ex: Jean Dupont"
                    class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                  />
                </div>

                <!-- Type de participant -->
                <div>
                  <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Vous êtes
                  </label>
                  <div class="space-y-3">
                    <label class="flex items-center">
                      <input
                        v-model="formData.userType"
                        type="radio"
                        value="student"
                        class="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                      />
                      <span class="ml-3 text-gray-900 dark:text-white">Élève</span>
                    </label>
                    <label class="flex items-center">
                      <input
                        v-model="formData.userType"
                        type="radio"
                        value="teacher"
                        class="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                      />
                      <span class="ml-3 text-gray-900 dark:text-white">Professeur</span>
                    </label>
                    <label class="flex items-center">
                      <input
                        v-model="formData.userType"
                        type="radio"
                        value="guest"
                        class="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                      />
                      <span class="ml-3 text-gray-900 dark:text-white">Invité</span>
                    </label>
                  </div>
                </div>
              </div>
              
              <!-- Actions -->
              <div class="p-6 border-t border-gray-200/50 dark:border-gray-700/50">
                <div class="flex items-center justify-end space-x-4">
                  <button
                    @click="$emit('close')"
                    class="px-6 py-3 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
                  >
                    Annuler
                  </button>
                  
                  <button
                    @click="joinCourse"
                    :disabled="!isFormValid"
                    :class="[
                      'px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-medium text-white',
                      isFormValid 
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700' 
                        : 'bg-gray-400 cursor-not-allowed'
                    ]"
                  >
                    <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
                    </svg>
                    Rejoindre le Cours
                  </button>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface Props {
  show: boolean
}

const props = defineProps<Props>()

interface JoinData {
  courseId: string
  participantName: string
  userType: 'student' | 'teacher' | 'guest'
}

const emit = defineEmits<{
  close: []
  joined: [data: JoinData]
}>()

const formData = ref<JoinData>({
  courseId: '',
  participantName: '',
  userType: 'student'
})

const isFormValid = computed(() => {
  return formData.value.courseId.trim() !== '' && 
         formData.value.participantName.trim() !== ''
})

// Reset form when modal opens
watch(() => props.show, (newShow) => {
  if (newShow) {
    formData.value = {
      courseId: '',
      participantName: '',
      userType: 'student'
    }
  }
})

const joinCourse = () => {
  if (isFormValid.value) {
    emit('joined', { ...formData.value })
  }
}
</script> 