export function displaySongContent(song, elements) {
    const { songContent, categoryFilter, categoryLabel, favoritesButton } = elements;

    console.log("Rendering contenuto della canzone:", song.title);

    if (!song || !songContent) {
        console.error("Errore: song o songContent non definiti.", { song, songContent });
        return;
    }

    songContent.innerHTML = ''; // Pulisce il contenuto precedente

    // Aggiorna il titolo del progetto
    const projectTitle = document.querySelector('header h1');
    if (projectTitle) {
        projectTitle.textContent = song.title;
        console.log("Titolo aggiornato:", song.title);
    }

    // Nasconde elementi non necessari
    if (categoryFilter) categoryFilter.style.display = 'none';
    if (categoryLabel) categoryLabel.style.display = 'none';
    if (favoritesButton) favoritesButton.style.display = 'none';

    // Rendi visibile il contenitore della canzone
    songContent.style.display = 'block';

    let chordCount = 0, lyricCount = 0; // Contatori per log
    song.sections.forEach((section) => {
        const sectionDiv = document.createElement('div');
        sectionDiv.classList.add('song-section', section.type);

        section.lines.forEach((line) => {
            const lineContainer = document.createElement('div');
            lineContainer.classList.add('line-container');

            // Creazione degli elementi
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
