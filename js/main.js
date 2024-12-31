async function loadAllSongs() {
  const songs = [];
  try {
    console.log("Tentativo di caricamento dell'indice...");

    // Carica l'indice
    const response = await fetch('/text_with_notes_web/assets/songs/index.json');
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

function renderSongDetails(song) {
  const selectedSong = document.getElementById('selected-song');
  selectedSong.innerHTML = song.sections
    .map(section => {
      if (section.type === 'chords') {
        return `
          <div class="chords">
            ${section.lines
              .map(line => `<div class="chord-line">${line.text}</div>`)
              .join('')}
          </div>
        `;
      } else {
        const isChorus = section.type === 'chorus';
        return `
          <div class="${isChorus ? 'chorus' : 'verse'}">
            ${section.lines
              .map(line => renderLine(line))
              .join('<br>')}
          </div>
        `;
      }
    })
    .join('<hr>');
}

function renderLine(line) {
  if (!line.tags || line.tags.length === 0) {
    return `<div class="lyrics">${line.text}</div>`;
  }

  return line.tags
    .map(tag => `
      <span class="word-pair">
        <span class="chord">${tag.note}</span>
        <span class="lyric">${tag.word}</span>
      </span>
    `)
    .join('');
}

function showSongDetails(songId) {
  const song = loadedSongs.find(s => s.id === songId);
  if (!song) {
    console.warn(`Canzone con ID ${songId} non trovata.`);
    return;
  }
  renderSongDetails(song);
}

let loadedSongs = [];
document.addEventListener('DOMContentLoaded', async () => {
  console.log('Script avviato!');
  loadedSongs = await loadAllSongs();
});
