# CustomShirt - Site de Vêtements Personnalisés

Un site e-commerce mobile-first similaire à Spreadshirt pour créer et personnaliser des vêtements.

## 🚀 Fonctionnalités

### ✅ Implémentées
- **Design Mobile-First**: Interface 100% responsive optimisée pour mobile
- **Créateur de Design**: Éditeur en ligne avec canvas pour personnaliser les t-shirts
- **Catalogue Produits**: Grille responsive avec filtres par catégorie
- **Panier Interactif**: Ajout de produits personnalisés et standards
- **PWA**: Application web progressive avec service worker
- **Navigation Mobile**: Menu hamburger et gestes tactiles
- **Animations Fluides**: Transitions et micro-interactions

### 🔄 En cours
- Tests de responsivité et interactions tactiles

### 📋 À venir
- Système de comptes utilisateurs
- Gestion des commandes
- Intégration paiement
- Notifications push

## 🛠️ Technologies

- **HTML5** sémantique et accessible
- **Tailwind CSS** pour le design responsive
- **JavaScript ES6+** vanilla
- **Canvas API** pour le designer
- **Service Worker** pour le mode offline
- **PWA** avec manifest.json

## 📱 Mobile-First

Le site est conçu avec une approche mobile-first :
- Navigation optimisée pour les écrans tactiles
- Boutons de taille minimale 44px pour l'accessibilité
- Menu hamburger pour les petits écrans
- Grille responsive qui s'adapte à toutes les tailles
- Support des gestes tactiles (swipe)

## 🚀 Démarrage

1. Clonez ou téléchargez les fichiers
2. Lancez un serveur local :
   ```bash
   python -m http.server 8000
   ```
3. Ouvrez `http://localhost:8000` dans votre navigateur

## 📱 Installation PWA

Sur mobile :
1. Ouvrez le site dans Chrome/Safari
2. Cliquez sur "Ajouter à l'écran d'accueil"
3. L'application s'installera comme une app native

## 🎨 Personnalisation

Le designer permet de :
- Ajouter du texte personnalisé
- Choisir les couleurs
- Sélectionner la taille du texte
- Changer la couleur du vêtement
- Visualiser en temps réel

## 📦 Structure des Fichiers

```
├── index.html          # Page principale
├── styles.css          # Styles personnalisés
├── script.js           # Logique JavaScript
├── manifest.json       # Manifeste PWA
├── sw.js              # Service Worker
└── README.md          # Documentation
```

## 🌟 Caractéristiques Techniques

- **Performance**: Chargement optimisé avec cache
- **Accessibilité**: Structure sémantique et ARIA
- **SEO**: Meta tags optimisés
- **Offline**: Fonctionnalité de base hors ligne
- **Responsive**: Breakpoints mobile, tablette, desktop

## 📊 Compatibilité

- ✅ Chrome 80+
- ✅ Safari 13+
- ✅ Firefox 75+
- ✅ Edge 80+
- ✅ Mobile iOS/Android

## 🔄 Développement Futur

Pour continuer le développement :
1. Backend API pour la gestion des comptes
2. Base de données pour les commandes
3. Passerelle de paiement (Stripe/PayPal)
4. Upload d'images personnalisées
5. Preview 3D des produits
