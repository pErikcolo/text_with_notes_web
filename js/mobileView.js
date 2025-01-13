export function adaptMobileView() {
    const songContent = document.getElementById('songContent');
    const controlsContainer = document.getElementById('controlsContainer');

    if (isMobile()) {
        // Adatta il contenuto per mobile
        songContent.style.fontSize = '14px';
        songContent.style.padding = '1rem';
        songContent.style.maxHeight = 'calc(100vh - 120px)'; // Adatta altezza per pulsanti
        controlsContainer.style.position = 'fixed';
        controlsContainer.style.bottom = '0';
    } else {
        // Ripristina impostazioni desktop
        songContent.style.fontSize = '';
        songContent.style.padding = '';
        controlsContainer.style.position = '';
        controlsContainer.style.bottom = '';
    }
}

function isMobile() {
    return window.innerWidth <= 768; // Limite per mobile
}

// Assegna l'evento al ridimensionamento della finestra
window.addEventListener('resize', adaptMobileView);
window.addEventListener('DOMContentLoaded', adaptMobileView);
