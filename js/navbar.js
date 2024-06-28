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
                        <i class="material-icons" id="sideShow1">menu_open</i>
                        <i class="material-icons" id="sideShow2">keyboard_tab</i>
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

        document.addEventListener('DOMContentLoaded', () =>{

            let sideShow1 = document.getElementById('sideShow1');
            let sideShow2 = document.getElementById('sideShow2');

            sideShow1.style.display = 'none'

            let sidebar = document.getElementById('sidebar');
            let thirdContainer = document.getElementById('third-container');

            sideShow1.addEventListener( 'click', () => {
                sidebar.style.display = 'flex';
                thirdContainer.style.marginRight = '0px';
                sideShow1.style.display = 'none'
                sideShow2.style.display = 'block'
            });

            sideShow2.addEventListener( 'click', () => {
                sidebar.style.display = 'none';
                thirdContainer.style.marginRight = '12px';
                sideShow2.style.display = 'none'
                sideShow1.style.display = 'block'
            });

            if (sidebar.style.display == 'none') {
                sideShow1.style.display = 'block'
                sideShow2.style.display = 'none'
                thirdContainer.style.marginRight = '12px';
            } else if (sidebar.style.display == 'flex') {
                sideShow2.style.display = 'block'
                sideShow1.style.display = 'none'
                thirdContainer.style.marginRight = '0px';
            }
        })
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

if (window.location.pathname == '/sessions') {
    document.getElementById('stage').style.display = 'block';
    document.getElementById('showS').style.display = 'inline';
} else {
    document.getElementById('stage').style.display = 'none';
    document.getElementById('showS').style.display = 'none';
}