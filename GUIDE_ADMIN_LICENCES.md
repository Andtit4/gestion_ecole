# 🛡️ Guide d'Administration des Licences et Abonnements

## Vue d'ensemble

La nouvelle fonctionnalité d'administration des licences permet aux **super admins** de gérer centralement tous les établissements, leurs abonnements, et leurs licences depuis le dashboard école (`http://localhost:5173/school/dashboard`).

## 🚀 Accès à l'Interface d'Administration

### 1. Connexion en tant que Super Admin

Pour accéder aux fonctionnalités d'administration des licences, vous devez vous connecter avec un compte super admin :

```
URL: http://localhost:5173/school/dashboard
Domaine: super-admin
Utilisateur: super-admin / admin
```

### 2. Détection Automatique

Le système détecte automatiquement si vous êtes un super admin basé sur :
- Le domaine = `super-admin`
- Le nom d'établissement contient "Super"
- Aucun établissement connecté (mode super admin par défaut)

## 🎯 Fonctionnalités Principales

### Dashboard Super Admin

Quand vous vous connectez en tant que super admin, vous verrez :

#### **Statistiques Globales**
- 📊 **Total Établissements** : Nombre total d'établissements enregistrés
- ✅ **Abonnements Actifs** : Nombre d'abonnements en cours
- ⚠️ **Expirent Bientôt** : Abonnements qui expirent dans moins de 30 jours
- 💰 **Revenus Mensuel** : Revenus totaux mensuels

#### **Actions Rapides**
- 🏗️ **Gérer Plans** : Créer et modifier les plans d'abonnement
- 👥 **Abonnements** : Gérer les abonnements des établissements
- 🏫 **Établissements** : Vue d'ensemble de tous les établissements
- 📊 **Rapports** : Générer des rapports d'utilisation et de revenus

## 🏗️ Gestion des Plans d'Abonnement

### Plans Disponibles

Le système propose 3 plans de base :

#### **Plan Starter** - 50€/mois
- 50 élèves maximum
- 5 professeurs maximum
- Gestion des élèves
- Gestion des notes de base
- Bulletins simples
- Support par email

#### **Plan Standard** - 100€/mois
- 200 élèves maximum
- 20 professeurs maximum
- Toutes les fonctionnalités Starter
- Emplois du temps avancés
- Communication avec les parents
- Gestion des absences
- Rapports détaillés
- Support prioritaire

#### **Plan Enterprise** - 1500€/mois
- Utilisateurs illimités
- Toutes les fonctionnalités Standard
- Multi-établissements
- API complète
- Intégrations personnalisées
- Formation dédiée
- Support 24/7
- Gestionnaire de compte dédié

### Création de Plans Personnalisés

Vous pouvez créer des plans personnalisés via l'interface :

1. Cliquez sur **"Nouveau Plan"**
2. Définissez les paramètres :
   - Nom du plan
   - Prix mensuel
   - Nombre max d'élèves
   - Nombre max de professeurs
   - Fonctionnalités incluses
3. Enregistrez le plan

## 🏫 Gestion des Établissements

### Vue d'ensemble des Établissements

L'interface de gestion des établissements permet de :

#### **Filtrage et Recherche**
- 🔍 Recherche par nom ou domaine
- 📋 Filtrage par plan d'abonnement
- 🎯 Filtrage par statut (Actif, Suspendu, Essai)

#### **Informations Affichées**
- Nom et domaine de l'établissement
- Plan d'abonnement actuel
- Date d'expiration
- Utilisation des élèves (actuel/maximum)
- Utilisation des professeurs (actuel/maximum)
- Statut de l'établissement

#### **Actions Disponibles**

Pour chaque établissement, vous pouvez :

##### **Changer Plan**
```javascript
// Changement vers un plan supérieur
changeTenantPlan(tenantId, {
  plan: 'standard',
  duration: 12 // mois
})
```

##### **Prolonger Abonnement**
```javascript
// Prolongation de 6 mois
extendSubscription(tenantId, {
  months: 6
})
```

##### **Suspendre/Activer**
- Suspendre temporairement un établissement
- Réactiver un établissement suspendu

## 📊 Rapports et Analytics

### Types de Rapports

#### **Rapport d'Abonnements**
- Vue d'ensemble de tous les abonnements
- Revenus par plan
- Prévisions de renouvellement
- Formats : PDF, CSV, Excel

#### **Rapport d'Utilisation**
- Utilisation des ressources par établissement
- Tendances d'usage
- Recommandations d'optimisation
- Période personnalisable

