export function displaySongContent(songData) {
  console.log("Rendering canzone con dati:", songData);
  const songContent = document.getElementById("songContent");
  
  // Svuota completamente il contenitore e imposta alcune proprietà base
  songContent.innerHTML = "";
  songContent.style.display = "block";
  songContent.style.whiteSpace = "pre-wrap";
  
  if (!songData || !songData.song) {
    console.error("Dati della canzone non validi:", songData);
    songContent.innerHTML = "<p>Errore: nessun dato valido per la canzone.</p>";
    return;
  }
  
  // 1. Crea il blocco per titolo e autore
  const songHeader = document.createElement("div");
  songHeader.id = "songHeader";
  songHeader.style.textAlign = "center";
  songHeader.style.marginBottom = "1rem";
  
  const titleElement = document.createElement("h1");
  titleElement.id = "songTitle";
  titleElement.style.fontSize = "1.8rem";
  titleElement.style.fontWeight = "bold";
  titleElement.style.marginBottom = "0.5rem";
  titleElement.textContent = songData.title;
  
  const authorElement = document.createElement("h2");
  authorElement.id = "songAuthor";
  authorElement.style.fontSize = "1.2rem";
  authorElement.style.fontStyle = "italic";
  authorElement.style.color = "#555";
  authorElement.style.marginBottom = "1rem";
  authorElement.textContent = songData.author || "";
  
  songHeader.appendChild(titleElement);
  songHeader.appendChild(authorElement);
  
  // Aggiunge il blocco header in cima al contenitore della canzone
  songContent.appendChild(songHeader);
  
  // 2. Crea il display della trasposizione (posizionato in alto a destra)
  const transposeDisplay = document.createElement("div");
  transposeDisplay.id = "transposeDisplay";
  transposeDisplay.style.position = "absolute";
  transposeDisplay.style.top = "5px";
  transposeDisplay.style.right = "5px";
  transposeDisplay.style.color = "green";
  transposeDisplay.style.fontWeight = "bold";
  transposeDisplay.style.zIndex = "10";
  // Inizialmente mostra il valore 0 (accordatura standard)
  transposeDisplay.textContent = "Trasposizione: 0";
  songContent.appendChild(transposeDisplay);
  
  // 3. Crea un contenitore per il corpo della canzone
  const songBody = document.createElement("div");
  songBody.id = "songBody";
  
  // Funzioni di utilità per il rendering degli accordi e del testo
  function getTextWidth(text, font) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    context.font = font;
    const width = context.measureText(text).width;
    console.log(`getTextWidth: "${text}" con font "${font}" = ${width}px`);
    return width;
  }
  
  function getDynamicFont() {
    const font = window.getComputedStyle(songContent).font;
    console.log("Dynamic font:", font);
    return font;
  }
  
  function calculateChordPosition(textBefore, font) {
    const pos = getTextWidth(textBefore, font);
    console.log(`calculateChordPosition: testo precedente "${textBefore}" => ${pos}px`);
    return pos;
  }
  
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
      if (Math.abs(rect.top - lastTop) > 2) {
        let breakIndex = currentLine.lastIndexOf(" ");
        if (breakIndex !== -1) {
          let lineText = currentLine.substring(0, breakIndex + 1);
          console.log(`splitLyricSpan: Trovato spazio per evitare spezzamento a indice ${i}. Riga completa: "${lineText}"`);
          lines.push({ text: lineText, startIndex: currentStart });
          currentStart = currentStart + breakIndex + 1;
          currentLine = currentLine.substring(breakIndex + 1) + fullText[i];
        } else {
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
  
  function processWrappedSection(section, dynamicFont) {
    console.log(`processWrappedSection: Elaboro sezione di tipo "${section.section}"`);
    const sectionContainer = document.createElement("div");
    sectionContainer.classList.add("song-section", section.section);
    
    let fullLyric = "";
    const chordData = [];
    section.lines.forEach((line) => {
      if (line.chords) {
        chordData.push({ chord: line.chords, globalIndex: fullLyric.length });
        console.log(`processWrappedSection: Aggiunto accordo "${line.chords}" con globalIndex ${fullLyric.length}`);
      }
      fullLyric += line.lyric;
    });
    
    const lyricSpan = document.createElement("span");
    lyricSpan.classList.add("lyric");
    lyricSpan.textContent = fullLyric;
    sectionContainer.appendChild(lyricSpan);
    songContent.appendChild(sectionContainer);
    
    const lineSplits = splitLyricSpan(lyricSpan);
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
      lineSplits.forEach((lineInfo, lineIndex) => {
        console.log(`processWrappedSection: Elaboro sottosezione riga ${lineIndex}: "${lineInfo.text}" (startIndex: ${lineInfo.startIndex})`);
        const subContainer = document.createElement("div");
        subContainer.classList.add("song-section", section.section);
        const chordRow = document.createElement("div");
        chordRow.classList.add("chord-row");
        chordRow.style.position = "relative";
        const lyricRow = document.createElement("div");
        lyricRow.classList.add("lyric-row");
        
        const lineLyricSpan = document.createElement("span");
        lineLyricSpan.classList.add("lyric");
        lineLyricSpan.textContent = lineInfo.text;
        lyricRow.appendChild(lineLyricSpan);
        
        chordData.forEach((data) => {
          let lineStart = lineInfo.startIndex;
          let lineEnd = lineStart + lineInfo.text.length;
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
  
  function renderSong() {
    const dynamicFont = getDynamicFont();
    console.log(`renderSong: Font dinamico utilizzato: ${dynamicFont}`);
    
    songData.song.forEach((section) => {
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
        songBody.appendChild(sectionContainer);
      } else if (section.section === "chorus" || section.section === "verse") {
        console.log(`renderSong: Elaboro sezione "${section.section}" con controllo wrapping`);
        const subSections = processWrappedSection(section, dynamicFont);
        subSections.forEach((subContainer, idx) => {
          console.log(`renderSong: Aggiunta sottosezione ${idx} per sezione "${section.section}"`);
          songBody.appendChild(subContainer);
        });
      }
    });
    
    // Aggiungi il contenitore del corpo della canzone a songContent
    songContent.appendChild(songBody);
  }
  
  renderSong();
}
