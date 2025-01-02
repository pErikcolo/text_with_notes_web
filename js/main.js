document.addEventListener('DOMContentLoaded', () => {
  const songList = document.getElementById('songList');
  const songContent = document.getElementById('songContent');
  const backButton = document.getElementById('backButton');
  const categoryFilter = document.getElementById('categoryFilter');
  const favoritesButton = document.getElementById('favoritesButton');

  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  let songs = [];

  fetch('assets/songs/index.json')
    .then(response => response.json())
    .then(data => {
      songs = data.files;
      loadSongs();
    })
    .catch(err => console.error('Errore nel caricamento dei file JSON:', err));

  function loadSongs() {
    songList.innerHTML = '';
    songContent.style.display = 'none';
    backButton.style.display = 'none';

    const songPromises = songs.map(file =>
      fetch(`assets/songs/${file}`).then(response => response.json())
    );

    Promise.all(songPromises)
      .then(songDetails => {
        songDetails.sort((a, b) => a.title.localeCompare(b.title));

        songDetails.forEach(song => {
          const li = document.createElement('li');
          li.textContent = song.title;
          li.dataset.id = song.id;

          li.addEventListener('click', () => displaySongContent(song));

          const heartIcon = document.createElement('span');
          heartIcon.classList.add('heart-icon');
          heartIcon.innerHTML = favorites.includes(song.id) ? '❤️' : '🤍';
          heartIcon.addEventListener('click', (event) => {
            event.stopPropagation();
            toggleFavorite(song.id, heartIcon);
          });

          li.appendChild(heartIcon);
          songList.appendChild(li);
        });
      })
      .catch(err => console.error('Errore durante il caricamento delle canzoni:', err));
  }

  function displaySongContent(song) {
    songList.innerHTML = '';
    songContent.innerHTML = '';

    const toggleButton = document.createElement('button');
    toggleButton.id = 'viewModeButton';
    toggleButton.textContent = 'Solo testo';
    toggleButton.dataset.mode = 'all';
    toggleButton.addEventListener('click', toggleViewMode);
    songContent.appendChild(toggleButton);

    const songTitle = document.createElement('h2');
    songTitle.textContent = song.title;
    songContent.appendChild(songTitle);

    song.sections.forEach((section) => {
      const sectionDiv = document.createElement('div');
      sectionDiv.classList.add('song-section', `${section.type}-section`);

      section.lines.forEach((line) => {
        const lineContainer = document.createElement('div');
        lineContainer.classList.add('line-container');

        if (section.type === 'chords') {
          // Gestisce le righe di tipo "chords"
          const chordLine = document.createElement('div');
          chordLine.classList.add('chord-line');
          chordLine.textContent = line.text; // Aggiunge il testo degli accordi
          lineContainer.appendChild(chordLine);
        } else {
          // Gestisce le lyrics con accordi
          const lyricLine = document.createElement('div');
          lyricLine.classList.add('lyric-line');

          let currentIndex = 0; // Indice corrente nel testo originale

          line.tags.forEach(tag => {
            const wordStartIndex = line.text.indexOf(tag.word, currentIndex);
            const spaceBetween = line.text.slice(currentIndex, wordStartIndex);

            // Aggiungi spazio tra le parole
            if (spaceBetween) {
              const spaceSpan = document.createElement('span');
              spaceSpan.textContent = spaceBetween;
              lyricLine.appendChild(spaceSpan);
            }

            const wordWrapper = document.createElement('span');
            wordWrapper.classList.add('word-wrapper');

            const chordSpan = document.createElement('span');
            chordSpan.classList.add('chord');
            chordSpan.textContent = tag.note;

            const wordSpan = document.createElement('span');
            wordSpan.classList.add('word');
            wordSpan.textContent = tag.word;

            wordWrapper.appendChild(chordSpan);
            wordWrapper.appendChild(wordSpan);

            lyricLine.appendChild(wordWrapper);

            // Aggiorna l'indice corrente
            currentIndex = wordStartIndex + tag.word.length;
          });

          lineContainer.appendChild(lyricLine);
        }

        sectionDiv.appendChild(lineContainer);
      });

      songContent.appendChild(sectionDiv);
    });

    songContent.style.display = 'block';
    backButton.style.display = 'inline';
  }

  function toggleViewMode() {
    const chordLines = document.querySelectorAll('.chord-line'); // Righe di accordi
    const lyricLines = document.querySelectorAll('.lyric-line'); // Lyrics
    const chordsInLyrics = document.querySelectorAll('.word-wrapper .chord'); // Accordi sopra le lyrics
    const toggleButton = document.getElementById('viewModeButton');
  
    if (toggleButton.dataset.mode === 'all') {
      // Nascondi gli accordi
      chordLines.forEach(line => line.style.display = 'none'); // Nasconde righe di accordi
      chordsInLyrics.forEach(chord => chord.style.display = 'none'); // Nasconde accordi sopra lyrics
      lyricLines.forEach(line => line.style.display = 'block'); // Mostra solo lyrics
      toggleButton.textContent = 'Testo e accordi';
      toggleButton.dataset.mode = 'lyrics';
    } else {
      // Mostra accordi
      chordLines.forEach(line => line.style.display = 'block'); // Mostra righe di accordi
      chordsInLyrics.forEach(chord => chord.style.display = 'block'); // Mostra accordi sopra lyrics
      lyricLines.forEach(line => line.style.display = 'block'); // Mostra lyrics con accordi
      toggleButton.textContent = 'Solo testo';
      toggleButton.dataset.mode = 'all';
    }
  }
  

  function toggleFavorite(songId, heartIcon) {
    if (favorites.includes(songId)) {
      favorites = favorites.filter(id => id !== songId);
      heartIcon.innerHTML = '🤍';
    } else {
      favorites.push(songId);
      heartIcon.innerHTML = '❤️';
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }

  backButton.addEventListener('click', loadSongs);
});
