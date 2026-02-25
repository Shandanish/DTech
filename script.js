// script.js - Optional Enhancements
document.addEventListener('DOMContentLoaded', () => {
    // Add a simple click tracker (for your own info, not invasive)
    const downloadButtons = document.querySelectorAll('.download-btn');
    downloadButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const softwareName = e.target.closest('.software-card').querySelector('h2').textContent;
            console.log(`User initiated download for: ${softwareName}`); // See this in browser console
            // You could alert: alert(`Starting download: ${softwareName}`);
        });
    });
});
