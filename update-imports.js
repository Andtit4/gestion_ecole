const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Liste des fichiers contenant l'ancienne importation
const filesToFix = [
  'app/api/timetable/schedule/route.ts',
  'app/api/timetable/schedule/[id]/route.ts',
  'app/api/subjects/route.ts',
  'app/api/teachers/[id]/classes/route.ts',
  'app/api/timetable/schedule/teacher/[id]/route.ts',
  'app/api/parents/[id]/children/route.ts',
  'app/api/evaluations/[id]/route.ts',
  'app/api/evaluations/route.ts',
  'app/api/evaluations/[id]/grades/route.ts',
  'app/api/parents/[id]/route.ts',
  'app/api/teachers/route.ts',
  'app/api/classes/[id]/students/route.ts',
  'app/api/classes/new/route.ts',
  'app/api/parents/route.ts',
  // Pour être sûr, ajoutons aussi les fichiers que nous avons déjà corrigés
  'app/api/timetable/schedule/class/[id]/route.ts'
];

// Chaîne de caractères exacte à remplacer
const oldImport = "import { authOptions } from '@/app/api/auth/[...nextauth]/route'";
const newImport = "import { authOptions } from '@/app/lib/auth'";

// Fonction pour mettre à jour un fichier
function updateFile(filePath) {
  try {
    // Lire le contenu du fichier
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Vérifier si le fichier contient l'ancienne importation
    if (!content.includes(oldImport)) {
      console.log(`Pas besoin de mise à jour pour ${filePath}`);
      return false;
    }
    
    // Remplacer l'ancienne importation par la nouvelle
    const updatedContent = content.replace(oldImport, newImport);
    
    // Écrire le contenu mis à jour
    fs.writeFileSync(filePath, updatedContent, 'utf8');
    
    console.log(`Mise à jour réussie pour ${filePath}`);
    return true;
  } catch (error) {
    console.error(`Erreur lors de la mise à jour de ${filePath}:`, error);
    return false;
  }
}

// Mettre à jour tous les fichiers
let updatedCount = 0;
for (const file of filesToFix) {
  if (updateFile(file)) {
    updatedCount++;
  }
}

console.log(`Total des fichiers mis à jour: ${updatedCount}`);

// Démarrer le serveur après les mises à jour
if (updatedCount > 0) {
  console.log("Redémarrage du serveur...");
  exec("npm run dev", (error, stdout, stderr) => {
    if (error) {
      console.error(`Erreur lors du redémarrage du serveur: ${error}`);
      return;
    }
    console.log(`Serveur redémarré: ${stdout}`);
  });
} 