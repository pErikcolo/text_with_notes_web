import { populateCategoryFilter } from './categoryFilter.js';
import { toggleFavorite } from './toggleFavorite.js';

export function loadSongs(
    songs,
    songList,
    songContent,
    backButton,
    displaySongContent,
    favorites = [] // Valore di default
) {
    console.log('Dati ricevuti in loadSongs:', { songs, favorites });

    // Reimposta lo stato della pagina principale
    document.body.classList.remove('song-page');
    songContent.style.display = 'none'; // Nasconde il contenuto della canzone
    songList.innerHTML = ''; // Pulisce la lista delle canzoni
    backButton.style.display = 'none'; // Nasconde il pulsante per la lista principale

    const categoryFilter = document.getElementById('categoryFilter');
    const favoritesButton = document.getElementById('favoritesButton');
    const clearFavoritesButton = document.getElementById('clearFavoritesButton');

    if (!Array.isArray(favorites)) {
        console.error('Errore: favorites non è un array. Inizializzazione a vuoto.');
        favorites = [];
    }

    // Validazione delle canzoni
    const songDetails = songs.map(song => {
        if (typeof song !== 'object' || !song.id || !song.title || !song.tags) {
            console.error(`Errore nei dati della canzone:`, song);
            return null;
        }
        return song;
    }).filter(song => song !== null);

    console.log('Canzoni valide dopo la validazione:', songDetails);

    if (songDetails.length === 0) {
        console.warn('Nessuna canzone valida trovata.');
        songList.innerHTML = '<li>Nessuna canzone trovata.</li>';
        return;
    }

    // Raccogliere tutte le categorie
    const categories = new Set();
    songDetails.forEach(song => {
        if (Array.isArray(song.tags)) {
            song.tags.forEach(tag => categories.add(tag));
        }
    });

    // Popolare il filtro per categoria
    populateCategoryFilter([...categories], document.getElementById('categoryFilter'));
    console.log('Categorie raccolte:', [...categories]);

    // Ordinare le canzoni alfabeticamente
    songDetails.sort((a, b) => a.title.localeCompare(b.title));

    // Creare la lista delle canzoni
    songDetails.forEach(song => {
        const li = document.createElement('li');
        li.textContent = song.title;
        console.log('Aggiungo alla lista la canzone:', song.title);
        li.dataset.id = song.id;

        // Evento per visualizzare i dettagli
        li.addEventListener('click', () => {
            console.log(`Apertura canzone: ${song.title}`);
            songList.style.display = 'none'; // Nasconde la lista delle canzoni
            backButton.style.display = 'block'; // Mostra il pulsante "Torna alla lista"
            songContent.style.display = 'block'; // Mostra il contenitore della canzone

            // Nascondi il filtro per categoria e i pulsanti preferiti
            categoryFilter.style.display = 'none';
            favoritesButton.style.display = 'none';
            clearFavoritesButton.style.display = 'none';

            displaySongContent(song, songContent); // Rendering della canzone
        });

        // Aggiungere il cuoricino per i preferiti
        const heartIcon = document.createElement('span');
        heartIcon.classList.add('heart-icon');
        heartIcon.innerHTML = favorites.includes(song.id) ? '❤️' : '🤍';

        heartIcon.addEventListener('click', event => {
            event.stopPropagation();
            console.log(`Toggle preferito per la canzone: ${song.title} (ID: ${song.id})`);
            const isFavorite = favorites.includes(song.id);
            if (isFavorite) {
                favorites = favorites.filter(id => id !== song.id);
            } else {
                favorites.push(song.id);
            }
            localStorage.setItem('favorites', JSON.stringify(favorites)); // Sincronizza i dati
            heartIcon.innerHTML = isFavorite ? '🤍' : '❤️'; // Cambia il cuoricino visivamente
            console.log(`Canzone "${song.title}" ${isFavorite ? 'rimossa dai' : 'aggiunta ai'} preferiti.`);
        });

        li.appendChild(heartIcon);
        songList.appendChild(li);
    });

    // Mostra la lista delle canzoni
    songList.style.display = 'block';

    // Assicurati che filtro e pulsanti siano visibili nella lista principale
    categoryFilter.style.display = 'block';
    favoritesButton.style.display = 'inline-block';
    clearFavoritesButton.style.display = favorites.length > 0 ? 'inline-block' : 'none';
}
