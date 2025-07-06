# Frontend Multi-Tenant - École Manager

## Vue d'ensemble

Cette documentation décrit l'intégration frontend complète du système multi-tenant pour la gestion d'établissements scolaires. Le frontend est développé avec Vue 3, TailwindCSS et TailAdmin, intégrant toutes les fonctionnalités de gestion d'établissements, d'abonnements et de configuration.

## Architecture Frontend

### Structure des fichiers

```
src/
├── types/
│   └── tenant.ts                    # Types TypeScript
├── services/
│   ├── api.ts                       # Configuration API client
│   ├── tenantService.ts             # Service gestion tenants
│   └── subscriptionService.ts       # Service gestion abonnements
├── stores/
│   ├── tenantStore.ts               # Store Pinia tenants
│   └── subscriptionStore.ts         # Store Pinia abonnements
├── views/
│   ├── Tenant/
│   │   ├── TenantRegistration.vue   # Inscription établissement
│   │   ├── TenantDashboard.vue      # Dashboard principal
│   │   ├── TenantDetails.vue        # Détails établissement
│   │   └── TenantEdit.vue           # Édition établissement
│   └── Subscription/
│       └── SubscriptionManagement.vue # Gestion abonnements
├── components/
│   ├── tenant/
│   │   └── TenantSettings.vue       # Configuration établissement
│   └── subscription/
│       └── PlanCard.vue             # Carte plan d'abonnement
└── router/
    └── index.ts                     # Routes multi-tenant
```

## Fonctionnalités Implémentées

### 1. Inscription des Établissements

**Page** : `TenantRegistration.vue`
**Route** : `/tenant/register`

#### Caractéristiques :
- Formulaire d'inscription en 3 étapes
- Validation en temps réel des domaines
- Sélection du plan d'abonnement
- Configuration académique initiale
- Gestion des erreurs et validation

#### Champs du formulaire :
- **Informations générales** : nom, domaine, email, téléphone
- **Configuration académique** : type d'établissement, système de notation, année scolaire
- **Choix d'abonnement** : sélection du plan avec tarification

### 2. Dashboard Principal

**Page** : `TenantDashboard.vue`
**Route** : `/tenant-dashboard`

#### Fonctionnalités :
- Vue d'ensemble de tous les établissements
- Statistiques globales (actifs, en attente, expirants)
- Filtres par statut et plan
- Recherche par nom/domaine
- Actions bulk et pagination
- Menu contextuel par établissement

#### Statistiques affichées :
- Total établissements
- Établissements actifs
- En attente d'activation
- Abonnements expirants (< 30 jours)

### 3. Détails d'Établissement

**Page** : `TenantDetails.vue`
**Route** : `/tenant/:id`

#### Sections :
- **Informations générales** : contact, adresse, domaine
- **Configuration académique** : type, notation, calendrier
- **Utilisation actuelle** : élèves/professeurs avec barres de progression
- **Détails d'abonnement** : plan, dates, fonctionnalités
- **Actions rapides** : activation, suspension, suppression

### 4. Édition d'Établissement

**Page** : `TenantEdit.vue`
**Route** : `/tenant/:id/edit`

#### Fonctionnalités :
- Formulaire de modification complet
- Composant `TenantSettings` réutilisable
- Actions avancées : duplication, transfert, réinitialisation
- Garde de navigation pour modifications non sauvegardées
- Aperçu en temps réel des modifications

### 5. Gestion des Abonnements

**Page** : `SubscriptionManagement.vue`
**Route** : `/subscriptions`

#### Fonctionnalités :
- Sélecteur d'établissement
- Vue d'ensemble de l'abonnement actuel
- Barres d'utilisation avec alertes
- Catalogue des plans disponibles
- Historique de facturation
- Actions : upgrade, downgrade, renouvellement, annulation

## Composants Réutilisables

### TenantSettings.vue

Composant complet de configuration d'établissement :

