# Clothify - Application de Personnalisation de Vêtements

Clothify est une application web qui permet d'ajouter des motifs personnalisés sur des vêtements. Interface intuitive et moderne pour créer des designs uniques.

## 🎨 Fonctionnalités

### Principales
- **Importation d'images** : Téléchargez des photos de vos vêtements
- **Bibliothèque de motifs** : 9 motifs prédéfinis (floral, géométrique, pois, etc.)
- **Motifs personnalisés** : Importez vos propres motifs
- **Édition en temps réel** : Positionnez, redimensionnez et faites pivoter les motifs
- **Exportation** : Téléchargez vos créations en haute qualité

### Contrôles avancés
- **Opacité** : Ajustez la transparence des motifs (0-100%)
- **Taille** : Redimensionnez les motifs (10-200%)
- **Rotation** : Faites pivoter les motifs (0-360°)
- **Retournement** : Flip horizontal et vertical
- **Historique** : Annuler/rétablir les modifications
- **Partage** : Partagez vos créations directement

## 🚀 Démarrage Rapide

### Prérequis
- Un navigateur web moderne (Chrome, Firefox, Safari, Edge)
- Connexion internet (pour les motifs par défaut)

### Installation
1. Téléchargez les fichiers du projet
2. Ouvrez `index.html` dans votre navigateur
3. C'est tout ! Aucune installation requise

### Utilisation

#### 1. Importer un vêtement
- Cliquez sur "Importer un vêtement"
- Sélectionnez une image de votre vêtement
- L'image s'affiche automatiquement dans la zone de travail

#### 2. Ajouter des motifs
- **Motifs prédéfinis** : Cliquez sur un motif dans la galerie
- **Motif personnalisé** : Cliquez sur "Ajouter votre motif" et sélectionnez une image

#### 3. Éditer les motifs
- **Sélectionner** : Cliquez sur un motif pour le sélectionner
- **Déplacer** : Glissez-déposez le motif sur le vêtement
- **Redimensionner** : Utilisez le curseur "Taille"
- **Faire pivoter** : Utilisez le curseur "Rotation"
- **Ajuster l'opacité** : Utilisez le curseur "Opacité"
- **Retourner** : Cliquez sur les boutons Horizontal/Vertical

#### 4. Exporter votre création
- **Télécharger** : Cliquez sur "Télécharger l'image" pour sauvegarder
- **Partager** : Utilisez "Partager" pour envoyer votre création

## 🎯 Conseils d'utilisation

### Pour de meilleurs résultats
- Utilisez des images de vêtements avec un fond clair
- Choisissez des motifs avec une bonne résolution
- Expérimentez avec différentes opacités pour un effet subtil
- Superposez plusieurs motifs pour créer des designs complexes

### Raccourcis et astuces
- Les motifs sélectionnés apparaissent avec un contour bleu
- Le dernier motif ajouté est automatiquement sélectionné
- Utilisez l'historique pour expérimenter sans crainte
- Les motifs peuvent être superposés pour créer des effets uniques

## 🛠️ Structure technique

### Fichiers
```
clothify/
├── index.html      # Interface principale
├── script.js       # Logique de l'application
└── README.md       # Documentation
```

### Technologies utilisées
- **HTML5** : Structure sémantique
- **CSS3** : Design responsive avec Tailwind CSS
- **JavaScript ES6+** : Logique interactive
- **Canvas API** : Manipulation d'images
- **File API** : Importation de fichiers

### Compatibilité navigateur
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 🔧 Personnalisation

### Ajouter de nouveaux motifs prédéfinis
Modifiez le tableau `defaultPatterns` dans `script.js` :

```javascript
const defaultPatterns = [
    { name: 'Votre Motif', url: 'url-de-votre-image', category: 'votre-categorie' },
    // ... autres motifs
];
```

### Personnaliser les couleurs
Modifiez les classes Tailwind dans `index.html` ou ajoutez du CSS personnalisé dans la section `<style>`.

## 📱 Support mobile

L'application est optimisée pour :
- **Desktop** : Expérience complète avec souris
- **Tablette** : Interface tactile adaptée
- **Mobile** : Fonctionnalités essentielles préservées

## 🐛 Dépannage

### Problèmes courants
**Les motifs ne s'affichent pas**
- Vérifiez votre connexion internet
- Essayez de recharger la page

**L'image ne se télécharge pas**
- Assurez-vous d'avoir d'abord importé un vêtement
- Vérifiez que votre navigateur autorise les téléchargements

**Les contrôles ne répondent pas**
- Sélectionnez d'abord un motif en cliquant dessus
- Vérifiez que le motif n'est pas en cours de déplacement

### Performance
- Pour des images très grandes, l'application peut être plus lente
- Limitez le nombre de motifs superposés pour de meilleures performances

## 📄 Licence

Ce projet est créé à des fins éducatives et personnelles.

## 🤝 Contribution

N'hésitez pas à suggérer des améliorations ou à signaler des bugs !

---

**Créé avec ❤️ pour la mode personnalisée**
