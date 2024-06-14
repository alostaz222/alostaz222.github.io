const head = document.head;

class SpecialHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
            <header class="header">
              <!-- <i></i> -->
              <nav>
                  <ul>
                      <li class="nav"><a href="/">الصفحة الرئيسية</a></li>
                      <li class="nav"><a href="/sessions">المحاضرات</a></li>
                      <li class="nav"><a href="/pricing">الاسعار</a></li>
                      <li class="nav"><a href="/contact">تواصل معنا</a></li>
                  </ul>
              </nav>
              <!-- <ul class="sec">
                  Account
              </ul> -->
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
        <video controls>
          <source id='videoPlayer' src="${window.VideoPlayer}">
          Your browser does not support the video tag.
        </video>
      `;
  }
}

class MetaGroup extends HTMLElement {
  connectedCallback() {
    const metaContent = `
    <link rel="shortcut icon" href="/favicon/fav-ico.ico" type="image/x-icon" />
    <link rel="icon" href="/favicon/fav-png(32).png" sizes="32x32" />
    <link rel="icon" href="/favicon/fav-png(48).png" sizes="48x48" />
    <link rel="icon" href="/favicon/fav-png(96).png" sizes="96x96" />
    <link rel="icon" href="/favicon/fav-png(144).png" sizes="144x144" />
    `;
    head.insertAdjacentHTML("beforeend", metaContent);
  }
}

let metaGroup = document.createElement("meta-group");
head.appendChild(metaGroup)

customElements.define("special-header", SpecialHeader);
customElements.define("special-footer", SpecialFooter);
customElements.define("special-video", SpecialVideo);
customElements.define("meta-group", MetaGroup);

// Fetch video list and display in the sidebar
fetch('/media/videos/others')
  .then(response => response.json())
  .then(videos => {
    const sidebar = document.getElementById('sidebar');
    videos.forEach(video => {
      const button = document.createElement('button');
      button.innerText = video;
      button.onclick = () => {
        window.VideoPlayer = `/media/videos/others/${video}`;
        document.getElementById('videoPlayer').src = window.VideoPlayer;
      };
      sidebar.appendChild(button);
    });
  })
  .catch(err => console.error('Failed to fetch videos:', err));
