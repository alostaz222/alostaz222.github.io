fetch('../api/videos.json')
.then((res) => res.json())
.then((data) =>data.array.forEach(e => {
    console.log(name);
}))
.catch((err) => console.error(err));