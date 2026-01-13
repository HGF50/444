// Mobile-First JavaScript for CustomShirt
class CustomShirtApp {
    constructor() {
        this.cart = [];
        this.currentShirtColor = 'white';
        this.canvas = null;
        this.ctx = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadProducts();
        this.updateCartCount();
        this.initCanvas();
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

        // Draw shirt shape
        ctx.fillStyle = this.currentShirtColor;
        ctx.beginPath();
        
        // T-shirt shape
        ctx.moveTo(width * 0.2, height * 0.1);
        ctx.lineTo(width * 0.35, height * 0.05);
        ctx.lineTo(width * 0.4, height * 0.15);
        ctx.lineTo(width * 0.6, height * 0.15);
        ctx.lineTo(width * 0.65, height * 0.05);
        ctx.lineTo(width * 0.8, height * 0.1);
        ctx.lineTo(width * 0.85, height * 0.3);
        ctx.lineTo(width * 0.8, height * 0.95);
        ctx.lineTo(width * 0.2, height * 0.95);
        ctx.lineTo(width * 0.15, height * 0.3);
        ctx.closePath();
        ctx.fill();

        // Add border
        ctx.strokeStyle = '#ddd';
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    loadProducts() {
        const products = [
            { id: 1, name: 'T-shirt Classic', price: 19.99, category: 'tshirts', image: 'https://picsum.photos/seed/tshirt1/300/300' },
            { id: 2, name: 'T-shirt Premium', price: 24.99, category: 'tshirts', image: 'https://picsum.photos/seed/tshirt2/300/300' },
            { id: 3, name: 'Sweat à Capuche', price: 39.99, category: 'hoodies', image: 'https://picsum.photos/seed/hoodie1/300/300' },
            { id: 4, name: 'Sweat Zip', price: 44.99, category: 'hoodies', image: 'https://picsum.photos/seed/hoodie2/300/300' },
            { id: 5, name: 'Casquette', price: 14.99, category: 'accessories', image: 'https://picsum.photos/seed/cap1/300/300' },
            { id: 6, name: 'Sac Tote', price: 12.99, category: 'accessories', image: 'https://picsum.photos/seed/bag1/300/300' },
            { id: 7, name: 'T-shirt Sport', price: 22.99, category: 'tshirts', image: 'https://picsum.photos/seed/tshirt3/300/300' },
            { id: 8, name: 'Sweat Oversize', price: 49.99, category: 'hoodies', image: 'https://picsum.photos/seed/hoodie3/300/300' }
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
                <div class="aspect-square overflow-hidden">
                    <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover">
                </div>
                <div class="p-4">
                    <h3 class="font-semibold text-lg mb-2">${product.name}</h3>
                    <p class="text-2xl font-bold text-indigo-600 mb-3">${product.price.toFixed(2)} €</p>
                    <button onclick="app.addToCartFromProduct(${product.id}, '${product.name}', ${product.price})" 
                            class="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition">
                        <i class="fas fa-shopping-cart mr-2"></i>Ajouter au panier
                    </button>
                    <button onclick="app.customizeProduct(${product.id})" 
                            class="w-full mt-2 border border-indigo-600 text-indigo-600 py-2 rounded-lg hover:bg-indigo-50 transition">
                        <i class="fas fa-paint-brush mr-2"></i>Personnaliser
                    </button>
                </div>
            `;
            grid.appendChild(card);
        });
    }

    filterProducts(category) {
        const allProducts = [
            { id: 1, name: 'T-shirt Classic', price: 19.99, category: 'tshirts', image: 'https://picsum.photos/seed/tshirt1/300/300' },
            { id: 2, name: 'T-shirt Premium', price: 24.99, category: 'tshirts', image: 'https://picsum.photos/seed/tshirt2/300/300' },
            { id: 3, name: 'Sweat à Capuche', price: 39.99, category: 'hoodies', image: 'https://picsum.photos/seed/hoodie1/300/300' },
            { id: 4, name: 'Sweat Zip', price: 44.99, category: 'hoodies', image: 'https://picsum.photos/seed/hoodie2/300/300' },
            { id: 5, name: 'Casquette', price: 14.99, category: 'accessories', image: 'https://picsum.photos/seed/cap1/300/300' },
            { id: 6, name: 'Sac Tote', price: 12.99, category: 'accessories', image: 'https://picsum.photos/seed/bag1/300/300' },
            { id: 7, name: 'T-shirt Sport', price: 22.99, category: 'tshirts', image: 'https://picsum.photos/seed/tshirt3/300/300' },
            { id: 8, name: 'Sweat Oversize', price: 49.99, category: 'hoodies', image: 'https://picsum.photos/seed/hoodie3/300/300' }
        ];

        const filtered = category === 'all' 
            ? allProducts 
            : allProducts.filter(p => p.category === category);
        
        this.renderProducts(filtered);
    }

    addToCartFromProduct(productId, name, price) {
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

    customizeProduct(productId) {
        this.openDesigner();
    }

    openDesigner() {
        document.getElementById('designerModal').classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    closeDesigner() {
        document.getElementById('designerModal').classList.add('hidden');
        document.body.style.overflow = 'auto';
    }

    addTextToCanvas() {
        const text = document.getElementById('textInput').value;
        const color = document.getElementById('colorPicker').value;
        const fontSize = document.getElementById('fontSize').value;

        if (!text) {
            alert('Veuillez entrer un texte');
            return;
        }

        this.ctx.fillStyle = color;
        this.ctx.font = `${fontSize}px Arial`;
        this.ctx.textAlign = 'center';
        this.ctx.fillText(text, this.canvas.width / 2, this.canvas.height / 2);

        document.getElementById('textInput').value = '';
    }

    setShirtColor(color) {
        this.currentShirtColor = color;
        this.drawShirt();
    }

    clearCanvas() {
        this.drawShirt();
    }

    addToCart() {
        const item = {
            id: Date.now(),
            name: 'T-shirt Personnalisé',
            price: 29.99,
            quantity: 1,
            custom: true,
            design: this.canvas.toDataURL()
        };

        this.cart.push(item);
        this.updateCartCount();
        this.showNotification('Design personnalisé ajouté au panier!');
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

// Handle responsive behavior
window.addEventListener('resize', () => {
    // Add any responsive logic here
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
