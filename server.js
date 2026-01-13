const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs-extra');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Configuration de Multer pour l'upload d'images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, 'uploads');
        fs.ensureDirSync(uploadPath);
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueName = uuidv4() + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB max
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Seuls les fichiers image sont autorisés'));
        }
    }
});

// Données en mémoire (pour la démo)
let products = [
    { id: 1, name: 'T-shirt Classic', price: 19.99, category: 'tshirts', image: 'https://picsum.photos/seed/tshirt1/300/300', customizable: true },
    { id: 2, name: 'T-shirt Premium', price: 24.99, category: 'tshirts', image: 'https://picsum.photos/seed/tshirt2/300/300', customizable: true },
    { id: 3, name: 'Sweat à Capuche', price: 39.99, category: 'hoodies', image: 'https://picsum.photos/seed/hoodie1/300/300', customizable: true },
    { id: 4, name: 'Sweat Zip', price: 44.99, category: 'hoodies', image: 'https://picsum.photos/seed/hoodie2/300/300', customizable: true },
    { id: 5, name: 'Casquette', price: 14.99, category: 'accessories', image: 'https://picsum.photos/seed/cap1/300/300', customizable: false },
    { id: 6, name: 'Sac Tote', price: 12.99, category: 'accessories', image: 'https://picsum.photos/seed/bag1/300/300', customizable: false },
    { id: 7, name: 'T-shirt Sport', price: 22.99, category: 'tshirts', image: 'https://picsum.photos/seed/tshirt3/300/300', customizable: true },
    { id: 8, name: 'Sweat Oversize', price: 49.99, category: 'hoodies', image: 'https://picsum.photos/seed/hoodie3/300/300', customizable: true }
];

let orders = [];
let carts = [];

// Routes API
app.get('/api/products', (req, res) => {
    const { category } = req.query;
    const filtered = category && category !== 'all' 
        ? products.filter(p => p.category === category)
        : products;
    res.json(filtered);
});

app.get('/api/products/:id', (req, res) => {
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ error: 'Produit non trouvé' });
    }
});

app.post('/api/cart', (req, res) => {
    const { userId, items } = req.body;
    const cartId = uuidv4();
    
    const cart = {
        id: cartId,
        userId: userId || 'anonymous',
        items: items,
        createdAt: new Date(),
        total: items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    };
    
    carts.push(cart);
    res.json({ success: true, cartId, total: cart.total });
});

app.post('/api/orders', (req, res) => {
    const { userId, items, customerInfo } = req.body;
    const orderId = uuidv4();
    
    const order = {
        id: orderId,
        userId: userId || 'anonymous',
        items: items,
        customerInfo,
        status: 'pending',
        createdAt: new Date(),
        total: items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    };
    
    orders.push(order);
    res.json({ success: true, orderId, status: order.status });
});

app.get('/api/orders/:userId', (req, res) => {
    const userOrders = orders.filter(o => o.userId === req.params.userId);
    res.json(userOrders);
});

// Upload d'images de designs personnalisés
app.post('/api/upload-design', upload.single('design'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Aucun fichier uploadé' });
    }
    
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ 
        success: true, 
        imageUrl,
        filename: req.file.filename 
    });
});

// Servir les fichiers uploadés
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Route principale pour servir le frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Gestion des erreurs
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'Fichier trop volumineux (max 5MB)' });
        }
    }
    res.status(500).json({ error: error.message });
});

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║    🚀 CustomShirt Backend Server is Running!               ║
║                                                              ║
║    📍 Local:    http://localhost:${PORT}                    ║
║    🌐 Network:   http://192.168.1.100:${PORT}           ║
║                                                              ║
║    📦 API Endpoints:                                        ║
║       • GET  /api/products                                     ║
║       • POST /api/cart                                        ║
║       • POST /api/orders                                       ║
║       • POST /api/upload-design                                ║
║                                                              ║
╚════════════════════════════════════════════════════════════════╝
    `);
});

// Export pour les tests
module.exports = app;
