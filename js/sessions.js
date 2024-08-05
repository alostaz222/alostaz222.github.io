let buttons = document.getElementsByClassName('Vbtn');
let stage = "";
let stgOpt1 = document.getElementById('stage')
let stgOpt = stgOpt1.cloneNode(true);
let videoName = document.getElementById('video-name');
const stgGroups = document.getElementsByClassName('stgGroup');
let sidebar = document.getElementById('sidecontainer');
let thirdContainer = document.getElementById('third-container');
let videoData;
let resulted; // Declare resulted in the outer scope
let directoryName;
let directoryStage;
let firstEntryDirText;
let firstEntryName;
let firstEntryDirType;
let secondEntryDirText;
let secondEntryName;
let secondEntryDirType;
let video = document.getElementById('videoPlayer');

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

    // fetch('../api/videos.json')
    //     .then((res) => res.json())
    //     .then((data) => {
    //         videoData = data
    //         data.forEach(e => {
    //             let name = e.name;
    //             sidebar.innerHTML += `
    //                     <div class="video-entry">
    //                         <button class="Vbtn" data-url="${e.url}" data-name="${name}">${name}</button>
    //                     </div>
    //                 `;
    //         });
    //         addEventListenersToButtons(video);
    //     })
    //     .catch((err) => console.error('Error fetching data:', err));
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

// sidebar directories

// naming

function extractTextAfterSymbols(str, symbols, variables) {
    const resulted = {};
    symbols.forEach((symbol, index) => {
        const variableName = variables[index];
        if (str.includes(symbol)) {
            const parts = str.split(symbol);
            let textAfterSymbol = parts[1];
            for (let i = 0; i < textAfterSymbol.length; i++) {
                if (symbols.includes(textAfterSymbol[i])) {
                    textAfterSymbol = textAfterSymbol.slice(0, i);
                    break;
                }
            }
            resulted[variableName] = textAfterSymbol.trim();
        } else {
            resulted[variableName] = "";
        };
    });
    return resulted;
};

function addEntry() {
    const name = "!3s@term1#الواجب$الحصة الاولى%شرح^video.mp4";
    const inputString = name.split('.')[0];
    const symbols = ['!', '@', '#', '$', '%', '^'];
    const variables = ['stage', 'term', 'name', 'directory', 'session', 'type'];
    resulted = extractTextAfterSymbols(inputString, symbols, variables);

    console.log(resulted);
};

addEntry();

document.addEventListener('DOMContentLoaded', () => {
    const updateEntries = (result) => {
        const directoryGroup = document.getElementById(`${result.stage}`).querySelector('.directories');
        let directoryExists = false;
        let targetDirectory;

        const directories = directoryGroup.querySelectorAll('.directory');
        directories.forEach((directory) => {
            const directoryName = directory.getAttribute('data-name');

            if (directoryName == result.directory) {
                directoryExists = true;
                targetDirectory = directory;
            }
        });

        if (!directoryExists) {
            const newDirectory = document.createElement('div');
            newDirectory.className = 'directory';
            newDirectory.dataset.name = result.directory;
            newDirectory.innerHTML = `
                <p class="dir-name">${result.directory}</p>
                <div class="entry">
                    <div class="dir-text-cont">
                        <div class="session-txt">
                            <i class="material-icons">arrow_drop_down</i>
                            <p class="directory-text">${result.directory} - ${result.session}</p>
                        </div>
                        <input type="checkbox" disabled>
                    </div>
                    <div class="directory-item">
                        <p class="entry-text" data-url="${result.url}" data-dirType="${result.type}">${result.name}</p>
                        <input type="checkbox" disabled>
                    </div>
                </div>
            `;
            directoryGroup.appendChild(newDirectory);
            return;
        }

        const entries = targetDirectory.querySelectorAll('.entry');
        let entryExists = false;
        let targetEntry;

        entries.forEach((entry) => {
            const dirTextCont = entry.querySelector('.dir-text-cont .directory-text').textContent;

            if (dirTextCont == `${result.directory} - ${result.session}`) {
                entryExists = true;
                targetEntry = entry;
            }
        });

        if (!entryExists) {
            const newEntry = document.createElement('div');
            newEntry.className = 'entry';
            newEntry.innerHTML = `
                <div class="dir-text-cont">
                    <div class="session-txt">
                        <i class="material-icons">arrow_drop_down</i>
                        <p class="directory-text">${result.directory} - ${result.session}</p>
                    </div>
                    <input type="checkbox" disabled>
                </div>
                <div class="directory-item">
                    <p class="entry-text" data-url="${result.url}" data-dirType="${result.type}">${result.name}</p>
                    <input type="checkbox" disabled>
                </div>
            `;
            targetDirectory.appendChild(newEntry);
        } else {
            const directoryItems = targetEntry.querySelectorAll('.directory-item');
            let directoryItemExists = false;

            directoryItems.forEach((directoryItem) => {
                const entryText = directoryItem.querySelector('.entry-text').textContent;
                const entryDirType = directoryItem.querySelector('.entry-text').getAttribute('data-dirType');

                if (entryText == result.name) {
                    directoryItemExists = true;
                }
            });

            if (!directoryItemExists) {
                const newDirectoryItem = document.createElement('div');
                newDirectoryItem.className = 'directory-item';
                newDirectoryItem.innerHTML = `
                    <p class="entry-text" data-url="${result.url}" data-dirType="${result.type}">${result.name}</p>
                    <input type="checkbox" disabled>
                `;
                targetEntry.appendChild(newDirectoryItem);
            } else {
                console.log("Directory-item already exists. No action needed.");
            }
        }
    };

    // Example usage: fetch and update entries
    fetch('../api/entries.json')
        .then(response => response.json())
        .then(data => {
            data.forEach(entry => updateEntries(entry));
        })
        .catch(error => console.error('Error loading entries:', error));
});
