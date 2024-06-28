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
                        <i class="material-icons">menu_open</i>
                        <i class="material-icons hide">keyboard_tab</i>
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

// if (window.location.pathname == '/sessions') {
//     document.getElementById('stage').style.display = 'block';
//     document.getElementById('showS').style.display = 'inline';
// } else {
//     document.getElementById('stage').style.display = 'none';
//     document.getElementById('showS').style.display = 'none';
// }