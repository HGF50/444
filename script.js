// API Configuration
const API_BASE_URL = window.location.origin + '/api';

class CustomShirtApp {
    constructor() {
        this.cart = [];
        this.currentShirtColor = 'white';
        this.canvas = null;
        this.ctx = null;
        this.currentProductId = null;
        this.currentProductName = null;
        this.currentProductPrice = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadProducts();
        this.updateCartCount();
        this.initCanvas();
        this.setupImageUpload();
        this.setupColorPicker();
        this.setupFontSize();
    }

    setupEventListeners() {
        // Mobile menu toggle
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const mobileMenu = document.getElementById('mobileMenu');
        
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.filterProducts(e.target.dataset.category);
                
                // Update active state
                document.querySelectorAll('.filter-btn').forEach(b => {
                    b.classList.remove('active', 'bg-indigo-600', 'text-white');
                    b.classList.add('bg-gray-200', 'text-gray-700');
                });
                e.target.classList.add('active', 'bg-indigo-600', 'text-white');
                e.target.classList.remove('bg-gray-200', 'text-gray-700');
            });
        });

        // Canvas controls
        document.getElementById('fontSize').addEventListener('input', (e) => {
            document.getElementById('fontSizeValue').textContent = e.target.value;
        });

        // Close modal on outside click
        document.getElementById('designerModal').addEventListener('click', (e) => {
            if (e.target.id === 'designerModal') {
                this.closeDesigner();
            }
        });

        // Handle touch events for mobile
        this.setupTouchEvents();
    }

    setupImageUpload() {
        const imageUpload = document.getElementById('imageUpload');
        const uploadArea = imageUpload.parentElement;
        
        // Handle file selection
        imageUpload.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file && file.type.startsWith('image/')) {
                this.handleImageUpload(file);
            }
        });
        
        // Handle drag and drop
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('border-indigo-500', 'bg-indigo-50');
        });
        
        uploadArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('border-indigo-500', 'bg-indigo-50');
        });
        
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('border-indigo-500', 'bg-indigo-50');
            
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                this.handleImageUpload(file);
            }
        });
    }

    setupColorPicker() {
        const colorPicker = document.getElementById('colorPicker');
        const colorHex = document.getElementById('colorHex');
        
        colorPicker.addEventListener('input', (e) => {
            colorHex.textContent = e.target.value.toUpperCase();
        });
    }

    setupFontSize() {
        const fontSize = document.getElementById('fontSize');
        const fontSizeValue = document.getElementById('fontSizeValue');
        
        fontSize.addEventListener('input', (e) => {
            fontSizeValue.textContent = e.target.value;
        });
    }

    handleImageUpload(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                this.drawImageOnCanvas(img);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    drawImageOnCanvas(img) {
        // Calculate dimensions to fit on shirt
        const maxWidth = 120;
        const maxHeight = 120;
        let width = img.width;
        let height = img.height;
        
        // Scale image to fit
        if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width *= ratio;
            height *= ratio;
        }
        
        // Center the image on the shirt
        const x = (this.canvas.width - width) / 2;
        const y = (this.canvas.height - height) / 2;
        
        this.ctx.drawImage(img, x, y, width, height);
        this.showNotification('Image ajoutée avec succès!');
    }

    changeProduct() {
        // Close designer and show product selection
        this.closeDesigner();
        document.getElementById('shop').scrollIntoView({ behavior: 'smooth' });
        this.showNotification('Sélectionnez un nouveau produit à personnaliser');
    }

    initCanvas() {
        this.canvas = document.getElementById('designCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.drawShirt();
    }

    drawShirt() {
        const ctx = this.ctx;
        const width = this.canvas.width;
        const height = this.canvas.height;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Draw shirt shape with better proportions
        ctx.fillStyle = this.currentShirtColor;
        ctx.beginPath();
        
        // T-shirt shape with more realistic proportions
        const centerX = width / 2;
        const shirtWidth = 180;
        const shirtHeight = 220;
        const startX = centerX - shirtWidth / 2;
        const startY = 40;
        
        // Main body
        ctx.rect(startX, startY + 40, shirtWidth, shirtHeight);
        ctx.fill();
        
        // Sleeves
        ctx.beginPath();
        // Left sleeve
        ctx.moveTo(startX, startY + 40);
        ctx.lineTo(startX - 20, startY + 20);
        ctx.lineTo(startX - 10, startY + 60);
        ctx.lineTo(startX, startY + 80);
        ctx.closePath();
        ctx.fill();
        
        // Right sleeve
        ctx.beginPath();
        ctx.moveTo(startX + shirtWidth, startY + 40);
        ctx.lineTo(startX + shirtWidth + 20, startY + 20);
        ctx.lineTo(startX + shirtWidth + 10, startY + 60);
        ctx.lineTo(startX + shirtWidth, startY + 80);
        ctx.closePath();
        ctx.fill();
        
        // Neck
        ctx.beginPath();
        ctx.ellipse(centerX, startY + 30, 30, 20, 0, 0, 2 * Math.PI);
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.strokeStyle = '#ddd';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Add border to main shirt
        ctx.strokeStyle = '#ddd';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.rect(startX, startY + 40, shirtWidth, shirtHeight);
        ctx.stroke();
    }

    async loadProducts() {
        try {
            const response = await fetch(`${API_BASE_URL}/products`);
            const products = await response.json();
            this.renderProducts(products);
        } catch (error) {
            console.error('Erreur lors du chargement des produits:', error);
            // Fallback vers les données locales
            this.loadProductsFallback();
        }
    }

    loadProductsFallback() {
        const products = [
            { id: 1, name: 'T-shirt Classic', price: 19.99, category: 'tshirts', image: 'https://picsum.photos/seed/tshirt1/300/300', customizable: true },
            { id: 2, name: 'T-shirt Premium', price: 24.99, category: 'tshirts', image: 'https://picsum.photos/seed/tshirt2/300/300', customizable: true },
            { id: 3, name: 'Sweat à Capuche', price: 39.99, category: 'hoodies', image: 'https://picsum.photos/seed/hoodie1/300/300', customizable: true },
            { id: 4, name: 'Sweat Zip', price: 44.99, category: 'hoodies', image: 'https://picsum.photos/seed/hoodie2/300/300', customizable: true },
            { id: 5, name: 'Casquette', price: 14.99, category: 'accessories', image: 'https://picsum.photos/seed/cap1/300/300', customizable: false },
            { id: 6, name: 'Sac Tote', price: 12.99, category: 'accessories', image: 'https://picsum.photos/seed/bag1/300/300', customizable: false },
            { id: 7, name: 'T-shirt Sport', price: 22.99, category: 'tshirts', image: 'https://picsum.photos/seed/tshirt3/300/300', customizable: true },
            { id: 8, name: 'Sweat Oversize', price: 49.99, category: 'hoodies', image: 'https://picsum.photos/seed/hoodie3/300/300', customizable: true }
        ];
        this.renderProducts(products);
    }

    renderProducts(products) {
        const grid = document.getElementById('productsGrid');
        grid.innerHTML = '';

        products.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card bg-white rounded-lg shadow-md overflow-hidden';
            card.innerHTML = `
                <div class="aspect-square overflow-hidden relative">
                    <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover">
                    ${product.customizable ? '<div class="absolute top-2 right-2 bg-indigo-600 text-white px-2 py-1 rounded-full text-xs font-semibold">Personnalisable</div>' : ''}
                </div>
                <div class="p-4">
                    <h3 class="font-semibold text-lg mb-2">${product.name}</h3>
                    <p class="text-2xl font-bold text-indigo-600 mb-3">${product.price.toFixed(2)} €</p>
                    <button onclick="app.addToCartFromProduct(${product.id}, '${product.name}', ${product.price})" 
                            class="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition">
                        <i class="fas fa-shopping-cart mr-2"></i>Ajouter au panier
                    </button>
                    ${product.customizable ? `
                    <button onclick="app.customizeProduct(${product.id}, '${product.name}', ${product.price})" 
                            class="w-full mt-2 border border-indigo-600 text-indigo-600 py-2 rounded-lg hover:bg-indigo-50 transition">
                        <i class="fas fa-paint-brush mr-2"></i>Personnaliser
                    </button>` : ''}
                </div>
            `;
            grid.appendChild(card);
        });
    }

    filterProducts(category) {
        const allProducts = [
            { id: 1, name: 'T-shirt Classic', price: 19.99, category: 'tshirts', image: 'https://picsum.photos/seed/tshirt1/300/300', customizable: true },
            { id: 2, name: 'T-shirt Premium', price: 24.99, category: 'tshirts', image: 'https://picsum.photos/seed/tshirt2/300/300', customizable: true },
            { id: 3, name: 'Sweat à Capuche', price: 39.99, category: 'hoodies', image: 'https://picsum.photos/seed/hoodie1/300/300', customizable: true },
            { id: 4, name: 'Sweat Zip', price: 44.99, category: 'hoodies', image: 'https://picsum.photos/seed/hoodie2/300/300', customizable: true },
            { id: 5, name: 'Casquette', price: 14.99, category: 'accessories', image: 'https://picsum.photos/seed/cap1/300/300', customizable: false },
            { id: 6, name: 'Sac Tote', price: 12.99, category: 'accessories', image: 'https://picsum.photos/seed/bag1/300/300', customizable: false },
            { id: 7, name: 'T-shirt Sport', price: 22.99, category: 'tshirts', image: 'https://picsum.photos/seed/tshirt3/300/300', customizable: true },
            { id: 8, name: 'Sweat Oversize', price: 49.99, category: 'hoodies', image: 'https://picsum.photos/seed/hoodie3/300/300', customizable: true }
        ];

        const filtered = category === 'all' 
            ? allProducts 
            : allProducts.filter(p => p.category === category);
        
        this.renderProducts(filtered);
    }

    async addToCartFromProduct(productId, name, price) {
        try {
            const response = await fetch(`${API_BASE_URL}/cart`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: 'anonymous',
                    items: [{
                        productId,
                        name,
                        price,
                        quantity: 1,
                        custom: false
                    }]
                })
            });
            
            const result = await response.json();
            if (result.success) {
                this.cart.push({
                    id: Date.now(),
                    productId,
                    name,
                    price,
                    quantity: 1,
                    custom: false
                });
                this.updateCartCount();
                this.showNotification('Produit ajouté au panier!');
            }
        } catch (error) {
            console.error('Erreur ajout panier:', error);
            // Fallback local
            this.addToCartFallback(productId, name, price);
        }
    }

    addToCartFallback(productId, name, price) {
        const item = {
            id: Date.now(),
            productId,
            name,
            price,
            quantity: 1,
            custom: false
        };

        this.cart.push(item);
        this.updateCartCount();
        this.showNotification('Produit ajouté au panier!');
    }

    customizeProduct(productId, productName, productPrice) {
        this.currentProductId = productId;
        this.currentProductName = productName;
        this.currentProductPrice = productPrice;
        this.openDesigner();
    }

    setupTouchEvents() {
        // Add swipe gestures for mobile
        let touchStartX = 0;
        let touchEndX = 0;

        document.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        document.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe(touchStartX, touchEndX);
        });
    }

    handleSwipe(startX, endX) {
        const swipeThreshold = 50;
        const diff = startX - endX;

        if (Math.abs(diff) > swipeThreshold) {
            // Swipe logic can be added here for mobile navigation
            console.log('Swipe detected');
        }
    }

    openDesigner() {
        document.getElementById('designerModal').classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        
        // Update designer with current product info
        if (this.currentProductName) {
            document.getElementById('designerProductName').textContent = `Personnalisation: ${this.currentProductName}`;
            document.getElementById('selectedProduct').textContent = this.currentProductName;
            document.getElementById('basePrice').textContent = `${this.currentProductPrice.toFixed(2)}€`;
            document.getElementById('totalPrice').textContent = `${(this.currentProductPrice + 5).toFixed(2)}€`;
        }
        
        this.clearCanvas();
    }

    addTextToCanvas() {
        const text = document.getElementById('textInput').value;
        const color = document.getElementById('colorPicker').value;
        const fontSize = document.getElementById('fontSize').value;

        if (!text) {
            alert('Veuillez entrer un texte');
            return;
        }

        // Ensure text is visible on shirt
        const adjustedColor = this.isColorTooSimilar(color, this.currentShirtColor) ? 
            (this.currentShirtColor === 'black' || this.currentShirtColor === 'blue' ? '#ffffff' : '#000000') : color;

        this.ctx.fillStyle = adjustedColor;
        this.ctx.font = `bold ${fontSize}px Arial`;
        this.ctx.textAlign = 'center';
        this.ctx.fillText(text, this.canvas.width / 2, this.canvas.height / 2);

        document.getElementById('textInput').value = '';
    }
