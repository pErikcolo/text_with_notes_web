// Esempio di categoryFilter.js aggiornato

export function loadTags(selectElement) {
    // Supponiamo che le canzoni siano memorizzate in window.allSongs (oppure puoi passare l'array come parametro)
    const songs = window.allSongs || [];
    const tagsSet = new Set();
  
    songs.forEach(song => {
      // Usa "tags" se presenti, altrimenti "categories", altrimenti un array vuoto
      const tags = song.tags || song.categories || [];
      if (tags.length > 0) {
        tags.forEach(tag => tagsSet.add(tag));
      } else {
        console.warn(`File "${song.title}" non contiene tag/categorie validi.`);
      }
    });
  
    // Converti l'insieme in un array e ordina i tag
    const tagsArray = Array.from(tagsSet).sort();
  
    // Pulisce e popola il select element
    selectElement.innerHTML = '';
    
    // Aggiunge l'opzione "Tutte"
    const allOption = document.createElement('option');
    allOption.value = '';
    allOption.textContent = 'Tutte';
    selectElement.appendChild(allOption);
  
    // Aggiunge le opzioni per ogni tag/categoria
    tagsArray.forEach(tag => {
      const option = document.createElement('option');
      option.value = tag;
      option.textContent = tag;
      selectElement.appendChild(option);
    });
    
    console.log("Filtro per categoria popolato con tag:", tagsArray);
  }
  