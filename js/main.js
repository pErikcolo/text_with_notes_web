const songs = [];

async function loadAllSongs() {
  try {
    console.log("Tentativo di caricamento dell'indice...");

    // Carica l'indice
    const response = await fetch('./assets/songs/index.json');
    console.log("Indice caricato:", response);

    const index = await response.json();
    const songFiles = index.files;

    console.log("File delle canzoni trovati:", songFiles);

    // Carica ogni canzone dall'indice
    for (const file of songFiles) {
      try {
        console.log(`Caricamento del file: ${file}`);
        const songResponse = await fetch(`./assets/songs/${file}`);
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
  const song = songs.find(s => s.id === songId);
  if (!song) {
    console.error(`Canzone con ID ${songId} non trovata.`);
    return;
  }

  const selectedSong = document.getElementById('selected-song');
  selectedSong.innerHTML = `
    <h2>${song.title}</h2>
    <div class="song-sections">
      ${song.sections.map(section => `
        <div class="song-section ${section.type}">
          ${section.lines.map(line => `
            <div class="song-line">
              ${renderLine(line)}
            </div>
          `).join('')}
        </div>
      `).join('')}
    </div>
  `;
}

function renderLine(line) {
  if (!line.tags || line.tags.length === 0) {
    return `<div class="lyrics">${line.text}</div>`;
  }

  const words = line.text.split(' ');
  return words.map(word => {
    const tag = line.tags.find(tag => tag.word.trim() === word.trim());
    const chord = tag?.note || '';
    return `
      <span class="word-pair">
        <span class="chord">${chord}</span>
        <span class="lyric">${word}</span>
      </span>
    `;
  }).join(' ');
}

// Avvia il caricamento delle canzoni quando la pagina è pronta
document.addEventListener('DOMContentLoaded', loadAllSongs);

console.log('Script avviato!');