#### Sections :
1. **Informations générales** : nom, email, téléphone, type
2. **Adresse** : rue, ville, code postal, pays
3. **Configuration académique** : système de notation, calendrier, langue
4. **Personnalisation** : logo, couleurs de thème

#### Fonctionnalités :
- Validation en temps réel
- Aperçu des modifications
- Sélecteur de couleurs intégré
- Gestion des images de logo

### PlanCard.vue

Composant d'affichage des plans d'abonnement :

#### Caractéristiques :
- Design responsive et moderne
- Badges recommandé/actuel
- Barres d'utilisation pour le plan actuel
- Calculs de prix automatiques
- Actions contextuelles (upgrade/downgrade)

## Services API

### api.ts - Configuration Générale

```typescript
// Intercepteur tenant automatique
config.headers['X-Tenant-Domain'] = currentTenant

// Gestion d'erreurs centralisée
// Notifications toast automatiques
// Configuration timeout et retry
```

### tenantService.ts - Gestion Tenants

#### Méthodes principales :
- `createTenant()` - Création établissement
- `getTenants()` - Liste avec filtres
- `updateTenant()` - Modification
- `activateTenant()` - Activation
- `suspendTenant()` - Suspension
- `checkDomainAvailability()` - Vérification domaine

### subscriptionService.ts - Gestion Abonnements

#### Méthodes principales :
- `getPlanDetails()` - Détails des plans
- `getUsageStats()` - Statistiques d'utilisation
- `upgradePlan()` - Mise à niveau
- `renewSubscription()` - Renouvellement
- `getBillingHistory()` - Historique facturation

## Stores Pinia

### tenantStore.ts

#### État :
- `tenants[]` - Liste des établissements
- `currentTenant` - Établissement actuel
- `loading` - État de chargement
- `pagination` - Informations de pagination

#### Actions :
- Gestion CRUD complète
- Cache et synchronisation
- Gestion des erreurs
- Persistance localStorage

### subscriptionStore.ts

#### État :
- `plans{}` - Détails des plans
- `usageStats` - Statistiques d'utilisation
- `billingHistory[]` - Historique facturation

#### Helpers :
- Formatage des prix
- Calculs de coûts
- Couleurs d'état
- Validation des limites

## Types TypeScript

### Interfaces principales :

```typescript
interface Tenant {
  _id: string
  name: string
  domain: string
  email: string
  status: TenantStatus
  settings: TenantSettings
  subscription: Subscription
}

interface TenantSettings {
  schoolType: 'primary' | 'secondary' | 'university' | 'mixed'
  gradeSystem: 'numeric' | 'letter' | 'points'
  academicYearStart: string
  academicYearEnd: string
  // ... autres configurations
}

interface Subscription {
  plan: SubscriptionPlan
  maxStudents: number
  maxTeachers: number
  features: string[]
  pricePerMonth: number
  isActive: boolean
}
```

## Routes Configuration

### Routes ajoutées :

```typescript
// Inscription
'/tenant/register' → TenantRegistration.vue

// Gestion établissements
'/tenant-dashboard' → TenantDashboard.vue
'/tenant/:id' → TenantDetails.vue
'/tenant/:id/edit' → TenantEdit.vue

// Gestion abonnements
'/subscriptions' → SubscriptionManagement.vue
'/tenant/:id/subscription' → TenantSubscription.vue
'/plans' → PlanComparison.vue
```

## Configuration

### Variables d'environnement :

```env
# API Configuration
VITE_API_URL=http://localhost:3000/api/v1

# Application
VITE_APP_NAME=École Manager
VITE_DEFAULT_DOMAIN=monecole.fr

# Multi-tenant
VITE_ENABLE_TENANT_ISOLATION=true
```

### Dépendances ajoutées :

```json
{
  "axios": "^1.x.x",
  "pinia": "^2.x.x",
  "@vueuse/core": "^10.x.x",
  "vue-toastification": "^2.x.x"
}
```

