export function displaySongContent(song, elements) {
    const { songContent, categoryFilter, categoryLabel, favoritesButton } = elements;
    const controlsContainer = document.getElementById('controlsContainer');
    const backButton = document.getElementById('backButton');

    if (!song || !songContent) {
        console.error("Errore: song o songContent non definiti.", { song, songContent });
        return;
    }

    // Aggiorna il titolo del progetto
    const projectTitle = document.querySelector('header h1');
    if (projectTitle) {
        projectTitle.textContent = song.title;
    }

    // Nasconde elementi della pagina principale
    if (categoryFilter) categoryFilter.style.display = 'none';
    if (categoryLabel) categoryLabel.style.display = 'none';
    if (favoritesButton) favoritesButton.style.display = 'none';

    // Mostra i controlli specifici per la visualizzazione della canzone
    if (controlsContainer) {
        controlsContainer.style.display = 'flex';
    }

    // Mostra il pulsante "Torna alla lista"
    if (backButton) {
        backButton.style.display = 'block';
    }

    // Aggiungi la classe `song-page`
    document.body.classList.add('song-page');

    // Rendering del contenuto della canzone
    songContent.style.display = 'block';
    songContent.innerHTML = ''; // Pulisce il contenuto precedente

    let chordCount = 0, lyricCount = 0;
    song.sections.forEach((section) => {
        const sectionDiv = document.createElement('div');
        sectionDiv.classList.add('song-section', section.type);

        section.lines.forEach((line) => {
            const lineContainer = document.createElement('div');
            lineContainer.classList.add('line-container');

            const chordLine = document.createElement('div');
            chordLine.textContent = line.chords || '';
            chordLine.classList.add('chord-line');
            if (line.chords) chordCount++;

            const lyricLine = document.createElement('div');
            lyricLine.textContent = line.lyrics || '';
            lyricLine.classList.add('lyric-line');
            if (line.lyrics) lyricCount++;

            lineContainer.appendChild(chordLine);
            lineContainer.appendChild(lyricLine);
            sectionDiv.appendChild(lineContainer);
        });

        songContent.appendChild(sectionDiv);
    });

    console.log(`Rendering completato per: ${song.title}`);
    console.log(`Totale accordi creati: ${chordCount}, Totale lyrics create: ${lyricCount}`);
}
