// Formula 1 Marketplace - Main JavaScript File
// Handles all interactive functionality, animations, and e-commerce logic

class F1Marketplace {
    constructor() {
        this.products = [];
        this.vendors = [];
        this.cart = JSON.parse(localStorage.getItem('f1-cart')) || [];
        this.currentLanguage = 'en';
        this.translations = {};
        this.stripe = null;
        
        this.init();
    }
    
    async init() {
        try {
            // Load data files
            await this.loadData();
            
            // Initialize page-specific functionality
            this.initCommonFeatures();
            this.initPageSpecific();
            
            // Initialize animations
            this.initAnimations();
            
            // Update cart counter
            this.updateCartCounter();
            
            console.log('F1 Marketplace initialized successfully');
        } catch (error) {
            console.error('Failed to initialize F1 Marketplace:', error);
        }
    }
    
    async loadData() {
        try {
            // Load products
            const productsResponse = await fetch('products.json');
            this.products = await productsResponse.json();
            
            // Load vendors
            const vendorsResponse = await fetch('vendors.json');
            this.vendors = await vendorsResponse.json();
            
            // Load translations
            const enResponse = await fetch('en.json');
            this.translations.en = await enResponse.json();
            
            const idResponse = await fetch('id.json');
            this.translations.id = await idResponse.json();
            
            console.log('Data loaded successfully');
        } catch (error) {
            console.error('Error loading data:', error);
            // Use fallback data
            this.loadFallbackData();
        }
    }
    
    loadFallbackData() {
        // Fallback products data
        this.products = [
            {
                id: "ferrari-cap-001",
                title: "Scuderia Ferrari Team Cap 2024",
                vendor_type: "official",
                team: "Ferrari",
                price: 89.99,
                currency: "USD",
                images: ["resources/product-ferrari-cap.jpg"],
                variants: [
                    {id: "s", label: "S", stock: 15},
                    {id: "m", label: "M", stock: 8},
                    {id: "l", label: "L", stock: 12},
                    {id: "xl", label: "XL", stock: 5}
                ],
                stock_total: 40,
                description: "Official Scuderia Ferrari team cap featuring the iconic prancing horse logo. Made from premium materials with adjustable fit.",
                badges: ["official", "new"],
                category: "accessories",
                sku: "SF-CAP-2024-001"
            }
        ];
        
        // Fallback translations
        this.translations = {
            en: {
                nav: { home: "Home", catalog: "Catalog", cart: "Cart" },
                hero: { headline: "Formula 1 Marketplace", subheadline: "Official & Creator Merchandise" }
            }
        };
    }
    
