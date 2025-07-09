<template>
  <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-hidden">
      <!-- Header -->
      <div class="p-8 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-2xl font-bold text-white">Gestion des Abonnements</h3>
            <p class="text-blue-100 mt-1">Administrer tous les abonnements des établissements</p>
          </div>
          <button 
            @click="$emit('close')" 
            class="text-blue-100 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Contenu principal -->
      <div class="flex h-[calc(95vh-120px)]">
        <!-- Sidebar avec statistiques -->
        <div class="w-80 bg-gray-50/50 dark:bg-gray-900/50 border-r border-gray-200/50 dark:border-gray-700/50 p-6 overflow-y-auto">
          <!-- Statistiques rapides -->
          <div class="space-y-4 mb-6">
            <h4 class="font-semibold text-gray-900 dark:text-white">Vue d'ensemble</h4>
            
            <div v-if="overview" class="space-y-3">
              <div class="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-200/50 dark:border-gray-700/50">
                <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ overview.totalEstablishments }}</div>
                <div class="text-sm text-gray-600 dark:text-gray-400">Total établissements</div>
              </div>
              
              <div class="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-200/50 dark:border-gray-700/50">
                <div class="text-2xl font-bold text-green-600">{{ overview.activeSubscriptions }}</div>
                <div class="text-sm text-gray-600 dark:text-gray-400">Abonnements actifs</div>
              </div>
              
              <div class="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-200/50 dark:border-gray-700/50">
                <div class="text-2xl font-bold text-orange-600">{{ overview.expiringSoon }}</div>
                <div class="text-sm text-gray-600 dark:text-gray-400">Expirent bientôt</div>
              </div>
              
              <div class="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-200/50 dark:border-gray-700/50">
                <div class="text-2xl font-bold text-blue-600">{{ formatPrice(overview.monthlyRevenue) }}</div>
                <div class="text-sm text-gray-600 dark:text-gray-400">Revenus mensuels</div>
              </div>
            </div>
          </div>

          <!-- Actions rapides -->
          <div class="space-y-3">
            <h4 class="font-semibold text-gray-900 dark:text-white">Actions rapides</h4>
            
            <button 
              @click="notifyExpiringSubscriptions"
              :disabled="loading"
              class="w-full p-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
            >
              <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 19.5A2.5 2.5 0 016.5 17H20" />
              </svg>
              Notifier expirations
            </button>
            
            <button 
              @click="exportData('csv')"
              :disabled="loading"
              class="w-full p-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
            >
              <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Exporter CSV
            </button>
            
            <button 
              @click="showBulkActionsModal = true"
              :disabled="selectedItems.length === 0"
              class="w-full p-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
            >
              <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Actions groupées ({{ selectedItems.length }})
            </button>
          </div>
        </div>

        <!-- Zone principale -->
        <div class="flex-1 flex flex-col">
          <!-- Filtres et recherche -->
          <div class="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
              <!-- Recherche -->
              <div class="md:col-span-2">
                <div class="relative">
                  <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    v-model="filters.search"
                    @input="debouncedSearch"
                    type="text"
                    placeholder="Rechercher établissement, domaine ou email..."
                    class="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <!-- Filtre par plan -->
              <div>
                <select
                  v-model="filters.plan"
                  @change="loadSubscriptions"
                  class="w-full py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Tous les plans</option>
                  <option value="starter">Starter</option>
                  <option value="standard">Standard</option>
                  <option value="enterprise">Enterprise</option>
                  <option value="custom">Personnalisé</option>
                </select>
              </div>

              <!-- Filtre par statut -->
              <div>
                <select
                  v-model="filters.status"
                  @change="loadSubscriptions"
                  class="w-full py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Tous les statuts</option>
                  <option value="active">Actif</option>
                  <option value="expiring_soon">Expire bientôt</option>
                  <option value="expired">Expiré</option>
                  <option value="cancelled">Annulé</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Liste des abonnements -->
          <div class="flex-1 overflow-y-auto p-6">
            <div v-if="loading && subscriptions.length === 0" class="flex items-center justify-center h-64">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>

            <div v-else-if="subscriptions.length === 0" class="text-center py-12">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">Aucun abonnement trouvé</p>
            </div>

            <div v-else class="space-y-4">
              <!-- Sélection globale -->
              <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                <label class="flex items-center">
                  <input
                    v-model="selectAll"
                    @change="toggleSelectAll"
                    type="checkbox"
                    class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span class="ml-2 text-sm font-medium text-gray-900 dark:text-white">
                    Sélectionner tout ({{ subscriptions.length }})
                  </span>
                </label>
                <span class="text-sm text-gray-600 dark:text-gray-400">
                  {{ selectedItems.length }} élément(s) sélectionné(s)
                </span>
              </div>

              <!-- Liste des éléments -->
              <div class="space-y-3">
                <div
                  v-for="subscription in subscriptions"
                  :key="subscription.id"
                  class="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 hover:shadow-md transition-all duration-200"
                >
                  <div class="flex items-center space-x-4">
                    <!-- Checkbox -->
                    <input
                      v-model="selectedItems"
                      :value="subscription.id"
                      type="checkbox"
                      class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />

                    <!-- Informations principales -->
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center justify-between">
                        <div>
                          <h4 class="text-lg font-semibold text-gray-900 dark:text-white">{{ subscription.name }}</h4>
                          <p class="text-sm text-gray-600 dark:text-gray-400">{{ subscription.domain }}</p>
                          <p class="text-sm text-gray-500 dark:text-gray-400">{{ subscription.adminEmail }}</p>
                        </div>
                        
                        <div class="text-right">
                          <!-- Badge du plan -->
                          <span :class="getPlanBadgeClass(subscription.plan)" class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mb-2">
                            {{ formatPlan(subscription.plan) }}
                          </span>
                          
                          <!-- Prix -->
                          <div class="text-lg font-bold text-gray-900 dark:text-white">
                            {{ formatPrice(subscription.monthlyPrice) }}/mois
                          </div>
                        </div>
                      </div>

                      <!-- Détails secondaires -->
                      <div class="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span class="text-gray-500 dark:text-gray-400">Statut:</span>
                          <div class="mt-1">
                            <span :class="getStatusBadgeClass(subscription.status)" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium">
                              {{ formatSubscriptionStatus(subscription.status).text }}
                            </span>
                          </div>
                        </div>
                        
                        <div>
                          <span class="text-gray-500 dark:text-gray-400">Expire le:</span>
                          <div class="mt-1 font-medium text-gray-900 dark:text-white">
                            {{ formatDate(subscription.endDate) }}
                          </div>
                        </div>
                        
                        <div>
                          <span class="text-gray-500 dark:text-gray-400">Jours restants:</span>
                          <div class="mt-1 font-medium" :class="subscription.daysRemaining <= 30 ? 'text-orange-600' : 'text-gray-900 dark:text-white'">
                            {{ subscription.daysRemaining }} jours
                          </div>
                        </div>
                        
                        <div>
                          <span class="text-gray-500 dark:text-gray-400">Créé le:</span>
                          <div class="mt-1 font-medium text-gray-900 dark:text-white">
                            {{ formatDate(subscription.createdAt) }}
                          </div>
                        </div>
                      </div>

                      <!-- Actions individuelles -->
                      <div class="mt-4 flex flex-wrap gap-2">
                        <button
                          @click="openEditModal(subscription)"
                          class="px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm font-medium transition-colors"
                        >
                          Modifier plan
                        </button>
                        
                        <button
                          @click="extendSubscription(subscription.id)"
                          class="px-3 py-1.5 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg text-sm font-medium transition-colors"
                        >
                          Prolonger
                        </button>
                        
                        <button
                          v-if="subscription.status === 'active'"
                          @click="cancelSubscription(subscription.id)"
                          class="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-medium transition-colors"
                        >
                          Annuler
                        </button>
                        
                        <button
                          v-if="subscription.status === 'cancelled'"
                          @click="reactivateSubscription(subscription.id)"
                          class="px-3 py-1.5 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg text-sm font-medium transition-colors"
                        >
                          Réactiver
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Pagination -->
              <div v-if="pagination" class="mt-8 flex items-center justify-between">
                <div class="text-sm text-gray-600 dark:text-gray-400">
                  Affichage de {{ (pagination.page - 1) * pagination.limit + 1 }} à 
                  {{ Math.min(pagination.page * pagination.limit, pagination.total) }} 
                  sur {{ pagination.total }} résultats
                </div>
                
                <div class="flex items-center space-x-2">
                  <button
                    @click="loadPage(pagination.page - 1)"
                    :disabled="pagination.page <= 1"
                    class="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Précédent
                  </button>
                  
                  <span class="px-4 py-2 text-sm font-medium text-gray-900 dark:text-white">
                    Page {{ pagination.page }} sur {{ pagination.totalPages }}
                  </span>
                  
                  <button
                    @click="loadPage(pagination.page + 1)"
                    :disabled="pagination.page >= pagination.totalPages"
                    class="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Suivant
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Actions en Masse -->
      <div v-if="showBulkActionsModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
          <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Actions en masse ({{ selectedItems.length }} éléments)
          </h4>
          
          <div class="space-y-3">
            <button
              @click="processBulkAction('change_plan')"
              class="w-full p-3 text-left border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div class="font-medium text-gray-900 dark:text-white">Changer de plan</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">Modifier le plan d'abonnement</div>
            </button>
            
            <button
              @click="processBulkAction('extend')"
              class="w-full p-3 text-left border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div class="font-medium text-gray-900 dark:text-white">Prolonger</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">Étendre la période d'abonnement</div>
            </button>
            
            <button
              @click="processBulkAction('cancel')"
              class="w-full p-3 text-left border border-red-200 dark:border-red-600 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-red-700 dark:text-red-400"
            >
              <div class="font-medium">Annuler</div>
              <div class="text-sm opacity-80">Annuler les abonnements sélectionnés</div>
            </button>
            
            <button
              @click="processBulkAction('reactivate')"
              class="w-full p-3 text-left border border-green-200 dark:border-green-600 rounded-xl hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors text-green-700 dark:text-green-400"
            >
              <div class="font-medium">Réactiver</div>
              <div class="text-sm opacity-80">Réactiver les abonnements annulés</div>
            </button>
          </div>
          
          <div class="mt-6 flex justify-end space-x-3">
            <button
              @click="showBulkActionsModal = false"
              class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              Annuler
            </button>
          </div>
        </div>
      </div>

      <!-- Modal d'édition d'abonnement -->
      <div v-if="showEditModal && currentSubscription" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
          <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Modifier l'abonnement - {{ currentSubscription.name }}
          </h4>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nouveau plan
              </label>
              <select
                v-model="editForm.plan"
                class="w-full py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="starter">Starter - 50€/mois</option>
                <option value="standard">Standard - 100€/mois</option>
                <option value="enterprise">Enterprise - 1500€/mois</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Durée (mois)
              </label>
              <input
                v-model.number="editForm.duration"
                type="number"
                min="1"
                max="36"
                class="w-full py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          
          <div class="mt-6 flex justify-end space-x-3">
            <button
              @click="showEditModal = false"
              class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              Annuler
            </button>
            <button
              @click="saveSubscriptionChanges"
              :disabled="loading"
              class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
            >
              Enregistrer
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import subscriptionAdminService, { 
  type SubscriptionOverview, 
  type SubscriptionItem, 
  type SubscriptionListResponse 
} from '../../services/subscriptionAdminService';

