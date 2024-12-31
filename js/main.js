console.log('Inizio script');

// Modifica visibile della pagina per debug
document.body.style.backgroundColor = "lightblue";
document.body.innerHTML = `
  <h1 style="color: red;">Script eseguito correttamente!</h1>
  <p>Controlla la console per ulteriori dettagli.</p>
`;

async function loadAllSongs() {
  const songs = [];
  try {
    // Debug: verifica il caricamento del file index.json
    console.log('Caricamento file index.json...');
    const response = await fetch('/text_with_notes_web/assets/songs/index.json');
    if (!response.ok) throw new Error(`Errore nel caricamento dell'indice: ${response.statusText}`);
    const index = await response.json();
    const songFiles = index.files;

    console.log('File index.json caricato correttamente:', songFiles);

    // Carica ogni canzone dall'indice
    for (const file of songFiles) {
      try {
        console.log(`Caricamento del file: ${file}`);
        const songResponse = await fetch(`/text_with_notes_web/assets/songs/${file}`);
        if (!songResponse.ok) throw new Error(`Errore nel caricamento di ${file}`);
        const song = await songResponse.json();
        songs.push(song);
        console.log(`Canzone caricata: ${song.title}`);
      } catch (error) {
        console.warn(`Impossibile caricare il file: ${file}`, error);
      }
    }

    renderSongList(songs);
  } catch (error) {
    console.error("Errore nel caricamento delle canzoni:", error);
  }
}

function renderSongList(songs) {
  const songList = document.getElementById('song-list');
  if (!songList) {
    console.error('Elemento song-list non trovato nella pagina.');
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
  console.log('Elenco delle canzoni renderizzato.');
}

function showSongDetails(songId) {
  const selectedSong = document.getElementById('selected-song');
  if (!selectedSong) {
    console.error('Elemento selected-song non trovato nella pagina.');
    return;
  }

  selectedSong.innerHTML = `Dettagli della canzone con ID: ${songId}`;
  console.log(`Dettagli della canzone visualizzati: ${songId}`);
}

// Avvia il caricamento delle canzoni quando la pagina è pronta
document.addEventListener('DOMContentLoaded', () => {
  console.log('Evento DOMContentLoaded ricevuto. Avvio caricamento canzoni.');
  loadAllSongs();
});
