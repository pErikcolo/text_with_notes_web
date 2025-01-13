export function transposeChords(steps) {
  const chords = document.querySelectorAll('.chord, .chord-line');
  const majorChords = ['Do', 'Do#', 'Re', 'Re#', 'Mi', 'Fa', 'Fa#', 'Sol', 'Sol#', 'La', 'Sib', 'Si'];
  const minorChords = ['Dom', 'Do#m', 'Rem', 'Re#m', 'Mim', 'Fam', 'Fa#m', 'Solm', 'Sol#m', 'Lam', 'Sibm', 'Sim'];
  const suffixes = ['7', '4', 'm', 'm7', 'm4']; // Suffixes to handle

  chords.forEach(chord => {
    let text = chord.textContent.trim();
    let newText = text.split(' ').map(originalChord => {
      let baseChord = '';
      let suffix = '';

      // Separare accordo base e suffisso
      suffixes.forEach(suf => {
        if (originalChord.endsWith(suf)) {
          baseChord = originalChord.slice(0, -suf.length);
          suffix = suf;
        }
      });

      // Se non c'è suffisso, il baseChord è l'accordo originale
      if (!baseChord) {
        baseChord = originalChord;
      }

      // Determinare se è maggiore o minore
      let chordList = majorChords.includes(baseChord) ? majorChords : minorChords;

      if (chordList.includes(baseChord)) {
        let index = chordList.indexOf(baseChord);
        let newIndex = (index + steps + chordList.length) % chordList.length; // Gestione del loop circolare
        return chordList[newIndex] + suffix; // Aggiungere il suffisso
      }

      return originalChord; // Lascia invariato se non è un accordo valido
    }).join(' ');

    chord.textContent = newText;
  });
}
