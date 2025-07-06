<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    
    <!-- Métriques Financières -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6 mb-6">
      <!-- Revenus Mensuels -->
      <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div class="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <svg class="fill-gray-800 dark:fill-white/90" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="flex items-end justify-between mt-5">
          <div>
            <span class="text-sm text-gray-500 dark:text-gray-400">Revenus Mensuels</span>
            <h4 class="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">1 957€</h4>
          </div>
          <span class="flex items-center gap-1 rounded-full bg-success-50 py-0.5 pl-2 pr-2.5 text-sm font-medium text-success-600 dark:bg-success-500/15 dark:text-success-500">
            <svg class="fill-current" width="12" height="12" viewBox="0 0 12 12">
              <path d="M5.56462 1.62393C5.70193 1.47072 5.90135 1.37432 6.12329 1.37432L9.65514 4.5918L6.87329 3.93247V10.125L5.56462 1.62393Z"/>
            </svg>
            +24.5%
          </span>
        </div>
      </div>

      <!-- Revenus Annuels -->
      <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div class="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <svg class="fill-success dark:fill-success" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="flex items-end justify-between mt-5">
          <div>
            <span class="text-sm text-gray-500 dark:text-gray-400">Revenus Annuels</span>
            <h4 class="mt-2 font-bold text-success text-title-sm">23 484€</h4>
          </div>
          <span class="flex items-center gap-1 rounded-full bg-success-50 py-0.5 pl-2 pr-2.5 text-sm font-medium text-success-600 dark:bg-success-500/15 dark:text-success-500">
            <svg class="fill-current" width="12" height="12" viewBox="0 0 12 12">
              <path d="M5.56462 1.62393L9.65514 4.5918L6.87329 3.93247V10.125L5.56462 1.62393Z"/>
            </svg>
            +18.2%
          </span>
        </div>
      </div>

      <!-- Abonnements Actifs -->
      <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div class="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <svg class="fill-blue-600 dark:fill-blue-400" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="flex items-end justify-between mt-5">
          <div>
            <span class="text-sm text-gray-500 dark:text-gray-400">Abonnements Actifs</span>
            <h4 class="mt-2 font-bold text-blue-600 text-title-sm dark:text-blue-400">30</h4>
          </div>
          <span class="flex items-center gap-1 rounded-full bg-blue-50 py-0.5 pl-2 pr-2.5 text-sm font-medium text-blue-600 dark:bg-blue-500/15 dark:text-blue-500">
            <svg class="fill-current" width="12" height="12" viewBox="0 0 12 12">
              <path d="M5.56462 1.62393L9.65514 4.5918L6.87329 3.93247V10.125L5.56462 1.62393Z"/>
            </svg>
            +5.7%
          </span>
        </div>
      </div>

      <!-- Taux de Renouvellement -->
      <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div class="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <svg class="fill-warning dark:fill-warning" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="flex items-end justify-between mt-5">
          <div>
            <span class="text-sm text-gray-500 dark:text-gray-400">Taux Renouvellement</span>
            <h4 class="mt-2 font-bold text-warning text-title-sm">89.3%</h4>
          </div>
          <span class="flex items-center gap-1 rounded-full bg-warning-50 py-0.5 pl-2 pr-2.5 text-sm font-medium text-warning-600 dark:bg-warning-500/15 dark:text-orange-400">
            <svg class="fill-current" width="12" height="12" viewBox="0 0 12 12">
              <path d="M5.56462 1.62393L9.65514 4.5918L6.87329 3.93247V10.125L5.56462 1.62393Z"/>
            </svg>
            +2.1%
          </span>
        </div>
      </div>
    </div>

    <!-- Plans d'Abonnement -->
    <div class="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 mb-6">
      <div class="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">Plans d'Abonnement</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">Gérez vos offres et tarifications</p>
        </div>

        <div class="flex items-center gap-3">
          <button
            @click="refreshCustomPlans"
            :disabled="loading"
            class="inline-flex items-center gap-2 rounded-lg bg-gray-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-gray-700 dark:bg-gray-500 dark:hover:bg-gray-600 disabled:opacity-50"
          >
            <svg class="w-4 h-4" :class="{ 'animate-spin': loading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            Actualiser Plans
          </button>
          
          <button
            @click="createPlan"
            class="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            Nouveau Plan
          </button>
          
          <button
            @click="createSubscription"
            class="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
            Assigner Abonnement
          </button>
        </div>
      </div>

      <!-- Grille des Plans -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div
          v-for="plan in subscriptionPlans"
          :key="plan.key"
          class="relative rounded-xl border p-6 hover:shadow-lg transition-shadow"
          :class="plan.popular ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400' : 'border-gray-200 dark:border-gray-700'"
        >
          <div v-if="plan.popular" class="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <span class="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
              Populaire
            </span>
          </div>
          
          <div class="text-center">
            <h4 class="text-lg font-semibold text-gray-800 dark:text-white/90">{{ plan.name }}</h4>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ plan.description }}</p>
            
            <div class="mt-4">
              <span class="text-3xl font-bold text-gray-800 dark:text-white/90">{{ formatPrice(plan.monthlyPrice) }}</span>
              <span class="text-gray-500 dark:text-gray-400">/mois</span>
            </div>

            <ul class="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <li v-for="feature in plan.features" :key="feature" class="flex items-center">
                <svg class="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                {{ feature }}
              </li>
            </ul>

            <div class="mt-6 space-y-2">
              <button
                @click="editPlan(plan)"
                class="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Modifier
              </button>
              <button
                @click="deletePlan(plan.key)"
                class="w-full rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-900/20"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Activité Récente des Abonnements -->
    <div class="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div class="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">Activité Récente</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">Dernières transactions et modifications</p>
        </div>

        <div class="flex items-center gap-3">
          <button
            class="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/>
            </svg>
            Filtrer
          </button>
          
          <button
            class="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]"
          >
            Exporter
          </button>
        </div>
      </div>

      <div class="max-w-full overflow-x-auto">
        <table class="min-w-full">
          <thead>
            <tr class="border-t border-gray-100 dark:border-gray-800">
              <th class="py-3 text-left">
                <p class="font-medium text-gray-500 text-xs dark:text-gray-400">Établissement</p>
              </th>
              <th class="py-3 text-left">
                <p class="font-medium text-gray-500 text-xs dark:text-gray-400">Action</p>
              </th>
              <th class="py-3 text-left">
                <p class="font-medium text-gray-500 text-xs dark:text-gray-400">Plan</p>
              </th>
              <th class="py-3 text-left">
                <p class="font-medium text-gray-500 text-xs dark:text-gray-400">Montant</p>
              </th>
              <th class="py-3 text-left">
                <p class="font-medium text-gray-500 text-xs dark:text-gray-400">Date</p>
              </th>
              <th class="py-3 text-left">
                <p class="font-medium text-gray-500 text-xs dark:text-gray-400">Statut</p>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="activity in recentActivity"
              :key="activity.id"
              class="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/[0.02]"
            >
              <td class="py-3 whitespace-nowrap">
                <div class="flex items-center gap-3">
                  <div class="h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <span class="text-xs font-medium text-blue-600 dark:text-blue-400">
                      {{ activity.school.charAt(0) }}
                    </span>
                  </div>
                  <div>
                    <p class="font-medium text-gray-800 text-sm dark:text-white/90">{{ activity.school }}</p>
                  </div>
                </div>
              </td>
              <td class="py-3 whitespace-nowrap">
                <span :class="getActionBadgeClass(activity.action)" class="rounded-full px-2 py-0.5 text-xs font-medium">
                  {{ getActionLabel(activity.action) }}
                </span>
              </td>
              <td class="py-3 whitespace-nowrap">
                <span class="font-medium text-gray-800 text-sm dark:text-white/90">{{ activity.plan }}</span>
              </td>
              <td class="py-3 whitespace-nowrap">
                <span class="font-medium text-gray-800 text-sm dark:text-white/90">{{ subscriptionStore.formatPrice(activity.amount) }}</span>
              </td>
              <td class="py-3 whitespace-nowrap">
                <span class="text-gray-500 text-sm dark:text-gray-400">{{ formatDate(activity.date) }}</span>
              </td>
              <td class="py-3 whitespace-nowrap">
                <span :class="getStatusBadgeClass(activity.status)" class="rounded-full px-2 py-0.5 text-xs font-medium">
                  {{ activity.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal d'assignation d'abonnement -->
    <div v-if="showCreateSubscriptionModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4 dark:bg-gray-800">
        <h3 class="text-lg font-medium text-gray-900 mb-4 dark:text-white">
          Créer un Nouvel Abonnement
        </h3>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
              Établissement
            </label>
            <select v-model="newSubscriptionTenant" class="w-full border border-gray-300 rounded-md px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
              <option value="">Sélectionnez un établissement</option>
              <option
                v-for="tenant in tenantStore.tenants"
                :key="tenant._id"
                :value="tenant._id"
              >
                {{ tenant.name }} ({{ tenant.domain }})
              </option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
              Plan
            </label>
            <select v-model="newSubscriptionPlan" class="w-full border border-gray-300 rounded-md px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
              <option value="">Sélectionnez un plan</option>
              <option
                v-for="{ plan, details } in availablePlans"
                :key="plan"
                :value="plan"
              >
                {{ details.name }} - {{ subscriptionStore.formatPrice(details.pricePerMonth) }}/mois
              </option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
              Durée (en mois)
            </label>
            <select v-model="newSubscriptionDuration" class="w-full border border-gray-300 rounded-md px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
              <option value="1">1 mois</option>
              <option value="3">3 mois</option>
              <option value="6">6 mois</option>
              <option value="12">12 mois</option>
            </select>
          </div>
          
          <div v-if="newSubscriptionPlan" class="p-3 bg-gray-50 rounded-md dark:bg-gray-700">
            <p class="text-sm text-gray-600 dark:text-gray-300">
              <strong>Total:</strong>
              {{ formatNewSubscriptionPrice() }}
            </p>
          </div>
        </div>
        
        <div class="flex justify-end space-x-3 mt-6">
          <button
            @click="showCreateModal = false"
            class="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
          >
            Annuler
          </button>
          <button
            @click="confirmCreateSubscription"
            :disabled="createLoading || !newSubscriptionTenant || !newSubscriptionPlan"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            <span v-if="createLoading">Traitement...</span>
            <span v-else>Créer</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de création de plan -->
    <div v-if="showCreatePlanModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4 dark:bg-gray-800">
        <h3 class="text-lg font-medium text-gray-900 mb-4 dark:text-white">
          Créer un Nouveau Plan
        </h3>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
              Nom
            </label>
            <input v-model="newPlan.name" class="w-full border border-gray-300 rounded-md px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
              Description
            </label>
            <textarea v-model="newPlan.description" class="w-full border border-gray-300 rounded-md px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"></textarea>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
              Prix Mensuel
            </label>
            <input v-model="newPlan.monthlyPrice" type="number" class="w-full border border-gray-300 rounded-md px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
              Nombre d'Élèves
            </label>
            <input v-model="newPlan.maxStudents" type="number" class="w-full border border-gray-300 rounded-md px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
              Nombre de Professeurs
            </label>
            <input v-model="newPlan.maxTeachers" type="number" class="w-full border border-gray-300 rounded-md px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
              Caractéristiques
            </label>
            <input v-model="newPlan.features[0]" class="w-full border border-gray-300 rounded-md px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
          </div>
        </div>
        
        <div class="flex justify-end space-x-3 mt-6">
          <button
            @click="showCreatePlanModal = false"
            class="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
          >
            Annuler
          </button>
          <button
            @click="confirmCreatePlan"
            :disabled="createPlanLoading || !newPlan.name || !newPlan.monthlyPrice"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            <span v-if="createPlanLoading">Traitement...</span>
            <span v-else>Créer</span>
          </button>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import { useTenantStore } from '../../stores/tenantStore'
import { useSubscriptionStore } from '../../stores/subscriptionStore'
import { fetchCustomPlans, assignCustomPlan, fetchPlanDetails } from '../../services/api'
import type { CreateSubscriptionRequest, CustomPlan } from '../../services/api'

const currentPageTitle = ref('Gestion des Abonnements')

// Plans de base (statiques)
const basePlans = ref([
  {
    key: 'starter',
    name: 'Plan Starter',
    description: 'Pour les petites écoles',
    monthlyPrice: 5000,
    maxStudents: 50,
    maxTeachers: 5,
    features: [
      '50 élèves maximum',
      '5 professeurs',
      'Gestion des notes de base',
      'Bulletins simples',
      'Support par email'
    ],
    popular: false
  },
  {
    key: 'standard',
    name: 'Plan Standard',
    description: 'Le choix idéal pour la plupart des établissements',
    monthlyPrice: 10000,
    maxStudents: 200,
    maxTeachers: 20,
    features: [
      '200 élèves maximum',
      '20 professeurs',
      'Emplois du temps avancés',
      'Communication parents',
      'Gestion des absences',
      'Support prioritaire'
    ],
    popular: true
  },
  {
    key: 'enterprise',
    name: 'Plan Enterprise',
    description: 'Pour les grandes institutions',
    monthlyPrice: 150000,
    maxStudents: 999999,
    maxTeachers: 999999,
    features: [
      'Utilisateurs illimités',
      'Multi-établissements',
      'API complète',
      'Formation dédiée',
      'Support 24/7',
      'Gestionnaire dédié'
    ],
    popular: false
  }
])

// Plans personnalisés (depuis l'API)
const customPlans = ref<CustomPlan[]>([])

// Plans combinés (statiques + personnalisés)
const subscriptionPlans = computed(() => [
  ...basePlans.value,
  ...customPlans.value.map(plan => ({
    key: plan.id,
    name: plan.name,
    description: plan.description,
    monthlyPrice: plan.monthlyPrice,
    maxStudents: plan.maxStudents,
    maxTeachers: plan.maxTeachers,
    features: plan.features,
    popular: plan.popular
  }))
])
const tenantStore = useTenantStore()
const subscriptionStore = useSubscriptionStore()

// État pour le chargement
const loading = ref(false)

// État pour la modal de création
const showCreateModal = ref(false)
const newSubscriptionTenant = ref('')
const newSubscriptionPlan = ref('')
const newSubscriptionDuration = ref(12)
const createLoading = ref(false)

// État pour la modal de création de plan
const showCreatePlanModal = ref(false)
const showCreateSubscriptionModal = ref(false)
const newPlan = ref({
  key: '',
  name: '',
  description: '',
  monthlyPrice: 0,
  maxStudents: 100,
  maxTeachers: 10,
  features: [''],
  popular: false
})
const createPlanLoading = ref(false)

const recentActivity = ref([
  {
    id: '1',
    school: 'École Primaire Les Roses',
    action: 'upgrade',
    plan: 'Premium',
    amount: 65000, // En franc CFA
    date: new Date('2024-01-15'),
    status: 'Confirmé'
  },
  {
    id: '2',
    school: 'Collège Saint-Martin',
    action: 'renewal',
    plan: 'Standard',
    amount: 40000, // En franc CFA
    date: new Date('2024-01-14'),
    status: 'Confirmé'
  },
  {
    id: '3',
    school: 'Université Technologique',
    action: 'new',
    plan: 'Enterprise',
    amount: 130000, // En franc CFA
    date: new Date('2024-01-13'),
    status: 'En cours'
  },
  {
    id: '4',
    school: 'Lycée Innovation',
    action: 'downgrade',
    plan: 'Basic',
    amount: 20000, // En franc CFA
    date: new Date('2024-01-12'),
    status: 'Confirmé'
  }
])

// Données computées
const availablePlans = computed(() => subscriptionStore.sortedPlans)

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date)
}