// Fonction debounce native
function debounce<T extends (...args: any[]) => void>(func: T, wait: number): T {
  let timeout: NodeJS.Timeout;
  return ((...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  }) as T;
}

// Events
const emit = defineEmits<{
  close: []
}>();

// État réactif
const loading = ref(false);
const overview = ref<SubscriptionOverview | null>(null);
const subscriptions = ref<SubscriptionItem[]>([]);
const pagination = ref<any>(null);
const selectedItems = ref<string[]>([]);
const selectAll = ref(false);

// Modals
const showBulkActionsModal = ref(false);
const showEditModal = ref(false);
const currentSubscription = ref<SubscriptionItem | null>(null);

// Filtres
const filters = reactive({
  search: '',
  plan: '',
  status: '',
  page: 1,
  limit: 10,
});

// Formulaire d'édition
const editForm = reactive({
  plan: '',
  duration: 12,
});

// Computed
const debouncedSearch = debounce(() => {
  filters.page = 1;
  loadSubscriptions();
}, 300);

// Méthodes de chargement
const loadOverview = async () => {
  try {
    overview.value = await subscriptionAdminService.getSubscriptionOverview();
  } catch (error) {
    console.error('Erreur lors du chargement de la vue d\'ensemble:', error);
  }
};

const loadSubscriptions = async () => {
  loading.value = true;
  try {
    const response: SubscriptionListResponse = await subscriptionAdminService.getAllSubscriptions(
      filters.page,
      filters.limit,
      {
        plan: filters.plan || undefined,
        status: filters.status as any || undefined,
        search: filters.search || undefined,
      }
    );
    
    subscriptions.value = response.data;
    pagination.value = response.pagination;
    selectedItems.value = [];
    selectAll.value = false;
  } catch (error) {
    console.error('Erreur lors du chargement des abonnements:', error);
  } finally {
    loading.value = false;
  }
};

