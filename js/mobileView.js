export function adaptMobileView() {
    const songContent = document.getElementById('songContent');
    const controlsContainer = document.getElementById('controlsContainer');

    if (isMobile()) {
        // Adatta il contenuto per mobile
        songContent.style.fontSize = '14px';
        songContent.style.padding = '1rem';
        songContent.style.maxHeight = 'calc(100vh - 120px)'; // Adatta altezza per pulsanti
        controlsContainer.style.position = 'relative';
        controlsContainer.style.bottom = 'auto';
        controlsContainer.style.marginBottom = '1rem';
        controlsContainer.style.textAlign = 'center'; // Center the buttons
    } else {
        // Ripristina impostazioni desktop
        songContent.style.fontSize = '';
        songContent.style.padding = '';
        songContent.style.maxHeight = '';
        controlsContainer.style.position = '';
        controlsContainer.style.bottom = '';
        controlsContainer.style.marginBottom = '';
        controlsContainer.style.textAlign = '';
    }
}

function isMobile() {
    return window.innerWidth <= 768; // Limite per mobile
}

// Assegna l'evento al ridimensionamento della finestra
window.addEventListener('resize', adaptMobileView);
window.addEventListener('DOMContentLoaded', adaptMobileView);
