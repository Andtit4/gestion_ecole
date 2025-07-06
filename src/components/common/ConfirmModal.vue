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
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" @click="$emit('cancel')"></div>
        
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
              
              <!-- Icon -->
              <div class="p-6 text-center">
                <div :class="iconBgClass" class="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <svg :class="iconColorClass" class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="iconPath" />
                  </svg>
                </div>
                
                <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {{ title }}
                </h3>
                
                <p class="text-gray-600 dark:text-gray-400 mb-6">
                  {{ message }}
                </p>
                
                <!-- Actions -->
                <div class="flex items-center justify-center space-x-4">
                  <button
                    @click="$emit('cancel')"
                    class="px-6 py-3 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
                  >
                    Annuler
                  </button>
                  
                  <button
                    @click="$emit('confirm')"
                    :class="confirmButtonClass"
                    class="px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-medium text-white"
                  >
                    {{ confirmText }}
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
import { computed } from 'vue'

interface Props {
  show: boolean
  title: string
  message: string
  type?: 'danger' | 'warning' | 'success' | 'info'
  confirmText?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'danger',
  confirmText: 'Confirmer'
})

defineEmits<{
  confirm: []
  cancel: []
}>()

const iconBgClass = computed(() => {
  const classes = {
    danger: 'bg-red-100 dark:bg-red-900/30',
    warning: 'bg-yellow-100 dark:bg-yellow-900/30',
    success: 'bg-green-100 dark:bg-green-900/30',
    info: 'bg-blue-100 dark:bg-blue-900/30'
  }
  return classes[props.type]
})

const iconColorClass = computed(() => {
  const classes = {
    danger: 'text-red-600 dark:text-red-400',
    warning: 'text-yellow-600 dark:text-yellow-400',
    success: 'text-green-600 dark:text-green-400',
    info: 'text-blue-600 dark:text-blue-400'
  }
  return classes[props.type]
})

const confirmButtonClass = computed(() => {
  const classes = {
    danger: 'bg-gradient-to-r from-red-600 to-red-700',
    warning: 'bg-gradient-to-r from-yellow-600 to-yellow-700',
    success: 'bg-gradient-to-r from-green-600 to-green-700',
    info: 'bg-gradient-to-r from-blue-600 to-blue-700'
  }
  return classes[props.type]
})

const iconPath = computed(() => {
  const paths = {
    danger: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.863-.833-2.633 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z',
    warning: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.863-.833-2.633 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z',
    success: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    info: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
  }
  return paths[props.type]
})
</script> 