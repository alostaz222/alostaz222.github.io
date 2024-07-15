const head = document.head;

class SpecialHeader extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <header class="header" id="header">
                <nav>
                    <ul class="headerShow">
                        <li><i class="material-icons" id='showMenu'>menu</i></li>
                        <li><i class="material-icons" id='hideMenu'>close</i></li>
                    </ul>
                    <ul class="mainHeader" id="mainHeader">
                        <div class="headerShow">
                            <li><i class="material-icons" id='hideMenuInner'>close</i></li>
                        </div>
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
                        <ul>
                            <div class='account'>
                                <li>
                                    <div class='account_dropDown'>
                                        <p>حسابك</p>
                                        <i class='material-icons acc_arr' id='acc_arr_u'>keyboard_arrow_up</i>
                                        <i class='material-icons acc_arr' id='acc_arr_d'>keyboard_arrow_down</i>
                                    </div>
                                </li>
                                <li class='acc_opt'><p>تسجيل الدخول</p><i class='material-icons'>login</i></li>
                                <li class='acc_opt'><p>انشاء حساب</p><i class='material-icons'>person_add</i></li>
                                <li class='acc_opt'><p>تعديل الحساب</p><i class='material-icons'>account_circle</i></li>
                            </div>
                        </ul>
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
        listItems.forEach(function (item) {
            if (item.href === window.location.href) {
                item.parentElement.classList.add('active');
            }
        });

        document.addEventListener('DOMContentLoaded', () => {
            let sideShow1 = document.getElementById('sideShow1');
            let sideShow2 = document.getElementById('sideShow2');
            let sidebar = document.getElementById('sidebar');
            let thirdContainer = document.getElementById('third-container');
            let showMenu = document.getElementById('showMenu');
            let hideMenu = document.getElementById('hideMenu');
            let hideMenuInner = document.getElementById('hideMenuInner');
            let menu = document.getElementById('mainHeader');
            // let header = document.getElementById('header');

            sideShow1.addEventListener('click', () => {
                sidebar.style.display = 'flex';
                thirdContainer.style.marginRight = '0px';
                sideShow1.style.display = 'none';
                sideShow2.style.display = 'block';
            });

            sideShow2.addEventListener('click', () => {
                sidebar.style.display = 'none';
                thirdContainer.style.marginRight = '12px';
                sideShow2.style.display = 'none';
                sideShow1.style.display = 'block';
            });

            // Check if sidebar is visible initially for smaller screens
            if (window.location.pathname == '/sessions' || window.location.pathname == '/sessions.html') {
                if (window.matchMedia('(max-width: 767px)').matches) {
                    sidebar.style.display = 'none';
                    sideShow1.style.display = 'block';
                    sideShow2.style.display = 'none';
                    thirdContainer.style.marginRight = '12px';
                } else {
                    // Default behavior for larger screens
                    sidebar.style.display = 'flex';
                    sideShow1.style.display = 'none';
                    sideShow2.style.display = 'block';
                    thirdContainer.style.marginRight = '0px';
                }
            }

            // Show/hide menu
            hideMenu.style.display = "none";
            hideMenu.style.display = 'none';

            showMenu.addEventListener('click', () => {
                menu.style.display = 'flex';
                showMenu.style.display = 'none';
                hideMenu.style.display = 'block';
                hideMenuInner.style.display = 'block';
            });

            hideMenu.addEventListener('click', () => {
                menu.style.display = 'none';
                hideMenu.style.display = 'none';
                hideMenu.style.display = 'none';
                showMenu.style.display = 'block';
            });

            hideMenuInner.addEventListener('click', () => {
                menu.style.display = 'none';
                hideMenu.style.display = 'none';
                hideMenu.style.display = 'none';
                showMenu.style.display = 'block';
            });

            // Check initial state of mainHeader to sync with show/hide menu buttons
            if (menu.style.display === 'none') {
                showMenu.style.display = 'block';
                hideMenu.style.display = 'none';
                hideMenuInner.style.display = 'none';
            } else if (menu.style.display === 'flex') {
                showMenu.style.display = 'none';
                hideMenu.style.display = 'block';
                hideMenuInner.style.display = 'block';
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

if (window.location.pathname == '/sessions' || window.location.pathname == '/sessions.html') {
    document.getElementById('stage').style.display = 'block';
    document.getElementById('showS').style.display = 'inline';
} else {
    document.getElementById('stage').style.display = 'none';
    document.getElementById('showS').style.display = 'none';
}