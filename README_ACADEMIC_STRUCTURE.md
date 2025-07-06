# Système de Gestion de Structure Académique

## Vue d'ensemble

Le système de gestion de structure académique permet de créer et gérer les éléments fondamentaux d'un établissement scolaire : années scolaires, classes, et créneaux horaires.

## Fonctionnalités implémentées

### 1. Gestion des Années Scolaires
- **Création d'années scolaires** avec périodes d'évaluation
- **Activation/désactivation** des années
- **Périodes personnalisables** (trimestres, semestres, etc.)
- **Validation des dates** et unicité des noms

#### Fonctionnalités :
- ✅ Nom de l'année (ex: 2024-2025)
- ✅ Dates de début et fin
- ✅ Statut actif/inactif
- ✅ Périodes d'évaluation avec dates
- ✅ Description optionnelle

### 2. Gestion des Classes
- **Création de classes** par niveau et type d'école
- **Association aux années scolaires**
- **Gestion des capacités** et salles
- **Matières assignées** (optionnel)

#### Fonctionnalités :
- ✅ Nom de la classe (ex: 6ème A)
- ✅ Niveau et section
- ✅ Type d'école (primaire, collège, lycée, université)
- ✅ Capacité maximale d'élèves
- ✅ Salle de classe assignée
- ✅ Matières enseignées
- ✅ Association à l'année scolaire

### 3. Gestion des Créneaux Horaires
- **Création de créneaux** pour les emplois du temps
- **Gestion des conflits** d'horaires
- **Créneaux récurrents** ou ponctuels
- **Codes couleur** pour l'affichage

#### Fonctionnalités :
- ✅ Nom du créneau
- ✅ Jour de la semaine
- ✅ Heures de début/fin
- ✅ Durée calculée automatiquement
- ✅ Type de cours (cours, TD, TP, examen, etc.)
- ✅ Association à une classe
- ✅ Salle assignée
- ✅ Couleur d'affichage
- ✅ Récurrence hebdomadaire
- ✅ Détection des conflits d'horaires

## Architecture technique

### Backend (NestJS + MongoDB)

#### Schémas de données :
```typescript
// Année scolaire
AcademicYear {
  name: string
  startDate: Date
  endDate: Date
  isActive: boolean
  periods: AcademicPeriod[]
  description?: string
  status: 'active' | 'inactive' | 'archived'
  tenantId: ObjectId
}

// Classe
Class {
  name: string
  level: string
  section?: string
  capacity: number
  schoolType: 'primary' | 'middle' | 'high' | 'university'
  subjects: ObjectId[]
  academicYearId: ObjectId
  classroom?: string
  tenantId: ObjectId
}

// Créneau horaire
Schedule {
  name: string
  dayOfWeek: 'monday' | 'tuesday' | ... | 'sunday'
  startTime: string
  endTime: string
  duration: number
  classId: ObjectId
  academicYearId: ObjectId
  type: 'course' | 'td' | 'tp' | 'exam' | 'break' | 'other'
  color?: string
  isRecurring: boolean
  tenantId: ObjectId
}
```

#### Endpoints API :
```
GET    /api/v1/academic/years          - Liste des années scolaires
POST   /api/v1/academic/years          - Créer une année scolaire
GET    /api/v1/academic/years/active   - Année active
GET    /api/v1/academic/years/:id      - Détails d'une année

GET    /api/v1/academic/classes        - Liste des classes
POST   /api/v1/academic/classes        - Créer une classe
GET    /api/v1/academic/classes/:id    - Détails d'une classe

GET    /api/v1/academic/schedules      - Liste des créneaux
POST   /api/v1/academic/schedules      - Créer un créneau
GET    /api/v1/academic/schedules/:id  - Détails d'un créneau

GET    /api/v1/academic/stats          - Statistiques académiques
```

### Frontend (Vue 3 + TypeScript)

#### Composants créés :
- `AddAcademicYearModal.vue` - Modal de création d'année scolaire
- `AddClassModal.vue` - Modal de création de classe
- `AddScheduleModal.vue` - Modal de création de créneau
- `AcademicStructure.vue` - Vue principale mise à jour

#### Services :
- `academicService.ts` - Appels API
- `academicStore.ts` - Store Pinia pour la gestion d'état

## Utilisation

### 1. Créer une année scolaire
1. Aller sur la page "Structure Académique"
2. Cliquer sur "Nouvelle Année"
3. Remplir le formulaire :
   - Nom (ex: 2024-2025)
   - Dates de début/fin
   - Périodes d'évaluation
   - Marquer comme active si nécessaire

### 2. Créer des classes
1. S'assurer qu'au moins une année scolaire existe
2. Cliquer sur "Nouvelle Classe"
3. Remplir le formulaire :
   - Nom de la classe
   - Niveau et section
   - Type d'école
   - Capacité
   - Année scolaire
   - Matières (optionnel)

### 3. Créer des créneaux
1. S'assurer que des classes existent
2. Cliquer sur "Nouveau Créneau"
3. Remplir le formulaire :
   - Nom du créneau
   - Jour et horaires
   - Type de cours
   - Classe associée
   - Options avancées

## Validation et sécurité

### Validations backend :
- **Années scolaires** : Unicité du nom par tenant, dates cohérentes
- **Classes** : Unicité du nom par année scolaire, capacité valide
- **Créneaux** : Détection des conflits d'horaires, durée cohérente

### Sécurité :
- **Multi-tenant** : Isolation des données par tenant
- **Validation** : DTOs avec class-validator
- **Sanitisation** : Nettoyage des données d'entrée

## Configuration requise

### Variables d'environnement :
```
VITE_API_URL=http://localhost:3000/api/v1  # Frontend
```

### Headers requis :
```
X-Tenant-Id: <tenant-id>  # Obligatoire pour tous les appels API
```

## Développement

### Commandes utiles :
```bash
# Backend
cd backend
npm run start:dev

# Frontend
npm run dev
```

### Tests :
Les modaux et l'API peuvent être testés directement depuis l'interface. Les données sont validées côté client et serveur.

## Améliorations futures

- [ ] Gestion des professeurs assignés
- [ ] Import/export de données
- [ ] Validation avancée des emplois du temps
- [ ] Notifications de conflits
- [ ] Vue calendrier des créneaux
- [ ] Copie d'année en année
- [ ] Archivage automatique

## Troubleshooting

### Erreurs communes :
1. **"Tenant ID requis"** : Vérifier le header X-Tenant-Id
2. **"Année scolaire non trouvée"** : Créer d'abord une année scolaire
3. **"Conflit d'horaire"** : Vérifier les créneaux existants pour la classe

### Logs :
Les erreurs sont logguées côté client (console) et serveur. 