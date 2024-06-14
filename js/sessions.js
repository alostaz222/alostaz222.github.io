window.VideoPlayer = ``
window.VideoName =``

fetch("/api/videos.json")
    .then(res => console.log(res))
    .catch(err => console.error(err));