// ShopQuest - E-Commerce App
// Using Promises and fetch (no async/await)

const API_BASE = 'https://fakestoreapi.com';

// State Management
const state = {
    products: [],
    filteredProducts: [],
    categories: [],
    cart: [],
    currentPage: 1,
    itemsPerPage: 12,
    currentCategory: '',
    currentSort: 'default',
    searchQuery: '',
    user: null,
    token: null,
    isOnline: navigator.onLine,
    apiRequests: []
};

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    loadCartFromStorage();
    loadUserFromStorage();
    loadSearchHistory();
    setupEventListeners();
    checkOnlineStatus();
    initializeApp();
});

// Setup Event Listeners
function setupEventListeners() {
    // Search
    document.getElementById('searchBtn').addEventListener('click', handleSearch);
    document.getElementById('searchInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') handleSearch();
    });

    // Filters
    document.getElementById('categoryFilter').addEventListener('change', handleCategoryFilter);
    document.getElementById('sortFilter').addEventListener('change', handleSortFilter);

    // Cart
    document.getElementById('cartIcon').addEventListener('click', toggleCart);
    document.getElementById('closeCart').addEventListener('click', toggleCart);

    // Auth
    document.getElementById('loginBtn').addEventListener('click', openLoginModal);
    document.getElementById('closeLoginModal').addEventListener('click', closeLoginModal);
    document.getElementById('loginForm').addEventListener('submit', handleLogin);

    // Modal close on outside click
    window.addEventListener('click', function(e) {
        const loginModal = document.getElementById('loginModal');
        const productModal = document.getElementById('productModal');
        if (e.target === loginModal) closeLoginModal();
        if (e.target === productModal) closeProductModal();
    });

    // Pagination
    document.getElementById('pagination').addEventListener('click', handlePagination);

    // Retry button
    document.getElementById('retryBtn').addEventListener('click', initializeApp);

    // Checkout
    document.getElementById('checkoutBtn').addEventListener('click', handleCheckout);

    // Developer Panel
    document.getElementById('toggleDevPanel').addEventListener('click', toggleDevPanel);

    // Online/Offline detection
    window.addEventListener('online', function() {
        state.isOnline = true;
        document.getElementById('cacheIndicator').style.display = 'none';
        initializeApp();
    });

    window.addEventListener('offline', function() {
        state.isOnline = false;
        loadProductsFromCache();
    });
}

// Check Online Status
function checkOnlineStatus() {
    state.isOnline = navigator.onLine;
    if (!state.isOnline) {
        loadProductsFromCache();
    }
}

// Initialize App
function initializeApp() {
    showLoading();
    hideError();
    
    Promise.all([
        fetchCategories(),
        fetchProducts()
    ]).then(function(results) {
        state.categories = results[0];
        state.products = results[1];
        state.filteredProducts = [...state.products];
        populateCategories();
        renderProducts();
        hideLoading();
    }).catch(function(error) {
        console.error('Initialization error:', error);
        if (!state.isOnline || state.products.length === 0) {
            loadProductsFromCache();
        } else {
            showError('Failed to load products. Please try again.');
        }
    });
}

// API Service Functions (Promise-based, no async/await)

function makeApiRequest(url, options = {}) {
    const startTime = Date.now();
    const method = options.method || 'GET';
    
    return fetch(url, options)
        .then(function(response) {
            const duration = Date.now() - startTime;
            const requestInfo = {
                url: url,
                method: method,
                status: response.status,
                duration: duration,
                source: 'network',
                timestamp: new Date().toLocaleTimeString()
            };
            addApiRequest(requestInfo);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .catch(function(error) {
            const duration = Date.now() - startTime;
            const requestInfo = {
                url: url,
                method: method,
                status: 'error',
                duration: duration,
                source: 'network',
                error: error.message,
                timestamp: new Date().toLocaleTimeString()
            };
            addApiRequest(requestInfo);
            throw error;
        });
}

function fetchProducts() {
    const url = `${API_BASE}/products`;
    
    // Retry mechanism with Promise.race for timeout
    return retryWithTimeout(
        function() {
            return makeApiRequest(url);
        },
        3, // max retries
        5000 // timeout 5 seconds
    ).then(function(products) {
        // Cache products
        try {
            localStorage.setItem('cachedProducts', JSON.stringify(products));
            localStorage.setItem('cachedProductsTimestamp', Date.now().toString());
        } catch (e) {
            console.error('Failed to cache products:', e);
        }
        return products;
    }).catch(function(error) {
        console.error('Failed to fetch products:', error);
        throw error;
    });
}

function fetchProductById(id) {
    const url = `${API_BASE}/products/${id}`;
    return makeApiRequest(url);
}

function fetchCategories() {
    const url = `${API_BASE}/products/categories`;
    return makeApiRequest(url);
}

function loginUser(username, password) {
    const url = `${API_BASE}/auth/login`;
    return makeApiRequest(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });
}

function createCart(userId, products) {
    const url = `${API_BASE}/carts`;
    return makeApiRequest(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userId: userId,
            date: new Date().toISOString(),
            products: products
        })
    });
}