function getActionBadgeClass(action: string): string {
  const classes: Record<string, string> = {
    'upgrade': 'bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500',
    'downgrade': 'bg-warning-50 text-warning-600 dark:bg-warning-500/15 dark:text-orange-400',
    'new': 'bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-500',
    'renewal': 'bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-500',
    'cancel': 'bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-500'
  }
  return classes[action] || classes['new']
}

function getActionLabel(action: string): string {
  const labels: Record<string, string> = {
    'upgrade': 'Upgrade',
    'downgrade': 'Downgrade',
    'new': 'Nouveau',
    'renewal': 'Renouvellement',
    'cancel': 'Annulation'
  }
  return labels[action] || action
}

function getStatusBadgeClass(status: string): string {
  const classes: Record<string, string> = {
    'Confirmé': 'bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500',
    'En cours': 'bg-warning-50 text-warning-600 dark:bg-warning-500/15 dark:text-orange-400',
    'Échoué': 'bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-500'
  }
  return classes[status] || classes['En cours']
}

function createPlan() {
  console.log('Créer un nouveau plan')
  showCreatePlanModal.value = true
}

function createSubscription() {
  console.log('Créer un nouvel abonnement')
  showCreateSubscriptionModal.value = true
}

function editPlan(plan: any) {
  console.log('Modifier plan:', plan.name)
  // Remplir le formulaire avec les données du plan existant
  newPlan.value = { ...plan }
  showCreatePlanModal.value = true
}

