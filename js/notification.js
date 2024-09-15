function updateCounters() {
    const errorCount = document.querySelectorAll('.message.error').length;
    const infoCount = document.querySelectorAll('.message.info').length;
    const successCount = document.querySelectorAll('.message.success').length;
    const warningCount = document.querySelectorAll('.message.warning').length;

    // Update counters
    document.getElementById('errorCounter').querySelector('span').textContent = errorCount;
    document.getElementById('infoCounter').querySelector('span').textContent = infoCount;
    document.getElementById('successCounter').querySelector('span').textContent = successCount;
    document.getElementById('warningCounter').querySelector('span').textContent = warningCount;

    // Show or hide counters based on message count
    const counters = document.querySelector('.counters');
    if (errorCount + infoCount + successCount + warningCount === 0) {
        counters.style.display = 'none';
    } else {
        counters.style.display = 'flex';
    }
}

document.addEventListener('DOMContentLoaded', updateCounters);

document.addEventListener('click', function (event) {
    if (event.target.classList.contains('close-icon')) {
        event.target.parentNode.remove();
        updateCounters();
    }
});

function addNotification(type, text, location_to_add) {
    const container = document.querySelector(location_to_add);

    // Create elements for the notification
    const message = document.createElement('div');
    message.classList.add('message', type);

    const icon = document.createElement('i');
    icon.classList.add('material-icons');

    const textContainer = document.createElement('div');
    textContainer.classList.add('textContainer');

    const title = document.createElement('h4');

    const messageText = document.createElement('p');
    messageText.textContent = text;

    switch (type) {
        case 'error':
            icon.textContent = 'error';
            title.textContent = 'خطأ';
            break;
        case 'info':
            icon.textContent = 'info';
            title.textContent = 'معلومة';
            break;
        case 'success':
            icon.textContent = 'check_circle';
            title.textContent = 'نجاح';
            break;
        case 'warning':
            icon.textContent = 'warning';
            title.textContent = 'تحذير';
            break;
        default:
            icon.textContent = 'info';
            title.textContent = 'معلومة';
    }

    const closeIcon = document.createElement('i');
    closeIcon.classList.add('material-icons', 'close-icon');
    closeIcon.textContent = 'close';
    closeIcon.addEventListener('click', function () {
        message.remove();
        updateCounters();
    });

    // Construct the message structure
    textContainer.appendChild(title);
    textContainer.appendChild(messageText);
    message.appendChild(icon);
    message.appendChild(textContainer);
    message.appendChild(closeIcon);

    // Append the message to the specified location
    container.appendChild(message);

    // Update counters
    updateCounters();
}

document.addEventListener('DOMContentLoaded', updateCounters);


// addNotification('error', 'This is an error message.', '.popupContainer');
// addNotification('info', 'This is an info message.', '.popupContainer');
// addNotification('success', 'This is a success message.', '.popupContainer');
// addNotification('warning', 'This is a warning message.', '.popupContainer');


export { addNotification, updateCounters };