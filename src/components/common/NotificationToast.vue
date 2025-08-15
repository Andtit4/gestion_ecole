<template>
  <div
    v-if="show"
    class="fixed top-4 right-4 z-50 max-w-sm w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border-l-4 transition-all duration-300 transform"
    :class="{
      'border-green-500': type === 'success',
      'border-red-500': type === 'danger',
      'border-yellow-500': type === 'warning',
      'border-blue-500': type === 'info',
      'translate-x-0 opacity-100': show,
      'translate-x-full opacity-0': !show
    }"
  >
    <div class="p-4">
      <div class="flex items-start">
        <div class="flex-shrink-0">
          <!-- Icône de succès -->
          <svg
            v-if="type === 'success'"
            class="h-6 w-6 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          
          <!-- Icône d'erreur -->
          <svg
            v-else-if="type === 'danger'"
            class="h-6 w-6 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          
          <!-- Icône d'avertissement -->
          <svg
            v-else-if="type === 'warning'"
            class="h-6 w-6 text-yellow-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          
          <!-- Icône d'information -->
          <svg
            v-else
            class="h-6 w-6 text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        
        <div class="ml-3 w-0 flex-1">
          <p class="text-sm font-medium text-gray-900 dark:text-white">
            {{ title }}
          </p>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {{ message }}
          </p>
        </div>
        
        <div class="ml-4 flex-shrink-0 flex">
          <button
            @click="close"
            class="bg-white dark:bg-gray-800 rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <span class="sr-only">Fermer</span>
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Props {
  title: string
  message: string
  type: 'success' | 'danger' | 'warning' | 'info'
  duration?: number
}

const props = withDefaults(defineProps<Props>(), {
  duration: 5000
})

const emit = defineEmits<{
  close: []
}>()

const show = ref(false)

const close = () => {
  show.value = false
  setTimeout(() => {
    emit('close')
  }, 300)
}

onMounted(() => {
  show.value = true
  
  if (props.duration > 0) {
    setTimeout(() => {
      close()
    }, props.duration)
  }
})
</script> 