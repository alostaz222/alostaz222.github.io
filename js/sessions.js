fetch('../api/videos.json')
.then((res) => res.json())
.then((data) =>data.forEach(e => {
    addElement(e.name, e.url);
}))
.catch((err) => console.error(err));

let addElement = function(name, url){
    let sidebar = document.getElementById('sidebar');
    sidebar.innerHtml += `
        <button onclick="location.href='${url}'">${name}</button>
    `;
}