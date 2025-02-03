import { transposeChords } from './transpose.js';
import { changeFontSize } from './changeFontSize.js';
import { initializeScrollingButton } from './scrolling.js';

export function addControlsFunctionality() {
    const transposeUp = document.getElementById('transposeUp');
    const transposeDown = document.getElementById('transposeDown');
    const increaseFontSize = document.getElementById('increaseFontSize');
    const decreaseFontSize = document.getElementById('decreaseFontSize');

    if (transposeUp && transposeDown && increaseFontSize && decreaseFontSize) {
        transposeUp.addEventListener('click', () => transposeChords(1));
        transposeDown.addEventListener('click', () => transposeChords(-1));
        increaseFontSize.addEventListener('click', () => changeFontSize(2)); // Incrementa di 2px
        decreaseFontSize.addEventListener('click', () => changeFontSize(-2)); // Decrementa di 2px
    }
}

// Dopo ogni modifica della dimensione del testo
document.getElementById('increaseFontSize').addEventListener('click', () => {
    changeFontSize(1);
    initializeScrollingButton(); // Controlla lo scrolling dopo il ridimensionamento
});

document.getElementById('decreaseFontSize').addEventListener('click', () => {
    changeFontSize(-1);
    initializeScrollingButton(); // Controlla lo scrolling dopo il ridimensionamento
});

