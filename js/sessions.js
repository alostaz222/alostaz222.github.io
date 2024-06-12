window.VideoPlayer = `${path}`
window.VideoName =`${fileDetails.name}`

const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'your-directory'); // Change 'your-directory' to your folder name

fs.readdir(directoryPath, (err, files) => {
    if (err) {
        return console.error('Unable to scan directory:', err);
    }

    const fileDetails = files.map(file => ({
        name: file,
        path: path.join(directoryPath, file)
    }));

    console.log(fileDetails);
});