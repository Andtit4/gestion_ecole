# Système de Gestion des Élèves

Ce document explique l'implémentation du système de gestion des élèves dans l'application de gestion d'école.

## 🎯 Fonctionnalités Implémentées

### ✅ Écran d'Ajout d'Élève
- **Composant**: `src/components/forms/AddStudentModal.vue`
- **Formulaire complet** avec toutes les informations requises :
  - Informations personnelles (nom, prénom, email, téléphone, date de naissance, genre)
  - Adresse complète
  - Contact des parents/tuteurs (père, mère, tuteur légal)
  - Informations académiques (classe, niveau, section, date d'inscription, statut)
  - Informations médicales optionnelles (allergies, médicaments, contact d'urgence, groupe sanguin, besoins spéciaux)

### ✅ API Backend Complète
- **Contrôleur**: `backend/src/modules/student/student.controller.ts`
- **Service**: `backend/src/modules/student/student.service.ts`
- **Schéma**: `backend/src/modules/student/schemas/student.schema.ts`
- **DTOs**: `backend/src/modules/student/dto/`

### ✅ Intégration Frontend-Backend
- **Service**: `src/services/studentService.ts`
- **Store Pinia**: `src/stores/studentStore.ts`
- **Vue principale**: `src/views/Students/StudentManagement.vue`

## 🚀 Comment Utiliser

### 1. Démarrer le Backend
```bash
cd backend
npm install
npm run start:dev
```

### 2. Démarrer le Frontend
```bash
npm install
npm run dev
```

### 3. Accéder à la Gestion des Élèves
- Aller sur `/students` dans l'application
- Cliquer sur "Nouvel Élève" pour ouvrir le modal d'ajout

## 📋 Fonctionnalités du Formulaire

### Informations Personnelles ✨
- **Prénom** et **Nom** (obligatoires)
- **Numéro d'élève** avec génération automatique
- **Email** (obligatoire, unique par tenant)
- **Téléphone** (optionnel)
- **Date de naissance** (obligatoire)
- **Genre** (Masculin/Féminin)

### Adresse 📍
- **Rue** (obligatoire)
- **Ville** (obligatoire)
- **Code postal** (obligatoire)
- **Pays** (obligatoire, par défaut "France")

### Contact des Parents 👨‍👩‍👧‍👦
- **Père** : nom, téléphone, email
- **Mère** : nom, téléphone, email
- **Tuteur légal** : nom, téléphone, email (optionnel)

### Informations Académiques 🎓
- **Classe** (sélection parmi les classes disponibles)
- **Niveau** (auto-rempli selon la classe)
- **Section** (optionnelle)
- **Date d'inscription** (obligatoire)
- **Statut** (Actif, Inactif, Transféré, Diplômé)

### Informations Médicales 🏥 (Optionnelles)
- **Allergies** (ajout par tags)
- **Médicaments** (ajout par tags)
- **Contact d'urgence**
- **Groupe sanguin**
- **Besoins spéciaux** (zone de texte)

## 🔧 Validation et Sécurité

### Côté Backend
- Validation avec **class-validator**
- Vérification d'unicité (numéro d'élève, email)
- Validation des ObjectIds MongoDB
- Isolation par tenant

### Côté Frontend
- Validation HTML5 native
- Validation TypeScript stricte
- Gestion d'erreurs complète
- Interface utilisateur responsive

## 📡 API Endpoints

```
POST   /api/v1/students           # Créer un élève
GET    /api/v1/students           # Liste des élèves (avec filtres/pagination)
GET    /api/v1/students/:id       # Détails d'un élève
PATCH  /api/v1/students/:id       # Modifier un élève
DELETE /api/v1/students/:id       # Supprimer un élève
GET    /api/v1/students/stats     # Statistiques des élèves
```

### Headers Requis
```
X-Tenant-Id: <tenant_id>
Content-Type: application/json
```

## 💾 Structure des Données

### Exemple de Création d'Élève
```json
{
  "firstName": "Jean",
  "lastName": "Dupont",
  "studentNumber": "STU20241234",
  "email": "jean.dupont@exemple.com",
  "phone": "+33 1 23 45 67 89",
  "dateOfBirth": "2010-05-15",
  "gender": "M",
  "address": {
    "street": "123 Rue de la République",
    "city": "Paris",
    "postalCode": "75001",
    "country": "France"
  },
  "parentContact": {
    "fatherName": "Pierre Dupont",
    "fatherPhone": "+33 1 23 45 67 88",
    "fatherEmail": "pierre.dupont@exemple.com",
    "motherName": "Marie Dupont",
    "motherPhone": "+33 1 23 45 67 87",
    "motherEmail": "marie.dupont@exemple.com"
  },
  "academicInfo": {
    "classId": "64f5b2a9e1d4c45f23456781",
    "className": "6ème A",
    "level": "6ème",
    "section": "Sciences",
    "enrollmentDate": "2024-09-01",
    "status": "active"
  },
  "medicalInfo": {
    "allergies": ["Arachides", "Pollen"],
    "medications": ["Ventoline"],
    "emergencyContact": "Dr Martin - 01 23 45 67 86",
    "bloodType": "O+",
    "specialNeeds": "Besoin d'un pupitre adapté"
  }
}
```

## 🎨 Interface Utilisateur

### Caractéristiques UX
- **Modal responsive** qui s'adapte à tous les écrans
- **Formulaire en sections** pour une meilleure organisation
- **Validation en temps réel**
- **Indicateurs de chargement**
- **Messages d'erreur clairs**
- **Auto-génération** du numéro d'élève
- **Tags interactifs** pour allergies/médicaments
- **Thème sombre/clair** supporté

### Actions Disponibles
- ✅ **Créer** un nouvel élève
- 👁️ **Voir** les détails d'un élève
- ✏️ **Modifier** un élève existant
- 🗑️ **Supprimer** un élève
- 🔍 **Rechercher** parmi les élèves
- 📊 **Voir les statistiques**

## 🔄 Prochaines Étapes

### Améliorations Suggérées
1. **Upload de photos** d'élèves
2. **Import en masse** depuis CSV/Excel
3. **Système de notifications** pour les parents
4. **Historique des modifications**
5. **Sauvegarde automatique** du formulaire
6. **Validation avancée** (numéro de téléphone, codes postaux)
7. **Géolocalisation** des adresses
8. **Intégration avec un système de classes** complet

### Optimisations Techniques
1. **Cache** des données fréquemment utilisées
2. **Pagination optimisée** avec virtual scrolling
3. **Compression d'images** automatique
4. **Recherche full-text** avec Elasticsearch
5. **Synchronisation temps réel** avec WebSockets

## 🐛 Résolution de Problèmes

### Erreurs Courantes

**Erreur "Cannot determine type"**
- ✅ **Résolu** : Schéma MongoDB corrigé avec types explicites

**Erreur de validation "Invalid ObjectId"**
- ✅ **Résolu** : IDs de classes prédéfinis utilisés

**Problème de tenant isolation**
- ✅ **Résolu** : Header X-Tenant-Id requis et validé

### Support
Pour toute question ou problème, consulter :
- Les logs du backend (`npm run start:dev`)
- La console du navigateur pour les erreurs frontend
- Les validations de schéma dans les DTOs 