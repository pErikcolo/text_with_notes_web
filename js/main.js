async function loadAllSongs() {
  const songs = [];
  try {
    // Carica l'indice
    const response = await fetch('/text_with_notes_web/assets/songs/index.json');
    const index = await response.json();
    const songFiles = index.files;

    // Carica ogni canzone dall'indice
    for (const file of songFiles) {
      try {
        const songResponse = await fetch(`./assets/songs/${file}`);
        const song = await songResponse.json();
        songs.push(song);
      } catch (error) {
        console.warn(`Impossibile caricare il file: ${file}`, error);
      }
    }

    renderSongList(songs);
  } catch (error) {
    console.error("Errore nel caricamento dell'indice:", error);
  }
}

function renderSongList(songs) {
  const songList = document.getElementById('song-list');
  songList.innerHTML = songs
    .map(
      song => `
        <div class="song-item" onclick="showSongDetails('${song.id}')">
          ${song.title}
        </div>
      `
    )
    .join('');
}

function showSongDetails(songId) {
  const selectedSong = document.getElementById('selected-song');
  selectedSong.innerHTML = `Dettagli della canzone con ID: ${songId}`;
}

// Avvia il caricamento delle canzoni quando la pagina è pronta
document.addEventListener('DOMContentLoaded', loadAllSongs);

console.log('Script avviato!');

// Inizia il caricamento delle canzoni
document.addEventListener('DOMContentLoaded', loadAllSongs);
