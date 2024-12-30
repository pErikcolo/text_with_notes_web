async function loadSongs() {
  const response = await fetch('assets/canzoni.json');
  const data = await response.json();
  renderSongList(data.songs);
}

function renderSongList(songs) {
  const songList = document.getElementById('song-list');
  songList.innerHTML = songs.map(song => `<div>${song.title}</div>`).join('');
}

loadSongs();
