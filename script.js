// ===== NEXUS 2050 - Main JavaScript =====

document.addEventListener('DOMContentLoaded', function() {
    
    // ===== Initialize =====
    loadPosts();
    updateStats();
    initNavigation();
    initSearch();
    initFilters();
    initModal();
    
    console.log('%c NEXUS 2050 ', 'background: linear-gradient(90deg, #00f5ff, #bf00ff); color: #000; font-size: 20px; padding: 10px; border-radius: 5px;');
    console.log('System initialized successfully ✓');
});

// ===== Load Posts =====
function loadPosts(filter = 'all', limit = 8) {
    const grid = document.getElementById('postsGrid');
    if (!grid) return;
    
    let filteredPosts = postsData;
    
    if (filter !== 'all') {
        filteredPosts = postsData.filter(post => post.type === filter);
    }
    
    // Sort by date (newest first)
    filteredPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Limit posts
    const displayPosts = filteredPosts.slice(0, limit);
    
    grid.innerHTML = '';
    
    if (displayPosts.length === 0) {
        grid.innerHTML = `
            <div class="no-posts">
                <i class="fas fa-inbox"></i>
                <h3>No posts found</h3>
                <p>Check back later for new content!</p>
            </div>
        `;
        return;
    }
    
    displayPosts.forEach((post, index) => {
        const card = createPostCard(post);
        card.style.animationDelay = `${index * 0.1}s`;
        grid.appendChild(card);
    });
}

// ===== Create Post Card =====
function createPostCard(post) {
    const card = document.createElement('div');
    card.className = 'post-card';
    card.dataset.type = post.type;
    card.dataset.id = post.id;
    
    const typeIcons = {
        image: 'fa-image',
        video: 'fa-play',
        document: 'fa-file-alt',
        software: 'fa-download'
    };
    
    const typeLabels = {
        image: 'Image',
        video: 'Video',
        document: 'Document',
        software: 'Software'
    };
    
    const formattedDate = formatDate(post.date);
    
    card.innerHTML = `
        <div class="post-image">
            <img src="${post.image}" alt="${post.title}" loading="lazy">
            <span class="post-type-badge ${post.type}">
                <i class="fas ${typeIcons[post.type]}"></i>
                ${typeLabels[post.type]}
            </span>
            <span class="post-date">${formattedDate}</span>
            <div class="post-overlay">
                <button class="overlay-btn preview" onclick="openPreview(${post.id})">
                    <i class="fas fa-eye"></i>
                </button>
                <a href="${post.file}" class="overlay-btn download" download>
                    <i class="fas fa-download"></i>
                </a>
            </div>
        </div>
        <div class="post-content">
            <h3 class="post-title">${post.title}</h3>
            <p class="post-description">${post.description}</p>
            <div class="post-meta">
                <div class="post-stats">
                    <span class="stat">
                        <i class="fas fa-eye"></i>
                        ${formatNumber(post.views)}
                    </span>
                    <span class="stat">
                        <i class="fas fa-download"></i>
                        ${formatNumber(post.downloads)}
                    </span>
                </div>
                <a href="${post.file}" class="post-action" download>
                    <i class="fas fa-download"></i>
                    Download
                </a>
            </div>
        </div>
    `;
    
    return card;
}

// ===== Update Stats =====
function updateStats() {
    const imageCount = document.getElementById('imageCount');
    const videoCount = document.getElementById('videoCount');
    const docCount = document.getElementById('docCount');
    const softwareCount = document.getElementById('softwareCount');
    
    if (imageCount) {
        animateNumber(imageCount, postsData.filter(p => p.type === 'image').length);
    }
    if (videoCount) {
        animateNumber(videoCount, postsData.filter(p => p.type === 'video').length);
    }
    if (docCount) {
        animateNumber(docCount, postsData.filter(p => p.type === 'document').length);
    }
    if (softwareCount) {
        animateNumber(softwareCount, postsData.filter(p => p.type === 'software').length);
    }
}

