// ===== DANISH TECH - MAIN JAVASCRIPT =====

document.addEventListener('DOMContentLoaded', function() {
    initApp();
});

function initApp() {
    loadDownloads();
    initNavigation();
    initSearch();
    initScrollEffects();
    
    console.log('%c DANISH TECH HUB ', 'background: linear-gradient(90deg, #00f5ff, #bf00ff); color: #000; font-size: 20px; padding: 10px 20px; border-radius: 5px; font-weight: bold;');
    console.log('✅ Website loaded successfully');
}

// ===== Load Downloads =====
function loadDownloads() {
    const grid = document.getElementById('downloadsGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    if (postsData.length === 0) {
        grid.innerHTML = `
            <div class="no-downloads">
                <i class="fas fa-inbox"></i>
                <h3>No downloads available</h3>
                <p>Check back soon for new content!</p>
            </div>
        `;
        return;
    }
    
    postsData.forEach((post, index) => {
        const card = createDownloadCard(post);
        card.style.animationDelay = `${index * 0.15}s`;
        grid.appendChild(card);
    });
}

// ===== Create Download Card =====
function createDownloadCard(post) {
    const card = document.createElement('div');
    card.className = 'download-card';
    card.dataset.id = post.id;
    
    const typeIcons = {
        software: 'fa-laptop-code',
        image: 'fa-image',
        video: 'fa-play',
        document: 'fa-file-alt'
    };
    
    const badgeHtml = post.badge ? `<span class="card-badge">${post.badge}</span>` : '';
    
    card.innerHTML = `
        <div class="card-image">
            <img src="${post.image}" alt="${post.title}" loading="lazy">
            ${badgeHtml}
            <div class="card-type">
                <i class="fas ${typeIcons[post.type] || 'fa-download'}"></i>
            </div>
        </div>
        <div class="card-content">
            <h3 class="card-title">${post.title}</h3>
            <p class="card-description">${post.description}</p>
            <div class="card-meta">
                <div class="meta-item">
                    <i class="fas fa-hdd"></i>
                    <span>${post.fileSize}</span>
                </div>
                <div class="meta-item">
                    <i class="fas fa-desktop"></i>
                    <span>${post.platform}</span>
                </div>
                <div class="meta-item">
                    <i class="fas fa-download"></i>
                    <span>${formatNumber(post.downloads)}</span>
                </div>
            </div>
            <div class="card-footer">
                <span class="version-tag">v${post.version}</span>
                <button class="download-btn" onclick="startDownload('${post.downloadUrl}', '${post.title}')">
                    <i class="fas fa-download"></i>
                    Download Now
                </button>
            </div>
        </div>
    `;
    
    return card;
}

// ===== Start Download with Auto-Download =====
function startDownload(url, title) {
    const modal = document.getElementById('downloadModal');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    const manualDownload = document.getElementById('manualDownload');
    
    // Set manual download link
    manualDownload.href = url;
    manualDownload.onclick = function(e) {
        e.preventDefault();
        window.open(url, '_blank');
    };
    
    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Animate progress
    let progress = 0;
    const messages = ['Preparing download...', 'Connecting to server...', 'Starting download...'];
    
    progressFill.style.width = '0%';
    progressText.textContent = messages[0];
    
    const progressInterval = setInterval(() => {
        progress += 2;
        progressFill.style.width = `${progress}%`;
        
        if (progress >= 30 && progress < 60) {
            progressText.textContent = messages[1];
        } else if (progress >= 60) {
            progressText.textContent = messages[2];
        }
        
        if (progress >= 100) {
            clearInterval(progressInterval);
            progressText.textContent = 'Download started! ✓';
            
            // Auto redirect to download
            setTimeout(() => {
                window.open(url, '_blank');
            }, 500);
        }
    }, 50);
}

// ===== Close Download Modal =====
function closeDownloadModal() {
    const modal = document.getElementById('downloadModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
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
            const icon = menuToggle.querySelector('i');
            icon.className = navMenu.classList.contains('active') ? 'fas fa-times' : 'fas fa-bars';
        });
    }
    
    // Close menu when clicking nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu) navMenu.classList.remove('active');
            if (menuToggle) menuToggle.querySelector('i').className = 'fas fa-bars';
        });
    });
}

// ===== Search =====
function initSearch() {
    const searchBtn = document.getElementById('searchBtn');
    const searchModal = document.getElementById('searchModal');
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    
    if (searchBtn && searchModal) {
        searchBtn.addEventListener('click', () => {
            searchModal.classList.add('active');
            setTimeout(() => searchInput.focus(), 100);
        });
    }
    
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            
            if (query.length < 2) {
                searchResults.innerHTML = '';
                return;
            }
            
            const results = postsData.filter(post => 
                post.title.toLowerCase().includes(query) || 
                post.description.toLowerCase().includes(query) ||
                post.category.toLowerCase().includes(query)
            );
            
            displaySearchResults(results);
        });
    }
}

function displaySearchResults(results) {
    const searchResults = document.getElementById('searchResults');
    
    if (results.length === 0) {
        searchResults.innerHTML = `
            <div style="text-align: center; padding: 40px; color: var(--text-secondary);">
                <i class="fas fa-search" style="font-size: 2rem; margin-bottom: 15px; opacity: 0.5;"></i>
                <p>No results found</p>
            </div>
        `;
        return;
    }
    
    searchResults.innerHTML = results.map(post => `
        <div class="search-result-item" onclick="handleSearchResultClick('${post.downloadUrl}', '${post.title}')">
            <img src="${post.image}" alt="${post.title}">
            <div class="result-info">
                <h4>${post.title}</h4>
                <span class="result-type">${post.type} • ${post.fileSize}</span>
            </div>
        </div>
    `).join('');
}

function handleSearchResultClick(url, title) {
    closeSearch();
    startDownload(url, title);
}

function closeSearch() {
    const searchModal = document.getElementById('searchModal');
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    
    if (searchModal) searchModal.classList.remove('active');
    if (searchInput) searchInput.value = '';
    if (searchResults) searchResults.innerHTML = '';
}

// ===== Scroll Effects =====
function initScrollEffects() {
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            navbar.classList.toggle('scrolled', window.scrollY > 80);
        }
    });
    
    // Animate cards on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.download-card, .feature-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(40px)';
        card.style.transition = 'all 0.6s ease';
        observer.observe(card);
    });
}

// ===== Keyboard shortcuts =====
document.addEventListener('keydown', (e) => {
    // ESC to close modals
    if (e.key === 'Escape') {
        closeDownloadModal();
        closeSearch();
    }
    
    // Ctrl+K for search
    if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        const searchModal = document.getElementById('searchModal');
        if (searchModal) {
            searchModal.classList.add('active');
            document.getElementById('searchInput').focus();
        }
    }
});

// ===== Add no-downloads style =====
const style = document.createElement('style');
style.textContent = `
    .no-downloads {
        grid-column: 1 / -1;
        text-align: center;
        padding: 80px 20px;
        color: var(--text-secondary);
    }
    
    .no-downloads i {
        font-size: 4rem;
        margin-bottom: 20px;
        color: var(--neon-cyan);
        opacity: 0.5;
    }
    
    .no-downloads h3 {
        font-size: 1.5rem;
        margin-bottom: 10px;
        color: var(--text-primary);
    }
`;
document.head.appendChild(style);