    initCommonFeatures() {
        // Mobile menu toggle
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        
        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
            });
        }
        
        // Initialize Stripe (test mode)
        if (typeof Stripe !== 'undefined') {
            this.stripe = Stripe('pk_test_51H3q5KLkdIwHLd4KXgL6ffN2L9m3Z3J3J3J3J3J3J3J3J3J3J3J3J3J3J'); // Test key
        }
    }
    
    initPageSpecific() {
        const currentPage = this.getCurrentPage();
        
        switch (currentPage) {
            case 'index':
                this.initHomePage();
                break;
            case 'catalog':
                this.initCatalogPage();
                break;
            case 'product-detail':
                this.initProductDetailPage();
                break;
            case 'cart':
                this.initCartPage();
                break;
        }
    }
    
    getCurrentPage() {
        const path = window.location.pathname;
        if (path.includes('catalog')) return 'catalog';
        if (path.includes('product-detail')) return 'product-detail';
        if (path.includes('cart')) return 'cart';
        return 'index';
    }
    
    initHomePage() {
        // Initialize hero typewriter effect
        this.initTypewriter();
        
        // Initialize particle background
        this.initParticleBackground();
        
        // Load featured products
        this.loadFeaturedProducts();
        
        // Initialize scroll animations
        this.initScrollAnimations();
    }
    
    initTypewriter() {
        const typedElement = document.getElementById('typed-headline');
        if (typedElement && typeof Typed !== 'undefined') {
            new Typed('#typed-headline', {
                strings: ['Formula 1 Marketplace', 'Official Merchandise', 'Creator Collections'],
                typeSpeed: 80,
                backSpeed: 50,
                backDelay: 2000,
                loop: true,
                showCursor: true,
                cursorChar: '|'
            });
        }
    }
    
    initParticleBackground() {
        const container = document.getElementById('particle-container');
        if (container && typeof p5 !== 'undefined') {
            new p5((p) => {
                let particles = [];
                
                p.setup = () => {
                    const canvas = p.createCanvas(container.offsetWidth, container.offsetHeight);
                    canvas.parent(container);
                    
                    // Create particles
                    for (let i = 0; i < 50; i++) {
                        particles.push({
                            x: p.random(p.width),
                            y: p.random(p.height),
                            vx: p.random(-1, 1),
                            vy: p.random(-1, 1),
                            size: p.random(2, 6)
                        });
                    }
                };
                
                p.draw = () => {
                    p.clear();
                    
                    // Update and draw particles
                    particles.forEach(particle => {
                        particle.x += particle.vx;
                        particle.y += particle.vy;
                        
                        // Wrap around edges
                        if (particle.x < 0) particle.x = p.width;
                        if (particle.x > p.width) particle.x = 0;
                        if (particle.y < 0) particle.y = p.height;
                        if (particle.y > p.height) particle.y = 0;
                        
                        // Draw particle
                        p.fill(255, 255, 255, 100);
                        p.noStroke();
                        p.circle(particle.x, particle.y, particle.size);
                    });
                };
                
                p.windowResized = () => {
                    p.resizeCanvas(container.offsetWidth, container.offsetHeight);
                };
            });
        }
    }
    
    loadFeaturedProducts() {
        const container = document.getElementById('featured-products');
        if (!container) return;
        
        // Get featured products (first 6 products)
        const featuredProducts = this.products.slice(0, 6);
        
        container.innerHTML = featuredProducts.map(product => this.createProductCard(product)).join('');
        
        // Add event listeners
        this.attachProductEventListeners(container);
    }
    
    createProductCard(product) {
        const vendor = this.vendors.find(v => v.vendor_id === this.getVendorId(product));
        const badges = this.renderBadges(product);
        
        return `
            <div class="product-card rounded-lg overflow-hidden reveal-element" data-product-id="${product.id}">
                <div class="product-image aspect-square">
                    <img src="${product.images[0]}" alt="${product.title}" class="w-full h-full object-cover">
                </div>
                <div class="p-6">
                    <div class="flex items-center gap-2 mb-2">
                        ${badges}
                    </div>
                    <h3 class="font-semibold text-lg mb-2 line-clamp-2">${product.title}</h3>
                    <p class="text-sm text-gray-600 mb-2">
                        ${product.vendor_type === 'official' ? product.team : product.creator_name}
                    </p>
                    <div class="flex items-center justify-between">
                        <span class="text-2xl font-bold">$${product.price}</span>
                        <div class="flex gap-2">
                            <button class="btn-secondary px-1 py-1 text-sm quick-view-btn" data-product-id="${product.id}">
                                View
                            </button>
                            <button class="btn-primary px-1 py-1 text-sm add-to-cart-btn" data-product-id="${product.id}">
                                Add Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    renderBadges(product) {
        let badges = '';
        
        if (product.vendor_type === 'official') {
            badges += '<span class="badge badge-official">Official</span>';
        } else {
            badges += '<span class="badge badge-creator">Creator</span>';
        }
        
        if (product.badges) {
            if (product.badges.includes('limited')) {
                badges += '<span class="badge badge-limited">Limited</span>';
            }
            if (product.badges.includes('new')) {
                badges += '<span class="badge badge-new">New</span>';
            }
        }
        
        return badges;
    }
    
    getVendorId(product) {
        if (product.vendor_type === 'official') {
            return `${product.team.toLowerCase().replace(/\s+/g, '-')}-official`;
        } else {
            return product.creator_name?.toLowerCase().replace(/\s+/g, '-') || 'creator';
        }
    }
    
    attachProductEventListeners(container) {
        // Quick view buttons
        container.querySelectorAll('.quick-view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const productId = btn.dataset.productId;
                this.showQuickView(productId);
            });
        });
        
        // Add to cart buttons
        container.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const productId = btn.dataset.productId;
                this.addToCart(productId);
            });
        });
        
        // Product card clicks
        container.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.quick-view-btn') && !e.target.closest('.add-to-cart-btn')) {
                    const productId = card.dataset.productId;
                    window.location.href = `product-detail.html?id=${productId}`;
                }
            });
        });
    }
    
    initCatalogPage() {
        this.loadCatalogProducts();
        this.initFilters();
        this.initSorting();
        this.initQuickViewModal();
    }
    
    loadCatalogProducts() {
        const container = document.getElementById('products-grid');
        if (!container) return;
        
        // Remove loading skeletons
        container.innerHTML = '';
        
        // Load all products
        container.innerHTML = this.products.map(product => this.createProductCard(product)).join('');
        
        // Add event listeners
        this.attachProductEventListeners(container);
        
        // Update product count
        document.getElementById('product-count').textContent = this.products.length;
        
        // Initialize filters
        this.populateTeamFilters();
    }
    
    populateTeamFilters() {
        const container = document.getElementById('team-filters');
        if (!container) return;
        
        const teams = [...new Set(this.products.filter(p => p.team).map(p => p.team))];
        
        container.innerHTML = teams.map(team => `
            <label class="flex items-center">
                <input type="checkbox" name="team" value="${team}" class="mr-2">
                <span>${team}</span>
            </label>
        `).join('');
    }
    
    initFilters() {
        const filterInputs = document.querySelectorAll('input[type="checkbox"], input[type="radio"]');
        
        filterInputs.forEach(input => {
            input.addEventListener('change', () => {
                this.applyFilters();
            });
        });
        
        // Clear filters button
        const clearBtn = document.getElementById('clear-filters');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                filterInputs.forEach(input => {
                    input.checked = false;
                });
                this.applyFilters();
            });
        }
        
        // Mobile filter toggle
        const filterToggle = document.getElementById('filter-toggle');
        const sidebar = document.querySelector('.filter-sidebar');
        
        if (filterToggle && sidebar) {
            filterToggle.addEventListener('click', () => {
                sidebar.classList.toggle('filter-mobile');
                sidebar.classList.toggle('active');
            });
        }
    }
    
    applyFilters() {
        const filters = {
            channel: Array.from(document.querySelectorAll('input[name="channel"]:checked')).map(i => i.value),
            team: Array.from(document.querySelectorAll('input[name="team"]:checked')).map(i => i.value),
            category: Array.from(document.querySelectorAll('input[name="category"]:checked')).map(i => i.value),
            price: document.querySelector('input[name="price"]:checked')?.value
        };
        
        let filteredProducts = this.products.filter(product => {
            // Channel filter
            if (filters.channel.length > 0 && !filters.channel.includes(product.vendor_type)) {
                return false;
            }
            
            // Team filter
            if (filters.team.length > 0 && !filters.team.includes(product.team)) {
                return false;
            }
            
            // Category filter
            if (filters.category.length > 0 && !filters.category.includes(product.category)) {
                return false;
            }
            
            // Price filter
            if (filters.price) {
                const price = product.price;
                switch (filters.price) {
                    case '0-50':
                        if (price > 50) return false;
                        break;
                    case '50-100':
                        if (price < 50 || price > 100) return false;
                        break;
                    case '100-200':
                        if (price < 100 || price > 200) return false;
                        break;
                    case '200+':
                        if (price < 200) return false;
                        break;
                }
            }
            
            return true;
        });
        
        this.displayFilteredProducts(filteredProducts);
    }
    
    displayFilteredProducts(products) {
        const container = document.getElementById('products-grid');
        if (!container) return;
        
        container.innerHTML = products.map(product => this.createProductCard(product)).join('');
        this.attachProductEventListeners(container);
        
        // Update product count
        document.getElementById('product-count').textContent = products.length;
        
        // Animate in
        if (typeof anime !== 'undefined') {
            anime({
                targets: '.product-card',
                opacity: [0, 1],
                translateY: [30, 0],
                delay: anime.stagger(100),
                duration: 600,
                easing: 'easeOutQuart'
            });
        }
    }
    
    initSorting() {
        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.sortProducts(e.target.value);
            });
        }
    }
    
    sortProducts(sortBy) {
        let sortedProducts = [...this.products];
        
        switch (sortBy) {
            case 'price-low':
                sortedProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                sortedProducts.sort((a, b) => b.price - a.price);
                break;
            case 'newest':
                sortedProducts.sort((a, b) => new Date(b.release_date || 0) - new Date(a.release_date || 0));
                break;
            case 'editor':
                // Mock editor's pick - products with 'new' or 'limited' badges first
                sortedProducts.sort((a, b) => {
                    const aScore = (a.badges?.includes('new') ? 2 : 0) + (a.badges?.includes('limited') ? 1 : 0);
                    const bScore = (b.badges?.includes('new') ? 2 : 0) + (b.badges?.includes('limited') ? 1 : 0);
                    return bScore - aScore;
                });
                break;
            default: // popular
                // Mock popularity - by stock total
                sortedProducts.sort((a, b) => b.stock_total - a.stock_total);
        }
        
        this.displayFilteredProducts(sortedProducts);
    }
    
    initQuickViewModal() {
        const modal = document.getElementById('quick-view-modal');
        const closeBtn = document.getElementById('close-modal');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.hideQuickView();
            });
        }
        
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideQuickView();
                }
            });
        }
    }
    
    showQuickView(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;
        
        const modal = document.getElementById('quick-view-modal');
        const content = document.getElementById('modal-content');
        
        if (!modal || !content) return;
        
        content.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <img src="${product.images[0]}" alt="${product.title}" class="w-full h-64 object-cover rounded-lg">
                </div>
                <div>
                    <div class="flex items-center gap-2 mb-4">
                        ${this.renderBadges(product)}
                    </div>
                    <h3 class="font-display text-2xl font-bold mb-4">${product.title}</h3>
                    <p class="text-gray-600 mb-4">${product.description}</p>
                    <div class="flex items-center justify-between mb-6">
                        <span class="text-3xl font-bold">$${product.price}</span>
                        <span class="text-sm text-gray-500">SKU: ${product.sku}</span>
                    </div>
                    <button class="btn-primary w-full py-3 rounded-none font-semibold add-to-cart-btn" data-product-id="${product.id}">
                        Add to Cart
                    </button>
                </div>
            </div>
        `;
        
        // Add event listener to the new add to cart button
        content.querySelector('.add-to-cart-btn').addEventListener('click', () => {
            this.addToCart(productId);
            this.hideQuickView();
        });
        
        modal.classList.remove('hidden');
        
        // Animate in
        if (typeof anime !== 'undefined') {
            anime({
                targets: '.modal-content',
                scale: [0.8, 1],
                opacity: [0, 1],
                duration: 300,
                easing: 'easeOutQuart'
            });
        }
    }
    
    hideQuickView() {
        const modal = document.getElementById('quick-view-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }
    
    initProductDetailPage() {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');
        
        if (productId) {
            this.loadProductDetail(productId);
            this.initProductGallery();
            this.initVariantSelection();
            this.initQuantitySelector();
            this.initProductActions();
        }
    }
    
    loadProductDetail(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) {
            window.location.href = 'catalog.html';
            return;
        }
        
        // Update breadcrumb
        document.getElementById('breadcrumb-product').textContent = product.title;
        
        // Update product information
        document.getElementById('product-title').textContent = product.title;
        document.getElementById('product-price').textContent = `$${product.price}`;
        document.getElementById('product-sku').textContent = `SKU: ${product.sku}`;
        document.getElementById('product-description').textContent = product.description;
        document.getElementById('detailed-description').innerHTML = `<p>${product.description}</p>`;
        
        // Update main image
        const mainImage = document.getElementById('main-image-src');
        mainImage.src = product.images[0];
        mainImage.alt = product.title;
        
        // Update badges
        const badgesContainer = document.getElementById('product-badges');
        badgesContainer.innerHTML = this.renderBadges(product);
        
        // Update vendor info
        const vendor = this.vendors.find(v => v.vendor_id === this.getVendorId(product));
        if (vendor) {
            document.getElementById('vendor-name').textContent = vendor.name;
            document.getElementById('vendor-type').textContent = `(${vendor.vendor_type})`;
        }
        
        // Update stock status
        this.updateStockStatus(product);
        
        // Load variants
        this.loadVariants(product);
        
        // Load related products
        this.loadRelatedProducts(product);
    }
    
    initProductGallery() {
        // This would typically include thumbnail navigation
        // For now, we'll just show the main image
    }
    
    loadVariants(product) {
        if (!product.variants || product.variants.length === 0) return;
        
        const sizeSelector = document.getElementById('size-selector');
        if (!sizeSelector) return;
        
        sizeSelector.innerHTML = product.variants.map(variant => `
            <div class="variant-option ${variant.stock > 0 ? '' : 'disabled'}" data-variant="${variant.id}">
                ${variant.label}
            </div>
        `).join('');
        
        // Select first available variant
        const firstAvailable = sizeSelector.querySelector('.variant-option:not(.disabled)');
        if (firstAvailable) {
            firstAvailable.classList.add('selected');
        }
        
        // Add click handlers
        sizeSelector.querySelectorAll('.variant-option:not(.disabled)').forEach(option => {
            option.addEventListener('click', () => {
                sizeSelector.querySelectorAll('.variant-option').forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
            });
        });
    }
    
    initVariantSelection() {
        // Variant selection is handled in loadVariants method
    }
    
    initQuantitySelector() {
        const minusBtn = document.getElementById('qty-minus');
        const plusBtn = document.getElementById('qty-plus');
        const input = document.getElementById('quantity');
        
        if (minusBtn && plusBtn && input) {
            minusBtn.addEventListener('click', () => {
                const value = parseInt(input.value);
                if (value > 1) {
                    input.value = value - 1;
                }
            });
            
            plusBtn.addEventListener('click', () => {
                const value = parseInt(input.value);
                if (value < 10) {
                    input.value = value + 1;
                }
            });
        }
    }
    
    updateStockStatus(product) {
        const stockDot = document.getElementById('stock-dot');
        const stockText = document.getElementById('stock-text');
        
        if (!stockDot || !stockText) return;
        
        let status, className;
        
        if (product.stock_total > 20) {
            status = 'In Stock';
            className = 'stock-high';
        } else if (product.stock_total > 5) {
            status = 'Limited Stock';
            className = 'stock-medium';
        } else {
            status = 'Low Stock';
            className = 'stock-low';
        }
        
        stockText.textContent = status;
        stockDot.className = `stock-dot ${className}`;
    }
    
    initProductActions() {
        const addToCartBtn = document.getElementById('add-to-cart');
        const buyNowBtn = document.getElementById('buy-now');
        
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', () => {
                const productId = new URLSearchParams(window.location.search).get('id');
                const quantity = parseInt(document.getElementById('quantity')?.value || 1);
                this.addToCart(productId, quantity);
            });
        }
        
        if (buyNowBtn) {
            buyNowBtn.addEventListener('click', () => {
                const productId = new URLSearchParams(window.location.search).get('id');
                const quantity = parseInt(document.getElementById('quantity')?.value || 1);
                this.addToCart(productId, quantity);
                setTimeout(() => {
                    window.location.href = 'cart.html';
                }, 500);
            });
        }
    }
    
    loadRelatedProducts(product) {
        const container = document.getElementById('related-products');
        if (!container) return;
        
        // Find related products (same team/category)
        const related = this.products.filter(p => 
            p.id !== product.id && 
            (p.team === product.team || p.category === product.category)
        ).slice(0, 4);
        
        container.innerHTML = related.map(p => `
            <div class="related-product border rounded-lg overflow-hidden cursor-pointer" onclick="window.location.href='product-detail.html?id=${p.id}'">
                <img src="${p.images[0]}" alt="${p.title}" class="w-full h-48 object-cover">
                <div class="p-4">
                    <h4 class="font-semibold mb-2 line-clamp-2">${p.title}</h4>
                    <div class="flex items-center justify-between">
                        <span class="font-bold">$${p.price}</span>
                        <div class="flex gap-1">
                            ${this.renderBadges(p)}
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    initCartPage() {
        this.loadCartItems();
        this.initCheckoutForm();
        this.initPaymentMethods();
        this.updateOrderSummary();
    }
    
    loadCartItems() {
        const container = document.getElementById('cart-items');
        const emptyCart = document.getElementById('empty-cart');
        const cartContent = document.getElementById('cart-content');
        
        if (!container) return;
        
        if (this.cart.length === 0) {
            if (emptyCart) emptyCart.classList.remove('hidden');
            if (cartContent) cartContent.classList.add('hidden');
            return;
        }
        
        if (emptyCart) emptyCart.classList.add('hidden');
        if (cartContent) cartContent.classList.remove('hidden');
        
        container.innerHTML = this.cart.map(item => {
            const product = this.products.find(p => p.id === item.productId);
            if (!product) return '';
            
            return `
                <div class="cart-item rounded-lg p-6" data-cart-id="${item.id}">
                    <div class="flex items-center gap-4">
                        <img src="${product.images[0]}" alt="${product.title}" class="w-20 h-20 object-cover rounded-lg">
                        <div class="flex-1">
                            <h3 class="font-semibold text-lg mb-1">${product.title}</h3>
                            <p class="text-gray-600 text-sm mb-2">
                                ${product.vendor_type === 'official' ? product.team : product.creator_name}
                            </p>
                            <div class="flex items-center justify-between">
                                <div class="quantity-selector">
                                    <button class="quantity-btn" onclick="f1Marketplace.updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                                    <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="10" onchange="f1Marketplace.updateQuantity('${item.id}', this.value)">
                                    <button class="quantity-btn" onclick="f1Marketplace.updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                                </div>
                                <div class="text-right">
                                    <div class="text-xl font-bold">$${(product.price * item.quantity).toFixed(2)}</div>
                                    <button class="text-red-600 text-sm hover:text-red-700" onclick="f1Marketplace.removeFromCart('${item.id}')">Remove</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        
        this.updateOrderSummary();
    }
    
    initCheckoutForm() {
        const form = document.querySelector('.checkout-form');
        if (!form) return;
        
        const inputs = form.querySelectorAll('input, select');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
        });
        
        const placeOrderBtn = document.getElementById('place-order');
        if (placeOrderBtn) {
            placeOrderBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.processCheckout();
            });
        }
    }
    
    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.id;
        let isValid = true;
        let errorMessage = '';
        
        switch (fieldName) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                isValid = emailRegex.test(value);
                errorMessage = 'Please enter a valid email address';
                break;
            case 'full-name':
                isValid = value.length >= 2;
                errorMessage = 'Please enter your full name';
                break;
            case 'address':
                isValid = value.length >= 5;
                errorMessage = 'Please enter a valid address';
                break;
            case 'city':
                isValid = value.length >= 2;
                errorMessage = 'Please enter your city';
                break;
            case 'zip':
                isValid = value.length >= 3;
                errorMessage = 'Please enter a valid ZIP code';
                break;
            case 'country':
                isValid = value !== '';
                errorMessage = 'Please select your country';
                break;
        }
        
        const errorElement = document.getElementById(`${fieldName}-error`);
        
        if (!isValid && value !== '') {
            field.classList.add('error');
            if (errorElement) {
                errorElement.textContent = errorMessage;
                errorElement.classList.remove('hidden');
            }
        } else {
            field.classList.remove('error');
            if (errorElement) {
                errorElement.classList.add('hidden');
            }
        }
        
        return isValid;
    }
    
    initPaymentMethods() {
        const paymentMethods = document.querySelectorAll('.payment-method');
        
        paymentMethods.forEach(method => {
            method.addEventListener('click', () => {
                paymentMethods.forEach(m => m.classList.remove('selected'));
                method.classList.add('selected');
                method.querySelector('input[type="radio"]').checked = true;
            });
        });
    }
    
    processCheckout() {
        // Validate form
        const form = document.querySelector('.checkout-form');
        const inputs = form.querySelectorAll('input[required], select[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            this.showToast('Please fill in all required fields correctly', 'error');
            return;
        }
        
        // Show loading overlay
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.classList.remove('hidden');
        }
        
        // Simulate payment processing
        setTimeout(() => {
            this.processPayment();
        }, 2000);
    }
    
    processPayment() {
        const selectedPayment = document.querySelector('input[name="payment"]:checked').value;
        
        // Simulate different payment processes
        switch (selectedPayment) {
            case 'card':
                this.processCardPayment();
                break;
            case 'paypal':
                this.processPayPalPayment();
                break;
            case 'crypto':
                this.processCryptoPayment();
                break;
        }
    }
    
    processCardPayment() {
        // Simulate Stripe payment
        setTimeout(() => {
            this.completeOrder();
        }, 1000);
    }
    
    processPayPalPayment() {
        // Simulate PayPal payment
        setTimeout(() => {
            this.completeOrder();
        }, 1500);
    }
    
    processCryptoPayment() {
        // Simulate crypto payment
        setTimeout(() => {
            this.completeOrder();
        }, 2000);
    }
    
    completeOrder() {
        // Hide loading overlay
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.classList.add('hidden');
        }
        
        // Generate order details
        const orderNumber = `F1M-${Date.now()}`;
        const trackingNumber = `TRK${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        const total = this.calculateCartTotal();
        
        // Update success modal
        document.getElementById('order-number').textContent = orderNumber;
        document.getElementById('tracking-number').textContent = trackingNumber;
        document.getElementById('total-paid').textContent = `$${total.toFixed(2)}`;
        
        // Show success modal
        const successModal = document.getElementById('success-modal');
        if (successModal) {
            successModal.classList.remove('hidden');
        }
        
        // Clear cart
        this.cart = [];
        this.saveCart();
        this.updateCartCounter();
        
        // Send confirmation email (mock)
        this.sendConfirmationEmail(orderNumber, total);
        
        // Handle modal buttons
        document.getElementById('continue-shopping').addEventListener('click', () => {
            window.location.href = 'catalog.html';
        });
        
        document.getElementById('track-order').addEventListener('click', () => {
            this.showToast('Tracking information will be available in 24 hours', 'info');
        });
    }
    
    sendConfirmationEmail(orderNumber, total) {
        // Mock email sending
        console.log(`Confirmation email sent for order ${orderNumber} - Total: $${total.toFixed(2)}`);
    }
    
    updateOrderSummary() {
        const subtotal = this.calculateCartTotal();
        const shipping = subtotal > 100 ? 0 : 9.99;
        const tax = subtotal * 0.08; // 8% tax
        const total = subtotal + shipping + tax;
        
        document.getElementById('cart-subtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('summary-subtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('summary-shipping').textContent = shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`;
        document.getElementById('summary-tax').textContent = `$${tax.toFixed(2)}`;
        document.getElementById('summary-total').textContent = `$${total.toFixed(2)}`;
    }
    
    calculateCartTotal() {
        return this.cart.reduce((total, item) => {
            const product = this.products.find(p => p.id === item.productId);
            return total + (product ? product.price * item.quantity : 0);
        }, 0);
    }
    
    // Cart Management
    addToCart(productId, quantity = 1) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;
        
        const existingItem = this.cart.find(item => item.productId === productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.cart.push({
                id: Date.now().toString(),
                productId: productId,
                quantity: quantity,
                addedAt: new Date().toISOString()
            });
        }
        
        this.saveCart();
        this.updateCartCounter();
        this.showToast(`${product.title} added to cart!`, 'success');
        
        // Update cart page if currently viewing
        if (this.getCurrentPage() === 'cart') {
            this.loadCartItems();
        }
    }
    
    removeFromCart(cartItemId) {
        this.cart = this.cart.filter(item => item.id !== cartItemId);
        this.saveCart();
        this.updateCartCounter();
        this.loadCartItems();
        this.showToast('Item removed from cart', 'info');
    }
    
    updateQuantity(cartItemId, newQuantity) {
        const item = this.cart.find(item => item.id === cartItemId);
        if (!item) return;
        
        const quantity = parseInt(newQuantity);
        if (quantity < 1) {
            this.removeFromCart(cartItemId);
            return;
        }
        
        if (quantity > 10) {
            this.showToast('Maximum quantity per item is 10', 'error');
            return;
        }
        
        item.quantity = quantity;
        this.saveCart();
        this.updateCartCounter();
        this.loadCartItems();
    }
    
    saveCart() {
        localStorage.setItem('f1-cart', JSON.stringify(this.cart));
    }
    
    updateCartCounter() {
        const counter = document.getElementById('cart-counter');
        if (!counter) return;
        
        const totalItems = this.cart.reduce((total, item) => total + item.quantity, 0);
        
        if (totalItems > 0) {
            counter.textContent = totalItems;
            counter.classList.remove('hidden');
        } else {
            counter.classList.add('hidden');
        }
    }
    
    // Animations
    initAnimations() {
        this.initScrollAnimations();
        this.initHoverEffects();
    }
    
    initScrollAnimations() {
        if (typeof anime === 'undefined') return;
        
        // Reveal elements on scroll
        const revealElements = document.querySelectorAll('.reveal-element');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    anime({
                        targets: entry.target,
                        opacity: [0, 1],
                        translateY: [30, 0],
                        duration: 600,
                        easing: 'easeOutQuart',
                        delay: 100
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        revealElements.forEach(element => {
            observer.observe(element);
        });
    }
    
    initHoverEffects() {
        // Product card hover effects are handled in CSS
        // Additional JavaScript hover effects can be added here
    }
    
    // Utility Functions
    showToast(message, type = 'info') {
        // Create toast element
        const toast = document.createElement('div');
        toast.className = `fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${
            type === 'success' ? 'bg-green-600 text-white' :
            type === 'error' ? 'bg-red-600 text-white' :
            'bg-blue-600 text-white'
        }`;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        // Animate in
        if (typeof anime !== 'undefined') {
            anime({
                targets: toast,
                translateX: [300, 0],
                opacity: [0, 1],
                duration: 300,
                easing: 'easeOutQuart'
            });
        }
        
        // Remove after 3 seconds
        setTimeout(() => {
            if (typeof anime !== 'undefined') {
                anime({
                    targets: toast,
                    translateX: [0, 300],
                    opacity: [1, 0],
                    duration: 300,
                    easing: 'easeInQuart',
                    complete: () => {
                        document.body.removeChild(toast);
                    }
                });
            } else {
                document.body.removeChild(toast);
            }
        }, 3000);
    }
    
    formatPrice(price) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(price);
    }
    
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
}

// Initialize the application
let f1Marketplace;

document.addEventListener('DOMContentLoaded', () => {
    f1Marketplace = new F1Marketplace();
});

// Global functions for HTML onclick handlers
function updateQuantity(cartItemId, quantity) {
    if (f1Marketplace) {
        f1Marketplace.updateQuantity(cartItemId, quantity);
    }
}

function removeFromCart(cartItemId) {
    if (f1Marketplace) {
        f1Marketplace.removeFromCart(cartItemId);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const proceedBtn = document.getElementById("proceed-checkout");
    if (proceedBtn) {
        proceedBtn.addEventListener("click", () => {
            window.location.href = "checkout.html";
        });
    }
});
