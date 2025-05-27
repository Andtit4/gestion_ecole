// Script pour nettoyer le cache et lancer l'application
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Fonction pour supprimer un dossier et son contenu
function deleteFolder(folderPath) {
    if (fs.existsSync(folderPath)) {
        console.log(`Suppression du dossier: ${folderPath}`);
        fs.rmSync(folderPath, { recursive: true, force: true });
    }
}

try {
    // Afficher un message de début
    console.log('🧹 Nettoyage du cache Next.js...');

    // Supprimer les dossiers de cache
    deleteFolder(path.join(__dirname, '.next'));
    deleteFolder(path.join(__dirname, 'node_modules/.cache'));

    // Vérifier si le fichier .env.local existe
    const envPath = path.join(__dirname, '.env.local');
    if (!fs.existsSync(envPath)) {
        console.log('⚠️ Fichier .env.local non trouvé, création d\'un exemple...');
        const envExample = `
# Base de données
DATABASE_URL="mysql://root:password@localhost:3306/gestion_ecole"

# NextAuth
NEXTAUTH_URL="http://localhost:3001"
NEXTAUTH_SECRET="votre_clé_secrète_ici"
        `.trim();

        fs.writeFileSync(envPath, envExample);
        console.log('✅ Fichier .env.local créé avec des valeurs par défaut');
    }

    // Lancer l'application
    console.log('🚀 Démarrage de l\'application...');
    execSync('npm run dev -- -p 3001', { stdio: 'inherit' });
} catch (error) {
    console.error('❌ Une erreur est survenue:', error);
    process.exit(1);
}