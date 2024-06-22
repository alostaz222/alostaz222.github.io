let buttons = document.getElementsByClassName('Vbtn');
let stage = "" ;
let stgOpt = document.getElementById("stage").cloneNode(true);

// Get the popup container and content elements
const popupContainer = document.querySelector('.popup-container');
const popupContent = document.querySelector('.popup-content');
const closeButton = document.querySelector('.close-popup');

document.addEventListener('DOMContentLoaded', () => {
    stgOpt.id = `${stgOpt.id}-C`
popupContent.appendChild(stgOpt)

// Add an event listener to the original stgOpt
document.getElementById("stage").addEventListener("input", (e) => {
    stgOpt.value = e.target.value;
});

  // Add an event listener to the duplicated stgOpt
    stgOpt.addEventListener("input", (e) => {
    document.getElementById("stage").value = e.target.value;
});


stgOpt.addEventListener("change", () => {
    document.getElementById('stage').value
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
        popupContainer.style.display = 'block';
    } else {
        popupContainer.style.display = 'none';
        console.log(stage);
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
                        console.log();

                        // naming and catecorization
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
                video.load();  // Ensure the new video is loaded
            } else {
                console.error('Source element not found.');
                console.log(url);
            }
        });
    }
}