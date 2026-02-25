// ===== DANISH TECH HUB - MAIN JAVASCRIPT =====

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded');
    
    // Check if posts data exists
    if (typeof postsData !== 'undefined') {
        console.log('Posts found:', postsData.length);
        loadAllContent();
        loadVideosOnly();
    } else {
        console.error('postsData not found!');
        showError();
    }
});

// ===== Load All Content =====
function loadAllContent(filterType) {
    var grid = document.getElementById('contentGrid');
    if (!grid) return;
    
    var posts = postsData;
    
    // Filter if needed
    if (filterType && filterType !== 'all') {
        posts = postsData.filter(function(post) {
            return post.type === filterType;
        });
    }
    
    // Clear grid
    grid.innerHTML = '';
    
    // Check if posts exist
    if (posts.length === 0) {
        grid.innerHTML = '<div class="no-content"><i class="fas fa-inbox"></i><h3>No content found</h3></div>';
        return;
    }
    
    // Create cards
    posts.forEach(function(post) {
        var card = createCard(post);
        grid.innerHTML += card;
    });
}

// ===== Load Videos Only =====
function loadVideosOnly() {
    var grid = document.getElementById('videosGrid');
    if (!grid) return;
    
    var videos = postsData.filter(function(post) {
        return post.type === 'video';
    });
    
    // Hide section if no videos
    var section = document.querySelector('.videos-section');
    if (videos.length === 0) {
        if (section) section.style.display = 'none';
        return;
    }
    
    // Show section
    if (section) section.style.display = 'block';
    
    // Create video cards
    grid.innerHTML = '';
    videos.forEach(function(post) {
        var card = createCard(post);
        grid.innerHTML += card;
    });
}

// ===== Create Card HTML =====
function createCard(post) {
    if (post.type === 'video') {
        return createVideoCardHTML(post);
    } else {
        return createSoftwareCardHTML(post);
    }
}

// ===== Software Card HTML =====
function createSoftwareCardHTML(post) {
    var badgeHTML = post.badge ? '<span class="card-badge">' + post.badge + '</span>' : '';
    
    return '<div class="post-card" data-id="' + post.id + '">' +
        '<div class="card-image">' +
            '<img src="' + post.image + '" alt="' + post.title + '">' +
            badgeHTML +
            '<div class="card-type-icon"><i class="fas fa-download"></i></div>' +
        '</div>' +
        '<div class="card-content">' +
            '<h3 class="card-title">' + post.title + '</h3>' +
            '<p class="card-description">' + post.description + '</p>' +
            '<div class="card-meta">' +
                '<div class="meta-item"><i class="fas fa-hdd"></i><span>' + post.fileSize + '</span></div>' +
                '<div class="meta-item"><i class="fas fa-desktop"></i><span>' + post.platform + '</span></div>' +
                '<div class="meta-item"><i class="fas fa-download"></i><span>' + formatNumber(post.downloads) + '</span></div>' +
            '</div>' +
            '<div class="card-footer">' +
                '<span class="version-tag">v' + post.version + '</span>' +
                '<button class="download-btn" onclick="startDownload(\'' + post.downloadUrl + '\', \'' + post.title + '\')">' +
                    '<i class="fas fa-download"></i> Download' +
                '</button>' +
            '</div>' +
        '</div>' +
    '</div>';
}

// ===== Video Card HTML =====
function createVideoCardHTML(post) {
    var badgeHTML = post.badge ? '<span class="card-badge video-badge">' + post.badge + '</span>' : '';
    
    return '<div class="post-card video-card" data-id="' + post.id + '">' +
        '<div class="card-image">' +
            '<img src="' + post.image + '" alt="' + post.title + '">' +
            badgeHTML +
            '<div class="card-type-icon video"><i class="fas fa-play"></i></div>' +
            '<div class="video-overlay" onclick="playVideo(' + post.id + ')">' +
                '<div class="play-btn-large"><i class="fas fa-play"></i></div>' +
            '</div>' +
            '<span class="card-duration"><i class="fas fa-clock"></i> ' + post.duration + '</span>' +
        '</div>' +
        '<div class="card-content">' +
            '<h3 class="card-title">' + post.title + '</h3>' +
            '<p class="card-description">' + post.description + '</p>' +
            '<div class="card-meta">' +
                '<div class="meta-item video-meta"><i class="fas fa-clock"></i><span>' + post.duration + '</span></div>' +
                '<div class="meta-item video-meta"><i class="fas fa-eye"></i><span>' + formatNumber(post.views) + ' views</span></div>' +
            '</div>' +
            '<div class="card-footer">' +
                '<span class="category-tag">' + post.category + '</span>' +
                '<button class="watch-btn" onclick="playVideo(' + post.id + ')">' +
                    '<i class="fas fa-play"></i> Watch' +
                '</button>' +
            '</div>' +
        '</div>' +
    '</div>';
}

