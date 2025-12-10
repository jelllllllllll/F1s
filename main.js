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
            // --- UPDATE: COBA LOAD DARI BACKEND DULU ---
            try {
                // Coba ambil dari Database Backend (Port 3000)
                const productsResponse = await fetch('https://f1s-production.up.railway.app/api/products');
                this.products = await productsResponse.json();
                
                // Jika backend hidup tapi datanya kosong
                if (!this.products || this.products.length === 0) {
                    throw new Error("Backend connected but empty");
                }
                console.log("✅ Data loaded from Backend Database");
            } catch (backendError) {
                console.warn('⚠️ Backend tidak tersedia/kosong, menggunakan data lokal JSON...', backendError);
                // Fallback: Ambil dari file JSON lokal jika backend mati/kosong
                const productsResponse = await fetch('products.json');
                this.products = await productsResponse.json();
            }
            
            // Load vendors
            const vendorsResponse = await fetch('vendors.json');
            this.vendors = await vendorsResponse.json();
            
            // Load translations
            const enResponse = await fetch('en.json');
            this.translations.en = await enResponse.json();
            
            const idResponse = await fetch('id.json');
            this.translations.id = await idResponse.json();
            
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
                    {id: "m", label: "M", stock: 8}
                ],
                stock_total: 40,
                description: "Official Scuderia Ferrari team cap.",
                badges: ["official", "new"],
                category: "accessories",
                sku: "SF-CAP-2024-001"
            }
        ];
        
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
        this.initTypewriter();
        this.initParticleBackground();
        this.loadFeaturedProducts();
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
                    particles.forEach(particle => {
                        particle.x += particle.vx;
                        particle.y += particle.vy;
                        if (particle.x < 0) particle.x = p.width;
                        if (particle.x > p.width) particle.x = 0;
                        if (particle.y < 0) particle.y = p.height;
                        if (particle.y > p.height) particle.y = 0;
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
        const featuredProducts = this.products.slice(0, 6);
        container.innerHTML = featuredProducts.map(product => this.createProductCard(product)).join('');
        this.attachProductEventListeners(container);
    }
    
    createProductCard(product) {
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
                            <button class="btn-secondary px-1 py-1 text-sm quick-view-btn" data-product-id="${product.id}">View</button>
                            <button class="btn-primary px-1 py-1 text-sm add-to-cart-btn" data-product-id="${product.id}">Add Cart</button>
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
            if (product.badges.includes('limited')) badges += '<span class="badge badge-limited">Limited</span>';
            if (product.badges.includes('new')) badges += '<span class="badge badge-new">New</span>';
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
        container.querySelectorAll('.quick-view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showQuickView(btn.dataset.productId);
            });
        });
        container.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.addToCart(btn.dataset.productId);
            });
        });
        container.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.quick-view-btn') && !e.target.closest('.add-to-cart-btn')) {
                    window.location.href = `product-detail.html?id=${card.dataset.productId}`;
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
        container.innerHTML = this.products.map(product => this.createProductCard(product)).join('');
        this.attachProductEventListeners(container);
        document.getElementById('product-count').textContent = this.products.length;
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
            input.addEventListener('change', () => this.applyFilters());
        });
        const clearBtn = document.getElementById('clear-filters');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                filterInputs.forEach(input => input.checked = false);
                this.applyFilters();
            });
        }
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
            if (filters.channel.length > 0 && !filters.channel.includes(product.vendor_type)) return false;
            if (filters.team.length > 0 && !filters.team.includes(product.team)) return false;
            if (filters.category.length > 0 && !filters.category.includes(product.category)) return false;
            if (filters.price) {
                const price = product.price;
                switch (filters.price) {
                    case '0-50': if (price > 50) return false; break;
                    case '50-100': if (price < 50 || price > 100) return false; break;
                    case '100-200': if (price < 100 || price > 200) return false; break;
                    case '200+': if (price < 200) return false; break;
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
        document.getElementById('product-count').textContent = products.length;
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
            sortSelect.addEventListener('change', (e) => this.sortProducts(e.target.value));
        }
    }
    
    sortProducts(sortBy) {
        let sortedProducts = [...this.products];
        switch (sortBy) {
            case 'price-low': sortedProducts.sort((a, b) => a.price - b.price); break;
            case 'price-high': sortedProducts.sort((a, b) => b.price - a.price); break;
            case 'newest': sortedProducts.sort((a, b) => new Date(b.release_date || 0) - new Date(a.release_date || 0)); break;
            default: sortedProducts.sort((a, b) => b.stock_total - a.stock_total);
        }
        this.displayFilteredProducts(sortedProducts);
    }
    
    initQuickViewModal() {
        const modal = document.getElementById('quick-view-modal');
        const closeBtn = document.getElementById('close-modal');
        if (closeBtn) closeBtn.addEventListener('click', () => this.hideQuickView());
        if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) this.hideQuickView(); });
    }
    
    showQuickView(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;
        const modal = document.getElementById('quick-view-modal');
        const content = document.getElementById('modal-content');
        if (!modal || !content) return;
        content.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><img src="${product.images[0]}" alt="${product.title}" class="w-full h-64 object-cover rounded-lg"></div>
                <div>
                    <div class="flex items-center gap-2 mb-4">${this.renderBadges(product)}</div>
                    <h3 class="font-display text-2xl font-bold mb-4">${product.title}</h3>
                    <p class="text-gray-600 mb-4">${product.description}</p>
                    <div class="flex items-center justify-between mb-6">
                        <span class="text-3xl font-bold">$${product.price}</span>
                    </div>
                    <button class="btn-primary w-full py-3 rounded-none font-semibold add-to-cart-btn" data-product-id="${product.id}">Add to Cart</button>
                </div>
            </div>
        `;
        content.querySelector('.add-to-cart-btn').addEventListener('click', () => {
            this.addToCart(productId);
            this.hideQuickView();
        });
        modal.classList.remove('hidden');
    }
    
    hideQuickView() {
        const modal = document.getElementById('quick-view-modal');
        if (modal) modal.classList.add('hidden');
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
        if (!product) { window.location.href = 'catalog.html'; return; }
        document.getElementById('breadcrumb-product').textContent = product.title;
        document.getElementById('product-title').textContent = product.title;
        document.getElementById('product-price').textContent = `$${product.price}`;
        document.getElementById('product-sku').textContent = `SKU: ${product.sku}`;
        document.getElementById('product-description').textContent = product.description;
        document.getElementById('detailed-description').innerHTML = `<p>${product.description}</p>`;
        const mainImage = document.getElementById('main-image-src');
        mainImage.src = product.images[0];
        mainImage.alt = product.title;
        document.getElementById('product-badges').innerHTML = this.renderBadges(product);
        const vendor = this.vendors.find(v => v.vendor_id === this.getVendorId(product));
        if (vendor) {
            document.getElementById('vendor-name').textContent = vendor.name;
            document.getElementById('vendor-type').textContent = `(${vendor.vendor_type})`;
        }
        this.updateStockStatus(product);
        this.loadVariants(product);
        this.loadRelatedProducts(product);
    }
    
    initProductGallery() {}
    
    loadVariants(product) {
        if (!product.variants || product.variants.length === 0) return;
        const sizeSelector = document.getElementById('size-selector');
        if (!sizeSelector) return;
        sizeSelector.innerHTML = product.variants.map(variant => `
            <div class="variant-option ${variant.stock > 0 ? '' : 'disabled'}" data-variant="${variant.id}">${variant.label}</div>
        `).join('');
        const firstAvailable = sizeSelector.querySelector('.variant-option:not(.disabled)');
        if (firstAvailable) firstAvailable.classList.add('selected');
        sizeSelector.querySelectorAll('.variant-option:not(.disabled)').forEach(option => {
            option.addEventListener('click', () => {
                sizeSelector.querySelectorAll('.variant-option').forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
            });
        });
    }
    
    initVariantSelection() {}
    
    initQuantitySelector() {
        const minusBtn = document.getElementById('qty-minus');
        const plusBtn = document.getElementById('qty-plus');
        const input = document.getElementById('quantity');
        if (minusBtn && plusBtn && input) {
            minusBtn.addEventListener('click', () => { const value = parseInt(input.value); if (value > 1) input.value = value - 1; });
            plusBtn.addEventListener('click', () => { const value = parseInt(input.value); if (value < 10) input.value = value + 1; });
        }
    }
    
    updateStockStatus(product) {
        const stockDot = document.getElementById('stock-dot');
        const stockText = document.getElementById('stock-text');
        if (!stockDot || !stockText) return;
        let status, className;
        if (product.stock_total > 20) { status = 'In Stock'; className = 'stock-high'; }
        else if (product.stock_total > 5) { status = 'Limited Stock'; className = 'stock-medium'; }
        else { status = 'Low Stock'; className = 'stock-low'; }
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
                setTimeout(() => window.location.href = 'cart.html', 500);
            });
        }
    }
    
    loadRelatedProducts(product) {
        const container = document.getElementById('related-products');
        if (!container) return;
        const related = this.products.filter(p => p.id !== product.id && (p.team === product.team || p.category === product.category)).slice(0, 4);
        container.innerHTML = related.map(p => `
            <div class="related-product border rounded-lg overflow-hidden cursor-pointer" onclick="window.location.href='product-detail.html?id=${p.id}'">
                <img src="${p.images[0]}" alt="${p.title}" class="w-full h-48 object-cover">
                <div class="p-4">
                    <h4 class="font-semibold mb-2 line-clamp-2">${p.title}</h4>
                    <div class="flex items-center justify-between"><span class="font-bold">$${p.price}</span></div>
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
            input.addEventListener('blur', () => this.validateField(input));
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
        let isValid = value.length > 0;
        const fieldName = field.id;
        
        if (fieldName === 'email' && isValid) {
            isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        } else if (fieldName === 'phone' && isValid) {
            isValid = value.length >= 10;
        }
        
        if (!isValid && value !== '') {
            field.classList.add('error');
        } else {
            field.classList.remove('error');
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
    
    // --- METHOD PROCESS CHECKOUT BARU ---
    // INILAH YANG AKAN MENGIRIM DATA KE DATABASE
    async processCheckout() {
        // 1. Validasi Form
        const form = document.querySelector('.checkout-form');
        const inputs = form.querySelectorAll('input[required], select[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                input.classList.add('error');
                isValid = false;
            } else {
                input.classList.remove('error');
            }
        });
        
        if (!isValid) {
            this.showToast('Please fill in all required fields correctly', 'error');
            return;
        }
        
        // 2. Tampilkan Loading
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) loadingOverlay.classList.remove('hidden');
        
        // 3. SIAPKAN DATA ORDER (Sesuai dengan Order.js di Backend)
        const orderData = {
            orderNumber: `F1M-${Date.now()}`,
            customer: {
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                fullName: document.getElementById('full-name').value,
                address: document.getElementById('address').value,
                city: document.getElementById('city').value,
                zip: document.getElementById('zip').value,
                state: document.getElementById('state').value || "NA",
                country: document.getElementById('country').value
            },
            items: this.cart,
            paymentMethod: document.querySelector('input[name="payment"]:checked').value,
            shippingMethod: document.querySelector('input[name="shipping"]:checked')?.value || 'standard',
            totalAmount: this.calculateCartTotal()
        };

        try {
            console.log("Sending order to backend...", orderData);

            // 4. KIRIM DATA KE BACKEND
            const response = await fetch('https://f1s-production.up.railway.app/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });

            if (response.ok) {
                const result = await response.json();
                console.log("Order saved successfully:", result);

                // 5. JIKA SUKSES: Bersihkan Cart
                this.cart = [];
                this.saveCart();
                this.updateCartCounter();

                // Sembunyikan Loading
                if (loadingOverlay) loadingOverlay.classList.add('hidden');

                // Isi data ke Modal Sukses
                document.getElementById('order-number').textContent = result.orderNumber;
                document.getElementById('tracking-number').textContent = `TRK${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
                document.getElementById('total-paid').textContent = `$${result.totalAmount}`;

                // Tampilkan Modal
                const successModal = document.getElementById('success-modal');
                if (successModal) successModal.classList.remove('hidden');

                // Setup tombol di dalam modal agar berfungsi
                const continueBtn = document.getElementById('continue-shopping');
                if(continueBtn) {
                    const newBtn = continueBtn.cloneNode(true);
                    continueBtn.parentNode.replaceChild(newBtn, continueBtn);
                    newBtn.addEventListener('click', () => {
                        window.location.href = 'catalog.html';
                    });
                }
                
                const trackBtn = document.getElementById('track-order');
                if(trackBtn) {
                     const newTrackBtn = trackBtn.cloneNode(true);
                     trackBtn.parentNode.replaceChild(newTrackBtn, trackBtn);
                     newTrackBtn.addEventListener('click', () => {
                        this.showToast('Tracking information will be available in 24 hours', 'info');
                    });
                }

            } else {
                throw new Error('Failed to save order to database.');
            }

        } catch (error) {
            console.error("Checkout Error:", error);
            if (loadingOverlay) loadingOverlay.classList.add('hidden');
            this.showToast('Gagal memproses pesanan. Pastikan backend server menyala.', 'error');
        }
    }
    
    // Hapus logika lama agar tidak bentrok
    completeOrder() {}
    processPayment() {}
    processCardPayment() {}
    processPayPalPayment() {}
    processCryptoPayment() {}
    
    sendConfirmationEmail(orderNumber, total) {}
    
    updateOrderSummary() {
        const subtotal = this.calculateCartTotal();
        const shipping = subtotal > 100 ? 0 : 9.99;
        const tax = subtotal * 0.08; 
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
        if (quantity < 1) { this.removeFromCart(cartItemId); return; }
        if (quantity > 10) { this.showToast('Maximum quantity per item is 10', 'error'); return; }
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
    
    initAnimations() {
        this.initScrollAnimations();
        this.initHoverEffects();
    }
    
    initScrollAnimations() {
        if (typeof anime === 'undefined') return;
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
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
        revealElements.forEach(element => observer.observe(element));
    }
    
    initHoverEffects() {}
    
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${type === 'success' ? 'bg-green-600 text-white' : type === 'error' ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        if (typeof anime !== 'undefined') {
            anime({ targets: toast, translateX: [300, 0], opacity: [0, 1], duration: 300, easing: 'easeOutQuart' });
        }
        setTimeout(() => {
            if (typeof anime !== 'undefined') {
                anime({ targets: toast, translateX: [0, 300], opacity: [1, 0], duration: 300, easing: 'easeInQuart', complete: () => document.body.removeChild(toast) });
            } else {
                document.body.removeChild(toast);
            }
        }, 3000);
    }
    
    formatPrice(price) {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
    }
    
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
}

let f1Marketplace;
document.addEventListener('DOMContentLoaded', () => { f1Marketplace = new F1Marketplace(); });

function updateQuantity(cartItemId, quantity) { if (f1Marketplace) f1Marketplace.updateQuantity(cartItemId, quantity); }
function removeFromCart(cartItemId) { if (f1Marketplace) f1Marketplace.removeFromCart(cartItemId); }

document.addEventListener("DOMContentLoaded", () => {
    const proceedBtn = document.getElementById("proceed-checkout");
    if (proceedBtn) {
        proceedBtn.addEventListener("click", () => { window.location.href = "checkout.html"; });
    }
});