let buttons = document.querySelectorAll('.directory-item');
let stage = "";
let stgOpt1 = document.getElementById('stage')
let stgOpt = stgOpt1.cloneNode(true);
let videoName = document.getElementById('video-name');
const stgGroups = document.getElementsByClassName('stgGroup');
let sidebar = document.getElementById('sidebar');
let thirdContainer = document.getElementById('third-container');
let videoData;
let resulted;
let directoryName;
let directoryStage;
let firstEntryDirText;
let firstEntryName;
let firstEntryDirType;
let secondEntryDirText;
let secondEntryName;
let secondEntryDirType;
let video = document.getElementById('videoPlayer');
const popupContainer = document.querySelector('.popup-container');
const popupContent = document.querySelector('.popup-content');
const container = document.querySelector('.container');

document.addEventListener('DOMContentLoaded', () => {
    stgOpt.id = `${stgOpt.id}-C`
    container.prepend(stgOpt)

    stgOpt1.addEventListener("input", (e) => {
        stgOpt.value = e.target.value;
    });

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

document.addEventListener('click', function (e) {
    let target = e.target;

    e.stopPropagation();

    if (target.matches('.directory-item') || target.matches('.directory-item p') || target.matches('.directory-item i') || target.matches('.ADate') || target.matches('.ADate i') || target.matches('.ADate span')) {
        if (target.matches('p')) {
            target = target.closest('.directory-item');
        }

        if (target.matches('span')) {
            target = target.closest('.directory-item');
        }

        if (target.matches('i')) {
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
        syncDivHeights();
    }

    if (target.matches('.session-txt') || target.matches('.session-txt i') || target.matches('.session-txt p')) {
        const entry = target.closest('.entry');
        const directoryItems = entry.querySelectorAll('.directory-item');

        directoryItems.forEach((directoryItem) => {
            const isVisible = directoryItem.classList.contains('visible');

            if (isVisible) {
                directoryItem.classList.remove('visible');
            } else {
                directoryItem.classList.add('visible');
            }
        });

        const iconElement = entry.querySelector('.session-txt i');
        if (iconElement) {
            iconElement.innerText = iconElement.innerText === 'arrow_drop_down' ? 'arrow_drop_up' : 'arrow_drop_down';
        }
    }

    saveScrollPosition();
});

function saveScrollPosition() {
    const scrollPosition = sidebar.scrollTop;
    localStorage.setItem('sidebarScrollPosition', scrollPosition);
}

document.addEventListener('DOMContentLoaded', () => {
    const savedScrollPosition = localStorage.getItem('sidebarScrollPosition');
    if (savedScrollPosition !== null) {
        sidebar.scrollTop = parseInt(savedScrollPosition, 10);
    }
});

sidebar.addEventListener('mousedown', function(e) {
    e.preventDefault();
});

function syncDivHeights() {
    const div1 = document.getElementById('sidebar');
    const div2 = document.getElementById('third-container');

    div1.style.height = 'auto';
    div2.style.height = 'auto';

    const div1Height = div1.offsetHeight;
    const div2Height = div2.offsetHeight;

    if (window.matchMedia('(max-width: 767px)').matches) {
        div1.style.height = '100%';
    } else {
        div1.style.height = div2Height + 'px';
    }
}

if (window.location.pathname == '/sessions' || window.location.pathname == '/sessions.html') {
    window.addEventListener('load', syncDivHeights);
    window.addEventListener('resize', syncDivHeights);
    window.addEventListener('click', syncDivHeights);
}

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

function updateDirectoryIcons() {
    const directoryItems = document.querySelectorAll('.directory-item');

    directoryItems.forEach(item => {
        const dataType = item.getAttribute('data-type');
        const iconElement = item.querySelector('i');

        if (dataType === 'video') {
            iconElement.textContent = 'smart_display';
        } else if (dataType === 'exam') {
            iconElement.textContent = 'quiz';
        } else if (dataType === 'sheet') {
            iconElement.textContent = 'description';
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    updateDirectoryIcons();

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
            newDirectory.dataset.order = result.directoryOrder;
            newDirectory.style.order = result.directoryOrder;
            newDirectory.innerHTML = `
                <p class="dir-name">${result.directory}</p>
                <div class="entry" data-type="${result.session}">
                    <div class="dir-text-cont">
                        <div class="session-txt">
                            <i class="material-icons">arrow_drop_down</i>
                            <p class="directory-text">${result.directory} - ${result.session}</p>
                        </div>
                        <input type="checkbox" disabled>
                    </div>
                    <div class="directory-item" data-order='${result.order}' data-term='${result.term}' data-type='${result.type}' style='order: ${result.order};'>
                        <div>
                            <i class='material-icons'></i>
                            <p class="entry-text" data-url="${result.url}" data-order="${result.order}" data-name="${result.name}">${result.name}</p>
                            <input type="checkbox" disabled>
                        </div>
                        <div class="ADate">
                            <i class="material-icons">calendar_month</i>
                            <span>${result.availabilityDate}</span>
                        </div>
                    </div>
                </div>
            `;
            directoryGroup.appendChild(newDirectory);
        } else {
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
                newEntry.dataset.type = result.session;
                newEntry.innerHTML = `
                    <div class="dir-text-cont">
                        <div class="session-txt">
                            <i class="material-icons">arrow_drop_down</i>
                            <p class="directory-text">${result.directory} - ${result.session}</p>
                        </div>
                        <input type="checkbox" disabled>
                    </div>
                    <div class="directory-item" data-order='${result.order}' data-term='${result.term}' data-type='${result.type}' style='order: ${result.order};'>
                        <div>
                            <i class='material-icons'></i>
                            <p class="entry-text" data-url="${result.url}" data-order="${result.order}" data-name="${result.name}">${result.name}</p>
                            <input type="checkbox" disabled>
                        </div>
                        <div class="ADate">
                            <i class="material-icons">calendar_month</i>
                            <span>${result.availabilityDate}</span>
                        </div>
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
                    newDirectoryItem.dataset.order = result.order;
                    newDirectoryItem.dataset.type = result.type;
                    newDirectoryItem.style.order = result.order;
                    newDirectoryItem.dataset.term = result.term;
                    newDirectoryItem.innerHTML = `
                    <div>
                        <i class='material-icons'></i>
                        <p class="entry-text" data-url="${result.url}" data-order="${result.order}" data-name="${result.name}">${result.name}</p>
                        <input type="checkbox" disabled>
                    </div>
                    <div class="ADate">
                        <i class="material-icons">calendar_month</i>
                        <span>${result.availabilityDate}</span>
                    </div>
                    `;
                    targetEntry.appendChild(newDirectoryItem);
                } else {
                    console.log("Directory-item already exists. No action needed.");
                }
            }
        }

        updateDirectoryIcons();
    };

    fetch('../api/entries.json')
        .then(response => response.json())
        .then(data => {
            data.forEach(entry => updateEntries(entry));
        })
        .catch(error => console.error('Error loading entries:', error));

    fetch('../api/GSettings.json')
        .then(response => response.json())
        .then(data => {
            const CurrentTerm = data.CurrentTerm;
            filterEntries(CurrentTerm);
        })
        .catch(error => console.error('Error fetching Current Term:', error));

});

function filterEntries(term) {
    const termMap = {
        'fTerm': 'term1',
        'sTerm': 'term2'
    };

    const currentTerm = termMap[term];

    const directoryItems = document.querySelectorAll('.directory-item');

    directoryItems.forEach(item => {
        const itemTerm = item.getAttribute('data-term');
        if (itemTerm === currentTerm) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}