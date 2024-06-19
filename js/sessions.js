document.addEventListener('DOMContentLoaded', () => {
    let video = document.getElementById('videoPlayer');

    fetch('../api/videos.json')
        .then((res) => res.json())
        .then((data) => {
            data.forEach(e => {
                AddElement(e.url, e.name);
            });
            addEventListenersToButtons(video); // Pass the video element to the function
        })
        .catch((err) => console.error('Error fetching data:', err));
});

function AddElement(url, name) {
    let sidebar = document.getElementById('sidecontainer');
    sidebar.innerHTML += `
        <button class="Vbtn" data-url="${url}" data-name="${name}">${name}</button>
    `;
}

function addEventListenersToButtons(video) {
    let buttons = document.getElementsByClassName('Vbtn');
    for (let button of buttons) {
        button.addEventListener('click', function() {
            let url = this.getAttribute('data-url');
            let name = this.getAttribute('data-name');
            let source = video.querySelector('source');
            
            // Check if source element exists
            if (source) {
                // Update source URL
                source.src = url;
                
                // Load and play the new video
                video.load();  // Ensure the new video is loaded
                video.play();  // Start playing the video
            } else {
                console.error('Source element not found.');
                console.log(url);
            }
        });
    }
}
