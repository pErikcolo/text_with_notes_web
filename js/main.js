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
    let allSongs = [];

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
            const promises = data.files.map(file =>
                fetch(`assets/songs/${file}`).then(res => res.json())
            );
            return Promise.all(promises);
        })
        .then(songs => {
            allSongs = songs.sort((a, b) => a.title.localeCompare(b.title));
            populateSongList(allSongs, elements, favorites);
            loadTags(elements.categoryFilter);
            adaptMobileView();
        })
        .catch(err => console.error("Errore nel caricamento delle canzoni:", err));

    elements.categoryFilter.addEventListener('change', () => {
        const selectedCategory = elements.categoryFilter.value;
        const filteredSongs = selectedCategory
            ? allSongs.filter(song => song.tags && song.tags.includes(selectedCategory))
            : allSongs;

        populateSongList(filteredSongs, elements, favorites);
    });

    // Listener per i pulsanti dei controlli
    if (controls.transposeUp) {
        controls.transposeUp.addEventListener('click', () => {
            console.log("T+ cliccato.");
            transposeChords(1);
        });
    }
    if (controls.transposeDown) {
        controls.transposeDown.addEventListener('click', () => {
            console.log("T- cliccato.");
            transposeChords(-1);
        });
    }
    if (controls.increaseFontSize) {
        controls.increaseFontSize.addEventListener('click', () => {
            console.log("A+ cliccato.");
            changeFontSize(2);
        });
    }
    if (controls.decreaseFontSize) {
        controls.decreaseFontSize.addEventListener('click', () => {
            console.log("A- cliccato.");
            changeFontSize(-2);
        });
    }
    if (controls.viewModeButton) {
        controls.viewModeButton.addEventListener('click', () => {
            console.log("Solo testo cliccato.");
            const isTextOnly = controls.viewModeButton.textContent === 'Solo testo';
            const chordLines = elements.songContent.querySelectorAll('.chord-line');

            chordLines.forEach(line => {
                line.style.display = isTextOnly ? 'none' : 'block';
            });

            controls.viewModeButton.textContent = isTextOnly ? 'Testo + Accordi' : 'Solo testo';
        });
    }

    elements.backButton.addEventListener('click', () => {
        stopScrolling();
        document.body.classList.remove('song-page');
        elements.songList.style.display = 'block';
        elements.categoryFilter.style.display = 'block';
        elements.categoryLabel.style.display = 'inline';
        elements.favoritesButton.style.display = 'inline-block';
        elements.clearFavoritesButton.style.display = 'none';
        elements.controlsContainer.style.display = 'none';
        elements.songContent.style.display = 'none';
        elements.backButton.style.display = 'none';
    });
});
