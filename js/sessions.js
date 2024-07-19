let buttons = document.getElementsByClassName('Vbtn');
let stage = "";
let stgOpt1 = document.getElementById('stage')
let stgOpt = stgOpt1.cloneNode(true);
let videoName = document.getElementById('video-name');
const stgGroups = document.getElementsByClassName('stgGroup');
let sidebar = document.getElementById('sidecontainer');
let thirdContainer = document.getElementById('third-container');

// Get the popup container and content elements
const popupContainer = document.querySelector('.popup-container');
const popupContent = document.querySelector('.popup-content');
const container = document.querySelector('.container');

document.addEventListener('DOMContentLoaded', () => {
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
        if (stage == "") {
            popupContainer.style.display = 'flex';
            for (let group of stgGroups) {
                group.style.display = 'none'
            };
        } else {
            popupContainer.style.display = 'none';
            for (let group of stgGroups) {
                group.style.display = 'none';
            };
            document.getElementById(`${stage}`).style.display = 'flex';
            for (const button of buttons) {
                button.style.display = 'block'
            };
        }
    }

    updatePopup()

    let video = document.getElementById('videoPlayer');

    fetch('../api/videos.json')
        .then((res) => res.json())
        .then((data) => {
            data.forEach(e => {
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

        button.addEventListener('click', function () {
            let url = this.getAttribute('data-url');
            let source = video.querySelector('source');
            if (source) {
                source.src = url;
                videoName.innerText = this.getAttribute('data-name');
                video.load();  // Ensure the new video is loaded
            } else {
                console.error('Source element not found.');
            }

            if (videoName.innerText != "") {
                videoName.style.display = 'block'
            } else {
                videoName.style.display = 'none'
            }
        })
    }
}

function syncDivHeights() {
    const div1 = document.getElementById('sidebar');
    const div2 = document.getElementById('third-container');

    // Reset heights to auto to get the natural height
    div1.style.height = 'auto';
    div2.style.height = 'auto';

    // Get the heights of the divs
    const div1Height = div1.offsetHeight;
    const div2Height = div2.offsetHeight;

    if (window.matchMedia('(max-width: 767px)').matches) {
        div1.style.height = '100%'
    } else {
        // Set both divs to the maximum height
        div1.style.height = div2Height + 'px';
    }
}


if (window.location.pathname == '/sessions' || window.location.pathname == '/sessions.html') {
    // Call the function to sync heights on load
    window.addEventListener('load', syncDivHeights);
    
    // Optionally, call the function to sync heights on window resize
    window.addEventListener('resize', syncDivHeights);
    window.addEventListener('click', syncDivHeights);
}