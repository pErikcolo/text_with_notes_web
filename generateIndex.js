const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'assets/songs');
const outputFilePath = path.join(directoryPath, 'index.json');

fs.readdir(directoryPath, (err, files) => {
  if (err) {
    console.error('Errore durante la lettura della directory:', err);
    return;
  }

  // Filtra solo i file JSON, escludendo `index.json` stesso
  const jsonFiles = files.filter(file => file.endsWith('.json') && file !== 'index.json');
  const indexData = {
    files: jsonFiles
  };

  // Scrive il file index.json
  fs.writeFile(outputFilePath, JSON.stringify(indexData, null, 2), (err) => {
    if (err) {
      console.error('Errore durante la scrittura del file index.json:', err);
    } else {
      console.log('File index.json generato con successo!');
    }
  });
});
