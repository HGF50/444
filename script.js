class ClothifyApp {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.clothingImage = null;
        this.patterns = [];
        this.selectedPattern = null;
        this.isDragging = false;
        this.isResizing = false;
        this.dragOffset = { x: 0, y: 0 };
        this.history = [];
        this.historyStep = -1;
        this.patternIdCounter = 0;
        
        this.initializeTshirts();
        this.initializePatterns();
        this.setupEventListeners();
        this.setupCanvasEvents();
    }

    initializeTshirts() {
        const tshirtsGrid = document.getElementById('tshirtsGrid');
        const tshirts = [
            { name: 'T-shirt Blanc', color: '#FFFFFF', shadow: '#f0f0f0' },
            { name: 'T-shirt Noir', color: '#000000', shadow: '#333333' },
            { name: 'T-shirt Bleu', color: '#3b82f6', shadow: '#2563eb' },
            { name: 'T-shirt Rouge', color: '#ef4444', shadow: '#dc2626' }
        ];

        tshirts.forEach((tshirt, index) => {
            const tshirtElement = document.createElement('div');
            tshirtElement.className = 'cursor-pointer border-2 border-gray-200 rounded-lg p-4 hover:border-purple-400 transition-all hover:scale-105';
            tshirtElement.innerHTML = `
                <div class="bg-gray-100 rounded-lg p-4 flex items-center justify-center">
                    <canvas id="tshirt-${index}" width="80" height="80" class="rounded"></canvas>
                </div>
                <p class="text-xs text-center mt-2 text-gray-700 font-medium">${tshirt.name}</p>
            `;
            
            tshirtsGrid.appendChild(tshirtElement);
            
            // Créer le t-shirt sur le canvas
            const canvas = document.getElementById(`tshirt-${index}`);
            const ctx = canvas.getContext('2d');
            this.drawTshirtPreview(ctx, tshirt.color, tshirt.shadow, 80, 80);
            
            // Ajouter l'événement de clic
            tshirtElement.addEventListener('click', () => this.selectTshirt(tshirt));
        });
    }

    drawTshirtPreview(ctx, color, shadowColor, width, height) {
        ctx.clearRect(0, 0, width, height);
        
        // Dessiner la forme du t-shirt
        ctx.fillStyle = color;
        ctx.strokeStyle = shadowColor;
        ctx.lineWidth = 1;
        
        // Corps du t-shirt
        ctx.beginPath();
        ctx.moveTo(width * 0.2, height * 0.15);
        ctx.lineTo(width * 0.35, height * 0.05);
        ctx.lineTo(width * 0.4, height * 0.08);
        ctx.lineTo(width * 0.45, height * 0.05);
        ctx.lineTo(width * 0.6, height * 0.05);
        ctx.lineTo(width * 0.65, height * 0.08);
        ctx.lineTo(width * 0.7, height * 0.05);
        ctx.lineTo(width * 0.8, height * 0.15);
        ctx.lineTo(width * 0.85, height * 0.25);
        ctx.lineTo(width * 0.85, height * 0.85);
        ctx.lineTo(width * 0.15, height * 0.85);
        ctx.lineTo(width * 0.15, height * 0.25);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // Ajouter un léger ombrage
        ctx.fillStyle = 'rgba(0,0,0,0.1)';
        ctx.fillRect(width * 0.15, height * 0.75, width * 0.7, height * 0.1);
    }

    selectTshirt(tshirt) {
        // Créer l'image du t-shirt pour le canvas principal
        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 500;
        const ctx = canvas.getContext('2d');
        
        // Fond
        ctx.fillStyle = '#f8f9fa';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // T-shirt principal
        ctx.fillStyle = tshirt.color;
        ctx.strokeStyle = tshirt.shadow;
        ctx.lineWidth = 2;
        
        // Corps du t-shirt
        ctx.beginPath();
        ctx.moveTo(80, 60);
        ctx.lineTo(140, 20);
        ctx.moveTo(160, 20);
        ctx.lineTo(220, 60);
        ctx.lineTo(340, 60);
        ctx.lineTo(340, 420);
        ctx.lineTo(60, 420);
        ctx.lineTo(60, 60);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // Manches
        ctx.beginPath();
        ctx.moveTo(80, 60);
        ctx.lineTo(40, 80);
        ctx.lineTo(40, 140);
        ctx.lineTo(80, 120);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(320, 60);
        ctx.lineTo(360, 80);
        ctx.lineTo(360, 140);
        ctx.lineTo(320, 120);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // Col
        ctx.beginPath();
        ctx.moveTo(140, 20);
        ctx.lineTo(160, 20);
        ctx.lineTo(160, 40);
        ctx.lineTo(140, 40);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // Ombrage subtil
        ctx.fillStyle = 'rgba(0,0,0,0.05)';
        ctx.fillRect(60, 380, 280, 40);
        
        // Convertir en image
        const img = new Image();
        img.onload = () => {
            this.clothingImage = img;
            this.resizeCanvasToImage();
            this.redraw();
            this.saveHistory();
            this.updateButtons();
        };
        img.src = canvas.toDataURL();
    }

    initializePatterns() {
        const patternsGrid = document.getElementById('patternsGrid');
        const defaultPatterns = [
            { name: 'Floral', url: 'https://picsum.photos/seed/floral/100/100', category: 'nature' },
            { name: 'Géométrique', url: 'https://picsum.photos/seed/geometric/100/100', category: 'abstract' },
            { name: 'Pois', url: 'https://picsum.photos/seed/polka/100/100', category: 'classic' },
            { name: 'Rayures', url: 'https://picsum.photos/seed/stripes/100/100', category: 'classic' },
            { name: 'Animal', url: 'https://picsum.photos/seed/animal/100/100', category: 'trend' },
            { name: 'Étoiles', url: 'https://picsum.photos/seed/stars/100/100', category: 'fun' },
            { name: 'Cœur', url: 'https://picsum.photos/seed/hearts/100/100', category: 'romantic' },
            { name: 'Camouflage', url: 'https://picsum.photos/seed/camo/100/100', category: 'military' },
            { name: 'Denim', url: 'https://picsum.photos/seed/denim/100/100', category: 'fabric' }
        ];

        defaultPatterns.forEach(pattern => {
            const patternElement = document.createElement('div');
            patternElement.className = 'pattern-item cursor-pointer border-2 border-gray-200 rounded-lg p-2 hover:border-purple-400';
            patternElement.innerHTML = `
                <img src="${pattern.url}" alt="${pattern.name}" class="w-full h-20 object-cover rounded">
                <p class="text-xs text-center mt-1 text-gray-600">${pattern.name}</p>
            `;
            patternElement.addEventListener('click', () => this.addPattern(pattern.url, pattern.name));
            patternsGrid.appendChild(patternElement);
        });
    }

    setupEventListeners() {
        // Upload motif personnalisé
        document.getElementById('customPatternUpload').addEventListener('change', (e) => this.handleCustomPatternUpload(e));
        
        // Contrôles
        document.getElementById('opacitySlider').addEventListener('input', (e) => this.updatePatternOpacity(e.target.value));
        document.getElementById('sizeSlider').addEventListener('input', (e) => this.updatePatternSize(e.target.value));
        document.getElementById('rotationSlider').addEventListener('input', (e) => this.updatePatternRotation(e.target.value));
        document.getElementById('flipHorizontal').addEventListener('click', () => this.flipPattern('horizontal'));
        document.getElementById('flipVertical').addEventListener('click', () => this.flipPattern('vertical'));
        
        // Actions
        document.getElementById('undoBtn').addEventListener('click', () => this.undo());
        document.getElementById('redoBtn').addEventListener('click', () => this.redo());
        document.getElementById('clearBtn').addEventListener('click', () => this.clearCanvas());
        document.getElementById('downloadBtn').addEventListener('click', () => this.downloadImage());
        document.getElementById('shareBtn').addEventListener('click', () => this.shareImage());
        
        // Mettre à jour les valeurs affichées
        document.getElementById('opacitySlider').addEventListener('input', (e) => {
            document.getElementById('opacityValue').textContent = e.target.value + '%';
        });
        document.getElementById('sizeSlider').addEventListener('input', (e) => {
            document.getElementById('sizeValue').textContent = e.target.value + '%';
        });
        document.getElementById('rotationSlider').addEventListener('input', (e) => {
            document.getElementById('rotationValue').textContent = e.target.value + '°';
        });
    }

    setupCanvasEvents() {
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mouseup', () => this.handleMouseUp());
        this.canvas.addEventListener('mouseleave', () => this.handleMouseUp());
        
        // Touch events pour mobile
        this.canvas.addEventListener('touchstart', (e) => this.handleTouchStart(e));
        this.canvas.addEventListener('touchmove', (e) => this.handleTouchMove(e));
        this.canvas.addEventListener('touchend', () => this.handleMouseUp());
    }

    handleCustomPatternUpload(event) {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.addPattern(e.target.result, 'Motif personnalisé');
            };
            reader.readAsDataURL(file);
        }
    }

    resizeCanvasToImage() {
        if (this.clothingImage) {
            const maxWidth = 600;
            const maxHeight = 500;
            let width = this.clothingImage.width;
            let height = this.clothingImage.height;

            if (width > maxWidth || height > maxHeight) {
                const ratio = Math.min(maxWidth / width, maxHeight / height);
                width *= ratio;
                height *= ratio;
            }

            this.canvas.width = width;
            this.canvas.height = height;
        }
    }

    async addPattern(url, name) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        img.onload = () => {
            const pattern = {
                id: this.patternIdCounter++,
                name: name,
                image: img,
                x: this.canvas.width / 2 - 50,
                y: this.canvas.height / 2 - 50,
                width: 100,
                height: 100,
                opacity: 1,
                rotation: 0,
                flipH: false,
                flipV: false
            };
            
            this.patterns.push(pattern);
            this.selectedPattern = pattern;
            this.redraw();
            this.saveHistory();
            this.updateControls();
            this.updateButtons();
        };
        
        img.onerror = () => {
            // Fallback pour les images qui ne se chargent pas
            const canvas = document.createElement('canvas');
            canvas.width = 100;
            canvas.height = 100;
            const ctx = canvas.getContext('2d');
            
            // Créer un motif par défaut
            ctx.fillStyle = this.getRandomColor();
            ctx.fillRect(0, 0, 100, 100);
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(100, 100);
            ctx.moveTo(100, 0);
            ctx.lineTo(0, 100);
            ctx.stroke();
            
            const pattern = {
                id: this.patternIdCounter++,
                name: name,
                image: canvas,
                x: this.canvas.width / 2 - 50,
                y: this.canvas.height / 2 - 50,
                width: 100,
                height: 100,
                opacity: 1,
                rotation: 0,
                flipH: false,
                flipV: false
            };
            
            this.patterns.push(pattern);
            this.selectedPattern = pattern;
            this.redraw();
            this.saveHistory();
            this.updateControls();
            this.updateButtons();
        };
        
        img.src = url;
    }

    getRandomColor() {
        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    handleMouseDown(event) {
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // Vérifier si on clique sur un motif
        for (let i = this.patterns.length - 1; i >= 0; i--) {
            const pattern = this.patterns[i];
            if (this.isPointInPattern(x, y, pattern)) {
                this.selectedPattern = pattern;
                this.isDragging = true;
                this.dragOffset.x = x - pattern.x;
                this.dragOffset.y = y - pattern.y;
                
                // Mettre le motif sélectionné au premier plan
                this.patterns.splice(i, 1);
                this.patterns.push(pattern);
                
                this.updateControls();
                this.redraw();
                break;
            }
        }
    }

    handleMouseMove(event) {
        if (this.isDragging && this.selectedPattern) {
            const rect = this.canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            
            this.selectedPattern.x = x - this.dragOffset.x;
            this.selectedPattern.y = y - this.dragOffset.y;
            
            this.redraw();
        }
    }

    handleMouseUp() {
        if (this.isDragging) {
            this.isDragging = false;
            this.saveHistory();
        }
    }

    handleTouchStart(event) {
        event.preventDefault();
        const touch = event.touches[0];
        const mouseEvent = new MouseEvent('mousedown', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        this.canvas.dispatchEvent(mouseEvent);
    }

    handleTouchMove(event) {
        event.preventDefault();
        const touch = event.touches[0];
        const mouseEvent = new MouseEvent('mousemove', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        this.canvas.dispatchEvent(mouseEvent);
    }

    isPointInPattern(x, y, pattern) {
        return x >= pattern.x && x <= pattern.x + pattern.width &&
               y >= pattern.y && y <= pattern.y + pattern.height;
    }

    updatePatternOpacity(value) {
        if (this.selectedPattern) {
            this.selectedPattern.opacity = value / 100;
            this.redraw();
            this.saveHistory();
        }
    }

    updatePatternSize(value) {
        if (this.selectedPattern) {
            const scale = value / 100;
            const baseSize = 100;
            this.selectedPattern.width = baseSize * scale;
            this.selectedPattern.height = baseSize * scale;
            this.redraw();
            this.saveHistory();
        }
    }

    updatePatternRotation(value) {
        if (this.selectedPattern) {
            this.selectedPattern.rotation = value * Math.PI / 180;
            this.redraw();
            this.saveHistory();
        }
    }

    flipPattern(direction) {
        if (this.selectedPattern) {
            if (direction === 'horizontal') {
                this.selectedPattern.flipH = !this.selectedPattern.flipH;
            } else {
                this.selectedPattern.flipV = !this.selectedPattern.flipV;
            }
            this.redraw();
            this.saveHistory();
        }
    }

    updateControls() {
        if (this.selectedPattern) {
            document.getElementById('opacitySlider').value = this.selectedPattern.opacity * 100;
            document.getElementById('opacityValue').textContent = Math.round(this.selectedPattern.opacity * 100) + '%';
            
            const size = Math.round((this.selectedPattern.width / 100) * 100);
            document.getElementById('sizeSlider').value = size;
            document.getElementById('sizeValue').textContent = size + '%';
            
            const rotation = Math.round(this.selectedPattern.rotation * 180 / Math.PI);
            document.getElementById('rotationSlider').value = rotation;
            document.getElementById('rotationValue').textContent = rotation + '°';
        }
    }

    redraw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Dessiner l'image du vêtement
        if (this.clothingImage) {
            this.ctx.drawImage(this.clothingImage, 0, 0, this.canvas.width, this.canvas.height);
        }
        
        // Dessiner tous les motifs
        this.patterns.forEach(pattern => {
            this.ctx.save();
            
            // Appliquer les transformations
            this.ctx.globalAlpha = pattern.opacity;
            this.ctx.translate(pattern.x + pattern.width / 2, pattern.y + pattern.height / 2);
            this.ctx.rotate(pattern.rotation);
            
            if (pattern.flipH) {
                this.ctx.scale(-1, 1);
            }
            if (pattern.flipV) {
                this.ctx.scale(1, -1);
            }
            
            // Dessiner le motif
            this.ctx.drawImage(pattern.image, -pattern.width / 2, -pattern.height / 2, pattern.width, pattern.height);
            
            // Dessiner la sélection
            if (pattern === this.selectedPattern) {
                this.ctx.strokeStyle = '#3b82f6';
                this.ctx.lineWidth = 2;
                this.ctx.setLineDash([5, 5]);
                this.ctx.strokeRect(-pattern.width / 2, -pattern.height / 2, pattern.width, pattern.height);
                this.ctx.setLineDash([]);
            }
            
            this.ctx.restore();
        });
    }

    saveHistory() {
        this.historyStep++;
        if (this.historyStep < this.history.length) {
            this.history.length = this.historyStep;
        }
        
        const state = {
            patterns: JSON.parse(JSON.stringify(this.patterns.map(p => ({
                id: p.id,
                name: p.name,
                x: p.x,
                y: p.y,
                width: p.width,
                height: p.height,
                opacity: p.opacity,
                rotation: p.rotation,
                flipH: p.flipH,
                flipV: p.flipV
            })))),
            selectedPatternId: this.selectedPattern ? this.selectedPattern.id : null
        };
        
        this.history.push(state);
        this.updateButtons();
    }

    undo() {
        if (this.historyStep > 0) {
            this.historyStep--;
            this.restoreState(this.history[this.historyStep]);
        }
    }

    redo() {
        if (this.historyStep < this.history.length - 1) {
            this.historyStep++;
            this.restoreState(this.history[this.historyStep]);
        }
    }

    restoreState(state) {
        this.patterns = state.patterns.map(p => ({
            ...p,
            image: this.patterns.find(old => old.id === p.id)?.image || null
        })).filter(p => p.image);
        
        this.selectedPattern = this.patterns.find(p => p.id === state.selectedPatternId);
        
        this.redraw();
        this.updateControls();
        this.updateButtons();
    }

    clearCanvas() {
        if (confirm('Êtes-vous sûr de vouloir effacer tous les motifs ?')) {
            this.patterns = [];
            this.selectedPattern = null;
            this.redraw();
            this.saveHistory();
            this.updateControls();
            this.updateButtons();
        }
    }

    updateButtons() {
        const hasImage = this.clothingImage !== null;
        const hasPatterns = this.patterns.length > 0;
        
        document.getElementById('undoBtn').disabled = this.historyStep <= 0;
        document.getElementById('redoBtn').disabled = this.historyStep >= this.history.length - 1;
        document.getElementById('clearBtn').disabled = !hasPatterns;
        document.getElementById('downloadBtn').disabled = !hasImage;
        document.getElementById('shareBtn').disabled = !hasImage;
    }

    downloadImage() {
        const link = document.createElement('a');
        link.download = 'clothify-design.png';
        link.href = this.canvas.toDataURL();
        link.click();
    }

    shareImage() {
        if (navigator.share) {
            this.canvas.toBlob(blob => {
                const file = new File([blob], 'clothify-design.png', { type: 'image/png' });
                navigator.share({
                    title: 'Mon design Clothify',
                    text: 'Découvrez mon design personnalisé créé avec Clothify !',
                    files: [file]
                }).catch(err => console.log('Erreur de partage:', err));
            });
        } else {
            // Fallback: copier dans le presse-papiers
            this.canvas.toBlob(blob => {
                const item = new ClipboardItem({ 'image/png': blob });
                navigator.clipboard.write([item]).then(() => {
                    alert('Image copiée dans le presse-papiers !');
                });
            });
        }
    }
}

// Initialiser l'application quand le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
    new ClothifyApp();
});
