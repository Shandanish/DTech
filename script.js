// ===== DANISH TECH - MAIN JAVASCRIPT =====

document.addEventListener('DOMContentLoaded', function() {
    initApp();
});

function initApp() {
    loadAllContent();
    loadVideosSection();
    initNavigation();
    initSearch();
    initFilters();
    initScrollEffects();
    
    console.log('%c DANISH TECH HUB ', 'background: linear-gradient(90deg, #00f5ff, #bf00ff); color: #000; font-size: 20px; padding: 10px 20px; border-radius: 5px; font-weight: bold;');
    console.log('✅ Website loaded successfully');
}

// ===== Load All Content =====
function loadAllContent(filter = 'all') {
    const grid = document.getElementById('contentGrid');
    if (!grid) return;
    
    let filteredPosts = postsData;
    
    if (filter !== 'all') {
        filteredPosts = postsData.filter(post => post.type === filter);
    }
    
    grid.innerHTML = '';
    
    if (filteredPosts.length === 0) {
        grid.innerHTML = `
            <div class="no-content">
                <i class="fas fa-inbox"></i>
                <h3>No content available</h3>
                <p>Check back soon for new posts!</p>
            </div>
        `;
        return;
    }
    
    filteredPosts.forEach((post, index) => {
        const card = createPostCard(post);
        card.style.animationDelay = `${index * 0.1}s`;
        grid.appendChild(card);
    });
}

// ===== Load Videos Section =====
function loadVideosSection() {
    const grid = document.getElementById('videosGrid');
    if (!grid) return;
    
    const videos = postsData.filter(post => post.type === 'video');
    
    if (videos.length === 0) {
        document.querySelector('.videos-section').style.display = 'none';
        return;
    }
    
    grid.innerHTML = '';
    videos.forEach(video => {
        const card = createPostCard(video);
        grid.appendChild(card);
    });
}

// ===== Create Post Card =====
function createPostCard(post) {
    const card = document.createElement('div');
    card.className = post.type === 'video' ? 'post-card video-card' : 'post-card';
    card.dataset.id = post.id;
    card.dataset.type = post.type;
    
    if (post.type === 'video') {
        card.innerHTML = createVideoCard(post);
    } else {
        card.innerHTML = createSoftwareCard(post);
    }
    
    return card;
}

// ===== Create Software Card HTML =====
function createSoftwareCard(post) {
    const badgeHtml = post.badge ? `<span class="card-badge">${post.badge}</span>` : '';
    
    return `
        <div class="card-image">
            <img src="${post.image}" alt="${post.title}" loading="lazy">
            ${badgeHtml}
            <div class="card-type">
                <i class="fas fa-laptop-code"></i>
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
                    Download
                </button>
            </div>
        </div>
    `;
}

// ===== Create Video Card HTML =====
function createVideoCard(post) {
    const badgeHtml = post.badge ? `<span class="card-badge video-badge">${post.badge}</span>` : '';
    
    return `
        <div class="card-image">
            <img src="${post.image}" alt="${post.title}" loading="lazy">
            ${badgeHtml}
            <div class="card-type video">
                <i class="fas fa-play"></i>
            </div>
            <div class="video-play-overlay" onclick="playVideo(${post.id})">
                <div class="play-btn-large">
                    <i class="fas fa-play"></i>
                </div>
            </div>
            <span class="card-duration">
                <i class="fas fa-clock"></i> ${post.duration}
            </span>
        </div>
        <div class="card-content">
            <h3 class="card-title">${post.title}</h3>
            <p class="card-description">${post.description}</p>
            <div class="card-meta">
                <div class="meta-item video-meta">
                    <i class="fas fa-clock"></i>
                    <span>${post.duration}</span>
                </div>
                <div class="meta-item video-meta">
                    <i class="fas fa-eye"></i>
                    <span>${formatNumber(post.views)} views</span>
                </div>
            </div>
            <div class="card-footer">
                <span class="category-tag">${post.category}</span>
                <button class="watch-btn" onclick="playVideo(${post.id})">
                    <i class="fas fa-play"></i>
                    Watch Now
                </button>
            </div>
        </div>
    `;
}

