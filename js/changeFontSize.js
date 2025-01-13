let currentFontSize;

export function changeFontSize(increment) {
    const songContent = document.getElementById('songContent');

    if (!songContent) {
        console.error("Elemento #songContent non trovato.");
        return;
    }

    // Inizializza currentFontSize se non è stato ancora fatto
    if (currentFontSize === undefined) {
        const style = window.getComputedStyle(songContent.querySelector('.lyric-line') || songContent);
        currentFontSize = parseFloat(style.fontSize); // Recupera la dimensione attuale del font
        console.log(`Dimensione iniziale rilevata: ${currentFontSize}px`);
    }

    // Aggiorna la dimensione del font
    currentFontSize += increment;

    // Limiti del font
    if (currentFontSize < 12) currentFontSize = 12;
    if (currentFontSize > 32) currentFontSize = 32;

    const targetElements = songContent.querySelectorAll('.chord-line, .lyric-line');

    if (targetElements.length === 0) {
        console.warn("Nessun elemento trovato per modificare il font-size.");
        return;
    }

    targetElements.forEach(el => el.style.fontSize = `${currentFontSize}px`);
    console.log(`Font modificato: ${currentFontSize}px, applicato a ${targetElements.length} elementi.`);
}