// ===== Animate Number =====
function animateNumber(element, target) {
    let current = 0;
    const increment = target / 30;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 50);
}

// ===== Format Date =====
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// ===== Format Number =====
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

// ===== Navigation =====
function initNavigation() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu && !e.target.closest('.nav-menu') && !e.target.closest('.menu-toggle')) {
            navMenu.classList.remove('active');
        }
    });
    
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 100) {
                navbar.style.background = 'rgba(0, 0, 17, 0.95)';
            } else {
                navbar.style.background = 'rgba(0, 0, 17, 0.8)';
            }
        }
    });
}

// ===== Search =====
function initSearch() {
    const searchBtn = document.getElementById('searchBtn');
    const searchOverlay = document.getElementById('searchOverlay');
    const searchClose = document.getElementById('searchClose');
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    
    if (searchBtn && searchOverlay) {
        searchBtn.addEventListener('click', () => {
            searchOverlay.classList.add('active');
            searchInput.focus();
        });
        
        searchClose.addEventListener('click', () => {
            searchOverlay.classList.remove('active');
        });
        
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            
            if (query.length < 2) {
                searchResults.innerHTML = '';
                return;
            }
            
            const results = postsData.filter(post => 
                post.title.toLowerCase().includes(query) || 
                post.description.toLowerCase().includes(query)
            );
            
            displaySearchResults(results);
        });
    }
}

function displaySearchResults(results) {
    const searchResults = document.getElementById('searchResults');
    
    if (results.length === 0) {
        searchResults.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No results found</p>';
        return;
    }
    
    searchResults.innerHTML = results.map(post => `
        <div class="search-result-item" onclick="goToPost(${post.id})">
            <img src="${post.image}" alt="${post.title}">
            <div class="result-info">
                <h4>${post.title}</h4>
                <span class="result-type">${post.type}</span>
            </div>
        </div>
    `).join('');
}

// ===== Filters =====
function initFilters() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    
    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const filter = tab.dataset.filter;
            loadPosts(filter);
        });
    });
    
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            const sortBy = e.target.value;
            sortPosts(sortBy);
        });
    }
    
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        let currentLimit = 8;
        loadMoreBtn.addEventListener('click', () => {
            currentLimit += 4;
            const activeFilter = document.querySelector('.filter-tab.active');
            loadPosts(activeFilter ? activeFilter.dataset.filter : 'all', currentLimit);
        });
    }
}

function sortPosts(sortBy) {
    const grid = document.getElementById('postsGrid');
    const cards = Array.from(grid.children);
    
    cards.sort((a, b) => {
        const postA = postsData.find(p => p.id == a.dataset.id);
        const postB = postsData.find(p => p.id == b.dataset.id);
        
        switch(sortBy) {
            case 'newest':
                return new Date(postB.date) - new Date(postA.date);
            case 'oldest':
                return new Date(postA.date) - new Date(postB.date);
            case 'popular':
                return postB.views - postA.views;
            default:
                return 0;
        }
    });
    
    grid.innerHTML = '';
    cards.forEach(card => grid.appendChild(card));
}