// Retry Mechanism with Timeout
function retryWithTimeout(fn, maxRetries, timeout) {
    return new Promise(function(resolve, reject) {
        let attempts = 0;
        
        function attempt() {
            attempts++;
            
            // Create timeout promise
            const timeoutPromise = new Promise(function(_, timeoutReject) {
                setTimeout(function() {
                    timeoutReject(new Error('Request timeout'));
                }, timeout);
            });
            
            // Race between actual request and timeout
            Promise.race([fn(), timeoutPromise])
                .then(function(result) {
                    resolve(result);
                })
                .catch(function(error) {
                    if (attempts < maxRetries) {
                        console.log(`Retry attempt ${attempts} of ${maxRetries}`);
                        setTimeout(attempt, 1000 * attempts); // Exponential backoff
                    } else {
                        reject(error);
                    }
                });
        }
        
        attempt();
    });
}

// Cache Management
function loadProductsFromCache() {
    try {
        const cached = localStorage.getItem('cachedProducts');
        const timestamp = localStorage.getItem('cachedProductsTimestamp');
        
        if (cached) {
            state.products = JSON.parse(cached);
            state.filteredProducts = [...state.products];
            populateCategories();
            renderProducts();
            document.getElementById('cacheIndicator').style.display = 'block';
            hideLoading();
            
            const requestInfo = {
                url: 'localStorage',
                method: 'GET',
                status: 200,
                duration: 0,
                source: 'cache',
                timestamp: new Date().toLocaleTimeString()
            };
            addApiRequest(requestInfo);
        } else {
            showError('No cached data available. Please check your internet connection.');
        }
    } catch (e) {
        console.error('Failed to load from cache:', e);
        showError('Failed to load cached data.');
    }
}

// Cart Management
function loadCartFromStorage() {
    try {
        const cart = localStorage.getItem('cart');
        if (cart) {
            state.cart = JSON.parse(cart);
            updateCartUI();
        }
    } catch (e) {
        console.error('Failed to load cart:', e);
    }
}

function saveCartToStorage() {
    try {
        localStorage.setItem('cart', JSON.stringify(state.cart));
    } catch (e) {
        console.error('Failed to save cart:', e);
    }
}

function addToCart(product) {
    const existingItem = state.cart.find(function(item) {
        return item.id === product.id;
    });
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        state.cart.push({
            ...product,
            quantity: 1
        });
    }
    
    saveCartToStorage();
    updateCartUI();
}

function removeFromCart(productId) {
    state.cart = state.cart.filter(function(item) {
        return item.id !== productId;
    });
    saveCartToStorage();
    updateCartUI();
}

function updateCartQuantity(productId, change) {
    const item = state.cart.find(function(item) {
        return item.id === productId;
    });
    
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCartToStorage();
            updateCartUI();
        }
    }
}

