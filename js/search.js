// Aggiungi questo codice nel file main.js oppure in un file separato, da includere nel progetto.
document.getElementById("searchInput").addEventListener("input", function(e) {
    const filterText = e.target.value.toLowerCase();
    // Seleziona tutti gli elementi della lista delle canzoni
    const listItems = document.querySelectorAll("#songList li");
    listItems.forEach(item => {
      // Verifica se il testo dell'item (ad es. il titolo) contiene il testo cercato
      if (item.textContent.toLowerCase().includes(filterText)) {
        item.style.display = ""; // Mostra l'item
      } else {
        item.style.display = "none"; // Nasconde l'item
      }
    });
  });