// ===== Modal =====
function initModal() {
    const modal = document.getElementById('previewModal');
    const modalClose = document.getElementById('modalClose');
    const modalBackdrop = document.getElementById('modalBackdrop');
    
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    
    if (modalBackdrop) {
        modalBackdrop.addEventListener('click', closeModal);
    }
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

function openPreview(postId) {
    const post = postsData.find(p => p.id === postId);
    if (!post) return;
    
    const modal = document.getElementById('previewModal');
    const modalBody = document.getElementById('modalBody');
    
    let content = '';
    
    switch(post.type) {
        case 'image':
            content = `
                <img src="${post.image}" alt="${post.title}" style="max-width: 100%; border-radius: 15px;">
                <h2 style="margin-top: 20px;">${post.title}</h2>
                <p style="color: var(--text-secondary); margin: 15px 0;">${post.description}</p>
                <a href="${post.file}" class="post-action" download style="display: inline-flex;">
                    <i class="fas fa-download"></i>
                    Download Image
                </a>
            `;
            break;
        case 'video':
            content = `
                <div style="position: relative; padding-bottom: 56.25%; height: 0;">
                    <iframe src="${post.videoUrl}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border-radius: 15px;" frameborder="0" allowfullscreen></iframe>
                </div>
                <h2 style="margin-top: 20px;">${post.title}</h2>
                <p style="color: var(--text-secondary); margin: 15px 0;">${post.description}</p>
            `;
            break;
        case 'document':
            content = `
                <div style="text-align: center; padding: 40px;">
                    <i class="fas fa-file-pdf" style="font-size: 5rem; color: var(--neon-orange); margin-bottom: 20px;"></i>
                    <h2>${post.title}</h2>
                    <p style="color: var(--text-secondary); margin: 15px 0;">${post.description}</p>
                    <div style="margin: 20px 0; color: var(--text-secondary);">
                        <span><i class="fas fa-file"></i> ${post.fileType}</span>
                        <span style="margin-left: 20px;"><i class="fas fa-hdd"></i> ${post.fileSize}</span>
                    </div>
                    <a href="${post.file}" class="post-action" download style="display: inline-flex;">
                        <i class="fas fa-download"></i>
                        Download ${post.fileType}
                    </a>
                </div>
            `;
            break;
        case 'software':
            content = `
                <div style="text-align: center; padding: 40px;">
                    <i class="fas fa-cube" style="font-size: 5rem; color: var(--neon-green); margin-bottom: 20px;"></i>
                    <h2>${post.title}</h2>
                    <span style="background: var(--neon-green); color: #000; padding: 5px 15px; border-radius: 20px; font-size: 0.85rem;">v${post.version}</span>
                    <p style="color: var(--text-secondary); margin: 20px 0;">${post.description}</p>
                    <div style="margin: 20px 0; color: var(--text-secondary);">
                        <span><i class="fas fa-desktop"></i> ${post.platform}</span>
                        <span style="margin-left: 20px;"><i class="fas fa-hdd"></i> ${post.fileSize}</span>
                    </div>
                    <a href="${post.file}" class="post-action" download style="display: inline-flex;">
                        <i class="fas fa-download"></i>
                        Download Software
                    </a>
                </div>
            `;
            break;
    }
    
    modalBody.innerHTML = content;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('previewModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function goToPost(postId) {
    closeModal();
    const searchOverlay = document.getElementById('searchOverlay');
    if (searchOverlay) {
        searchOverlay.classList.remove('active');
    }
    openPreview(postId);
}

// ===== Add search result item styles =====
const style = document.createElement('style');
style.textContent = `
    .search-result-item {
        display: flex;
        align-items: center;
        gap: 15px;
        padding: 15px;
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        border-radius: 12px;
        margin-bottom: 10px;
        cursor: pointer;
        transition: all 0.3s;
    }
    
    .search-result-item:hover {
        border-color: var(--neon-cyan);
        transform: translateX(10px);
    }
    
    .search-result-item img {
        width: 60px;
        height: 60px;
        object-fit: cover;
        border-radius: 10px;
    }
    
    .result-info h4 {
        margin-bottom: 5px;
    }
    
    .result-type {
        background: var(--gradient-cyber);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-size: 0.85rem;
        text-transform: uppercase;
    }
    
    .no-posts {
        grid-column: 1 / -1;
        text-align: center;
        padding: 60px;
        color: var(--text-secondary);
    }
    
    .no-posts i {
        font-size: 4rem;
        margin-bottom: 20px;
        color: var(--neon-cyan);
    }
    
    .post-card {
        animation: fadeInUp 0.5s ease forwards;
        opacity: 0;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);
