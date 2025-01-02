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
      populateCategoryFilter();
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
          if (shouldDisplaySong(song)) {
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
          }
        });
      })
      .catch(err => console.error('Errore durante il caricamento delle canzoni:', err));
  }

  function displaySongContent(song) {
    songList.innerHTML = '';
    songContent.innerHTML = '';
  
    // Aggiungi il titolo della canzone in cima alla pagina
    const songTitle = document.createElement('h2');
    songTitle.textContent = song.title;
    songTitle.style.textAlign = 'center';
    songTitle.style.marginBottom = '20px';
    songTitle.style.color = '#333';
    songContent.appendChild(songTitle);
  
    // Visualizza i contenuti delle sezioni
    song.sections.forEach((section) => {
      const sectionDiv = document.createElement('div');
      sectionDiv.classList.add('song-section');
      sectionDiv.classList.add(`${section.type}-section`);
      sectionDiv.style.marginTop = '30px';
  
      section.lines.forEach((line) => {
        const lineContainer = document.createElement('div');
        lineContainer.classList.add('line-container');
  
        const chordLine = document.createElement('div');
        chordLine.classList.add('chord-line');
        chordLine.style.display = 'flex';
  
        const lyricLine = document.createElement('div');
        lyricLine.classList.add('lyric-line');
        lyricLine.style.display = 'flex';
  
        let cursor = 0;
  
        line.tags.forEach((tag) => {
          // Aggiungi eventuale spazio non taggato prima del frammento
          const startIndex = line.text.indexOf(tag.word, cursor);
          if (startIndex > cursor) {
            const untaggedText = line.text.substring(cursor, startIndex);
            const lyricSpan = document.createElement('span');
            lyricSpan.classList.add('word');
            lyricSpan.textContent = untaggedText;
            lyricLine.appendChild(lyricSpan);
  
            const emptySpace = document.createElement('span');
            emptySpace.classList.add('chord');
            emptySpace.style.minWidth = `${untaggedText.length * 8}px`;
            chordLine.appendChild(emptySpace);
          }
  
          // Aggiungi il frammento taggato con il relativo accordo
          const chordSpan = document.createElement('span');
          chordSpan.classList.add('chord');
          chordSpan.textContent = tag.note || '';
          chordSpan.style.minWidth = `${tag.word.length * 8}px`;
  
          const lyricSpan = document.createElement('span');
          lyricSpan.classList.add('word');
          lyricSpan.textContent = tag.word;
          lyricSpan.style.minWidth = `${tag.word.length * 8}px`;
  
          chordLine.appendChild(chordSpan);
          lyricLine.appendChild(lyricSpan);
  
          cursor = startIndex + tag.word.length;
        });
  
        // Aggiungi eventuale testo non taggato alla fine
        if (cursor < line.text.length) {
          const untaggedText = line.text.substring(cursor);
          const lyricSpan = document.createElement('span');
          lyricSpan.classList.add('word');
          lyricSpan.textContent = untaggedText;
          lyricLine.appendChild(lyricSpan);
  
          const emptySpace = document.createElement('span');
          emptySpace.classList.add('chord');
          emptySpace.style.minWidth = `${untaggedText.length * 8}px`;
          chordLine.appendChild(emptySpace);
        }
  
        lineContainer.appendChild(chordLine);
        lineContainer.appendChild(lyricLine);
        sectionDiv.appendChild(lineContainer);
      });
  
      songContent.appendChild(sectionDiv);
    });
  
    songContent.style.display = 'block';
    backButton.style.display = 'inline';
  }
  

  function shouldDisplaySong(song) {
    const selectedCategory = categoryFilter.value;
    return !selectedCategory || song.tags.includes(selectedCategory);
  }

  function populateCategoryFilter() {
    const categories = new Set();
    songs.forEach(file => {
      fetch(`assets/songs/${file}`)
        .then(response => response.json())
        .then(song => {
          song.tags.forEach(tag => categories.add(tag));
          updateCategoryOptions(categories);
        });
    });
  }

  function updateCategoryOptions(categories) {
    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      categoryFilter.appendChild(option);
    });
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
  categoryFilter.addEventListener('change', loadSongs);
});
