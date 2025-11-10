// Admin Panel JavaScript
const API_BASE = '/api';
const STORAGE_KEY = 'admin_token';

// Check authentication on load
document.addEventListener('DOMContentLoaded', async () => {
    const isAuthenticated = await checkAuth();
    if (isAuthenticated) {
        showDashboard();
        setupEventListeners();
        loadData();
    } else {
        showLogin();
    }
});

async function checkAuth() {
    const token = localStorage.getItem(STORAGE_KEY);
    if (!token) {
        return false;
    }

    try {
        const response = await fetch(`${API_BASE}/auth/verify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ token })
        });

        if (response.ok) {
            return true;
        } else {
            localStorage.removeItem(STORAGE_KEY);
            return false;
        }
    } catch (error) {
        console.error('Auth check error:', error);
        localStorage.removeItem(STORAGE_KEY);
        return false;
    }
}

function showLogin() {
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('adminDashboard').style.display = 'none';
}

function showDashboard() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('adminDashboard').style.display = 'block';
}

// Login form handler
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const password = document.getElementById('password').value;
    const errorMsg = document.getElementById('loginError');
    const submitBtn = e.target.querySelector('button[type="submit"]');
    
    // Disable button during login
    submitBtn.disabled = true;
    submitBtn.textContent = 'Logging in...';
    errorMsg.classList.remove('show');

    try {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ password })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            localStorage.setItem(STORAGE_KEY, data.token);
            showDashboard();
            setupEventListeners();
            loadData();
            errorMsg.classList.remove('show');
        } else {
            errorMsg.textContent = data.error || 'Invalid password';
            errorMsg.classList.add('show');
        }
    } catch (error) {
        errorMsg.textContent = 'Login failed. Please try again.';
        errorMsg.classList.add('show');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Login';
    }
});

// Logout
document.getElementById('logoutBtn')?.addEventListener('click', () => {
    localStorage.removeItem(STORAGE_KEY);
    showLogin();
    document.getElementById('password').value = '';
});

// Tab navigation
document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
        e.preventDefault();
        const targetTab = tab.getAttribute('data-tab');
        
        // Update active tab
        document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Show correct content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${targetTab}Tab`).classList.add('active');
    });
});

// API Functions
async function apiCall(endpoint, method = 'GET', data = null) {
    try {
        const token = localStorage.getItem(STORAGE_KEY);
        if (!token) {
            // Redirect to login if no token
            showLogin();
            throw new Error('Not authenticated');
        }

        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        };

        if (data) {
            options.body = JSON.stringify(data);
        }

        console.log('[DEBUG] API Call:', {
            endpoint: `${API_BASE}${endpoint}`,
            method: method,
            hasToken: !!token,
            hasData: !!data
        });
        
        const response = await fetch(`${API_BASE}${endpoint}`, options);
        
        console.log('[DEBUG] API Response:', {
            status: response.status,
            statusText: response.statusText,
            ok: response.ok
        });
        
        // Handle 401 Unauthorized
        if (response.status === 401) {
            console.log('[DEBUG] 401 Unauthorized - removing token');
            localStorage.removeItem(STORAGE_KEY);
            showLogin();
            throw new Error('Session expired. Please login again.');
        }

        const result = await response.json();
        console.log('[DEBUG] API Response data:', result);

        if (!response.ok) {
            console.error('[DEBUG] API Error response:', result);
            throw new Error(result.error || 'API request failed');
        }

        return result;
    } catch (error) {
        console.error('API Error:', error);
        showNotification(error.message, 'error');
        throw error;
    }
}

