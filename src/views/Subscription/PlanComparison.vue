<template>
  <div class="mx-auto max-w-7xl">
    <!-- Header -->
    <div class="mb-8 text-center">
      <h1 class="text-3xl font-bold text-black dark:text-white mb-4">
        Choisissez Votre Plan
      </h1>
      <p class="text-lg text-meta-4 dark:text-meta-5 max-w-2xl mx-auto">
        Trouvez le plan parfait pour votre établissement scolaire. 
        Toutes les fonctionnalités essentielles pour une gestion efficace.
      </p>
    </div>

    <!-- Billing Toggle -->
    <div class="flex justify-center mb-8">
      <div class="bg-gray-100 dark:bg-meta-4 p-1 rounded-lg">
        <button
          @click="isAnnual = false"
          :class="[
            'px-4 py-2 rounded-md text-sm font-medium transition-all',
            !isAnnual 
              ? 'bg-white dark:bg-boxdark text-black dark:text-white shadow-sm' 
              : 'text-gray-600 dark:text-gray-300'
          ]"
        >
          Mensuel
        </button>
        <button
          @click="isAnnual = true"
          :class="[
            'px-4 py-2 rounded-md text-sm font-medium transition-all relative',
            isAnnual 
              ? 'bg-white dark:bg-boxdark text-black dark:text-white shadow-sm' 
              : 'text-gray-600 dark:text-gray-300'
          ]"
        >
          Annuel
          <span class="absolute -top-2 -right-2 bg-success text-white text-xs px-2 py-1 rounded-full">
            -20%
          </span>
        </button>
      </div>
    </div>

    <!-- Plans Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      <div
        v-for="plan in plans"
        :key="plan.key"
        :class="[
          'relative rounded-xl border-2 p-6 transition-all hover:shadow-lg',
          plan.popular 
            ? 'border-primary bg-gradient-to-b from-primary/5 to-transparent scale-105' 
            : 'border-stroke dark:border-strokedark bg-white dark:bg-boxdark'
        ]"
      >
        <!-- Popular Badge -->
        <div v-if="plan.popular" class="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span class="bg-primary text-white px-4 py-1 rounded-full text-sm font-medium">
            Le plus populaire
          </span>
        </div>

        <!-- Plan Header -->
        <div class="text-center mb-6">
          <h3 class="text-xl font-bold text-black dark:text-white mb-2">
            {{ plan.name }}
          </h3>
          <p class="text-meta-4 dark:text-meta-5 mb-4">
            {{ plan.description }}
          </p>
          
          <!-- Price -->
          <div class="mb-4">
            <span class="text-4xl font-bold text-black dark:text-white">
              {{ formatPrice(plan.monthlyPrice, isAnnual) }}€
            </span>
            <span class="text-meta-4 dark:text-meta-5">
              /mois
            </span>
          </div>

          <!-- Annual Savings -->
          <div v-if="isAnnual" class="text-success text-sm font-medium mb-4">
            Économisez {{ (plan.monthlyPrice * 12 * 0.2).toFixed(0) }}€ par an
          </div>
        </div>

        <!-- Features List -->
        <div class="space-y-3 mb-8">
          <div v-for="feature in plan.features" :key="feature.name" class="flex items-start">
            <svg 
              v-if="feature.included" 
              class="w-5 h-5 text-success mr-3 mt-0.5 flex-shrink-0" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <svg 
              v-else 
              class="w-5 h-5 text-gray-300 mr-3 mt-0.5 flex-shrink-0" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="6 18L18 6M6 6l12 12" />
            </svg>
            <span 
              :class="[
                'text-sm', 
                feature.included 
                  ? 'text-black dark:text-white' 
                  : 'text-gray-400 line-through'
              ]"
            >
              {{ feature.name }}
              <span v-if="feature.limit" class="text-meta-4 dark:text-meta-5">
                ({{ feature.limit }})
              </span>
            </span>
          </div>
        </div>

        <!-- CTA Button -->
        <button
          @click="selectPlan(plan)"
          :class="[
            'w-full py-3 px-4 rounded-lg font-medium transition-all',
            plan.popular
              ? 'bg-primary text-white hover:bg-opacity-90'
              : 'bg-stroke dark:bg-strokedark text-black dark:text-white hover:bg-opacity-80'
          ]"
        >
          {{ plan.key === 'BASIC' ? 'Commencer' : 'Choisir ce plan' }}
        </button>
      </div>
    </div>

    <!-- Feature Comparison Table -->
    <div class="rounded-xl border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
      <h2 class="text-2xl font-bold text-black dark:text-white mb-6 text-center">
        Comparaison Détaillée des Fonctionnalités
      </h2>

      <div class="overflow-x-auto">
        <table class="min-w-full">
          <thead>
            <tr class="border-b border-stroke dark:border-strokedark">
              <th class="py-4 px-6 text-left text-black dark:text-white font-medium">
                Fonctionnalités
              </th>
              <th v-for="plan in plans" :key="plan.key" class="py-4 px-6 text-center">
                <div class="text-black dark:text-white font-medium">{{ plan.name }}</div>
                <div class="text-sm text-meta-4 dark:text-meta-5">
                  {{ formatPrice(plan.monthlyPrice, isAnnual) }}€/mois
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="feature in detailedFeatures" :key="feature.name" class="border-b border-stroke dark:border-strokedark hover:bg-gray-50 dark:hover:bg-meta-4/20">
              <td class="py-4 px-6 text-black dark:text-white font-medium">
                {{ feature.name }}
                <div v-if="feature.description" class="text-sm text-meta-4 dark:text-meta-5 mt-1">
                  {{ feature.description }}
                </div>
              </td>
              <td v-for="plan in plans" :key="plan.key" class="py-4 px-6 text-center">
                <div v-if="feature.values[plan.key] === true" class="text-success">
                  <svg class="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div v-else-if="feature.values[plan.key] === false" class="text-gray-300">
                  <svg class="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div v-else class="text-black dark:text-white font-medium">
                  {{ feature.values[plan.key] }}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- FAQ Section -->
    <div class="mt-16">
      <h2 class="text-2xl font-bold text-black dark:text-white mb-8 text-center">
        Questions Fréquentes
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div v-for="faq in faqs" :key="faq.question" class="rounded-lg border border-stroke bg-white p-6 dark:border-strokedark dark:bg-boxdark">
          <h3 class="font-semibold text-black dark:text-white mb-3">
            {{ faq.question }}
          </h3>
          <p class="text-meta-4 dark:text-meta-5">
            {{ faq.answer }}
          </p>
        </div>
      </div>
    </div>

    <!-- Contact CTA -->
    <div class="mt-16 text-center">
      <div class="rounded-xl bg-gradient-to-r from-primary to-primary/80 p-8 text-white">
        <h2 class="text-2xl font-bold mb-4">
          Besoin d'un Plan Personnalisé ?
        </h2>
        <p class="mb-6 opacity-90">
          Pour les groupes scolaires ou besoins spécifiques, contactez notre équipe 
          pour une solution sur mesure.
        </p>
        <button class="bg-white text-primary px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
          Contactez-nous
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { SubscriptionPlan } from '@/types/tenant'