function updateCartUI() {
    const cartCount = state.cart.reduce(function(total, item) {
        return total + item.quantity;
    }, 0);
    
    document.getElementById('cartCount').textContent = cartCount;
    
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');
    
    if (state.cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; padding: 2rem; color: #999;">Your cart is empty</p>';
        cartTotal.textContent = '0.00';
        checkoutBtn.disabled = true;
    } else {
        cartItems.innerHTML = state.cart.map(function(item) {
            return `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.title}" class="cart-item-image">
                    <div class="cart-item-info">
                        <div class="cart-item-title">${item.title.substring(0, 50)}...</div>
                        <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                        <div class="cart-item-actions">
                            <div class="quantity-control">
                                <button onclick="updateCartQuantity(${item.id}, -1)">−</button>
                                <span>${item.quantity}</span>
                                <button onclick="updateCartQuantity(${item.id}, 1)">+</button>
                            </div>
                            <button class="btn btn-danger" onclick="removeFromCart(${item.id})">Remove</button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        
        const total = state.cart.reduce(function(sum, item) {
            return sum + (item.price * item.quantity);
        }, 0);
        
        cartTotal.textContent = total.toFixed(2);
        checkoutBtn.disabled = !state.user;
    }
}

function toggleCart() {
    const sidebar = document.getElementById('cartSidebar');
    sidebar.classList.toggle('open');
}

// Search History
function loadSearchHistory() {
    try {
        const history = localStorage.getItem('searchHistory');
        if (history) {
            const historyArray = JSON.parse(history);
            renderSearchHistory(historyArray);
        }
    } catch (e) {
        console.error('Failed to load search history:', e);
    }
}

function saveSearchHistory(query) {
    if (!query.trim()) return;
    
    try {
        let history = localStorage.getItem('searchHistory');
        history = history ? JSON.parse(history) : [];
        
        // Remove if exists
        history = history.filter(function(item) {
            return item !== query;
        });
        
        // Add to beginning
        history.unshift(query);
        
        // Keep only last 5
        history = history.slice(0, 5);
        
        localStorage.setItem('searchHistory', JSON.stringify(history));
        renderSearchHistory(history);
    } catch (e) {
        console.error('Failed to save search history:', e);
    }
}

function renderSearchHistory(history) {
    const container = document.getElementById('searchHistory');
    if (history.length === 0) {
        container.innerHTML = '';
        return;
    }
    
    container.innerHTML = history.map(function(query) {
        return `<span class="search-history-item" onclick="handleSearchFromHistory('${query}')">${query}</span>`;
    }).join('');
}

function handleSearchFromHistory(query) {
    document.getElementById('searchInput').value = query;
    handleSearch();
}

// Search and Filter
function handleSearch() {
    const query = document.getElementById('searchInput').value.trim();
    state.searchQuery = query;
    state.currentPage = 1;
    
    if (query) {
        saveSearchHistory(query);
    }
    
    applyFilters();
}

function handleCategoryFilter() {
    state.currentCategory = document.getElementById('categoryFilter').value;
    state.currentPage = 1;
    applyFilters();
}

function handleSortFilter() {
    state.currentSort = document.getElementById('sortFilter').value;
    applyFilters();
}

function applyFilters() {
    let filtered = [...state.products];
    
    // Search filter
    if (state.searchQuery) {
        const query = state.searchQuery.toLowerCase();
        filtered = filtered.filter(function(product) {
            return product.title.toLowerCase().includes(query) ||
                   product.description.toLowerCase().includes(query);
        });
    }
    
    // Category filter
    if (state.currentCategory) {
        filtered = filtered.filter(function(product) {
            return product.category === state.currentCategory;
        });
    }
    
    // Sort
    switch (state.currentSort) {
        case 'price-asc':
            filtered.sort(function(a, b) {
                return a.price - b.price;
            });
            break;
        case 'price-desc':
            filtered.sort(function(a, b) {
                return b.price - a.price;
            });
            break;
        case 'title-asc':
            filtered.sort(function(a, b) {
                return a.title.localeCompare(b.title);
            });
            break;
        case 'title-desc':
            filtered.sort(function(a, b) {
                return b.title.localeCompare(a.title);
            });
            break;
    }
    
    state.filteredProducts = filtered;
    renderProducts();
}

function populateCategories() {
    const select = document.getElementById('categoryFilter');
    select.innerHTML = '<option value="">All Categories</option>' +
        state.categories.map(function(category) {
            return `<option value="${category}">${category.charAt(0).toUpperCase() + category.slice(1)}</option>`;
        }).join('');
}

// Product Rendering
function renderProducts() {
    const container = document.getElementById('productsGrid');
    const startIndex = (state.currentPage - 1) * state.itemsPerPage;
    const endIndex = startIndex + state.itemsPerPage;
    const pageProducts = state.filteredProducts.slice(startIndex, endIndex);
    
    if (pageProducts.length === 0) {
        container.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: white; font-size: 1.2rem;">No products found</p>';
        document.getElementById('pagination').innerHTML = '';
        return;
    }
    
    container.innerHTML = pageProducts.map(function(product) {
        return `
            <div class="product-card" onclick="showProductDetails(${product.id})">
                <img src="${product.image}" alt="${product.title}" class="product-image" onerror="this.src='https://via.placeholder.com/300?text=No+Image'">
                <div class="product-info">
                    <h3 class="product-title">${product.title}</h3>
                    <div class="product-price">$${product.price.toFixed(2)}</div>
                    <div class="product-category">${product.category}</div>
                    <div class="product-actions">
                        <button class="btn btn-primary" onclick="event.stopPropagation(); addToCartById(${product.id})">Add to Cart</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    renderPagination();
}

function renderPagination() {
    const totalPages = Math.ceil(state.filteredProducts.length / state.itemsPerPage);
    const container = document.getElementById('pagination');
    
    if (totalPages <= 1) {
        container.innerHTML = '';
        return;
    }
    
    let html = '';
    
    // Previous button
    html += `<button ${state.currentPage === 1 ? 'disabled' : ''} onclick="changePage(${state.currentPage - 1})">Previous</button>`;
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= state.currentPage - 2 && i <= state.currentPage + 2)) {
            html += `<button class="${i === state.currentPage ? 'active' : ''}" onclick="changePage(${i})">${i}</button>`;
        } else if (i === state.currentPage - 3 || i === state.currentPage + 3) {
            html += `<button disabled>...</button>`;
        }
    }
    
    // Next button
    html += `<button ${state.currentPage === totalPages ? 'disabled' : ''} onclick="changePage(${state.currentPage + 1})">Next</button>`;
    
    container.innerHTML = html;
}

