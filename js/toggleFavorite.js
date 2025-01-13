export function toggleFavorite(songId, heartIcon, favorites) {
    if (favorites.includes(songId)) {
        favorites = favorites.filter(id => id !== songId);
        heartIcon.innerHTML = '🤍';
    } else {
        favorites.push(songId);
        heartIcon.innerHTML = '❤️';
    }

    localStorage.setItem('favorites', JSON.stringify(favorites));
    console.log("Preferiti aggiornati:", favorites);
}
