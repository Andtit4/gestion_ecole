# 🏢 Système Multi-Tenant - Gestion d'École

## 📋 Vue d'ensemble

Ce système multi-tenant permet à plusieurs établissements scolaires d'utiliser la même plateforme tout en gardant leurs données complètement isolées.

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   MongoDB       │
│   (Vue.js)      │    │   (NestJS)      │    │                 │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ École A         │────│ TenantGuard     │────│ Collection:     │
│ École B         │    │ Multi-tenancy   │    │ tenants         │
│ École C         │    │ Isolation       │    │ users           │
└─────────────────┘    └─────────────────┘    │ students        │
                                              │ etc...          │
                                              └─────────────────┘
```

## 🚀 Démarrage rapide

### 1. Installation des dépendances
```bash
cd backend
npm install
```

### 2. Configuration de l'environnement
Créez un fichier `.env` dans le dossier backend :
```bash
# Configuration de la base de données MongoDB
MONGODB_URI=mongodb://localhost:27017/gestion_ecole

# Configuration JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=24h

# Configuration de l'application
NODE_ENV=development
PORT=3000
```

### 3. Démarrage de MongoDB
```bash
# Avec Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Ou installation locale de MongoDB
# Suivez les instructions sur https://docs.mongodb.com/manual/installation/
```

### 4. Initialisation des données de test
```bash
npm run seed
```

### 5. Démarrage du serveur
```bash
npm run start:dev
```

L'API sera disponible sur `http://localhost:3000/api/v1`

## 📡 API Endpoints

### Gestion des Tenants (Établissements)

#### Créer un nouvel établissement
```http
POST /api/v1/tenants
Content-Type: application/json

{
  "name": "Lycée Saint-Michel",
  "domain": "lycee-saint-michel",
  "email": "admin@lycee-saint-michel.edu",
  "phone": "+33 1 23 45 67 89",
  "address": {
    "street": "123 Rue de l'École",
    "city": "Paris",
    "postalCode": "75001",
    "country": "France"
  },
  "settings": {
    "schoolType": "secondary",
    "academicYearStart": "09-01",
    "academicYearEnd": "07-15",
    "gradeSystem": "numeric",
    "maxGrade": 20,
    "language": "fr",
    "timezone": "Europe/Paris",
    "currency": "EUR"
  },
  "subscription": {
    "plan": "standard",
    "startDate": "2024-01-01",
    "endDate": "2024-12-31",
    "maxStudents": 300,
    "maxTeachers": 25,
    "pricePerMonth": 59
  }
}
```

#### Lister tous les établissements
```http
GET /api/v1/tenants?page=1&limit=10&status=active&plan=standard
```

#### Obtenir un établissement par domaine
```http
GET /api/v1/tenants/domain/lycee-saint-michel
```

#### Activer un établissement
```http
PATCH /api/v1/tenants/{id}/activate
```

### Gestion des Abonnements

#### Obtenir les détails des plans
```http
GET /api/v1/subscriptions/plans
```

#### Mettre à niveau un abonnement
```http
POST /api/v1/subscriptions/{tenantId}/upgrade
Content-Type: application/json

{
  "plan": "premium",
  "duration": 12
}
```

#### Obtenir les statistiques d'utilisation
```http
GET /api/v1/subscriptions/{tenantId}/usage
```

## 🔒 Isolation Multi-Tenant

### Mécanisme d'isolation

L'isolation des données se fait via le `TenantGuard` qui :

1. **Extraction du tenant** depuis :
   - En-tête HTTP `X-Tenant-Domain`
   - Sous-domaine (ex: `lycee-saint-michel.monapp.com`)
   - Paramètre de requête `?tenant=lycee-saint-michel`

2. **Validation** :
   - Existence du tenant
   - Statut actif
   - Abonnement valide

3. **Injection** du tenant dans la requête pour utilisation ultérieure

### Utilisation dans les contrôleurs

```typescript
import { UseGuards } from '@nestjs/common';
import { TenantGuard } from '../common/guards/tenant.guard';
import { CurrentTenant, TenantId } from '../common/decorators/tenant.decorator';

@Controller('students')
@UseGuards(TenantGuard)
export class StudentsController {
  
  @Get()
  async findAll(@TenantId() tenantId: string) {
    // Automatiquement filtré par tenant
    return this.studentsService.findAll(tenantId);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @CurrentTenant() tenant: ITenantDocument
  ) {
    // Accès aux informations complètes du tenant
    return this.studentsService.findOne(id, tenant._id);
  }
}
```

## 📊 Plans d'Abonnement

| Plan | Prix/mois | Élèves max | Professeurs max | Fonctionnalités |
|------|-----------|------------|-----------------|-----------------|
| **Basique** | 29€ | 100 | 10 | Gestion de base |
| **Standard** | 59€ | 300 | 25 | + Absences, Communication |
| **Premium** | 99€ | 800 | 50 | + API, Intégrations |
| **Entreprise** | 199€ | Illimité | Illimité | + Multi-campus, SSO |

### Fonctionnalités par plan

- **Basique** : Gestion élèves, notes, bulletins basiques, emploi du temps
- **Standard** : + Gestion absences, communication parents, rapports avancés
- **Premium** : + Accès API, intégrations externes, support prioritaire
- **Entreprise** : + Multi-campus, SSO, logs d'audit, support 24/7

## 🧪 Tests

### Données de test créées

Le script `npm run seed` crée 3 établissements de test :

1. **Lycée Saint-Joseph** (`lycee-saint-joseph`)
   - Plan : Standard
   - Type : Secondaire
   - Système de notes : Numérique (0-20)

2. **École Primaire Les Tilleuls** (`ecole-les-tilleuls`)
   - Plan : Basique
   - Type : Primaire
   - Système de notes : Lettres (A-E)

3. **Université Technologique de Grenoble** (`utg`)
   - Plan : Entreprise
   - Type : Université
   - Système de notes : Points (0-100)

### Test des endpoints

```bash
# Test avec curl
curl -H "X-Tenant-Domain: lycee-saint-joseph" \
     http://localhost:3000/api/v1/tenants/domain/lycee-saint-joseph

# Ou avec des paramètres
curl "http://localhost:3000/api/v1/tenants/domain/lycee-saint-joseph?tenant=lycee-saint-joseph"
```

## 🔧 Configuration avancée

### Variables d'environnement

```bash
# Base de données
MONGODB_URI=mongodb://localhost:27017/gestion_ecole

# Sécurité
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h

# Application
NODE_ENV=development
PORT=3000

# Email (optionnel)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Uploads (optionnel)
UPLOAD_MAX_SIZE=10485760
ALLOWED_FILE_TYPES=jpg,jpeg,png,pdf,doc,docx
```

### Personnalisation des plans

Modifiez le service `SubscriptionService` pour ajuster :
- Prix des abonnements
- Limites par plan
- Fonctionnalités incluses

## 🚦 Prochaines étapes

Une fois le système multi-tenant en place, vous pouvez développer :

1. **Module d'authentification** avec gestion des rôles
2. **Module utilisateurs** (admins, professeurs, élèves, parents)
3. **Module académique** (classes, matières, emplois du temps)
4. **Module évaluation** (notes, bulletins)
5. **Module communication** (messages, notifications)

## 🤝 Contribution

Pour contribuer au développement :

1. Forkez le projet
2. Créez une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Committez vos changements (`git commit -am 'Ajoute nouvelle fonctionnalité'`)
4. Poussez vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Créez une Pull Request

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails. 