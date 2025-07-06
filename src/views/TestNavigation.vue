<template>
  <div class="mx-auto max-w-4xl">
    <h1 class="text-2xl font-bold text-black dark:text-white mb-6">
      Test Navigation Multi-Tenant
    </h1>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <h2 class="text-xl font-semibold text-black dark:text-white mb-4">
          Navigation Test
        </h2>
        
        <div class="space-y-4">
          <button 
            @click="navigateTo('/tenant/register')"
            class="w-full inline-flex items-center justify-center rounded-md bg-primary py-2 px-4 text-center font-medium text-white hover:bg-opacity-90"
          >
            Aller vers Inscription Établissement
          </button>
          
          <button 
            @click="navigateTo('/tenant-dashboard')"
            class="w-full inline-flex items-center justify-center rounded-md bg-secondary py-2 px-4 text-center font-medium text-white hover:bg-opacity-90"
          >
            Aller vers Dashboard Établissements
          </button>
          
          <button 
            @click="navigateTo('/subscriptions')"
            class="w-full inline-flex items-center justify-center rounded-md bg-success py-2 px-4 text-center font-medium text-white hover:bg-opacity-90"
          >
            Aller vers Gestion Abonnements
          </button>
        </div>
      </div>

      <div class="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <h2 class="text-xl font-semibold text-black dark:text-white mb-4">
          Route Actuelle
        </h2>
        
        <div class="space-y-2">
          <p class="text-body dark:text-bodydark">
            <strong>Path:</strong> {{ $route.path }}
          </p>
          <p class="text-body dark:text-bodydark">
            <strong>Name:</strong> {{ $route.name }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const navigateTo = (path: string) => {
  console.log('Navigation vers:', path)
  router.push(path).catch((error) => {
    console.error('Erreur de navigation:', error)
  })
}
</script> 