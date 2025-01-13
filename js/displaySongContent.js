export function displaySongContent(song, elements) {
    const { songContent, categoryFilter, categoryLabel, favoritesButton, songList, controlsContainer, backButton } = elements;

    if (!song || !songContent) {
        console.error("Errore: song o songContent non definiti.", { song, songContent });
        return;
    }

    console.log(`Rendering contenuto della canzone: ${song.title}`);

    // Nascondi la lista delle canzoni e gli elementi principali
    songList.style.display = 'none';
    if (categoryFilter) categoryFilter.style.display = 'none';
    if (categoryLabel) categoryLabel.style.display = 'none';
    if (favoritesButton) favoritesButton.style.display = 'none';

    // Mostra i controlli e il pulsante "Torna alla lista"
    controlsContainer.style.display = 'flex';
    backButton.style.display = 'inline-block';

    // Mostra il contenuto della canzone
    songContent.style.display = 'block';
    songContent.innerHTML = ''; // Pulisce il contenuto precedente

    // Aggiungi la classe `song-page` al body
    document.body.classList.add('song-page');

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