## Fonctionnalités UX/UI

### Design System

- **Couleurs** : Palette cohérente avec états (succès, avertissement, erreur)
- **Typographie** : Hiérarchie claire avec TailwindCSS
- **Espacements** : Grille cohérente et responsive
- **Animations** : Transitions fluides pour les interactions

### Responsive Design

- **Mobile-first** : Interface optimisée pour tous les écrans
- **Breakpoints** : sm (640px), md (768px), lg (1024px), xl (1280px)
- **Navigation** : Menu hamburger sur mobile
- **Tables** : Défilement horizontal avec sticky headers

### Accessibilité

- **Contraste** : Respect WCAG 2.1 AA
- **Navigation clavier** : Focus visible et logique
- **Screen readers** : Labels et descriptions appropriés
- **Erreurs** : Messages clairs et contextuels

## Gestion d'État

### Persistence

- **LocalStorage** : Tenant actuel et préférences
- **SessionStorage** : État temporaire de navigation
- **Cache API** : Optimisation des requêtes fréquentes

### Synchronisation

- **Real-time updates** : Mise à jour automatique des données
- **Conflict resolution** : Gestion des modifications concurrentes
- **Offline support** : Fonctionnalités de base hors ligne

## Sécurité Frontend

### Validation

- **Client-side** : Validation immediate pour UX
- **Sanitization** : Nettoyage des entrées utilisateur
- **CSRF Protection** : Tokens automatiques
- **XSS Prevention** : Échappement des données

### Isolation des Tenants

- **Headers automatiques** : X-Tenant-Domain dans toutes les requêtes
- **Route guards** : Vérification des permissions
- **Data filtering** : Isolation stricte des données

## Performance

### Optimisations

- **Lazy loading** : Chargement à la demande des routes
- **Code splitting** : Bundles optimisés par fonctionnalité
- **Image optimization** : Formats WebP et compression
- **Caching** : Stratégies de cache agressives

### Métriques

- **Bundle size** : < 500KB gzippé
- **First paint** : < 1.5s
- **Time to interactive** : < 3s
- **Lighthouse score** : > 90

## Tests

### Structure de tests

```
tests/
├── unit/
│   ├── components/
│   ├── stores/
│   └── services/
├── integration/
│   └── tenant-workflows/
└── e2e/
    └── tenant-management/
```

### Couverture recommandée

- **Components** : > 80%
- **Stores** : > 90%
- **Services** : > 95%
- **E2E** : Workflows critiques

## Déploiement

### Build Configuration

```bash
# Development
npm run dev

# Production build
npm run build

# Preview build
npm run preview
```

### Variables par environnement

- **Development** : API locale, debug activé
- **Staging** : API staging, analytics test
- **Production** : API production, optimisations max

## Maintenance

### Logs et Monitoring

- **Error tracking** : Sentry intégration
- **Analytics** : Usage patterns et performance
- **User feedback** : Système de retours intégré

### Mise à jour

- **Semantic versioning** : Gestion des versions
- **Migration scripts** : Mise à jour des données
- **Rollback strategy** : Plan de retour arrière

## Extensions Futures

### Fonctionnalités prévues

1. **Multi-langue** : I18n complet
2. **Notifications push** : Alertes temps réel
3. **Rapports avancés** : Dashboards personnalisés
4. **API publique** : Intégrations tierces
5. **Mobile app** : Application native

### Architecture évolutive

- **Micro-frontends** : Découpage par domaine
- **Plugin system** : Extensions modulaires
- **Theme engine** : Personnalisation poussée

---

## Support et Contact

Pour toute question ou problème :

- **Documentation technique** : Voir README principal
- **Issues** : GitHub Issues
- **Discussions** : GitHub Discussions

Cette intégration frontend offre une expérience utilisateur complète et moderne pour la gestion multi-tenant d'établissements scolaires, avec une architecture scalable et maintenable. 