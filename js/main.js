async function loadAllSongs() {
  const songs = [];
  try {
    console.log("Tentativo di caricamento dell'indice...");

    // Carica l'indice
    const response = await fetch('/text_with_notes_web/assets/songs/index.json');
    console.log("Indice caricato:", response);

    const index = await response.json();
    const songFiles = index.files;

    console.log("File delle canzoni trovati:", songFiles);

    // Carica ogni canzone dall'indice
    for (const file of songFiles) {
      try {
        console.log(`Caricamento del file: ${file}`);
        const songResponse = await fetch(`/text_with_notes_web/assets/songs/${file}`);
        const song = await songResponse.json();
        songs.push(song);
        console.log(`Canzone caricata con successo: ${song.title}`);
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
  if (!songs.length) {
    songList.innerHTML = '<p>Nessuna canzone trovata.</p>';
    return;
  }
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