const loadPage = (page: number) => {
  filters.page = page;
  loadSubscriptions();
};

// Gestion de la sélection
const toggleSelectAll = () => {
  if (selectAll.value) {
    selectedItems.value = subscriptions.value.map(s => s.id);
  } else {
    selectedItems.value = [];
  }
};

// Actions individuelles
const openEditModal = (subscription: SubscriptionItem) => {
  currentSubscription.value = subscription;
  editForm.plan = subscription.plan;
  editForm.duration = 12;
  showEditModal.value = true;
};

const saveSubscriptionChanges = async () => {
  if (!currentSubscription.value) return;
  
  loading.value = true;
  try {
    await subscriptionAdminService.changeSubscriptionPlan(
      currentSubscription.value.id,
      editForm.plan,
      editForm.duration
    );
    
    showEditModal.value = false;
    await loadSubscriptions();
    await loadOverview();
  } catch (error) {
    console.error('Erreur lors de la modification:', error);
  } finally {
    loading.value = false;
  }
};

const extendSubscription = async (tenantId: string) => {
  loading.value = true;
  try {
    await subscriptionAdminService.extendSubscription(tenantId, 12);
    await loadSubscriptions();
    await loadOverview();
  } catch (error) {
    console.error('Erreur lors de la prolongation:', error);
  } finally {
    loading.value = false;
  }
};

