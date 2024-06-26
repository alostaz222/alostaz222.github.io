let buttons = document.getElementsByClassName('Vbtn');
let stage = "" ;
let stgOpt1 = document.getElementById('stage')
let stgOpt = stgOpt1.cloneNode(true);
let videoName = document.getElementById('video-name');

// Get the popup container and content elements
const popupContainer = document.querySelector('.popup-container');
const popupContent = document.querySelector('.popup-content');
const container = document.querySelector('.container');

document.addEventListener('DOMContentLoaded', () => {

    
    if (videoName.innerHTML == "") {
        videoName.style.display = 'none'
    } else {
        videoName.style.display = 'block'
    }

    stgOpt.id = `${stgOpt.id}-C`
    container.prepend(stgOpt)

    // Add an event listener to the original stgOpt
    stgOpt1.addEventListener("input", (e) => {
        stgOpt.value = e.target.value;
    });

    // Add an event listener to the duplicated stgOpt
    stgOpt.addEventListener("input", (e) => {
        stgOpt1.value = e.target.value;
    });

    stgOpt1.addEventListener("change", () => {
        if (stgOpt1.value != "") {
            stage = stgOpt1.value;
            updatePopup()
        } else {
            updatePopup()
            stage = ""
        }
    });

    stgOpt.addEventListener("change", () => {
        if (stgOpt.value != "") {
            stage = stgOpt.value;
            updatePopup()
        } else {
            updatePopup()
            stage = ""
        }
    });

    function updatePopup() {
        const stgGroups = document.getElementsByClassName('stgGroup');
        if (stage == "") {
            popupContainer.style.display = 'block';
            for (let group of stgGroups) {
                group.style.display = 'none'
            }
        } else {
            popupContainer.style.display = 'none';
            console.log(stage);
            for (let group of stgGroups) {
                group.style.display = 'none'
            }
            document.getElementById(`${stage}`).style.display = 'block'
        }
    }

    updatePopup()

    let video = document.getElementById('videoPlayer');

    fetch('../api/videos.json')
        .then((res) => res.json())
        .then((data) => {
            data.forEach(e => {
                    let sidebar = document.getElementById('sidecontainer');
                    let name = e.name;
                    sidebar.innerHTML += `
                        <div class="video-entry">
                            <button class="Vbtn" data-url="${e.url}" data-name="${name}">${name}</button>
                        </div>
                    `;

                    for (let i = 0; i < buttons.length; i++) {
                        let button = buttons[i];
                        let btnName = button.getAttribute("data-name");

                        // naming and catecorization
                        if (btnName.includes('@')) {
                        }
                    }
            });
            addEventListenersToButtons(video);
        })
        .catch((err) => console.error('Error fetching data:', err));
});

function addEventListenersToButtons(video) {
    for (let i = 0; i < buttons.length; i++) {
        let button = buttons[i];

        button.addEventListener('click', function() {
            let url = this.getAttribute('data-url');
            let source = video.querySelector('source');
            if (source) {
                source.src = url;
                videoName.innerHTML = this.getAttribute('data-name');
                video.load();  // Ensure the new video is loaded
            } else {
                console.error('Source element not found.');
                console.log(url);
            }
        });
    }
}