let scrollingRequestId = null;
let scrollState = 0; // 0: fermo (play), 1: scrolling molto lento, 2: scrolling lento
let lastFrameTime = 0;

// Velocità in pixel per secondo: Stato 1: 20px/sec, Stato 2: 40px/sec
const speeds = [8, 15];

function startScrolling(speed) {
  lastFrameTime = performance.now();
  let accumulated = 0;
  function step(now) {
    const delta = now - lastFrameTime; // tempo trascorso in ms
    lastFrameTime = now;
    const pixelsToScroll = (speed * delta) / 1000; // pixel da scorrere (frazione)
    accumulated += pixelsToScroll;
    
    // Applica l'incremento solo se accumulato >= 1px
    const deltaScroll = Math.floor(accumulated);
    if (deltaScroll > 0) {
      const songContent = document.getElementById('songContent');
      songContent.scrollTop += deltaScroll;
      accumulated -= deltaScroll;
      console.log(`step: delta=${delta}ms, pixelsToScroll=${pixelsToScroll.toFixed(2)}px, deltaScroll=${deltaScroll}, scrollTop=${songContent.scrollTop}`);
      
      if (songContent.scrollTop + songContent.clientHeight >= songContent.scrollHeight) {
        stopScrolling();
        return;
      }
    }
    scrollingRequestId = requestAnimationFrame(step);
  }
  scrollingRequestId = requestAnimationFrame(step);
}

export function toggleScrolling() {
  const scrollingButton = document.getElementById('scrollingButton');
  const songContent = document.getElementById('songContent');
  if (!songContent) return;
  
  if (scrollState === 0) {
    // Stato 0 -> Stato 1: avvia scrolling molto lento (20px/sec)
    startScrolling(speeds[0]);
    scrollState = 1;
    scrollingButton.textContent = '⏩'; // simbolo per "very slow"
  } else if (scrollState === 1) {
    // Stato 1 -> Stato 2: passa a scrolling lento (40px/sec)
    if (scrollingRequestId) cancelAnimationFrame(scrollingRequestId);
    startScrolling(speeds[1]);
    scrollState = 2;
    scrollingButton.textContent = '■'; // simbolo per "stop"
  } else if (scrollState === 2) {
    // Stato 2 -> Stato 0: ferma lo scrolling
    stopScrolling();
  }
}

export function stopScrolling() {
  if (scrollingRequestId) {
    cancelAnimationFrame(scrollingRequestId);
    scrollingRequestId = null;
  }
  scrollState = 0;
  const scrollingButton = document.getElementById('scrollingButton');
  if (scrollingButton) {
    scrollingButton.textContent = '▶'; // simbolo "play"
  }
}

export function initializeScrollingButton() {
  const scrollingButton = document.getElementById('scrollingButton');
  if (scrollingButton) {
    scrollingButton.style.display = 'inline-block';
    scrollingButton.textContent = '▶';
    scrollingButton.style.color = 'black'; // Forza il colore del testo a nero
  }
}

export function watchContentHeight() {
  // Se preferisci non nascondere il pulsante, forza sempre la sua visualizzazione
  const scrollingButton = document.getElementById('scrollingButton');
  if (scrollingButton) {
    scrollingButton.style.display = 'inline-block';
    console.log("watchContentHeight: pulsante di scrolling forzato visibile.");
  }
}
