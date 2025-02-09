// Variabile globale per tenere traccia dell’offset (in semitoni)
let currentTransposeOffset = 0;

export function transposeChords(steps) {
  // Calcola il nuovo offset, limitando il valore tra -11 e +11
  let newOffset = currentTransposeOffset + steps;
  if (newOffset > 11) {
    newOffset = 11;
  } else if (newOffset < -11) {
    newOffset = -11;
  }
  
  // Calcola il delta (variazione) da applicare
  const delta = newOffset - currentTransposeOffset;
  currentTransposeOffset = newOffset;
  
  console.log(`Trasposizione attuale: ${currentTransposeOffset} (delta applicato: ${delta})`);
  
  // Trasponi tutti gli elementi con classe "chord" e "chord-line"
  const chords = document.querySelectorAll('.chord, .chord-line');
  const majorChords = ['Do', 'Do#', 'Re', 'Re#', 'Mi', 'Fa', 'Fa#', 'Sol', 'Sol#', 'La', 'Sib', 'Si'];
  const minorChords = ['Dom', 'Do#m', 'Rem', 'Re#m', 'Mim', 'Fam', 'Fa#m', 'Solm', 'Sol#m', 'Lam', 'Sibm', 'Sim'];
  const suffixes = ['7', '4', 'm', 'm7', 'm4']; // Suffix da gestire
  
  chords.forEach(chord => {
    let text = chord.textContent.trim();
    let newText = text.split(' ').map(originalChord => {
      let baseChord = '';
      let suffix = '';
      
      // Separa il suffisso (se presente)
      suffixes.forEach(suf => {
        if (originalChord.endsWith(suf)) {
          baseChord = originalChord.slice(0, -suf.length);
          suffix = suf;
        }
      });
      
      if (!baseChord) {
        baseChord = originalChord;
      }
      
      // Determina se l’accordo è maggiore o minore
      let chordList = majorChords.includes(baseChord) ? majorChords : minorChords;
      
      if (chordList.includes(baseChord)) {
        let index = chordList.indexOf(baseChord);
        let newIndex = (index + delta + chordList.length) % chordList.length;
        return chordList[newIndex] + suffix;
      }
      return originalChord;
    }).join(' ');
    chord.textContent = newText;
  });
  
  // Aggiorna il display della trasposizione in #transposeDisplay
  const transposeDisplay = document.getElementById("transposeDisplay");
  if (transposeDisplay) {
    const displayValue = currentTransposeOffset > 0 ? `+${currentTransposeOffset}` : currentTransposeOffset;
    transposeDisplay.textContent = `Trasposizione: ${displayValue}`;
    transposeDisplay.style.display = 'block';
  }
}
