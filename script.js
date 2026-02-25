// script.js - Client-Side Logic for Admin & Public View

document.addEventListener('DOMContentLoaded', () => {
    // --- CONFIGURATION ---
    const GITHUB_USERNAME = 'YOUR_GITHUB_USERNAME'; // 🔴 REPLACE THIS
    const REPO_NAME = 'YOUR_REPO_NAME';             // 🔴 REPLACE THIS
    const REPO_URL = `https://github.com/${GITHUB_USERNAME}/${REPO_NAME}`;
    document.getElementById('repo-link').href = REPO_URL;

    // --- DOM ELEMENTS ---
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const fileList = document.getElementById('file-list');
    const softwareForm = document.getElementById('software-form');
    const previewBtn = document.getElementById('preview-btn');
    const publishBtn = document.getElementById('publish-btn');
    const previewArea = document.getElementById('preview-area');
    const publishStatus = document.getElementById('publish-status');
    const downloadsGrid = document.getElementById('downloads-grid');
    const loadingDownloads = document.getElementById('loading-downloads');
    const noDownloads = document.getElementById('no-downloads');

    let selectedFiles = [];

    // --- DRAG & DROP & FILE HANDLING ---
    dropZone.addEventListener('click', () => fileInput.click());
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('drag-over');
    });
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        handleFiles(e.dataTransfer.files);
    });
    fileInput.addEventListener('change', (e) => handleFiles(e.target.files));

    function handleFiles(files) {
        selectedFiles = [...selectedFiles, ...Array.from(files)];
        renderFileList();
    }

    function renderFileList() {
        fileList.innerHTML = selectedFiles.map(f => `
            <div class="flex items-center justify-between bg-gray-600 px-3 py-1 rounded mb-1">
                <span class="truncate">${f.name} (${(f.size / 1024 / 1024).toFixed(2)} MB)</span>
                <button type="button" class="text-red-400 hover:text-red-300 text-lg" onclick="this.parentElement.remove(); removeFile('${f.name}')">✕</button>
            </div>
        `).join('');
    }

    // Helper to remove file from list (client-side only)
    window.removeFile = (filename) => {
        selectedFiles = selectedFiles.filter(f => f.name !== filename);
        renderFileList();
    };

    // --- PREVIEW FUNCTIONALITY ---
    previewBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        const data = getFormData();
        previewArea.innerHTML = generateCardHTML(data, true); // true = preview mode
        previewArea.classList.remove('hidden');
        previewArea.scrollIntoView({ behavior: 'smooth' });
    });

    // --- PUBLISH FUNCTIONALITY (Triggers GitHub Action) ---
    publishBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        if (!validateForm() || selectedFiles.length === 0) {
            alert('❌ Please fill all required fields and select at least one file!');
            return;
        }

        publishBtn.disabled = true;
        publishBtn.innerHTML = '⏳ Packaging & Triggering Action...';
        publishStatus.className = 'text-yellow-400';

        try {
            // 1. Create a FormData object to send files + metadata
            const formData = new FormData();
            selectedFiles.forEach(f => formData.append('files', f));
            formData.append('metadata', JSON.stringify(getFormData()));

            // 2. **CRITICAL:** We need a server endpoint to receive this and trigger the Action.
            //    **SOLUTION:** Use a **GitHub Action triggered by a specific Issue comment** or **a_dispatch event**.
            //    **SIMPLIFIED FOR FREE HOSTING:** We'll use **GitHub's REST API to create a new Release directly**.
            //    **BUT:** Creating Releases via Browser requires a **Personal Access Token (PAT)**, which is **INSECURE** to expose.

            // **SAFEST, FREE APPROACH (Recommended):**
            // **Manually create a Release via GitHub UI, but use our form to prepare the metadata file.**
            // **OR, use a GitHub Action that watches for a specific file commit (e.g., `publish-request.json`) and creates the Release.**

            // **IMPLEMENTING THE SAFEST "ONE-CLICK" (Action Trigger via API Call to `workflow_dispatch`):**
            // **This requires a PAT with `actions:write` scope. For DEMO, we'll simulate and instruct.**

            publishStatus.innerHTML = `
                <div class="bg-blue-900/50 p-4 rounded-lg">
                    <h3 class="font-bold text-lg mb-2">📦 Prepare for Publish:</h3>
                    <ol class="list-decimal list-inside space-y-1 text-sm text-left">
                        <li>✅ **Files Ready:** ${selectedFiles.length} file(s) selected.</li>
                        <li>✅ **Metadata Ready:** ${document.getElementById('sw-name').value} v${document.getElementById('sw-version').value}</li>
                        <li>🔑 **Next Step (Security First):** To truly automate, you need a **GitHub Action** (see <code>publish.yml</code>) and a **Personal Access Token (PAT)** with <code>actions:write</code> scope.</li>
                        <li>🤖 **How it works (Automated):** This page would send a request to your GitHub Action (using the PAT). The **Action** (running on GitHub's secure servers) would then **create the Release**, attach files, and update your site. **NO token is ever exposed to users!**</li>
                        <li>📖 **For Now (Manual + Safe):** <a href="${REPO_URL}/releases/new" target="_blank" class="font-bold text-indigo-400 hover:underline">Click here to go to GitHub Releases</a>. Use the form data below to fill the release. Upload your files. Your site will update automatically!</li>
                    </ol>
                    <div class="mt-4 p-3 bg-gray-900 rounded text-xs text-left font-mono overflow-auto max-h-40">
                        <strong>Metadata to copy for Release Notes:</strong><br>
                        <pre id="metadata-preview">${JSON.stringify(getFormData(), null, 2)}</pre>
                    </div>
                </div>
            `;
            previewArea.classList.add('hidden'); // Hide preview if open

        } catch (error) {
            console.error('Publish error:', error);
            publishStatus.innerHTML = `<span class="text-red-400">❌ Error: ${error.message}</span>`;
        } finally {
            publishBtn.disabled = false;
            publishBtn.innerHTML = '🚀 Publish to GitHub Release';
        }
    });

    // --- FORM HELPERS ---
    function validateForm() {
        const required = ['sw-name', 'sw-version', 'sw-desc'];
        for (const id of required) {
            if (!document.getElementById(id).value.trim()) {
                alert(`❌ Please fill the required field: ${id.replace('sw-', '').toUpperCase()}`);
                return false;
            }
        }
        return true;
    }

    function getFormData() {
        return {
            name: document.getElementById('sw-name').value.trim(),
            version: document.getElementById('sw-version').value.trim(),
            description: document.getElementById('sw-desc').value.trim(),
            image: document.getElementById('sw-image').value.trim(),
            category: document.getElementById('sw-category').value.trim() || 'Utility',
            timestamp: new Date().toISOString()
        };
    }

    // --- CARD GENERATION (Used for Preview & Public Grid) ---
    function generateCardHTML(data, isPreview = false) {
        const imageHtml = data.image ? `<img src="${data.image}" alt="${data.name}" class="w-full h-40 object-cover rounded-t-lg mb-3 border-b border-indigo-500/30">` : '<div class="w-full h-40 bg-gray-700 flex items-center justify-center rounded-t-lg mb-3 text-gray-500">No Image</div>';
        const versionBadge = `<span class="bg-indigo-600 text-white text-xs px-2 py-1 rounded absolute top-2 right-2">v${data.version}</span>`;
        const categoryBadge = `<span class="bg-purple-600 text-white text-xs px-2 py-1 rounded mb-2 inline-block">${data.category}</span>`;

        // For public grid, we need the ACTUAL RELEASE URL (from API)
        // For preview, we simulate a download link
        const downloadLink = isPreview
            ? `#` // Preview doesn't have a real file yet
            : `#`; // Public grid will replace this with real URL

        return `
            <div class="software-card relative bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 flex flex-col h-full">
                <div class="relative">
                    ${imageHtml}
                    ${versionBadge}
                </div>
                <div class="p-5 flex-grow flex flex-col">
                    ${categoryBadge}
                    <h3 class="text-xl font-bold text-white mb-2">${data.name}</h3>
                    <p class="text-gray-400 text-sm mb-4 flex-grow">${data.description}</p>
                    <div class="mt-auto pt-4 border-t border-gray-700">
                        <a href="${downloadLink}" target="_blank" class="w-full block text-center bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-2 px-4 rounded-lg hover:from-green-400 hover:to-emerald-500 transition shadow-md transform hover:scale-105">
                            ⬇️ Download
                        </a>
                        <p class="text-xs text-gray-500 text-center mt-2">Published: ${new Date(data.timestamp).toLocaleDateString()}</p>
                    </div>
                </div>
            </div>
        `;
    }

    // --- FETCH & DISPLAY PUBLIC DOWNLOADS (From GitHub Releases API) ---
    async function loadPublicDownloads() {
        try {
            const apiUrl = `https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/releases`;
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error(`GitHub API Error: ${response.status}`);
            const releases = await response.json();

            if (releases.length === 0) {
                noDownloads.classList.remove('hidden');
                loadingDownloads.classList.add('hidden');
                return;
            }

            loadingDownloads.classList.add('hidden');
            downloadsGrid.innerHTML = releases.map(release => {
                // **Parse metadata from release notes (assuming it's JSON at the top)**
                let metadata = { name: release.name, description: release.body, version: release.tag_name, image: '', category: 'General' };
                try {
                    // Look for JSON block in body (e.g., ```json ... ```)
                    const jsonMatch = release.body.match(/```json\n([\s\S]*?)\n```/);
                    if (jsonMatch) {
                        const parsed = JSON.parse(jsonMatch[1]);
                        metadata = { ...metadata, ...parsed };
                    }
                } catch (e) { console.warn('Could not parse metadata from release notes.'); }

                // **Find the main asset (assume first .zip or .exe is primary download)**
                const mainAsset = release.assets.find(a => a.name.endsWith('.zip') || a.name.endsWith('.exe') || a.name.endsWith('.dmg')) || release.assets[0];
                const downloadUrl = mainAsset ? mainAsset.browser_download_url : '#';

                // **Generate Card using real data**
                return generateCardHTML({
                    ...metadata,
                    timestamp: release.published_at
                }).replace(  // Replace the placeholder download link with REAL URL
                    'href="${downloadLink}"',
                    `href="${downloadUrl}"`
                );
            }).join('');
        } catch (error) {
            console.error('Failed to load releases:', error);
            loadingDownloads.innerHTML = `<p class="text-red-400">❌ Error loading downloads. Check console.</p>`;
        }
    }

    // Load public downloads on page load
    loadPublicDownloads();
});