// Reactive data
const isAnnual = ref(false)

// Plan data
const plans = [
  {
    key: 'BASIC' as SubscriptionPlan,
    name: 'Basique',
    description: 'Parfait pour débuter',
    monthlyPrice: 29,
    popular: false,
    features: [
      { name: 'Gestion des élèves', included: true, limit: '100 élèves' },
      { name: 'Gestion des professeurs', included: true, limit: '10 professeurs' },
      { name: 'Notes et évaluations', included: true },
      { name: 'Bulletins de base', included: true },
      { name: 'Support email', included: true },
      { name: 'Emplois du temps', included: false },
      { name: 'Communication parents', included: false },
      { name: 'Rapports avancés', included: false },
    ]
  },
  {
    key: 'STANDARD' as SubscriptionPlan,
    name: 'Standard',
    description: 'Le choix idéal',
    monthlyPrice: 59,
    popular: true,
    features: [
      { name: 'Gestion des élèves', included: true, limit: '500 élèves' },
      { name: 'Gestion des professeurs', included: true, limit: '50 professeurs' },
      { name: 'Notes et évaluations', included: true },
      { name: 'Bulletins personnalisés', included: true },
      { name: 'Emplois du temps', included: true },
      { name: 'Communication parents', included: true },
      { name: 'Support prioritaire', included: true },
      { name: 'Rapports avancés', included: false },
    ]
  },
  {
    key: 'PREMIUM' as SubscriptionPlan,
    name: 'Premium',
    description: 'Pour les grands établissements',
    monthlyPrice: 99,
    popular: false,
    features: [
      { name: 'Gestion des élèves', included: true, limit: '1000 élèves' },
      { name: 'Gestion des professeurs', included: true, limit: '100 professeurs' },
      { name: 'Toutes fonctionnalités Standard', included: true },
      { name: 'Bulletins avancés', included: true },
      { name: 'Rapports détaillés', included: true },
      { name: 'API complète', included: true },
      { name: 'Support téléphonique', included: true },
      { name: 'Formation en ligne', included: true },
    ]
  },
  {
    key: 'ENTERPRISE' as SubscriptionPlan,
    name: 'Entreprise',
    description: 'Solutions sur mesure',
    monthlyPrice: 199,
    popular: false,
    features: [
      { name: 'Utilisateurs illimités', included: true },
      { name: 'Multi-établissements', included: true },
      { name: 'Toutes fonctionnalités Premium', included: true },
      { name: 'Intégrations personnalisées', included: true },
      { name: 'Formation dédiée', included: true },
      { name: 'Support 24/7', included: true },
      { name: 'Manager dédié', included: true },
      { name: 'SLA garanti', included: true },
    ]
  }
]

