document.addEventListener('DOMContentLoaded', () => {
  const songList = document.getElementById('songList');
  const categoryFilter = document.getElementById('categoryFilter');
  const favoritesButton = document.getElementById('favoritesButton');

  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  let songs = [];

  // Carica l'elenco delle canzoni
  fetch('assets/songs/index.json')
      .then(response => response.json())
      .then(data => {
          songs = data.files;
          loadSongs();
          populateCategoryFilter();
      })
      .catch(err => console.error('Errore nel caricamento dei file JSON:', err));

  // Carica le canzoni in base al filtro di categoria
  function loadSongs() {
      songList.innerHTML = '';
      songs.forEach(file => {
          fetch(`assets/songs/${file}`)
              .then(response => response.json())
              .then(song => {
                  if (shouldDisplaySong(song)) {
                      const li = document.createElement('li');
                      li.textContent = song.title;
                      li.dataset.id = song.id;

                      // Creazione del cuoricino
                      const heartIcon = document.createElement('span');
                      heartIcon.classList.add('heart-icon');
                      heartIcon.innerHTML = favorites.includes(song.id) ? '❤️' : '🤍'; // Cuore pieno o vuoto
                      heartIcon.addEventListener('click', () => toggleFavorite(song.id, heartIcon));

                      li.appendChild(heartIcon);
                      songList.appendChild(li);
                  }
              });
      });
  }

  // Controlla se visualizzare la canzone in base al filtro
  function shouldDisplaySong(song) {
      const selectedCategory = categoryFilter.value;
      return !selectedCategory || song.tags.includes(selectedCategory);
  }

  // Popola il filtro delle categorie
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

  // Gestisce i preferiti
  function toggleFavorite(songId, heartIcon) {
      if (favorites.includes(songId)) {
          favorites = favorites.filter(id => id !== songId);
          heartIcon.innerHTML = '🤍'; // Cuore vuoto
      } else {
          favorites.push(songId);
          heartIcon.innerHTML = '❤️'; // Cuore pieno
      }
      localStorage.setItem('favorites', JSON.stringify(favorites));
  }

  // Visualizza i preferiti
  favoritesButton.addEventListener('click', () => {
      categoryFilter.value = '';
      songList.innerHTML = '';
      favorites.forEach(songId => {
          fetch(`assets/songs/index.json`)
              .then(response => response.json())
              .then(data => {
                  const songFile = data.files.find(file => file.includes(songId));
                  return fetch(`assets/songs/${songFile}`);
              })
              .then(response => response.json())
              .then(song => {
                  const li = document.createElement('li');
                  li.textContent = song.title;

                  const heartIcon = document.createElement('span');
                  heartIcon.classList.add('heart-icon');
                  heartIcon.innerHTML = '❤️'; // Cuore pieno
                  heartIcon.addEventListener('click', () => toggleFavorite(song.id, heartIcon));

                  li.appendChild(heartIcon);
                  songList.appendChild(li);
              });
      });
  });

  // Aggiorna le canzoni quando cambia il filtro di categoria
  categoryFilter.addEventListener('change', loadSongs);
});