isColorTooSimilar(color1, color2) {
        // Simple color contrast check
        const colors = {
            'black': '#000000',
            'white': '#ffffff',
            'red': '#ff0000',
            'blue': '#0000ff',
            'green': '#008000',
            'gray': '#808080'
        };
        
        const hex1 = colors[color1] || color1;
        const hex2 = colors[color2] || color2;
        
        return hex1 === hex2;
    }

    setShirtColor(color) {
        this.currentShirtColor = color;
        this.drawShirt();
    }

    clearCanvas() {
        this.drawShirt();
    }

    applyTemplate(templateType) {
        this.clearCanvas();
        
        switch(templateType) {
            case 'text':
                // Add white text for dark shirts, black for light shirts
                const textColor = this.currentShirtColor === 'black' || this.currentShirtColor === 'blue' ? '#ffffff' : '#000000';
                this.drawText('CUSTOM', textColor, 32, this.canvas.height / 2 - 20);
                this.drawText('DESIGN', textColor, 24, this.canvas.height / 2 + 20);
                break;
            case 'logo':
                // Gold star with text
                this.drawStar('#FFD700', this.canvas.width / 2, this.canvas.height / 2 - 20);
                const logoTextColor = this.currentShirtColor === 'black' || this.currentShirtColor === 'blue' ? '#FFD700' : '#B8860B';
                this.drawText('PREMIUM', logoTextColor, 20, this.canvas.height / 2 + 30);
                break;
            case 'sport':
                // Athletic style
                const sportColor = this.currentShirtColor === 'black' || this.currentShirtColor === 'blue' ? '#ffffff' : '#FF0000';
                this.drawText('ATHLETIC', sportColor, 28, this.canvas.height / 2 - 20);
                this.drawText('PERFORMANCE', sportColor, 16, this.canvas.height / 2 + 20);
                break;
            case 'vintage':
                // Vintage style
                const vintageColor = this.currentShirtColor === 'black' || this.currentShirtColor === 'blue' ? '#8B4513' : '#654321';
                this.drawText('VINTAGE', vintageColor, 24, this.canvas.height / 2 - 20);
                this.drawText('SINCE 2024', vintageColor, 14, this.canvas.height / 2 + 20);
                break;
        }
    }

    drawText(text, color, size, yPosition) {
        this.ctx.fillStyle = color;
        this.ctx.font = `bold ${size}px Arial`;
        this.ctx.textAlign = 'center';
        this.ctx.fillText(text, this.canvas.width / 2, yPosition);
    }

    drawStar(color, x, y) {
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
            const outerX = x + Math.cos(angle) * 20;
            const outerY = y + Math.sin(angle) * 20;
            
            if (i === 0) {
                this.ctx.moveTo(outerX, outerY);
            } else {
                this.ctx.lineTo(outerX, outerY);
            }
            
            const innerAngle = angle + Math.PI / 5;
            const innerX = x + Math.cos(innerAngle) * 10;
            const innerY = y + Math.sin(innerAngle) * 10;
            this.ctx.lineTo(innerX, innerY);
        }
        this.ctx.closePath();
        this.ctx.fill();
    }

    addToCart() {
        const item = {
            id: Date.now(),
            productId: this.currentProductId,
            name: `${this.currentProductName} Personnalisé`,
            price: this.currentProductPrice + 5, // Extra cost for customization
            quantity: 1,
            custom: true,
            design: this.canvas.toDataURL()
        };

        this.cart.push(item);
        this.updateCartCount();
        this.showNotification(`${this.currentProductName} personnalisé ajouté au panier!`);
        this.closeDesigner();
    }

    updateCartCount() {
        const count = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        document.getElementById('cartCount').textContent = count;
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.innerHTML = `
            <i class="fas fa-check-circle mr-2"></i>${message}
        `;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    scrollToShop() {
        document.getElementById('shop').scrollIntoView({ behavior: 'smooth' });
    }
}