// ===== Filter Posts =====
function filterPosts(type) {
    // Update active tab
    var tabs = document.querySelectorAll('.filter-tab');
    tabs.forEach(function(tab) {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Load filtered content
    loadAllContent(type);
}

// ===== Start Download =====
function startDownload(url, title) {
    var modal = document.getElementById('downloadModal');
    var progressFill = document.getElementById('progressFill');
    var progressText = document.getElementById('progressText');
    var manualDownload = document.getElementById('manualDownload');
    
    // Set manual link
    manualDownload.href = url;
    
    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Animate progress
    var progress = 0;
    progressFill.style.width = '0%';
    progressText.textContent = 'Preparing download...';
    
    var interval = setInterval(function() {
        progress += 3;
        progressFill.style.width = progress + '%';
        
        if (progress >= 30) {
            progressText.textContent = 'Connecting to server...';
        }
        if (progress >= 60) {
            progressText.textContent = 'Starting download...';
        }
        if (progress >= 100) {
            clearInterval(interval);
            progressText.textContent = 'Download started! ✓';
            
            // Open download link
            setTimeout(function() {
                window.open(url, '_blank');
            }, 500);
        }
    }, 50);
}

// ===== Close Download Modal =====
function closeDownloadModal() {
    var modal = document.getElementById('downloadModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// ===== Play Video =====
function playVideo(postId) {
    var post = postsData.find(function(p) {
        return p.id === postId;
    });
    
    if (!post || post.type !== 'video') return;
    
    var modal = document.getElementById('videoModal');
    var videoPlayer = document.getElementById('videoPlayer');
    var videoTitle = document.getElementById('videoModalTitle');
    var videoDesc = document.getElementById('videoModalDesc');
    
    // Set title and description
    videoTitle.textContent = post.title;
    videoDesc.textContent = post.description;
    
    // Get embed URL
    var embedUrl = getYouTubeEmbedUrl(post.videoUrl);
    
    // Create iframe
    videoPlayer.innerHTML = '<iframe src="' + embedUrl + '" allowfullscreen allow="autoplay"></iframe>';
    
    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// ===== Get YouTube Embed URL =====
function getYouTubeEmbedUrl(url) {
    var videoId = '';
    
    // YouTube watch URL
    if (url.indexOf('youtube.com/watch') !== -1) {
        var urlParams = new URL(url).searchParams;
        videoId = urlParams.get('v');
    }
    // YouTube short URL
    else if (url.indexOf('youtu.be/') !== -1) {
        videoId = url.split('youtu.be/')[1].split('?')[0];
    }
    // Already embed URL
    else if (url.indexOf('youtube.com/embed/') !== -1) {
        return url + '?autoplay=1';
    }
    // Vimeo
    else if (url.indexOf('vimeo.com') !== -1) {
        videoId = url.split('vimeo.com/')[1].split('?')[0];
        return 'https://player.vimeo.com/video/' + videoId + '?autoplay=1';
    }
    // Direct video
    else {
        return url;
    }
    
    return 'https://www.youtube.com/embed/' + videoId + '?autoplay=1&rel=0';
}

// ===== Close Video Modal =====
function closeVideoModal() {
    var modal = document.getElementById('videoModal');
    var videoPlayer = document.getElementById('videoPlayer');
    
    modal.classList.remove('active');
    document.body.style.overflow = '';
    
    // Stop video
    videoPlayer.innerHTML = '';
}

// ===== Search Functions =====
function openSearch() {
    var modal = document.getElementById('searchModal');
    modal.classList.add('active');
    document.getElementById('searchInput').focus();
}

function closeSearch() {
    var modal = document.getElementById('searchModal');
    modal.classList.remove('active');
    document.getElementById('searchInput').value = '';
    document.getElementById('searchResults').innerHTML = '';
}

function searchContent() {
    var query = document.getElementById('searchInput').value.toLowerCase().trim();
    var results = document.getElementById('searchResults');
    
    if (query.length < 2) {
        results.innerHTML = '';
        return;
    }
    
    var found = postsData.filter(function(post) {
        return post.title.toLowerCase().indexOf(query) !== -1 ||
               post.description.toLowerCase().indexOf(query) !== -1;
    });
    
    if (found.length === 0) {
        results.innerHTML = '<div class="no-content"><p>No results found</p></div>';
        return;
    }
    
    var html = '';
    found.forEach(function(post) {
        html += '<div class="search-result-item" onclick="handleSearchClick(' + post.id + ')">' +
            '<img src="' + post.image + '" alt="' + post.title + '">' +
            '<div class="result-info">' +
                '<h4>' + post.title + '</h4>' +
                '<span class="result-type ' + post.type + '">' +
                    '<i class="fas fa-' + (post.type === 'video' ? 'play' : 'download') + '"></i> ' +
                    post.type +
                '</span>' +
            '</div>' +
        '</div>';
    });
    
    results.innerHTML = html;
}

function handleSearchClick(postId) {
    var post = postsData.find(function(p) {
        return p.id === postId;
    });
    
    closeSearch();
    
    if (post.type === 'video') {
        playVideo(postId);
    } else {
        startDownload(post.downloadUrl, post.title);
    }
}

// ===== Toggle Menu =====
function toggleMenu() {
    var menu = document.getElementById('navMenu');
    var toggle = document.getElementById('menuToggle');
    
    menu.classList.toggle('active');
    
    var icon = toggle.querySelector('i');
    if (menu.classList.contains('active')) {
        icon.className = 'fas fa-times';
    } else {
        icon.className = 'fas fa-bars';
    }
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

// ===== Show Error =====
function showError() {
    var grid = document.getElementById('contentGrid');
    if (grid) {
        grid.innerHTML = '<div class="no-content"><i class="fas fa-exclamation-triangle"></i><h3>Error loading content</h3><p>Please check if posts.js is loaded correctly</p></div>';
    }
}

// ===== Keyboard Shortcuts =====
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeDownloadModal();
        closeVideoModal();
        closeSearch();
    }
});

// ===== Console Log =====
console.log('%c DANISH TECH HUB ', 'background: linear-gradient(90deg, #00f5ff, #ff00e4); color: #000; font-size: 16px; padding: 8px 15px; border-radius: 5px; font-weight: bold;');
