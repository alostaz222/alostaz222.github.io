fetch('https://alostaz222.github.io/api/videos.json').then((res) => {
    return res.json();
}).then((data) => {
    console.log(data);
});