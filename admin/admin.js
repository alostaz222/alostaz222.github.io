import { addEntry } from './export.js';

document.getElementById('addEntryButton').addEventListener('click', () => {
    const form = document.getElementById('namingForm');
    const formData = new FormData(form);

    addEntry(formData);
});
