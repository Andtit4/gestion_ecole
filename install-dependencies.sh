
#!/bin/bash

echo "🚀 Installation des dépendances pour les améliorations du design..."

# Dépendances pour les tableaux avancés
echo "📊 Installation de TanStack Table..."
npm install @tanstack/react-table

# Dépendances pour les icônes supplémentaires
echo "🎨 Vérification de Lucide React..."
npm install lucide-react

# Dépendances pour les composants Radix UI manquants
echo "🧩 Installation des composants Radix UI..."
npm install @radix-ui/react-avatar
npm install @radix-ui/react-dropdown-menu

# Dépendances pour la validation
echo "✅ Vérification de Zod..."
npm install zod

# Dépendances pour le hachage des mots de passe
echo "🔐 Vérification de bcryptjs..."
npm install bcryptjs
npm install @types/bcryptjs --save-dev

# Dépendances pour les thèmes
echo "🌙 Vérification de next-themes..."
npm install next-themes

# Dépendances pour class-variance-authority
echo "🎭 Vérification de class-variance-authority..."
npm install class-variance-authority

# Dépendances pour clsx et tailwind-merge
echo "🎨 Vérification des utilitaires CSS..."
npm install clsx tailwind-merge

echo "✅ Toutes les dépendances ont été installées avec succès !"
echo ""
echo "🎯 Prochaines étapes :"
echo "1. Redémarrez votre serveur de développement : npm run dev"
echo "2. Vérifiez que tous les composants se chargent correctement"
echo "3. Testez les nouvelles fonctionnalités dans l'interface"
echo ""
echo "📚 Documentation disponible dans DESIGN_IMPROVEMENTS.md" 