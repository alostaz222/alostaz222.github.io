let buttons = document.querySelectorAll('.directory-item');
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

    updatePopup();

});


// fix this
document.addEventListener('click', function(e) {
    let target = e.target;
    if (target.matches('.directory-item') || target.matches('.directory-item p')) {
        if (target.matches('p')) {
            target = target.closest('.directory-item');
        }

        let url = target.querySelector('p').getAttribute('data-url');
        let source = video.querySelector('source');
        if (source) {
            source.src = url;
            videoName.innerText = target.querySelector('p').getAttribute('data-name');
            video.load();
        }

        videoName.style.display = videoName.innerText ? 'block' : 'none';
    }

    if (target.matches('.session-txt') || target.matches('.session-txt i') || target.matches('.session-txt p')) {
        const entry = target.closest('.entry');
        const directoryItems = entry.querySelectorAll('.directory-item');

        directoryItems.forEach((directoryItem) => {
            const isVisible = directoryItem.classList.contains('visible');

            if (isVisible) {
                // Hide the directory item by removing the visible class
                directoryItem.classList.remove('visible');
            } else {
                // Show the directory item by adding the visible class
                directoryItem.classList.add('visible');
            }
        });

        const iconElement = entry.querySelector('.session-txt i');
        if (iconElement) {
            if (iconElement.innerText === 'arrow_drop_down') {
                iconElement.innerText = 'arrow_drop_up';
            } else {
                iconElement.innerText = 'arrow_drop_down';
            }
        }
    }
});



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
                        <p class="entry-text" data-url="${result.url}" data-dirType="${result.type}" data-name="${result.name}">${result.name}</p>
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
                    <p class="entry-text" data-url="${result.url}" data-dirType="${result.type}" data-name="${result.name}">${result.name}</p>
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
                    <p class="entry-text" data-url="${result.url}" data-dirType="${result.type}" data-name="${result.name}">${result.name}</p>
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