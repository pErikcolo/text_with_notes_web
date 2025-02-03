import { displaySongContent } from "./displaySongContent.js";

export function changeFontSize(increment) {
    // Recupera il contenitore della canzone
    const songContent = document.getElementById("songContent");
    if (!songContent) {
        console.error("Elemento #songContent non trovato.");
        return;
    }
    
    // Proviamo a recuperare il font-size corrente dal dataset,
    // altrimenti lo otteniamo da getComputedStyle sul primo elemento .lyric.
    let currentFontSize;
    if (songContent.dataset.currentFontSize) {
        currentFontSize = parseFloat(songContent.dataset.currentFontSize);
    } else {
        const lyricElement = songContent.querySelector(".lyric");
        if (!lyricElement) {
            console.error("Nessun elemento .lyric trovato.");
            return;
        }
        currentFontSize = parseFloat(window.getComputedStyle(lyricElement).fontSize);
    }
    console.log("Dimensione font corrente:", currentFontSize, "px");

    // Applica l'incremento e limita il valore tra 8px e 32px
    currentFontSize += increment;
    currentFontSize = Math.max(8, Math.min(32, currentFontSize));
    console.log(`Nuova dimensione font: ${currentFontSize}px (increment: ${increment})`);
    
    // Salva il nuovo valore nel dataset del contenitore
    songContent.dataset.currentFontSize = currentFontSize;
    
    // Imposta il nuovo font-size come style inline sul contenitore e su tutti gli elementi .lyric
    songContent.style.fontSize = `${currentFontSize}px`;
    const lyricElements = songContent.querySelectorAll(".lyric");
    lyricElements.forEach(el => {
        el.style.fontSize = `${currentFontSize}px`;
    });
    
    // Ricarica la canzone con il nuovo font (questo potrebbe ricreare gli elementi .lyric)
    if (window.currentSongData) {
        console.log("Ricaricamento della canzone con il nuovo font...");
        displaySongContent(window.currentSongData);
    } else {
        console.error("Dati della canzone non trovati.");
    }
}
