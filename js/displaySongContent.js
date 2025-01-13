export function displaySongContent(song, elements) {
    const { songContent, songList, controlsContainer, backButton } = elements;

    if (!song || !songContent) {
        console.error("Errore: song o songContent non definiti.", { song, songContent });
        return;
    }

    console.log(`Rendering contenuto della canzone: ${song.title}`);

    songList.style.display = 'none';
    controlsContainer.style.display = 'flex';
    backButton.style.display = 'inline-block';
    songContent.style.display = 'block';

    songContent.innerHTML = '';
    document.body.classList.add('song-page');

    song.sections.forEach((section) => {
        const sectionDiv = document.createElement('div');
        sectionDiv.classList.add('song-section', section.type);

        section.lines.forEach((line) => {
            const lineContainer = document.createElement('div');
            lineContainer.classList.add('line-container');

            const chordLine = document.createElement('div');
            chordLine.textContent = line.chords || '';
            chordLine.classList.add('chord-line');

            const lyricLine = document.createElement('div');
            lyricLine.textContent = line.lyrics || '';
            lyricLine.classList.add('lyric-line');

            lineContainer.appendChild(chordLine);
            lineContainer.appendChild(lyricLine);
            sectionDiv.appendChild(lineContainer);
        });

        songContent.appendChild(sectionDiv);
    });

    console.log(`Rendering completato per: ${song.title}`);
}