async function confirmCreatePlan() {
  console.log('=== Début création plan ===')
  console.log('Plan:', newPlan.value)
  
  if (!newPlan.value.name || !newPlan.value.monthlyPrice) {
    alert('Veuillez remplir les champs obligatoires')
    return
  }
  
  createPlanLoading.value = true
  
  try {
    // Générer une clé unique pour le plan
    newPlan.value.key = newPlan.value.name.toLowerCase().replace(/\s+/g, '-')
    
    // Formater les caractéristiques
    if (typeof newPlan.value.features[0] === 'string') {
      newPlan.value.features = newPlan.value.features[0].split(',').map(f => f.trim()).filter(f => f)
    }
    
    // Ajouter le plan à la liste locale (simulation)
    subscriptionPlans.value.push({ ...newPlan.value } as any)
    
    // Reset le formulaire
    resetPlanForm()
    showCreatePlanModal.value = false
    
    console.log('Plan créé avec succès')
    alert('Plan créé avec succès !')
    
  } catch (err) {
    console.error('Erreur création plan:', err)
    alert(`Erreur lors de la création: ${err instanceof Error ? err.message : 'Erreur inconnue'}`)
  } finally {
    createPlanLoading.value = false
  }
}

function resetPlanForm() {
  newPlan.value = {
    key: '',
    name: '',
    description: '',
    monthlyPrice: 0,
    maxStudents: 100,
    maxTeachers: 10,
    features: [''],
    popular: false
  }
}

