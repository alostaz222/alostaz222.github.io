const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const videoDirectory = path.join(__dirname, 'videos'); // Adjust the path to your video directory

app.use(express.static('public'));

app.get('/videos', (req, res) => {
    fs.readdir(videoDirectory, (err, files) => {
        if (err) {
            return res.status(500).send('Unable to scan directory: ' + err);
        }
        const videoFiles = files.filter(file => path.extname(file).toLowerCase() === '.mp4'); // Filter for .mp4 files
        res.json(videoFiles);
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
