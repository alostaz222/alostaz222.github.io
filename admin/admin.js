import { addEntry } from './export.js';

document.getElementById('addEntryButton').addEventListener('click', () => {
    const form = document.getElementById('namingForm');
    const formData = new FormData(form);

    addEntry(formData);
});

let type = document.getElementById('type');
let fileLabel = document.querySelector('label[for="file"]')

type.addEventListener('change', typefinder);
window.addEventListener('DOMContentLoaded', typefinder);

function typefinder() {
    if (type.value == 'video') {
        fileLabel.textContent = 'Video File:'
    } else if (type.value == 'exam') {
        fileLabel.textContent = 'Exam File:'
    } else if (type.value == 'sheet') {
        fileLabel.textContent = 'Sheet File:'
    } else {
        fileLabel.textContent = 'File:'
    }
}

