window.VideoPlayer = ``
window.VideoName =``

fetch("/api/videos.json")
    .then(data => console.log(data))
    .catch(err => console.error(err));