function changePage(page) {
    state.currentPage = page;
    renderProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function handlePagination(e) {
    if (e.target.tagName === 'BUTTON' && !e.target.disabled) {
        const page = parseInt(e.target.textContent);
        if (!isNaN(page)) {
            changePage(page);
        } else if (e.target.textContent === 'Previous') {
            changePage(state.currentPage - 1);
        } else if (e.target.textContent === 'Next') {
            changePage(state.currentPage + 1);
        }
    }
}

// Product Details
function showProductDetails(productId) {
    const modal = document.getElementById('productModal');
    const container = document.getElementById('productDetails');
    
    modal.style.display = 'block';
    container.innerHTML = '<div class="loading"><div class="spinner"></div><p>Loading product details...</p></div>';
    
    fetchProductById(productId)
        .then(function(product) {
            container.innerHTML = `
                <div class="product-details">
                    <div>
                        <img src="${product.image}" alt="${product.title}" class="product-details-image" onerror="this.src='https://via.placeholder.com/400?text=No+Image'">
                    </div>
                    <div class="product-details-info">
                        <h2>${product.title}</h2>
                        <div class="product-details-price">$${product.price.toFixed(2)}</div>
                        <div class="product-details-rating">
                            ⭐ ${product.rating.rate} (${product.rating.count} reviews)
                        </div>
                        <div class="product-details-description">${product.description}</div>
                        <div class="product-actions" style="margin-top: 2rem;">
                            <button class="btn btn-primary" onclick="addToCartById(${product.id}); closeProductModal();">Add to Cart</button>
                        </div>
                    </div>
                </div>
            `;
        })
        .catch(function(error) {
            container.innerHTML = `<div class="error-state"><p>Failed to load product details: ${error.message}</p></div>`;
        });
}

function closeProductModal() {
    document.getElementById('productModal').style.display = 'none';
}

// Authentication
function loadUserFromStorage() {
    try {
        const user = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        if (user && token) {
            state.user = JSON.parse(user);
            state.token = token;
            updateAuthUI();
        }
    } catch (e) {
        console.error('Failed to load user:', e);
    }
}

function saveUserToStorage(user, token) {
    try {
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', token);
    } catch (e) {
        console.error('Failed to save user:', e);
    }
}

function updateAuthUI() {
    const authSection = document.getElementById('authSection');
    if (state.user) {
        authSection.innerHTML = `
            <div class="user-info">
                <span>👤 ${state.user.username || 'User'}</span>
                <button class="btn btn-secondary" onclick="handleLogout()">Logout</button>
            </div>
        `;
    } else {
        authSection.innerHTML = '<button class="btn btn-primary" id="loginBtn">Login</button>';
        document.getElementById('loginBtn').addEventListener('click', openLoginModal);
    }
}

function openLoginModal() {
    document.getElementById('loginModal').style.display = 'block';
}

function closeLoginModal() {
    document.getElementById('loginModal').style.display = 'none';
    document.getElementById('loginError').textContent = '';
    document.getElementById('loginForm').reset();
}

function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('loginError');
    
    errorDiv.textContent = '';
    
    loginUser(username, password)
        .then(function(response) {
            // FakeStoreAPI returns a token
            state.token = response.token;
            state.user = { username: username, id: response.id || 1 };
            saveUserToStorage(state.user, state.token);
            updateAuthUI();
            closeLoginModal();
            updateCartUI(); // Enable checkout button if cart has items
        })
        .catch(function(error) {
            errorDiv.textContent = 'Login failed. Please try again. (Use any username/password for demo)';
            console.error('Login error:', error);
        });
}

