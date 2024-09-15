// Ensure all elements are selected before any function uses them
const couponCode = document.getElementById('coupon');
const percentage = document.getElementById('percentage');
const WAshare = document.getElementById('whatsappShare');

// Define the userUpdate function
function userUpdate() {
    const userData = localStorage.getItem('userData');

    if (userData) {
        const parsedData = JSON.parse(userData);
        const coupon = parsedData['G-coupon'];
        const Percentage = '20%';
    
        couponCode.innerText = coupon ?? '';
        percentage.innerText = Percentage;

        // Update the WhatsApp share link with the new data
        const message = `مرحبا! استخدم كود الكوبون *${coupon}* للحصول على خصم *${Percentage}* وشارك في موقع alostaz222.com المتخصص في تعليم الفيزياء. فرصة ممتازة لتعلم الفيزياء بطريقة ممتعة وفعّالة من المنزل!`;
        const whatsappLink = `https://wa.me/?text=${encodeURIComponent(message)}`;
        WAshare.setAttribute('data-link', whatsappLink);
    } else {
        couponCode.innerText = '';
        percentage.innerText = '';
    }
}

// Add event listeners
document.addEventListener('DOMContentLoaded', () => {
    userUpdate();
});

window.addEventListener('storage', (event) => {
    if (event.key === 'userData') {
        userUpdate();
    }
});

WAshare.addEventListener('click', () => {
    if (couponCode.innerText !== '' && percentage.innerText !== '') {
        const shareLink = WAshare.getAttribute('data-link');
        window.open(shareLink, '_blank');
    } else {
        alert('برجاء تسجيل الدخول');
    }
});
