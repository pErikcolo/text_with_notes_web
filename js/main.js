import { displaySongContent } from './displaySongContent.js';
import { loadTags } from './categoryFilter.js';
import { toggleFavorite } from './toggleFavorite.js';
import { transposeChords } from './transpose.js';
import { toggleScrolling, initializeScrollingButton, watchContentHeight, stopScrolling } from './scrolling.js';
import { changeFontSize } from './changeFontSize.js';
import { adaptMobileView } from './mobileView.js';
import { toggleViewMode } from './toggleViewMode.js';

document.addEventListener('DOMContentLoaded', () => {
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (event) => {
        const now = new Date().getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
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
        mainTitle: document.getElementById('mainTitle'),
        searchInput: document.getElementById('searchInput')
    };

    console.log("Elementi caricati:", elements);

    // Mostra gli elementi principali
    elements.mainTitle.style.display = 'block';
    elements.categoryFilter.style.display = 'block';
    elements.favoritesButton.style.display = 'inline-block';
    elements.searchInput.style.display = 'block';

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
    let allSongs = [];

    console.log("Favorites caricati dal localStorage:", favorites);

    // Nascondi elementi non principali all'avvio
    elements.controlsContainer.style.display = 'none';
    elements.songContent.style.display = 'none';
    elements.backButton.style.display = 'none';
    elements.clearFavoritesButton.style.display = 'none';

    if (controls.scrollingButton) {
        controls.scrollingButton.addEventListener('click', toggleScrolling);
    }
    
    initializeScrollingButton();
    watchContentHeight();

    // Evento di ricerca: filtra la lista mentre si digita
    if (elements.searchInput) {
        elements.searchInput.addEventListener("input", function(e) {
            const filterText = e.target.value.toLowerCase();
            const listItems = document.querySelectorAll("#songList li");
            listItems.forEach(item => {
                if (item.textContent.toLowerCase().includes(filterText)) {
                    item.style.display = "";
                } else {
                    item.style.display = "none";
                }
            });
        });
    }

    // Carica le canzoni
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
            window.allSongs = allSongs;
            populateSongList(allSongs, elements, favorites);
            loadTags(elements.categoryFilter);
            console.log("Filtro per categoria popolato.");
            adaptMobileView();
            console.log("Layout mobile adattato.");
        })
        .catch(err => console.error("Errore nel caricamento delle canzoni:", err));

    elements.categoryFilter.addEventListener('change', () => {
        const selectedCategory = elements.categoryFilter.value;
        console.log("Categoria selezionata:", selectedCategory);
        const filteredSongs = selectedCategory
            ? allSongs.filter(song => (song.tags || song.categories || []).includes(selectedCategory))
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
        // Mostra il pulsante "Svuota preferiti" solo nel menu preferiti
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

    // Popola la lista delle canzoni
    function populateSongList(songs, elements, favorites) {
        const { songList, controlsContainer } = elements;
        songList.innerHTML = '';
        songs.forEach(song => {
            const li = document.createElement('li');
            li.textContent = song.title;
            li.dataset.categories = song.tags ? song.tags.join(',') : (song.categories ? song.categories.join(',') : '');
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
                window.currentSongData = song;

                // Nascondi gli elementi della pagina principale
                elements.songList.style.display = 'none';
                elements.categoryFilter.style.display = 'none';
                elements.categoryLabel.style.display = 'none';
                elements.favoritesButton.style.display = 'none';
                elements.mainTitle.style.display = 'none';
                elements.searchInput.style.display = 'none';

                elements.controlsContainer.style.display = 'flex';
                elements.backButton.style.display = 'inline-block';
                elements.songContent.style.display = 'block';

                displaySongContent(song);
                console.log("window.currentSongData:", window.currentSongData);
                adaptMobileView();
            });

            songList.appendChild(li);
        });
        console.log("Lista delle canzoni popolata:", songList.innerHTML);
        controlsContainer.style.display = 'none';
    }

    function adaptViewForMobile() {
      const isMobile = window.innerWidth <= 768;
      const songContent = document.getElementById('songContent');
      if (isMobile) {
        songContent.classList.add('mobile-friendly');
      } else {
        songContent.classList.remove('mobile-friendly');
      }
    }
    window.addEventListener('resize', adaptViewForMobile);
    window.addEventListener('load', adaptViewForMobile);

    function adaptMainPageForMobile() {
      const isMobile = window.innerWidth <= 768;
      const nav = document.querySelector('nav');
      if (isMobile) {
        nav.style.flexWrap = 'wrap';
      } else {
        nav.style.flexWrap = 'nowrap';
      }
    }
    window.addEventListener('resize', adaptMainPageForMobile);
    window.addEventListener('load', adaptMainPageForMobile);

    // Gestione del pulsante "Torna alla lista"
    function handleBackButton() {
        console.log("Torna alla lista principale.");
        stopScrolling();
        // Mostra gli elementi della pagina principale
        const elementsToShow = ['categoryFilter', 'favoritesButton', 'mainTitle', 'searchInput', 'songList'];
        // Nascondi gli elementi relativi alla canzone
        const elementsToHide = ['songContent', 'controlsContainer', 'backButton', 'clearFavoritesButton'];
        elementsToShow.forEach(id => {
            const element = document.getElementById(id);
            if (element) element.style.display = 'block';
        });
        elementsToHide.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.style.display = 'none';
                if (id === 'songContent') element.innerHTML = '';
            }
        });
        document.body.classList.remove('song-page');
        populateSongList(allSongs, elements, favorites);
        adaptMobileView();
    }
    document.getElementById('backButton').addEventListener('click', handleBackButton);

    if (controls.transposeUp) {
        controls.transposeUp.addEventListener('click', () => {
            console.log("Trasposizione verso l’alto.");
            transposeChords(1);
        });
    }
    if (controls.transposeDown) {
        controls.transposeDown.addEventListener('click', () => {
            console.log("Trasposizione verso il basso.");
            transposeChords(-1);
        });
    }
    if (controls.increaseFontSize) {
        controls.increaseFontSize.addEventListener('click', () => {
            const isMobile = window.innerWidth <= 768;
            console.log(`A+ cliccato su ${isMobile ? "mobile" : "desktop"}.`);
            changeFontSize(2);
        });
    }
    if (controls.decreaseFontSize) {
        controls.decreaseFontSize.addEventListener('click', () => {
            const isMobile = window.innerWidth <= 768;
            console.log(`A- cliccato su ${isMobile ? "mobile" : "desktop"}.`);
            changeFontSize(-2);
        });
    }
    if (controls.viewModeButton) {
        controls.viewModeButton.addEventListener('click', toggleViewMode);
    }
    
    window.addEventListener('resize', () => {
        adaptMobileView();
        console.log("Ricalcolo layout per resize.");
    });
});