// Detailed features for comparison table
const detailedFeatures = [
  {
    name: 'Nombre d\'élèves',
    description: 'Limite d\'élèves pouvant être gérés',
    values: {
      BASIC: '100',
      STANDARD: '500',
      PREMIUM: '1 000',
      ENTERPRISE: 'Illimité'
    }
  },
  {
    name: 'Nombre de professeurs',
    description: 'Limite de professeurs dans le système',
    values: {
      BASIC: '10',
      STANDARD: '50',
      PREMIUM: '100',
      ENTERPRISE: 'Illimité'
    }
  },
  {
    name: 'Gestion des notes',
    values: {
      BASIC: true,
      STANDARD: true,
      PREMIUM: true,
      ENTERPRISE: true
    }
  },
  {
    name: 'Bulletins scolaires',
    values: {
      BASIC: 'Basique',
      STANDARD: 'Personnalisés',
      PREMIUM: 'Avancés',
      ENTERPRISE: 'Sur mesure'
    }
  },
  {
    name: 'Emplois du temps',
    values: {
      BASIC: false,
      STANDARD: true,
      PREMIUM: true,
      ENTERPRISE: true
    }
  },
  {
    name: 'Communication parents',
    values: {
      BASIC: false,
      STANDARD: true,
      PREMIUM: true,
      ENTERPRISE: true
    }
  },
  {
    name: 'Rapports et analyses',
    values: {
      BASIC: 'Basiques',
      STANDARD: 'Standards',
      PREMIUM: 'Avancés',
      ENTERPRISE: 'Personnalisés'
    }
  },
  {
    name: 'API et intégrations',
    values: {
      BASIC: false,
      STANDARD: 'Limitée',
      PREMIUM: 'Complète',
      ENTERPRISE: 'Sur mesure'
    }
  },
  {
    name: 'Support technique',
    values: {
      BASIC: 'Email',
      STANDARD: 'Prioritaire',
      PREMIUM: 'Téléphone',
      ENTERPRISE: '24/7'
    }
  },
  {
    name: 'Formation et accompagnement',
    values: {
      BASIC: 'Documentation',
      STANDARD: 'Tutoriels',
      PREMIUM: 'En ligne',
      ENTERPRISE: 'Dédiée'
    }
  }
]

// FAQ data
const faqs = [
  {
    question: 'Puis-je changer de plan à tout moment ?',
    answer: 'Oui, vous pouvez mettre à niveau ou rétrograder votre plan à tout moment. Les changements prennent effet immédiatement pour les améliorations et à la fin du cycle de facturation pour les rétrogradations.'
  },
  {
    question: 'Y a-t-il une période d\'essai gratuite ?',
    answer: 'Nous proposons une période d\'essai de 30 jours pour tous nos plans. Aucune carte de crédit n\'est requise pour commencer.'
  },
  {
    question: 'Que se passe-t-il si je dépasse les limites de mon plan ?',
    answer: 'Nous vous notifierons lorsque vous approchez des limites. Vous pourrez alors mettre à niveau votre plan ou supprimer des utilisateurs pour rester dans les limites.'
  },
  {
    question: 'Les données sont-elles sécurisées ?',
    answer: 'Absolument. Toutes les données sont chiffrées et stockées de manière sécurisée. Nous respectons le RGPD et appliquons les meilleures pratiques de sécurité.'
  },
  {
    question: 'Proposez-vous des remises pour les établissements multiples ?',
    answer: 'Oui, nous offrons des tarifs préférentiels pour les groupes scolaires gérant plusieurs établissements. Contactez-nous pour un devis personnalisé.'
  },
  {
    question: 'Comment fonctionne la migration des données ?',
    answer: 'Notre équipe vous accompagne gratuitement dans la migration de vos données existantes. Le processus est sécurisé et ne cause aucune interruption de service.'
  }
]

// Methods
const formatPrice = (price: number, annual: boolean) => {
  return annual ? Math.round(price * 0.8) : price
}

const selectPlan = (plan: any) => {
  // Implement plan selection logic
  console.log('Plan sélectionné:', plan)
  // Could navigate to registration with selected plan
  // or emit event to parent component
}
</script> 