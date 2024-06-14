fetch('../api/videos.json')
.then((res) => res.json())
.then((data) =>data.forEach(e => {
    AddElement(this.url, this.name);
}))
.catch((err) => console.error(err));

let AddElement = function(url, name){
    let sidebar = document.getElementById('sidecontainer');
    sidebar.innerHTML += `
        <button class="Vbtn" data-url="${url} data-name="${name}"">${name}</button>
    `;
    
}