function deletePlan(planKey: string) {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce plan ?')) {
    const index = subscriptionPlans.value.findIndex(p => p.key === planKey)
    if (index > -1) {
      subscriptionPlans.value.splice(index, 1)
      alert('Plan supprimé avec succès !')
    }
  }
}

function formatPrice(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

function formatNewSubscriptionPrice(): string {
  const selectedPlan = availablePlans.value.find(p => p.plan === newSubscriptionPlan.value)
  if (selectedPlan) {
    return subscriptionStore.formatPrice(selectedPlan.details.pricePerMonth * newSubscriptionDuration.value)
  }
  return subscriptionStore.formatPrice(0)
}

async function confirmCreateSubscription() {
  console.log('=== Début création abonnement (SimpleSubscriptionManagement) ===')
  console.log('Tenant:', newSubscriptionTenant.value)
  console.log('Plan:', newSubscriptionPlan.value)
  console.log('Duration:', newSubscriptionDuration.value)
  
  if (!newSubscriptionTenant.value || !newSubscriptionPlan.value || !newSubscriptionDuration.value) {
    console.error('Données manquantes pour la création')
    alert('Veuillez remplir tous les champs obligatoires')
    return
  }
  
  createLoading.value = true
  console.log('Loading activé')
  
  try {
    const createData: CreateSubscriptionRequest = {
      tenantId: newSubscriptionTenant.value,
      plan: newSubscriptionPlan.value,
      duration: newSubscriptionDuration.value
    }
    
    console.log('Données à envoyer:', createData)
    console.log('Appel de subscriptionStore.createSubscription...')
    
    const result = await subscriptionStore.createSubscription(createData)
    
    console.log('Résultat création:', result)
    
    showCreateModal.value = false
    newSubscriptionTenant.value = ''
    newSubscriptionPlan.value = ''
    newSubscriptionDuration.value = 12
    
    console.log('=== Création terminée avec succès ===')
    alert('Abonnement créé avec succès !')
    
    // Actualiser les données
    await loadData()
  } catch (err) {
    console.error('=== Erreur création abonnement ===')
    console.error('Erreur complète:', err)
    console.error('Message:', err instanceof Error ? err.message : 'Erreur inconnue')
    alert(`Erreur lors de la création: ${err instanceof Error ? err.message : 'Erreur inconnue'}`)
  } finally {
    createLoading.value = false
    console.log('Loading désactivé')
  }
}

async function refreshCustomPlans() {
  loading.value = true
  try {
    console.log('Actualisation des plans personnalisés...')
    const fetchedPlans = await fetchCustomPlans()
    customPlans.value = fetchedPlans
    console.log('Plans personnalisés chargés:', fetchedPlans)
    alert('Plans actualisés avec succès !')
  } catch (error) {
    console.error('Erreur lors de l\'actualisation des plans:', error)
    alert('Erreur lors de l\'actualisation des plans')
  } finally {
    loading.value = false
  }
}

async function loadData() {
  try {
    console.log('Chargement des données...')
    await tenantStore.fetchTenants()
    await subscriptionStore.fetchPlanDetails()
    await refreshCustomPlans() // Charger aussi les plans personnalisés
    console.log('Données chargées avec succès')
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error)
  }
}

// Lifecycle
onMounted(async () => {
  await loadData()
})
</script>