const cancelSubscription = async (tenantId: string) => {
  if (!confirm('Êtes-vous sûr de vouloir annuler cet abonnement?')) return;
  
  loading.value = true;
  try {
    await subscriptionAdminService.cancelSubscription(tenantId);
    await loadSubscriptions();
    await loadOverview();
  } catch (error) {
    console.error('Erreur lors de l\'annulation:', error);
  } finally {
    loading.value = false;
  }
};

const reactivateSubscription = async (tenantId: string) => {
  loading.value = true;
  try {
    await subscriptionAdminService.bulkUpdateSubscriptions({
      tenantIds: [tenantId],
      action: 'reactivate'
    });
    await loadSubscriptions();
    await loadOverview();
  } catch (error) {
    console.error('Erreur lors de la réactivation:', error);
  } finally {
    loading.value = false;
  }
};

// Actions en masse
const processBulkAction = async (action: string) => {
  showBulkActionsModal.value = false;
  
  if (action === 'change_plan') {
    // TODO: Ouvrir un modal pour sélectionner le nouveau plan
    return;
  }
  
  loading.value = true;
  try {
    await subscriptionAdminService.bulkUpdateSubscriptions({
      tenantIds: selectedItems.value,
      action: action as any,
      duration: action === 'extend' ? 12 : undefined,
    });
    
    await loadSubscriptions();
    await loadOverview();
    selectedItems.value = [];
  } catch (error) {
    console.error('Erreur lors de l\'action en masse:', error);
  } finally {
    loading.value = false;
  }
};

// Actions rapides
const notifyExpiringSubscriptions = async () => {
  loading.value = true;
  try {
    const result = await subscriptionAdminService.notifyExpiringSubscriptions();
    alert(`${result.count} notifications envoyées`);
  } catch (error) {
    console.error('Erreur lors de la notification:', error);
  } finally {
    loading.value = false;
  }
};

const exportData = async (format: 'csv' | 'xlsx') => {
  loading.value = true;
  try {
    const result = await subscriptionAdminService.exportSubscriptionData(format);
    alert(`Export généré: ${result.count} enregistrements`);
  } catch (error) {
    console.error('Erreur lors de l\'export:', error);
  } finally {
    loading.value = false;
  }
};

// Formatage
const formatPrice = (price: number): string => {
  return subscriptionAdminService.formatPrice(price);
};

const formatDate = (date: Date | string): string => {
  return subscriptionAdminService.formatDate(date);
};

const formatPlan = (plan: string): string => {
  return subscriptionAdminService.formatPlan(plan);
};

const formatSubscriptionStatus = (status: string) => {
  return subscriptionAdminService.formatSubscriptionStatus(status);
};

const getPlanBadgeClass = (plan: string): string => {
  const classes = {
    starter: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    standard: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    enterprise: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    custom: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
  };
  return classes[plan as keyof typeof classes] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
};

const getStatusBadgeClass = (status: string): string => {
  const classes = {
    active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    expired: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    cancelled: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
    expiring_soon: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
  };
  return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
};

// Initialisation
onMounted(async () => {
  await Promise.all([
    loadOverview(),
    loadSubscriptions(),
  ]);
});
</script> 