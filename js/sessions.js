        fetch('../api/videos.json')
        .then((res) => res.json())
        .then((data) => {
            data.forEach(e => {
                AddElement(e.url, e.name);
            });
            // After all elements have been added, call the function to add event listeners
            addEventListenersToButtons();
        })
        .catch((err) => console.error('Error fetching data:', err));

        let AddElement = function(url, name){
            let sidebar = document.getElementById('sidecontainer');
            sidebar.innerHTML += `
                <button class="Vbtn" data-url="${url}" data-name="${name}">${name}</button>
            `;
        };

        let addEventListenersToButtons = function() {
            let buttons = document.getElementsByClassName('Vbtn');
            for (let button of buttons) {
                button.addEventListener('click', function() {
                    let url = this.getAttribute('data-url');
                    let name = this.getAttribute('data-name');
                    console.log(`Button clicked - URL: ${url}, Name: ${name}`);
                    // You can add more functionality here
                });
            }
        };