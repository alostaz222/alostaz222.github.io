fetch('../api/videos.json')
.then((res) => res.json())
.then((data) =>data.forEach(e => {
    // addElement(e.name, e.url);
    console.log(e.url, e.name);
}))
.catch((err) => console.error(err));

// let addElement = function(name, url){
// }