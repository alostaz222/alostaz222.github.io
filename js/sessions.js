document.addEventListener('DOMContentLoaded', () => {
    let video = document.getElementById('videoPlayer');

    fetch('../api/videos.json')
        .then((res) => res.json())
        .then((data) => {
            data.forEach(e => {
                AddElement(e.url, e.name);
            });
            addEventListenersToButtons(video);
        })
        .catch((err) => console.error('Error fetching data:', err));
});

function AddElement(url, name) {
    let sidebar = document.getElementById('sidecontainer');
    sidebar.innerHTML += `
        <div class="video-entry">
            <button class="Vbtn" data-url="${url}" data-name="${name}">${name}</button>
        </div>
    `;

    let mp4 = ".mp4"

    let btnContainer = document.querySelectorAll(`div.btnCont${mp4}`);

    // Symbol processing example
    if (name.includes(mp4) && btnContainer.length > 0) {
        console.log("contains");
    } else {
        console.log("no");
    }
}

function addEventListenersToButtons(video) {
    let buttons = document.getElementsByClassName('Vbtn');

    for (let i = 0; i < buttons.length; i++) {
        let button = buttons[i];

        button.addEventListener('click', function() {
            let url = this.getAttribute('data-url');
            let source = video.querySelector('source');
            
            if (source) {
                source.src = url;
                video.load();  // Ensure the new video is loaded
            } else {
                console.error('Source element not found.');
                console.log(url);
            }
        });
    }
}