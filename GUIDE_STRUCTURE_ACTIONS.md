# Guide - Composant QuickStructureActions

## Vue d'ensemble

Le composant `QuickStructureActions` a été créé pour gérer la structure académique dans les actions rapides du dashboard d'un établissement. Il suit la même logique que `QuickSubjectActions`.

## Architecture

### Composant Principal
- **Fichier** : `src/components/academic/QuickStructureActions.vue`
- **Design** : Design moderne avec gradients indigo-purple
- **Fonctionnalités** :
  - Métriques visuelles (Années scolaires, Classes, Emplois du temps)
  - Actions rapides pour création
  - Liste des éléments récents
  - Gestion d'état (loading, erreur, vide)

### Intégration Dashboard
- **Fichier** : `src/views/Tenant/TenantDetail.vue`
- **Position** : Après le composant `QuickSubjectActions`
- **Props** : Reçoit le `tenantId` depuis les paramètres de route

### Route Spécifique Tenant
- **Route** : `/school/:tenantId/structure`
- **Nom** : `SchoolAcademicStructure`
- **Composant** : Réutilise `AcademicStructure.vue`

## APIs Utilisées

### Endpoints Academic
1. **Années scolaires** : `GET /api/v1/academic/years`
2. **Classes** : `GET /api/v1/academic/classes`
3. **Emplois du temps** : `GET /api/v1/academic/schedules`

### Header Requis
```javascript
headers: {
  'x-tenant-id': 'TENANT_ID'
}
```

## Fonctionnalités

### Métriques
- **Années Scolaires** : Nombre total avec badge "Active"
- **Classes** : Nombre total par niveau
- **Emplois du temps** : Nombre de créneaux configurés

### Actions Rapides
1. **Créer Année Scolaire** : Ouvre `AddAcademicYearModal`
2. **Créer Classe** : Ouvre `AddClassModal`
3. **Créer Emploi du Temps** : Ouvre `AddScheduleModal`
4. **Gestion Complète** : Redirige vers la page structure

### Liste Récente
- Affiche les 2 dernières années scolaires créées
- Affiche les 2 dernières classes créées
- Badges d'état (Active/Inactive)

## Design System

### Couleurs
- **Primaire** : Indigo-Purple gradient
- **Années** : Bleu (blue-500 to blue-600)
- **Classes** : Vert émeraude (emerald-500 to emerald-600)
- **Emplois du temps** : Violet (purple-500 to purple-600)

### Interactions
- Cartes hover avec shadow
- Boutons avec transform scale
- États loading avec spinners
- Messages d'erreur avec icônes

## Gestion d'État

### Loading
```javascript
const loading = ref(false)
const error = ref('')
```

### Données
```javascript
const years = ref<AcademicYear[]>([])
const classes = ref<Class[]>([])
const schedules = ref<Schedule[]>([])
```

### Computed
```javascript
const totalYears = computed(() => years.value.length)
const totalClasses = computed(() => classes.value.length)
const totalSchedules = computed(() => schedules.value.length)
const hasData = computed(() => /* logique de présence de données */)
```

## Tests API

### Test des Endpoints
```powershell
# Années scolaires
Invoke-WebRequest -Uri "http://localhost:3000/api/v1/academic/years" -Headers @{"x-tenant-id"="TENANT_ID"} -Method GET

# Classes
Invoke-WebRequest -Uri "http://localhost:3000/api/v1/academic/classes" -Headers @{"x-tenant-id"="TENANT_ID"} -Method GET

# Emplois du temps
Invoke-WebRequest -Uri "http://localhost:3000/api/v1/academic/schedules" -Headers @{"x-tenant-id"="TENANT_ID"} -Method GET
```

### Réponses Attendues
- **Status** : 200 OK
- **Content-Type** : application/json
- **Body** : Array JSON (vide si aucune donnée)

## Navigation

### Depuis Dashboard Tenant
```
Dashboard Établissement (/tenant/:id)
└── Actions Rapides
    └── Structure Académique (QuickStructureActions)
        ├── Bouton "Gestion Complète" → /school/:tenantId/structure
        └── Modals de création inline
```

### Route Complète
```
/school/:tenantId/structure → AcademicStructure.vue
```

## Maintenance

### Ajout de Nouvelles Métriques
1. Ajouter l'endpoint API correspondant
2. Créer la computed property
3. Ajouter la carte métrique dans le template
4. Définir la couleur/icône appropriée

### Modification du Design
- Couleurs : Variables dans les classes Tailwind
- Layout : Grids responsive (1 col mobile → 3 cols desktop)
- Animations : Transitions CSS dans les classes hover

## Dépendances

### Composants
- `AddAcademicYearModal.vue`
- `AddClassModal.vue` 
- `AddScheduleModal.vue`

### Services
- `academicService.ts` (getAcademicYears, getClasses, getSchedules)

### Types
- `types/academic.ts` (AcademicYear, Class, Schedule)

## Notes Importantes

1. **Tenant Context** : Toujours passer le tenantId en props
2. **Error Handling** : Gestion gracieuse des erreurs API
3. **Loading States** : Indicateurs visuels pendant les requêtes
4. **Responsive** : Adaptation mobile/desktop
5. **Accessibilité** : Boutons et textes descriptifs

## Exemple d'Usage

```vue
<template>
  <QuickStructureActions :tenant-id="tenantId" />
</template>

<script setup>
const tenantId = route.params.id as string
</script>
``` 