// Global functions for inline event handlers
function openDesigner() {
    app.openDesigner();
}

function closeDesigner() {
    app.closeDesigner();
}

function addTextToCanvas() {
    app.addTextToCanvas();
}

function setShirtColor(color) {
    app.setShirtColor(color);
}

function clearCanvas() {
    app.clearCanvas();
}

function addToCart() {
    app.addToCart();
}

function scrollToShop() {
    app.scrollToShop();
}

// Initialize app when DOM is loaded
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new CustomShirtApp();
});

// PWA Support and Install Prompt
let deferredPrompt;
let installButton;

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            })
            .catch((error) => {
                console.log('ServiceWorker registration failed: ', error);
            });
    });
}

// Listen for install prompt
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    showInstallButton();
});

// Show install button
function showInstallButton() {
    // Show floating button
    if (!installButton) {
        installButton = document.createElement('button');
        installButton.innerHTML = '<i class="fas fa-download mr-2"></i>Installer l\'application';
        installButton.className = 'fixed bottom-4 left-4 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg hover:bg-green-700 transition z-50 flex items-center';
        installButton.onclick = installApp;
        document.body.appendChild(installButton);
    }
    
    // Show header button
    const headerInstallBtn = document.getElementById('installPWA');
    if (headerInstallBtn) {
        headerInstallBtn.classList.remove('hidden');
        headerInstallBtn.onclick = installApp;
    }
}

