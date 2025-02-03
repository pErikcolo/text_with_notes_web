export function displaySongContent(songData) {
    console.log("Rendering canzone con dati:", songData);
    const songContent = document.getElementById("songContent");
    const mainTitle = document.querySelector("header h1");
    const authorElement = document.getElementById("songAuthor");
  
    songContent.innerHTML = "";  // Pulisce il contenuto della canzone
    songContent.style.display = "block";
    songContent.style.whiteSpace = "pre-wrap";  // Allow wrapping
  
    if (!songData || !songData.song) {
      console.error("Dati della canzone non validi:", songData);
      songContent.innerHTML = "<p>Errore: nessun dato valido per la canzone.</p>";
      return;
    }
  
    // Imposta titolo e autore
    mainTitle.textContent = songData.title;
    authorElement.textContent = songData.author || "";
  
    // Funzione per ottenere la larghezza in pixel di un testo
    function getTextWidth(text, font) {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      context.font = font;
      const width = context.measureText(text).width;
      console.log(`getTextWidth: "${text}" con font "${font}" = ${width}px`);
      return width;
    }
  
    // Ritorna il font corrente usato nel contenitore della canzone
    function getDynamicFont() {
      const font = window.getComputedStyle(songContent).font;
      console.log("Dynamic font:", font);
      return font;
    }
  
    // Calcola la posizione (left) di un accordo dato il testo che lo precede
    // La formula: left = somma ( larghezza in pixel dei caratteri delle lyrics che precedono l'accordo )
    function calculateChordPosition(textBefore, font) {
      const pos = getTextWidth(textBefore, font);
      console.log(`calculateChordPosition: testo precedente "${textBefore}" => ${pos}px`);
      return pos;
    }
  
    // Funzione per "splittare" lo span delle lyrics in base ai cambi di riga,
    // evitando di spezzare a metà una parola.
    // Restituisce un array di oggetti { text: string, startIndex: number }.
    function splitLyricSpan(lyricSpan) {
      const fullText = lyricSpan.textContent;
      const lines = [];
      let currentLine = "";
      let currentStart = 0;
      let lastTop = null;
      const range = document.createRange();
      console.log("splitLyricSpan: inizio split per testo:", fullText);
  
      for (let i = 0; i < fullText.length; i++) {
        range.setStart(lyricSpan.firstChild, i);
        range.setEnd(lyricSpan.firstChild, i + 1);
        const rect = range.getBoundingClientRect();
        if (!rect || rect.width === 0) continue;
        if (lastTop === null) {
          lastTop = rect.top;
        }
        // Se viene rilevato un cambiamento di riga (tolleranza di 2px)
        if (Math.abs(rect.top - lastTop) > 2) {
          // Se possibile, cerca di non spezzare una parola:
          let breakIndex = currentLine.lastIndexOf(" ");
          if (breakIndex !== -1) {
            // Definisci la riga come tutto ciò fino all'ultimo spazio (incluso lo spazio)
            let lineText = currentLine.substring(0, breakIndex + 1);
            console.log(`splitLyricSpan: Trovato spazio per evitare spezzamento a indice ${i}. Riga completa: "${lineText}"`);
            lines.push({ text: lineText, startIndex: currentStart });
            // Il nuovo inizio è l'indice corrente più il numero di caratteri eliminati (breakIndex+1)
            currentStart = currentStart + breakIndex + 1;
            // Il nuovo currentLine sarà il resto (escludendo lo spazio) + il carattere corrente
            currentLine = currentLine.substring(breakIndex + 1) + fullText[i];
          } else {
            // Nessuno spazio trovato: usa currentLine così com'è
            console.log(`splitLyricSpan: Nessun spazio trovato, wrapping a indice ${i}. Riga: "${currentLine}"`);
            lines.push({ text: currentLine, startIndex: currentStart });
            currentLine = fullText[i];
            currentStart = i;
          }
          lastTop = rect.top;
        } else {
          currentLine += fullText[i];
        }
      }
      if (currentLine) {
        console.log(`splitLyricSpan: Aggiunta ultima riga: "${currentLine}" (startIndex ${currentStart})`);
        lines.push({ text: currentLine, startIndex: currentStart });
      }
      console.log("splitLyricSpan: risultato:", lines);
      return lines;
    }
  
    // Processa una sezione (di tipo chorus o verse) verificando se il testo va a capo.
    // Se il wrapping viene rilevato, divide la sezione in sottosezioni e applica la formula:
    // left = somma ( larghezza in pixel dei caratteri delle lyrics che precedono l'accordo )
    function processWrappedSection(section, dynamicFont) {
      console.log(`processWrappedSection: Elaboro sezione di tipo "${section.section}"`);
      const sectionContainer = document.createElement("div");
      sectionContainer.classList.add("song-section", section.section);
  
      // Calcolo corretto: per ogni riga, se è presente un accordo,
      // il globalIndex deve essere uguale alla lunghezza cumulativa delle lyrics *prima* di aggiungere la cella corrente.
      let fullLyric = "";
      const chordData = []; // Ogni elemento: { chord: string, globalIndex: number }
      section.lines.forEach((line) => {
        if (line.chords) {
          chordData.push({ chord: line.chords, globalIndex: fullLyric.length });
          console.log(`processWrappedSection: Aggiunto accordo "${line.chords}" con globalIndex ${fullLyric.length}`);
        }
        fullLyric += line.lyric;
      });
  
      // Crea uno span temporaneo per le lyrics e lo aggiunge al DOM per poter calcolare il wrapping
      const lyricSpan = document.createElement("span");
      lyricSpan.classList.add("lyric");
      lyricSpan.textContent = fullLyric;
      sectionContainer.appendChild(lyricSpan);
      songContent.appendChild(sectionContainer);
  
      // Divide il testo in base ai cambi di riga
      const lineSplits = splitLyricSpan(lyricSpan);
      // Rimuove lo span originale (lo ricreeremo per ogni sottosezione)
      sectionContainer.removeChild(lyricSpan);
  
      if (lineSplits.length <= 1) {
        console.log("processWrappedSection: Nessun wrapping rilevato, utilizzo una singola riga.");
        const chordRow = document.createElement("div");
        chordRow.classList.add("chord-row");
        chordRow.style.position = "relative";
        const lyricRow = document.createElement("div");
        lyricRow.classList.add("lyric-row");
  
        chordData.forEach((data) => {
          const chordSpan = document.createElement("span");
          chordSpan.classList.add("chord");
          chordSpan.textContent = data.chord;
          const textBefore = fullLyric.substring(0, data.globalIndex);
          const pixelPosition = calculateChordPosition(textBefore, dynamicFont);
          chordSpan.style.left = `${pixelPosition}px`;
          console.log(`processWrappedSection (singola riga): Posizionato accordo "${data.chord}" a ${pixelPosition}px`);
          chordRow.appendChild(chordSpan);
        });
  
        const singleLyricSpan = document.createElement("span");
        singleLyricSpan.classList.add("lyric");
        singleLyricSpan.textContent = fullLyric;
        lyricRow.appendChild(singleLyricSpan);
  
        sectionContainer.appendChild(chordRow);
        sectionContainer.appendChild(lyricRow);
        return [sectionContainer];
      } else {
        console.log(`processWrappedSection: Wrapping rilevato in ${lineSplits.length} righe.`);
        const subSections = [];
        // Per ogni riga, crea una sottosezione
        lineSplits.forEach((lineInfo, lineIndex) => {
            console.log(`processWrappedSection: Elaboro sottosezione riga ${lineIndex}: "${lineInfo.text}" (startIndex: ${lineInfo.startIndex})`);
            const subContainer = document.createElement("div");
            subContainer.classList.add("song-section", section.section);
            const chordRow = document.createElement("div");
            chordRow.classList.add("chord-row");
            chordRow.style.position = "relative";
            const lyricRow = document.createElement("div");
            lyricRow.classList.add("lyric-row");
      
            // Crea lo span delle lyrics per questa riga
            const lineLyricSpan = document.createElement("span");
            lineLyricSpan.classList.add("lyric");
            lineLyricSpan.textContent = lineInfo.text;
            lyricRow.appendChild(lineLyricSpan);
      
            // Per ogni accordo che cade in questa riga, calcola la posizione relativa
            chordData.forEach((data) => {
              let lineStart = lineInfo.startIndex;
              let lineEnd = lineStart + lineInfo.text.length;
              // MODIFICA: usa >= per lineStart e < per lineEnd
              if (data.globalIndex >= lineStart && data.globalIndex < lineEnd) {
                const chordSpan = document.createElement("span");
                chordSpan.classList.add("chord");
                chordSpan.textContent = data.chord;
                const textBeforeInLine = fullLyric.substring(lineStart, data.globalIndex);
                const pixelPosition = calculateChordPosition(textBeforeInLine, dynamicFont);
                chordSpan.style.left = `${pixelPosition}px`;
                console.log(`processWrappedSection: (Riga ${lineIndex}) Posizionato accordo "${data.chord}" a ${pixelPosition}px (globalIndex: ${data.globalIndex}, lineStart: ${lineStart}, lineEnd: ${lineEnd})`);
                chordRow.appendChild(chordSpan);
              }
            });
      
            subContainer.appendChild(chordRow);
            subContainer.appendChild(lyricRow);
            subSections.push(subContainer);
          });
        return subSections;
      }
    }
  
    // Funzione principale che itera su ogni sezione della canzone
    function renderSong() {
      const dynamicFont = getDynamicFont();
      console.log(`renderSong: Font dinamico utilizzato: ${dynamicFont}`);
      songContent.innerHTML = "";
  
      songData.song.forEach((section) => {
        // Se la sezione è di tipo "chords", la gestiamo con il metodo attuale
        if (section.section === "chords") {
          console.log(`renderSong: Elaboro sezione "chords"`);
          const sectionContainer = document.createElement("div");
          sectionContainer.classList.add("song-section", section.section);
          const chordRow = document.createElement("div");
          chordRow.classList.add("chord-row");
          chordRow.style.position = "relative";
          const lyricRow = document.createElement("div");
          lyricRow.classList.add("lyric-row");
  
          let lyricsArray = [];
          let chordsWithoutLyrics = [];
  
          if (section.lines && Array.isArray(section.lines)) {
            section.lines.forEach((line, index) => {
              lyricsArray.push(line.lyric);
              if (line.chords) {
                const chordSpan = document.createElement("span");
                chordSpan.classList.add("chord");
                chordSpan.textContent = line.chords;
                chordRow.appendChild(chordSpan);
                console.log(`renderSong (chords): Aggiunto accordo "${line.chords}" per linea ${index}`);
                chordsWithoutLyrics.push({ span: chordSpan });
              }
            });
  
            const lyricSpan = document.createElement("span");
            lyricSpan.classList.add("lyric");
            lyricSpan.textContent = lyricsArray.join("");
            lyricRow.appendChild(lyricSpan);
          }
  
          // Per le sezioni "chords" usiamo uno spacing fisso (8 spazi)
          function arrangeChords(chordsArray, font) {
            const spaceWidth = getTextWidth("        ", font);
            let currentPosition = 0;
            chordsArray.forEach(({ span }) => {
              span.style.left = `${currentPosition}px`;
              console.log(`renderSong (chords): Posizionato accordo "${span.textContent}" a ${currentPosition}px`);
              currentPosition += spaceWidth;
            });
          }
          if (chordsWithoutLyrics.length > 0) {
            arrangeChords(chordsWithoutLyrics, dynamicFont);
          }
          sectionContainer.appendChild(chordRow);
          sectionContainer.appendChild(lyricRow);
          songContent.appendChild(sectionContainer);
        }
        // Per le sezioni di tipo "chorus" o "verse", utilizziamo il controllore per il wrapping
        else if (section.section === "chorus" || section.section === "verse") {
          console.log(`renderSong: Elaboro sezione "${section.section}" con controllo wrapping`);
          const subSections = processWrappedSection(section, dynamicFont);
          subSections.forEach((subContainer, idx) => {
            console.log(`renderSong: Aggiunta sottosezione ${idx} per sezione "${section.section}"`);
            songContent.appendChild(subContainer);
          });
        }
        // Altri tipi di sezioni possono essere gestiti qui se necessario.
      });
    }
  
    renderSong();
  }
  