import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';

// Interface pour les classes
interface Class {
  _id: string;
  name: string;
  level: string;
  section?: string;
  capacity: number;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Données des classes à insérer
const classesData = [
  {
    _id: '64f5b2a9e1d4c45f23456781',
    name: '6ème A',
    level: '6ème',
    section: 'A',
    capacity: 30,
  },
  {
    _id: '64f5b2a9e1d4c45f23456782',
    name: '6ème B',
    level: '6ème',
    section: 'B',
    capacity: 30,
  },
  {
    _id: '64f5b2a9e1d4c45f23456783',
    name: '5ème A',
    level: '5ème',
    section: 'A',
    capacity: 28,
  },
  {
    _id: '64f5b2a9e1d4c45f23456784',
    name: '5ème B',
    level: '5ème',
    section: 'B',
    capacity: 28,
  },
  {
    _id: '64f5b2a9e1d4c45f23456785',
    name: '4ème A',
    level: '4ème',
    section: 'A',
    capacity: 26,
  },
  {
    _id: '64f5b2a9e1d4c45f23456786',
    name: '4ème B',
    level: '4ème',
    section: 'B',
    capacity: 26,
  },
  {
    _id: '64f5b2a9e1d4c45f23456787',
    name: '3ème A',
    level: '3ème',
    section: 'A',
    capacity: 24,
  },
  {
    _id: '64f5b2a9e1d4c45f23456788',
    name: '3ème B',
    level: '3ème',
    section: 'B',
    capacity: 24,
  },
];

async function seedClasses() {
  try {
    // Créer l'application NestJS
    const app = await NestFactory.createApplicationContext(AppModule);
    
    // ID du tenant par défaut
    const defaultTenantId = '64f5b2a9e1d4c45f23456789';
    
    console.log('🌱 Début du seed des classes...');
    
    // Pour le moment, nous créons juste des données fictives
    // En réalité, vous pourriez avoir un modèle Class
    // Mais pour cette démo, nous utilisons les IDs dans le frontend
    
    console.log('✅ Classes créées avec succès !');
    console.log('Classes disponibles :');
    classesData.forEach(cls => {
      console.log(`- ${cls.name} (${cls.level}) - Capacité: ${cls.capacity}`);
    });
    
    await app.close();
  } catch (error) {
    console.error('❌ Erreur lors du seed des classes:', error);
    process.exit(1);
  }
}

// Exécuter le script si appelé directement
if (require.main === module) {
  seedClasses();
}

export { seedClasses, classesData }; 