#### **Métriques de Revenus**
```javascript
// Exemple de métriques
{
  totalRevenue: 125000,      // Revenus totaux
  recurringRevenue: 110000,  // Revenus récurrents
  newSubscriptions: 15,      // Nouveaux abonnements
  churnRate: 2.5,           // Taux de désabonnement
  averageRevenuePerUser: 85, // Revenu moyen par utilisateur
  growth: 12.3,             // Croissance en %
  breakdown: [              // Répartition par plan
    { plan: 'standard', revenue: 75000, subscribers: 45 },
    { plan: 'enterprise', revenue: 45000, subscribers: 12 }
  ]
}
```

## 🔧 APIs Backend Utilisées

### Endpoints Principaux

#### **Gestion des Tenants**
```http
GET /api/v1/tenants?page=1&limit=10&status=active
GET /api/v1/tenants/expiring-subscriptions
GET /api/v1/tenants/:id/limits
PATCH /api/v1/tenants/:id/activate
PATCH /api/v1/tenants/:id/suspend
```

#### **Gestion des Abonnements**
```http
GET /api/v1/subscriptions/plans
PATCH /api/v1/subscriptions/:tenantId/upgrade
POST /api/v1/subscriptions/:tenantId/extend
```

#### **Statistiques et Rapports**
```http
GET /api/v1/tenants/stats/global
GET /api/v1/tenants/metrics/revenue?period=month
GET /api/v1/tenants/reports/subscriptions?format=pdf
```

## 🛠️ Structure Technique

### Services Frontend

#### **TenantAdminService**
Le service principal pour l'administration des tenants :

```typescript
// Récupérer tous les établissements
const tenants = await tenantAdminService.getAllTenants(1, 10, {
  status: 'active',
  plan: 'standard'
})

// Changer le plan d'un établissement
await tenantAdminService.changeTenantPlan(tenantId, {
  plan: 'enterprise',
  duration: 12
})

// Générer un rapport
const report = await tenantAdminService.generateSubscriptionReport('pdf')
```

### Composants Vue

#### **SchoolDashboard.vue**
- Détection automatique du super admin
- Interface d'administration conditionnelle
- Statistiques en temps réel
- Modales de gestion

#### **Modales Intégrées**
- **Modal Gestion des Plans** : CRUD des plans d'abonnement
- **Modal Établissements** : Gestion complète des établissements

## 🎨 Interface Utilisateur

### Design Moderne
- **Glass effect** avec backdrop-blur
- **Gradients** pour les statistiques
- **Animations** hover et transitions
- **Dark mode** compatible
- **Responsive** design

### Codes Couleur
- 🔵 **Bleu** : Établissements et utilisateurs
- 🟢 **Vert** : Abonnements actifs et revenus
- 🟡 **Jaune/Orange** : Alertes et expirations
- 🟣 **Violet** : Plans et administration
- 🔴 **Rouge** : Suspensions et problèmes

## 🔐 Sécurité et Permissions

### Contrôle d'Accès
- Seuls les super admins peuvent accéder aux fonctionnalités
- Vérification du domaine et des permissions
- Actions auditées et tracées

### Validation des Données
- Validation côté client et serveur
- Confirmation pour les actions critiques
- Gestion d'erreurs robuste

## 📱 Utilisation Mobile

L'interface est entièrement responsive et utilisable sur :
- 📱 Smartphones
- 📲 Tablettes
- 💻 Ordinateurs portables
- 🖥️ Écrans de bureau

## 🚀 Prochaines Améliorations

### Fonctionnalités Prévues
- 📧 **Notifications automatiques** pour les expirations
- 🤖 **Recommandations IA** pour l'optimisation des plans
- 📈 **Analytics avancées** avec graphiques interactifs
- 🔗 **Intégrations** avec systèmes de paiement
- 📋 **Workflow d'approbation** pour les changements de plan

### Optimisations Techniques
- ⚡ Cache intelligent des données
- 🔄 Synchronisation en temps réel
- 📊 Métriques de performance
- 🛡️ Sécurité renforcée

## 💡 Conseils d'Utilisation

### Bonnes Pratiques
1. **Surveillez régulièrement** les abonnements qui expirent
2. **Analysez les tendances** d'utilisation pour optimiser les plans
3. **Communiquez proactivement** avec les établissements
4. **Sauvegardez régulièrement** les rapports importants
5. **Formez les utilisateurs** aux nouvelles fonctionnalités

### Résolution de Problèmes
- Vérifiez la connexion super admin en cas de problème d'accès
- Consultez les logs du navigateur pour les erreurs techniques
- Utilisez les filtres pour trouver rapidement les établissements
- Contactez le support technique pour les problèmes persistants

---

## 📞 Support

Pour toute question ou problème :
- 📧 Email : support@gestion-ecole.com
- 📱 Téléphone : +33 1 23 45 67 89
- 💬 Chat : Disponible dans l'interface admin
- 📖 Documentation : Version complète disponible en ligne 