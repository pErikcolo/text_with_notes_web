export function toggleViewMode(event) {
    const button = event.target;
    // Se non è definito, il valore di default sarà 'all'
    const mode = button.dataset.mode || 'all';
  
    if (mode === 'all') {
      // Passa alla modalità solo testo:
      // Aggiorna il testo del pulsante e il dataset
      button.textContent = 'Tutto';
      button.dataset.mode = 'text';
      
      // Nasconde le righe degli accordi e gli accordi stessi
      document.querySelectorAll('.chord-row').forEach(row => {
        row.style.display = 'none';
      });
      document.querySelectorAll('.chord').forEach(chord => {
        chord.style.display = 'none';
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
    }
  }
  