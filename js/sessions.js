fetch('../api/videos.json')
.then((res) => res.json())
.then((data) =>data.forEach(e => {
    console.log(e.url);
}))
.catch((err) => console.error(err));