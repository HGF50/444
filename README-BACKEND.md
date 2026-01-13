# CustomShirt Backend

Backend Node.js/Express pour le site de personnalisation de vêtements CustomShirt.

## 🚀 Démarrage Rapide

### 1. Installation des dépendances
```bash
npm install
```

### 2. Démarrage du serveur
```bash
# Mode développement (avec redémarrage automatique)
npm run dev

# Mode production
npm start
```

### 3. Accès au site
- **Local**: http://localhost:3000
- **Réseau**: http://192.168.1.100:3000

## 📡 API Endpoints

### Produits
- `GET /api/products` - Liste tous les produits
- `GET /api/products/:id` - Détails d'un produit
- `GET /api/products?category=tshirts` - Filtre par catégorie

### Panier
- `POST /api/cart` - Ajoute des articles au panier
```json
{
  "userId": "user123",
  "items": [
    {
      "id": 1,
      "name": "T-shirt Classic",
      "price": 19.99,
      "quantity": 2,
      "custom": false
    }
  ]
}
```

### Commandes
- `POST /api/orders` - Crée une commande
- `GET /api/orders/:userId` - Historique des commandes

### Upload de Designs
- `POST /api/upload-design` - Upload d'images personnalisées
```javascript
const formData = new FormData();
formData.append('design', file);
```

## 🗂️ Structure des Fichiers

```
├── server.js              # Serveur principal
├── package.json           # Dépendances et scripts
├── .env                  # Variables d'environnement
├── uploads/              # Images uploadées
├── index.html            # Frontend
├── styles.css            # Styles
├── script.js             # JavaScript frontend
└── README-BACKEND.md     # Documentation backend
```

## 🔧 Configuration

### Variables d'environnement (.env)
- `PORT` - Port du serveur (défaut: 3000)
- `NODE_ENV` - Environnement (development/production)

### Limites d'upload
- Taille max: 5MB par fichier
- Formats: JPEG, PNG, GIF, WebP

## 🌐 Déploiement

### Local
```bash
npm start
```

### Production (Heroku)
```bash
# Installation Heroku CLI
npm install -g heroku

# Création app Heroku
heroku create customshirt

# Déploiement
git push heroku main
```

### Production (Render)
1. Connecter le repo GitHub
2. Configurer les variables d'environnement
3. Déployer automatiquement

## 📊 Fonctionnalités

### ✅ Implémentées
- **API RESTful** : CRUD produits, panier, commandes
- **Upload d'images** : Support multipart/form-data
- **Gestion des erreurs** : Validation et messages clairs
- **CORS** : Support cross-origin
- **Fichiers statiques** : Servir le frontend
- **Logs détaillés** : Informations de démarrage

### 🔄 En cours
- Base de données MongoDB
- Authentification utilisateurs
- Passerelle de paiement Stripe
- Emails de confirmation

### 📋 À venir
- Dashboard admin
- Analytics et statistiques
- Notifications push
- API de tracking de commandes

## 🔒 Sécurité

- **Validation des fichiers** : Types et tailles limités
- **Sanitization** : Nettoyage des entrées utilisateur
- **CORS configuré** : Origines autorisées
- **Error handling** : Pas de fuites d'informations

## 🧪 Tests

```bash
# Tests unitaires (à implémenter)
npm test

# Tests API (à implémenter)
npm run test-api
```

## 📝 Développement

### Ajouter un nouveau endpoint
```javascript
app.get('/api/nouveau-endpoint', (req, res) => {
    // Logique métier
    res.json({ data: 'réponse' });
});
```

### Middleware personnalisé
```javascript
const customMiddleware = (req, res, next) => {
    // Logique du middleware
    next();
};
app.use(customMiddleware);
```

## 🚨 Dépannage

### Port déjà utilisé
```bash
# Trouver le processus
lsof -i :3000

# Tuer le processus
kill -9 <PID>
```

### Problèmes de CORS
Vérifier la configuration dans `server.js` :
```javascript
app.use(cors({
    origin: ['http://localhost:3000', 'https://votredomaine.com']
}));
```

### Upload ne fonctionne pas
Vérifier :
1. Permissions du dossier `uploads/`
2. Taille du fichier (< 5MB)
3. Format du fichier (JPEG/PNG/GIF/WebP)

## 📞 Support

Pour toute question sur le backend :
- Documentation : Ce fichier README-BACKEND.md
- Issues : Créer une issue sur le repo
- Email : support@customshirt.com