// ===== Play Video =====
function playVideo(postId) {
    const post = postsData.find(p => p.id === postId);
    if (!post || post.type !== 'video') return;
    
    const modal = document.getElementById('videoModal');
    const videoWrapper = document.getElementById('videoWrapper');
    const videoTitle = document.getElementById('videoTitle');
    const videoDescription = document.getElementById('videoDescription');
    
    videoTitle.textContent = post.title;
    videoDescription.textContent = post.description;
    
    // Parse video URL and create embed
    const embedUrl = getEmbedUrl(post.videoUrl);
    
    if (embedUrl.type === 'youtube' || embedUrl.type === 'vimeo') {
        videoWrapper.innerHTML = `
            <iframe 
                src="${embedUrl.url}" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen>
            </iframe>
        `;
    } else if (embedUrl.type === 'direct') {
        videoWrapper.innerHTML = `
            <video controls autoplay>
                <source src="${embedUrl.url}" type="video/mp4">
                Your browser does not support the video tag.
            </video>
        `;
    }
    
    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// ===== Get Embed URL =====
function getEmbedUrl(url) {
    // YouTube
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
        let videoId = '';
        
        if (url.includes('youtube.com/watch')) {
            const urlParams = new URLSearchParams(new URL(url).search);
            videoId = urlParams.get('v');
        } else if (url.includes('youtu.be/')) {
            videoId = url.split('youtu.be/')[1].split('?')[0];
        } else if (url.includes('youtube.com/embed/')) {
            videoId = url.split('youtube.com/embed/')[1].split('?')[0];
        }
        
        return {
            type: 'youtube',
            url: `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`
        };
    }
    
    // Vimeo
    if (url.includes('vimeo.com')) {
        const videoId = url.split('vimeo.com/')[1].split('?')[0];
        return {
            type: 'vimeo',
            url: `https://player.vimeo.com/video/${videoId}?autoplay=1`
        };
    }
    
    // Direct video link (.mp4, .webm, etc.)
    if (url.match(/\.(mp4|webm|ogg)$/i)) {
        return {
            type: 'direct',
            url: url
        };
    }
    
    // Default: treat as direct link
    return {
        type: 'direct',
        url: url
    };
}

// ===== Close Video Modal =====
function closeVideoModal() {
    const modal = document.getElementById('videoModal');
    const videoWrapper = document.getElementById('videoWrapper');
    
    modal.classList.remove('active');
    document.body.style.overflow = '';
    
    // Stop video
    videoWrapper.innerHTML = '';
}

// ===== Start Download =====
function startDownload(url, title) {
    const modal = document.getElementById('downloadModal');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    const manualDownload = document.getElementById('manualDownload');
    
    manualDownload.href = url;
    manualDownload.onclick = function(e) {
        e.preventDefault();
        window.open(url, '_blank');
    };
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
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
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu) navMenu.classList.remove('active');
            if (menuToggle) menuToggle.querySelector('i').className = 'fas fa-bars';
        });
    });
}

// ===== Filters =====
function initFilters() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    
    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const filter = tab.dataset.filter;
            loadAllContent(filter);
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
        <div class="search-result-item" onclick="handleSearchClick(${post.id})">
            <img src="${post.image}" alt="${post.title}">
            <div class="result-info">
                <h4>${post.title}</h4>
                <span class="result-type ${post.type}">
                    <i class="fas ${post.type === 'video' ? 'fa-play' : 'fa-download'}"></i>
                    ${post.type}
                </span>
            </div>
        </div>
    `).join('');
}

function handleSearchClick(postId) {
    const post = postsData.find(p => p.id === postId);
    closeSearch();
    
    if (post.type === 'video') {
        playVideo(postId);
    } else {
        startDownload(post.downloadUrl, post.title);
    }
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
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            navbar.classList.toggle('scrolled', window.scrollY > 80);
        }
    });
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.post-card, .feature-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(40px)';
        card.style.transition = 'all 0.6s ease';
        observer.observe(card);
    });
}

// ===== Keyboard Shortcuts =====
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeDownloadModal();
        closeVideoModal();
        closeSearch();
    }
    
    if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        const searchModal = document.getElementById('searchModal');
        if (searchModal) {
            searchModal.classList.add('active');
            document.getElementById('searchInput').focus();
        }
    }
});
