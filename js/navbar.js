const head = document.head;

class SpecialHeader extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <header class="header">
                <nav>
                    <ul>
                        <li class="nav"><a href="/">الصفحة الرئيسية</a></li>
                        <li class="nav"><a href="/sessions">المحاضرات</a></li>
                        <li class="nav">
                            <select id="stage">
                                <option disabled selected>--اختر الصف الدراسي--</option>
                                <optgroup label="المرحلة الابتدائية">
                                    <option value="4pm">الصف الرابع الابتدائي</option>
                                    <option value="5pm">الصف الخامس الابتدائي</option>
                                    <option value="6pm">الصف السادس الابتدائي</option>
                                </optgroup>
                                <optgroup label="المرحلة الاعدادية">
                                    <option value="1pp">الصف الاول الاعدادي</option>
                                    <option value="2pp">الصف الثاني الاعدادي</option>
                                    <option value="3pp">الصف الثالث الاعدادي</option>
                                </optgroup>
                                <optgroup label="المرحلة الثانوية">
                                    <option value="1s">الصف الاول الثانوي</option>
                                    <option value="2s">الصف الثاني الثانوي</option>
                                    <option value="3s">الصف الثالث الثانوي</option>
                                </optgroup>
                            </select>
                        </li>
                        <li class="nav"><a href="/pricing">الاسعار</a></li>
                        <li class="nav"><a href="/contact">تواصل معنا</a></li>
                    </ul>
                </nav>
                <ul class="sec">
                    <li class="showS" id="showS">
                        <i class="material-icons" id="sideOpen">menu_open</i>
                        <i class="material-icons hide" id="sideClose">keyboard_tab</i>
                    </li>
                </ul>
            </header>
        `;

        const listItems = this.querySelectorAll('.nav a');
        listItems.forEach(function(item) {
            if (item.href === window.location.href) {
                item.parentElement.classList.add('active');
            }
        });


        document.addEventListener('DOMContentLoaded', function() {
            let sideOpen = document.getElementById('sideOpen');
            let sideClose = document.getElementById('sideClose');
            let sidebar = document.getElementById('sidebar');
            let thirdContainer = document.getElementById('third-container'); // Assuming this is your third-container element
        
            sideOpen.addEventListener('click', function() {
                sidebar.style.display = 'flex'; // Show sidebar when sideOpen is clicked
                sideOpen.classList.add('hide'); // Hide sideOpen icon
                sideClose.classList.remove('hide'); // Show sideClose icon
                thirdContainer.style.marginRight = ''; // Reset margin right
            });
        
            sideClose.addEventListener('click', function() {
                sidebar.style.display = 'none'; // Hide sidebar when sideClose is clicked
                sideOpen.classList.remove('hide'); // Show sideOpen icon
                sideClose.classList.add('hide'); // Hide sideClose icon
                thirdContainer.style.marginRight = '12px'; // Adjust margin right as needed
            });
        });
    }
}

class SpecialFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <footer>
                <p>Copyright @ <a href='mailto:alostaz222@yahoo.com'>alostaz222@yahoo.com</a></p>
            </footer>
        `;
    }
}

class SpecialVideo extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <video id='videoPlayer' controls>
                <source src="">
                Your browser does not support the video tag.
            </video>
        `;
    }
}

customElements.define("special-header", SpecialHeader);
customElements.define("special-footer", SpecialFooter);
customElements.define("special-video", SpecialVideo);

document.addEventListener('DOMContentLoaded', function() {
    let sideOpen = document.getElementById('sideOpen');
    let sidebar = document.getElementById('sidebar');
    let thirdContainer = document.getElementById('third-container'); 
    if (sideOpen.style.display !== 'none') {
        sidebar.style.display = 'none';
        thirdContainer.style.marginRight = '12px'; 
    } else {
        sidebar.style.display = 'flex';
    }

    if (window.location.pathname == '/sessions') {
        document.getElementById('stage').style.display = 'block';
        document.getElementById('showS').style.display = 'inline';
    } else {
        document.getElementById('stage').style.display = 'none';
        document.getElementById('showS').style.display = 'none';
    }
});