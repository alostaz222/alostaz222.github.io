document.addEventListener('DOMContentLoaded', () => {
    // Determine the base URL based on the current location
    const isLocalhost = window.location.hostname === "localhost";
    const baseURL = isLocalhost ? "http://localhost/alostaz" : "https://alostaz222.github.io";
  
    // Helper function to update URLs
    function updateURLs() {
      const anchors = document.querySelectorAll('a');
      anchors.forEach(anchor => {
        if (anchor.getAttribute('href').startsWith('/alostaz/')) {
          anchor.href = baseURL + anchor.getAttribute('href').substring(8);
        }
      });
  
      const icons = document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"]');
      icons.forEach(icon => {
        if (icon.getAttribute('href').startsWith('/alostaz/')) {
          icon.href = baseURL + icon.getAttribute('href').substring(8);
        }
      });
    }
  
    // Update URLs after DOM content is loaded
    updateURLs();
  });
  