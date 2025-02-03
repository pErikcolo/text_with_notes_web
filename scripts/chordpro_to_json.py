import os
import json

# Directory dei file .chordpro e .json
CHORDPRO_DIR = "../assets/chordpro"
JSON_DIR = "../assets/songs"

SPACING_CHORDS = 5  # Spazi tra accordi nella sezione "chords"
SPACING_OTHERS = 1  # Spazi tra accordi in altre sezioni ("verse", "chorus")


def parse_chordpro(file_path):
    """
    Funzione per convertire un file .chordpro in un dizionario strutturato per il formato JSON ottimizzato,
    preservando tutti gli spazi e calcolando correttamente le posizioni.
    """
    song_data = {}
    with open(file_path, 'r', encoding='utf-8') as file:
        lines = file.readlines()

    song_data["song"] = []
    current_section = None
    for line in lines:
        line = line.rstrip("\n")  # Mantieni gli spazi esatti della riga
        if line.startswith("#"):
            # Metadati
            if ":" in line:
                key, value = line[1:].split(":", 1)
                song_data[key.strip()] = value.strip()
        elif line.startswith("{") and line.endswith("}"):
            # Nuova sezione
            current_section = line[1:-1].strip()
            if current_section not in ["chords", "verse", "chorus"]:
                current_section = None
        elif current_section:
            # Linea di accordi e testo
            parsed_lines = []
            position = 0  # Posizione iniziale per la riga
            buffer_text_length = 0  # Somma della lunghezza delle lyrics precedenti

            parts = line.split("[")
            for i, part in enumerate(parts):
                if i == 0:
                    # Testo prima del primo accordo
                    buffer_text_length = len(part)
                    continue

                if "]" in part:
                    chord, rest = part.split("]", 1)
                    lyric = rest  # Testo dopo l'accordo

                    # Calcolo della posizione
                    if current_section == "chords":
                        # Per la sezione "chords", incremento costante di 3
                        position = len(parsed_lines) * SPACING_CHORDS
                    else:
                        # Per le sezioni "verse" e "chorus", calcolo dinamico
                        position = buffer_text_length + 1 if buffer_text_length > 0 else 0

                    # Aggiungi la riga parsata
                    parsed_lines.append({
                        "chords": chord.strip(),
                        "lyric": lyric,
                        "position": position
                    })

                    # Aggiorna la lunghezza del testo accumulato
                    buffer_text_length += len(lyric)  # Somma solo la lunghezza del testo

            # Aggiungi la riga alla sezione
            if parsed_lines:
                song_data["song"].append({
                    "section": current_section,
                    "lines": parsed_lines
                })

    return song_data



def chordpro_to_json():
    """
    Funzione principale per convertire tutti i file .chordpro in file .json ottimizzati.
    """
    # Verifica che le directory esistano
    if not os.path.exists(CHORDPRO_DIR):
        raise FileNotFoundError(f"Directory non trovata: {CHORDPRO_DIR}")

    if not os.path.exists(JSON_DIR):
        os.makedirs(JSON_DIR)  # Crea la directory JSON se non esiste

    for filename in os.listdir(CHORDPRO_DIR):
        if filename.endswith(".chordpro"):
            chordpro_path = os.path.join(CHORDPRO_DIR, filename)
            json_path = os.path.join(JSON_DIR, filename.replace(".chordpro", ".json"))

            # Controllo se il file è stato modificato
            if os.path.exists(json_path):
                chordpro_mtime = os.path.getmtime(chordpro_path)
                json_mtime = os.path.getmtime(json_path)
                if chordpro_mtime <= json_mtime:
                    continue

            # Conversione e salvataggio
            song_data = parse_chordpro(chordpro_path)

            # Assicurarsi che le categorie siano una lista
            if "categories" in song_data and isinstance(song_data["categories"], str):
                song_data["categories"] = [cat.strip() for cat in song_data["categories"].split(",")]

            # Rimuovere sezioni vuote
            song_data["song"] = [section for section in song_data["song"] if section["lines"]]

            with open(json_path, 'w', encoding='utf-8') as json_file:
                json.dump(song_data, json_file, indent=4, ensure_ascii=False)
            print(f"File aggiornato: {json_path}")


if __name__ == "__main__":
    chordpro_to_json()
