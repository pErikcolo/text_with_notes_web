import { displaySongContent } from './displaySongContent.js';
import { loadTags } from './categoryFilter.js';
import { toggleFavorite } from './toggleFavorite.js';
import { transposeChords } from './transpose.js';
import { toggleScrolling, initializeScrollingButton, watchContentHeight, stopScrolling } from './scrolling.js';
import { changeFontSize } from './changeFontSize.js';
import { adaptMobileView } from './mobileView.js';

document.addEventListener('DOMContentLoaded', () => {
    let lastTouchEnd = 0;

    // Prevenire lo zoom sul doppio tap
    document.addEventListener('touchend', (event) => {
        const now = new Date().getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault(); // Impedisce lo zoom sul doppio tap
        }
        lastTouchEnd = now;
    }, false);
    
    const elements = {
        songList: document.getElementById('songList'),
        songContent: document.getElementById('songContent'),
        backButton: document.getElementById('backButton'),
        categoryFilter: document.getElementById('categoryFilter'),
        categoryLabel: document.querySelector('label[for="categoryFilter"]'),
        favoritesButton: document.getElementById('favoritesButton'),
        clearFavoritesButton: document.getElementById('clearFavoritesButton'),
        controlsContainer: document.getElementById('controlsContainer'),
    };

    console.log("Elementi caricati:", elements);

    const controls = {
        transposeUp: document.getElementById('transposeUp'),
        transposeDown: document.getElementById('transposeDown'),
        scrollingButton: document.getElementById('scrollingButton'),
        increaseFontSize: document.getElementById('increaseFontSize'),
        decreaseFontSize: document.getElementById('decreaseFontSize'),
        viewModeButton: document.getElementById('viewModeButton'),
    };

    console.log("Controlli caricati:", controls);

    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    let fontSize = 16;
    let allSongs = [];

    console.log("Favorites caricati dal localStorage:", favorites);

    // Nascondi i controlli inizialmente
    document.body.classList.remove('song-page');
    elements.controlsContainer.style.display = 'none';
    elements.songContent.style.display = 'none';
    elements.backButton.style.display = 'none';
    elements.clearFavoritesButton.style.display = 'none';

    if (controls.scrollingButton) {
        controls.scrollingButton.addEventListener('click', toggleScrolling);
    }

    initializeScrollingButton();
    watchContentHeight();

    fetch('assets/songs/index.json')
        .then(response => response.json())
        .then(data => {
            console.log("File index.json caricato:", data);
            const promises = data.files.map(file =>
                fetch(`assets/songs/${file}`).then(res => res.json())
            );
            return Promise.all(promises);
        })
        .then(songs => {
            console.log("Canzoni caricate:", songs);
            allSongs = songs.sort((a, b) => a.title.localeCompare(b.title));

            populateSongList(allSongs, elements, favorites);
            loadTags(elements.categoryFilter);

            console.log("Filtro per categoria popolato.");

            // Adatta il layout per mobile
            adaptMobileView();
            console.log("Layout mobile adattato.");
        })
        .catch(err => console.error("Errore nel caricamento delle canzoni:", err));

    elements.categoryFilter.addEventListener('change', () => {
        const selectedCategory = elements.categoryFilter.value;
        console.log("Categoria selezionata:", selectedCategory);

        const filteredSongs = selectedCategory
            ? allSongs.filter(song => song.tags && song.tags.includes(selectedCategory))
            : allSongs;

        populateSongList(filteredSongs, elements, favorites);
    });

    elements.favoritesButton.addEventListener('click', () => {
        console.log("Accesso al menu preferiti.");
        const favoriteSongs = allSongs.filter(song => favorites.includes(song.id));

        if (favoriteSongs.length === 0) {
            elements.songList.innerHTML = '<li>Menu preferiti vuoto</li>';
        } else {
            populateSongList(favoriteSongs, elements, favorites);
        }

        elements.clearFavoritesButton.style.display = 'inline-block';
        elements.backButton.style.display = 'inline-block';
    });

    elements.clearFavoritesButton.addEventListener('click', () => {
        console.log("Cancellazione dei preferiti.");
        favorites = [];
        localStorage.setItem('favorites', JSON.stringify(favorites));
        elements.clearFavoritesButton.style.display = 'none';

        elements.songList.innerHTML = '<li>Menu preferiti vuoto</li>';
    });

    elements.backButton.addEventListener('click', () => {
        console.log("Torna alla lista principale.");

        stopScrolling();

        elements.songList.style.display = 'block';
        elements.categoryFilter.style.display = 'block';
        elements.categoryLabel.style.display = 'inline';
        elements.favoritesButton.style.display = 'inline-block';
        elements.clearFavoritesButton.style.display = 'none';

        // Rimuove la classe e nasconde i controlli
        document.body.classList.remove('song-page');

        const projectTitle = document.querySelector('header h1');
        if (projectTitle) {
            projectTitle.textContent = 'Text With Notes';
            console.log("Titolo ripristinato a: Text With Notes");
        }

        populateSongList(allSongs, elements, favorites);

        // Adatta nuovamente il layout per mobile
        adaptMobileView();
    });

    function populateSongList(songs, elements, favorites) {
        const { songList } = elements;
        songList.innerHTML = '';

        songs.forEach(song => {
            const li = document.createElement('li');
            li.textContent = song.title;
            li.dataset.categories = song.tags ? song.tags.join(',') : '';
            li.dataset.songId = song.id;

            const heartIcon = document.createElement('span');
            heartIcon.className = 'favorite-icon';
            heartIcon.innerHTML = favorites.includes(song.id) ? '❤️' : '🤍';
            heartIcon.addEventListener('click', (event) => {
                event.stopPropagation();
                toggleFavorite(song.id, heartIcon, favorites);
            });

            li.appendChild(heartIcon);

            li.addEventListener('click', () => {
                console.log("Canzone selezionata:", song.title);

                // Aggiunge la classe per mostrare i controlli
                document.body.classList.add('song-page');

                displaySongContent(song, elements);

                // Adatta il layout per mobile
                adaptMobileView();
            });

            songList.appendChild(li);
        });

        console.log("Lista delle canzoni popolata:", songList.innerHTML);
    }
});