// Install the PWA
async function installApp() {
    if (!deferredPrompt) {
        // Fallback for browsers that don't support beforeinstallprompt
        showInstallInstructions();
        return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
        if (installButton) {
            installButton.remove();
            installButton = null;
        }
        // Hide header button too
        const headerInstallBtn = document.getElementById('installPWA');
        if (headerInstallBtn) {
            headerInstallBtn.classList.add('hidden');
        }
        showInstallSuccess();
    } else {
        console.log('User dismissed the install prompt');
    }
    
    deferredPrompt = null;
}

// Show install instructions for unsupported browsers
function showInstallInstructions() {
    const userAgent = navigator.userAgent.toLowerCase();
    let instructions = '';
    
    if (/android/.test(userAgent)) {
        instructions = `
            <div class="text-left space-y-3">
                <p><strong>Pour installer sur Android :</strong></p>
                <ol class="list-decimal list-inside space-y-2 text-sm">
                    <li>Ouvrez dans Chrome</li>
                    <li>Tapez sur les 3 points ⋮ en haut à droite</li>
                    <li>Sélectionnez "Installer l'application" ou "Ajouter à l'écran d'accueil"</li>
                    <li>Confirmez l'installation</li>
                </ol>
            </div>
        `;
    } else if (/iphone|ipad|ipod/.test(userAgent)) {
        instructions = `
            <div class="text-left space-y-3">
                <p><strong>Pour installer sur iOS :</strong></p>
                <ol class="list-decimal list-inside space-y-2 text-sm">
                    <li>Ouvrez dans Safari</li>
                    <li>Tapez sur l'icône Partager <i class="fas fa-share-square"></i> en bas</li>
                    <li>Faites défiler et tapez "Sur l'écran d'accueil"</li>
                    <li>Tapez "Ajouter" en haut à droite</li>
                </ol>
            </div>
        `;
    } else {
        instructions = `
            <div class="text-left space-y-3">
                <p><strong>Pour installer l'application :</strong></p>
                <ol class="list-decimal list-inside space-y-2 text-sm">
                    <li>Cherchez "Installer" ou "Ajouter à l'écran d'accueil" dans le menu du navigateur</li>
                    <li>Suivez les instructions pour terminer l'installation</li>
                </ol>
            </div>
        `;
    }
    
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4';
    modal.innerHTML = `
        <div class="bg-white rounded-lg max-w-md w-full p-6">
            <h3 class="text-xl font-bold mb-4">Installer CustomShirt</h3>
            ${instructions}
            <button onclick="this.closest('.fixed').remove()" class="mt-6 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">
                Compris
            </button>
        </div>
    `;
    document.body.appendChild(modal);
}

// Show install success notification
function showInstallSuccess() {
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-600 text-white px-6 py-4 rounded-lg shadow-lg z-50 flex items-center';
    notification.innerHTML = `
        <i class="fas fa-check-circle mr-3 text-xl"></i>
        <div>
            <strong>Installation réussie !</strong>
            <p class="text-sm">CustomShirt est maintenant installé</p>
        </div>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transition = 'opacity 0.5s';
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

// Check if app is already installed
window.addEventListener('appinstalled', () => {
    console.log('PWA was installed');
    if (installButton) {
        installButton.remove();
        installButton = null;
    }
    // Hide header button
    const headerInstallBtn = document.getElementById('installPWA');
    if (headerInstallBtn) {
        headerInstallBtn.classList.add('hidden');
    }
    showInstallSuccess();
});

// Also check if PWA is already installed on page load
window.addEventListener('load', () => {
    // Check if running as standalone PWA
    if (window.matchMedia('(display-mode: standalone)').matches || 
        window.navigator.standalone === true) {
        console.log('App is running as standalone PWA');
        // Hide install buttons if already installed
        const headerInstallBtn = document.getElementById('installPWA');
        if (headerInstallBtn) {
            headerInstallBtn.classList.add('hidden');
        }
    }
});
