export function toggleViewMode(event) {
  const button = event.target;
  // Se non è definito, il valore di default sarà 'all'
  const mode = button.dataset.mode || 'all';

  if (mode === 'all') {
    // Passa alla modalità solo testo:
    button.textContent = 'Tutto';
    button.dataset.mode = 'text';
    
    // Nasconde le righe degli accordi e gli accordi stessi
    document.querySelectorAll('.chord-row').forEach(row => {
      row.style.display = 'none';
    });
    document.querySelectorAll('.chord').forEach(chord => {
      chord.style.display = 'none';
    });
    // Rimuove eventuali spazi extra nei container delle lyrics (ad es. abbassa il margine superiore)
    document.querySelectorAll('.lyric-row').forEach(row => {
      row.style.marginTop = '0';
    });
  } else {
    // Passa alla modalità "tutto"
    button.textContent = 'Solo testo';
    button.dataset.mode = 'all';
    
    // Mostra le righe degli accordi e gli accordi stessi
    document.querySelectorAll('.chord-row').forEach(row => {
      row.style.display = '';
    });
    document.querySelectorAll('.chord').forEach(chord => {
      chord.style.display = '';
    });
    // Ripristina il margine originale per le lyric row (lasciando vuoto il valore per usare il CSS predefinito)
    document.querySelectorAll('.lyric-row').forEach(row => {
      row.style.marginTop = '';
    });
  }
}