function handleLogout() {
    state.user = null;
    state.token = null;
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    updateAuthUI();
    updateCartUI();
}

// Checkout
function handleCheckout() {
    if (!state.user) {
        alert('Please login to checkout');
        openLoginModal();
        return;
    }
    
    if (state.cart.length === 0) {
        alert('Your cart is empty');
        return;
    }
    
    const products = state.cart.map(function(item) {
        return {
            productId: item.id,
            quantity: item.quantity
        };
    });
    
    createCart(state.user.id || 1, products)
        .then(function(cart) {
            alert('Order placed successfully! Order ID: ' + (cart.id || 'N/A'));
            state.cart = [];
            saveCartToStorage();
            updateCartUI();
            toggleCart();
        })
        .catch(function(error) {
            alert('Checkout failed: ' + error.message);
            console.error('Checkout error:', error);
        });
}

// Developer Panel
function addApiRequest(requestInfo) {
    state.apiRequests.unshift(requestInfo);
    if (state.apiRequests.length > 5) {
        state.apiRequests = state.apiRequests.slice(0, 5);
    }
    renderApiRequests();
}

function renderApiRequests() {
    const container = document.getElementById('apiRequests');
    if (state.apiRequests.length === 0) {
        container.innerHTML = '<p style="color: #999;">No API requests yet</p>';
        return;
    }
    
    container.innerHTML = state.apiRequests.map(function(req) {
        const statusClass = req.status === 200 || req.status === 201 ? 'success' : 'error';
        const sourceBadge = req.source === 'cache' ? ' (CACHE)' : '';
        return `
            <div class="api-request-item">
                <span class="method ${req.method}">${req.method}</span>
                <span>${req.url}</span>
                <span class="status ${statusClass}">${req.status}</span>
                <span style="color: #999;">${req.duration}ms${sourceBadge}</span>
                <span style="color: #999; float: right;">${req.timestamp}</span>
            </div>
        `;
    }).join('');
}

function toggleDevPanel() {
    const panel = document.getElementById('devPanel');
    panel.classList.toggle('collapsed');
    const btn = document.getElementById('toggleDevPanel');
    btn.textContent = panel.classList.contains('collapsed') ? '+' : '−';
}

// UI Helpers
function showLoading() {
    document.getElementById('loadingState').style.display = 'block';
    document.getElementById('productsSection').style.display = 'none';
    document.getElementById('errorState').style.display = 'none';
}

function hideLoading() {
    document.getElementById('loadingState').style.display = 'none';
    document.getElementById('productsSection').style.display = 'block';
}

function showError(message) {
    document.getElementById('errorMessage').textContent = message;
    document.getElementById('errorState').style.display = 'block';
    document.getElementById('loadingState').style.display = 'none';
    document.getElementById('productsSection').style.display = 'none';
}

function hideError() {
    document.getElementById('errorState').style.display = 'none';
}

// Helper function to add product by ID
function addToCartById(productId) {
    const product = state.products.find(function(p) {
        return p.id === productId;
    });
    if (product) {
        addToCart(product);
    }
}

// Make functions available globally for onclick handlers
window.addToCartById = addToCartById;
window.removeFromCart = removeFromCart;
window.updateCartQuantity = updateCartQuantity;
window.showProductDetails = showProductDetails;
window.closeProductModal = closeProductModal;
window.handleSearchFromHistory = handleSearchFromHistory;
window.changePage = changePage;

