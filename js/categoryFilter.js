const indexFile = "assets/songs/index.json";

export async function loadTags(categoryFilter) {
    const tagsSet = new Set();

    try {
        const response = await fetch(indexFile);
        const { files } = await response.json();

        for (const file of files) {
            const songResponse = await fetch(`assets/songs/${file}`);
            const songData = await songResponse.json();

            if (songData.tags && Array.isArray(songData.tags)) {
                songData.tags.forEach(tag => tagsSet.add(tag));
            } else {
                console.warn(`File "${file}" non contiene tags validi.`, songData);
            }
        }
    } catch (error) {
        console.error("Errore durante il caricamento dei tag:", error);
    }

    populateCategoryFilter([...tagsSet], categoryFilter);
}

export function populateCategoryFilter(tags, categoryFilter) {
    if (!Array.isArray(tags)) {
        console.error("Errore: 'tags' non è un array valido.", tags);
        return;
    }

    tags.sort().forEach(tag => {
        const option = document.createElement('option');
        option.value = tag;
        option.textContent = tag;
        categoryFilter.appendChild(option);
    });

    console.log("Filtro per categoria popolato con tag:", tags);
}
