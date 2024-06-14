fetch('../api/videos.json')
.then((res) => res.json())
.then((data) =>data.forEach(e => {
    AddElement(e.url, e.name);
}))
.catch((err) => console.error(err));

let AddElement = function(url, name){
    let sidebar = document.getElementById('sidecontainer');
    sidebar.innerHTML += `
        <button class="Vbtn" data-url="${url} data-name="${name}"">${name}</button>
    `;
    let buttons = document.querySelectorAll('.Vbtn');
    console.log(`Found ${buttons.length} buttons`); // Log number of buttons found
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            let url = this.dataset.url;
            let name = this.dataset.name;
            console.log(`Button clicked - URL: ${url}, Name: ${name}`);
            // You can add more functionality here
        });
    });
}