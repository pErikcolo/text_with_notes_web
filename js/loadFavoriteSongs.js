import { toggleFavorite } from './toggleFavorite.js';

const toggleVisibility = (element, visible) => {
    element.style.display = visible ? 'block' : 'none';
};

export function loadFavoriteSongs(
    songs,
    songList,
    songContent,
    backButton,
    displaySongContent,
    favorites,
    clearFavoritesButton
) {
    document.body.classList.remove('song-page');
    songList.innerHTML = '';
    songContent.style.display = 'none';

    const favoriteSongs = songs.filter(song => favorites.includes(song.id));

    if (favoriteSongs.length === 0) {
        songList.innerHTML = '<p>Non hai ancora aggiunto preferiti!</p>';
        toggleVisibility(clearFavoritesButton, false); // Nasconde "Svuota Preferiti"
        backButton.style.display = 'inline'; // Mostra "Torna alla lista"
        return;
    }

    favoriteSongs.forEach(song => {
        const li = document.createElement('li');
        li.textContent = song.title;
        li.dataset.id = song.id;

        li.addEventListener('click', () => displaySongContent(song));

        const heartIcon = document.createElement('span');
        heartIcon.classList.add('heart-icon');
        heartIcon.innerHTML = favorites.includes(song.id) ? '❤️' : '🤍';
        heartIcon.addEventListener('click', event => {
            event.stopPropagation();
            toggleFavorite(song.id, heartIcon, favorites);
        });

        li.appendChild(heartIcon);
        songList.appendChild(li);
    });

    toggleVisibility(clearFavoritesButton, true); // Mostra "Svuota Preferiti"
    backButton.style.display = 'inline'; // Mostra "Torna alla lista"
}
