export function addEntry(formData) {
    fetch('/add-entry', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            alert('Entry added successfully!');
        } else {
            alert('Failed to add entry.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error submitting entry.');
    });
}