// Load all data
async function loadData() {
    try {
        await Promise.all([
            loadProducts(),
            loadGallery(),
            loadHeroImages(),
            loadContent()
        ]);
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

// Products Management
async function loadProducts() {
    try {
        const products = await apiCall('/products');
        const container = document.getElementById('productsList');
        container.innerHTML = '';

        if (products.length === 0) {
            container.innerHTML = '<p>No products found. Add your first product!</p>';
            return;
        }

        products.forEach(product => {
            const card = createProductCard(product);
            container.appendChild(card);
        });
    } catch (error) {
        document.getElementById('productsList').innerHTML = 
            '<p class="error">Error loading products. Make sure API is configured.</p>';
    }
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'item-card';
    card.innerHTML = `
        <img src="${product.image}" alt="${product.alt || product.name}" onerror="this.src='assets/images/product-1.webp'">
        <div class="item-card-body">
            <div class="item-card-title">${product.name}</div>
            <div class="item-card-info">
                <div>Category: ${product.category}</div>
                <div>Price: ₹${product.price}</div>
            </div>
            <div class="item-card-actions">
                <button class="btn btn-primary" onclick="editProduct('${product.id}')">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn btn-danger" onclick="deleteProduct('${product.id}')">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `;
    return card;
}

function openProductModal(productId = null) {
    const modal = document.getElementById('productModal');
    const form = document.getElementById('productForm');
    const title = document.getElementById('productModalTitle');

    form.reset();
    document.getElementById('productImagePreview').innerHTML = '';

    if (productId) {
        title.textContent = 'Edit Product';
        // Load product data
        loadProductData(productId);
    } else {
        title.textContent = 'Add Product';
        document.getElementById('productId').value = '';
    }

    modal.classList.add('active');
}

async function loadProductData(productId) {
    try {
        const product = await apiCall(`/products/${productId}`);
        document.getElementById('productId').value = product.id;
        document.getElementById('productName').value = product.name;
        document.getElementById('productCategory').value = product.category;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productImage').value = product.image;
        document.getElementById('productAlt').value = product.alt || '';
    } catch (error) {
        showNotification('Error loading product', 'error');
    }
}

document.getElementById('productForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const productId = document.getElementById('productId').value;
    const productData = {
        name: document.getElementById('productName').value,
        category: document.getElementById('productCategory').value,
        price: document.getElementById('productPrice').value,
        image: document.getElementById('productImage').value,
        alt: document.getElementById('productAlt').value
    };

    try {
        if (productId) {
            await apiCall(`/products/${productId}`, 'PUT', productData);
            showNotification('Product updated successfully', 'success');
        } else {
            await apiCall('/products', 'POST', productData);
            showNotification('Product added successfully', 'success');
        }
        
        closeModal('productModal');
        loadProducts();
    } catch (error) {
        showNotification('Error saving product', 'error');
    }
});

async function deleteProduct(productId) {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
        await apiCall(`/products/${productId}`, 'DELETE');
        showNotification('Product deleted successfully', 'success');
        loadProducts();
    } catch (error) {
        showNotification('Error deleting product', 'error');
    }
}

function editProduct(productId) {
    openProductModal(productId);
}

// Gallery Management
async function loadGallery() {
    try {
        const gallery = await apiCall('/gallery');
        const container = document.getElementById('galleryList');
        container.innerHTML = '';

        if (gallery.length === 0) {
            container.innerHTML = '<p>No gallery images found. Add your first image!</p>';
            return;
        }

        gallery.forEach(item => {
            const card = createGalleryCard(item);
            container.appendChild(card);
        });
    } catch (error) {
        document.getElementById('galleryList').innerHTML = 
            '<p class="error">Error loading gallery. Make sure API is configured.</p>';
    }
}

function createGalleryCard(item) {
    const card = document.createElement('div');
    card.className = 'item-card';
    card.innerHTML = `
        <img src="${item.image}" alt="${item.alt}" onerror="this.src='assets/images/new-1.webp'">
        <div class="item-card-body">
            <div class="item-card-title">${item.alt}</div>
            <div class="item-card-actions">
                <button class="btn btn-danger" onclick="deleteGalleryItem('${item.id}')">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `;
    return card;
}

function openGalleryModal(itemId = null) {
    const modal = document.getElementById('galleryModal');
    const form = document.getElementById('galleryForm');
    const title = document.getElementById('galleryModalTitle');

    form.reset();
    document.getElementById('galleryImagePreview').innerHTML = '';

    if (itemId) {
        title.textContent = 'Edit Gallery Image';
        document.getElementById('galleryId').value = itemId;
    } else {
        title.textContent = 'Add Gallery Image';
        document.getElementById('galleryId').value = '';
    }

    modal.classList.add('active');
}

document.getElementById('galleryForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const itemId = document.getElementById('galleryId').value;
    const galleryData = {
        image: document.getElementById('galleryImage').value,
        alt: document.getElementById('galleryAlt').value
    };

    try {
        if (itemId) {
            await apiCall(`/gallery/${itemId}`, 'PUT', galleryData);
            showNotification('Gallery image updated', 'success');
        } else {
            await apiCall('/gallery', 'POST', galleryData);
            showNotification('Gallery image added', 'success');
        }
        
        closeModal('galleryModal');
        loadGallery();
    } catch (error) {
        showNotification('Error saving gallery image', 'error');
    }
});

async function deleteGalleryItem(itemId) {
    console.log('[DEBUG] deleteGalleryItem called with ID:', itemId);
    
    if (!confirm('Are you sure you want to delete this image?')) {
        console.log('[DEBUG] User cancelled deletion');
        return;
    }

    try {
        console.log('[DEBUG] Making DELETE request to:', `/api/gallery/${itemId}`);
        const token = localStorage.getItem(STORAGE_KEY);
        console.log('[DEBUG] Token exists:', !!token);
        
        const result = await apiCall(`/gallery/${itemId}`, 'DELETE');
        console.log('[DEBUG] Delete response:', result);
        
        showNotification('Gallery image deleted', 'success');
        loadGallery();
    } catch (error) {
        console.error('[DEBUG] Error deleting gallery item:', error);
        console.error('[DEBUG] Error details:', {
            message: error.message,
            stack: error.stack,
            name: error.name
        });
        showNotification('Error deleting gallery image: ' + error.message, 'error');
    }
}

