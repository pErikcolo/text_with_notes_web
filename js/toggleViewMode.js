export function toggleViewMode(event) {
    const button = event.target;
    const mode = button.dataset.mode || 'all'; // Imposta il valore predefinito

    if (mode === 'all') {
        // Passa alla modalità solo testo
        button.textContent = 'Tutto';
        button.dataset.mode = 'text'; // Aggiorna il dataset

        // Nasconde tutte le righe di tipo "chords"
        document.querySelectorAll('.chord-line').forEach(chord => chord.style.display = 'none');

        // Nasconde gli accordi sopra le lyrics
        document.querySelectorAll('.chord').forEach(chord => chord.style.display = 'none');
    } else {
        // Passa alla modalità tutto
        button.textContent = 'Solo testo';
        button.dataset.mode = 'all'; // Aggiorna il dataset

        // Mostra tutte le righe di tipo "chords"
        document.querySelectorAll('.chord-line').forEach(chord => chord.style.display = '');

        // Mostra gli accordi sopra le lyrics
        document.querySelectorAll('.chord').forEach(chord => chord.style.display = '');
    }
}