// Hero Images Management
async function loadHeroImages() {
    try {
        const heroes = await apiCall('/hero');
        const container = document.getElementById('heroList');
        container.innerHTML = '';

        if (heroes.length === 0) {
            container.innerHTML = '<p>No hero images found. Add your first hero image!</p>';
            return;
        }

        heroes.forEach(item => {
            const card = createHeroCard(item);
            container.appendChild(card);
        });
    } catch (error) {
        document.getElementById('heroList').innerHTML = 
            '<p class="error">Error loading hero images. Make sure API is configured.</p>';
    }
}

function createHeroCard(item) {
    const card = document.createElement('div');
    card.className = 'item-card';
    card.innerHTML = `
        <img src="${item.image}" alt="Hero Image" onerror="this.src='assets/images/hero-1.webp'">
        <div class="item-card-body">
            <div class="item-card-title">Hero Image ${item.id}</div>
            <div class="item-card-actions">
                <button class="btn btn-danger" onclick="deleteHeroImage('${item.id}')">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `;
    return card;
}

function openHeroModal(itemId = null) {
    const modal = document.getElementById('heroModal');
    const form = document.getElementById('heroForm');
    const title = document.getElementById('heroModalTitle');

    form.reset();
    document.getElementById('heroImagePreview').innerHTML = '';

    if (itemId) {
        title.textContent = 'Edit Hero Image';
        document.getElementById('heroId').value = itemId;
    } else {
        title.textContent = 'Add Hero Image';
        document.getElementById('heroId').value = '';
    }

    modal.classList.add('active');
}

document.getElementById('heroForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const itemId = document.getElementById('heroId').value;
    const heroData = {
        image: document.getElementById('heroImage').value
    };

    try {
        if (itemId) {
            await apiCall(`/hero/${itemId}`, 'PUT', heroData);
            showNotification('Hero image updated', 'success');
        } else {
            await apiCall('/hero', 'POST', heroData);
            showNotification('Hero image added', 'success');
        }
        
        closeModal('heroModal');
        loadHeroImages();
    } catch (error) {
        showNotification('Error saving hero image', 'error');
    }
});

async function deleteHeroImage(itemId) {
    if (!confirm('Are you sure you want to delete this hero image?')) return;

    try {
        await apiCall(`/hero/${itemId}`, 'DELETE');
        showNotification('Hero image deleted', 'success');
        loadHeroImages();
    } catch (error) {
        showNotification('Error deleting hero image', 'error');
    }
}

// Content Management
async function loadContent() {
    try {
        const content = await apiCall('/content');
        if (content.about) document.getElementById('aboutText').value = content.about;
        if (content.email) document.getElementById('contactEmail').value = content.email;
        if (content.phone) document.getElementById('contactPhone').value = content.phone;
        if (content.whatsapp) document.getElementById('whatsappNumber').value = content.whatsapp;
    } catch (error) {
        console.error('Error loading content:', error);
    }
}

document.getElementById('contentForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const contentData = {
        about: document.getElementById('aboutText').value,
        email: document.getElementById('contactEmail').value,
        phone: document.getElementById('contactPhone').value,
        whatsapp: document.getElementById('whatsappNumber').value
    };

    try {
        await apiCall('/content', 'PUT', contentData);
        showNotification('Content updated successfully', 'success');
    } catch (error) {
        showNotification('Error updating content', 'error');
    }
});

// Modal functions
function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// Close modal on outside click
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('active');
    }
}

// Image preview handlers
document.getElementById('productImageUpload')?.addEventListener('change', (e) => {
    handleImagePreview(e, 'productImagePreview', 'productImage');
});

document.getElementById('galleryImageUpload')?.addEventListener('change', (e) => {
    handleImagePreview(e, 'galleryImagePreview', 'galleryImage');
});

document.getElementById('heroImageUpload')?.addEventListener('change', (e) => {
    handleImagePreview(e, 'heroImagePreview', 'heroImage');
});

function handleImagePreview(event, previewId, inputId) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const preview = document.getElementById(previewId);
            preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
            // Note: For actual upload, you'd need to convert to base64 or upload to a service
            // For now, we'll just show preview
        };
        reader.readAsDataURL(file);
    }
}

// Notification system
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.classList.add('show');

    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

function setupEventListeners() {
    // Additional event listeners can be added here
}
