import { addNotification, updateCounters } from "./notification.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAulOUDi39BQc6DvYulOKqHymlLHjv8Bmo",
    authDomain: "alostaz222-9a139.firebaseapp.com",
    databaseURL: "https://alostaz222-9a139-default-rtdb.firebaseio.com",
    projectId: "alostaz222-9a139",
    storageBucket: "alostaz222-9a139.appspot.com",
    messagingSenderId: "226577240230",
    appId: "1:226577240230:web:dfd5f82810e32fc36a2467",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();

/////////////////////////////////////////////////////

function validateEmail(email) {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
}

function validatePhone(phone) {
    const re = /^\+?[1-9]\d{1,14}$/;
    return re.test(String(phone));
}

// Initialize the intl-tel-input plugin
const phoneInputField = document.querySelector("#sphone");
const phoneInput = window.intlTelInput(phoneInputField, {
    initialCountry: "eg",
    utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js"
});

const phoneInputField2 = document.querySelector("#fphone");
const phoneInput2 = window.intlTelInput(phoneInputField2, {
    initialCountry: "eg",
    utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js"
});

function clearErrors() {
    document.querySelectorAll('.message').forEach(message => message.remove());
    updateCounters();
}

const email = document.getElementById('email');
const student_phone = document.getElementById('sphone');
const father_phone = document.getElementById('fphone');
const currentPass = document.getElementById('oldPass');
const newPass = document.getElementById('newPass');
const confirmPass = document.getElementById('confirmPass');
const updateUserData = document.getElementById('updateUserData');

function userUpdate() {
    const user = JSON.parse(localStorage.getItem('userData'));
    if (user) {
        document.getElementById('userDetails').innerHTML = `اهلًا ${user.username}`;
        email.value = user.email;
        student_phone.value = user.student_phone;
        father_phone.value = user.father_phone;

    } else {
        document.getElementById('userDetails').innerText = '';
        document.getElementById('userDetails').innerText = 'لا يوجد مستخدم مسجل.';
        email.value = '';
        student_phone.value = '';
        father_phone.value = '';
    }
}

document.getElementById('useMyCoupon').addEventListener('click', generateCoupon);

function generateCoupon() {
    const user = JSON.parse(localStorage.getItem('userData'));
    const username = user.username;

    if (!username) {
        addNotification('error', 'برجاء تسجيل الدخول.', '.popupContainer');
        setTimeout(clearErrors, 3000);
        return;
    }

    const userRef = database.ref('users/' + username);

    // Check if the user already has a generated coupon
    userRef.child('G-coupon').get().then(snapshot => {
        if (snapshot.exists()) {
            addNotification('error', 'لقد قمت بالفعل بإنشاء كوبون.', '.popupContainer');
            setTimeout(clearErrors, 3000);
        } else {
            // Clean up the username and generate a random number
            const cleanedUsername = username.replace(/[^a-zA-Z]/g, '').substring(0, 7).toUpperCase();
            const randomNum = Math.floor(Math.random() * 10000);
            const coupon = `${cleanedUsername}${randomNum}`;

            // Check if the coupon is already in Firebase
            checkAndSaveCoupon(coupon);
        }
    }).catch(error => {
        console.error('Error checking user coupons:', error);
        addNotification('error', 'حدث خطأ أثناء التحقق من الكوبونات الموجودة.', '.popupContainer');
        setTimeout(clearErrors, 3000);
    });
}

function checkAndSaveCoupon(coupon) {
    const user = JSON.parse(localStorage.getItem('userData'));
    const couponRef = database.ref('coupons/' + coupon);
    const username = user.username;

    couponRef.get().then(snapshot => {
        if (snapshot.exists()) {
            // Coupon already exists, regenerate a new one
            generateCoupon();
        } else {
            // Save the coupon to Firebase
            saveCouponToDatabase(coupon, username);
        }
    }).catch(error => {
        console.error('Error checking coupon in database:', error);
        addNotification('error', 'حدث خطأ أثناء التحقق من الكوبون.', '.popupContainer');
        setTimeout(clearErrors, 3000);
    });
}

function saveCouponToDatabase(coupon, username) {
    const userRef = database.ref('users/' + username);
    const couponRef = database.ref('coupons/' + coupon);

    couponRef.set({
        generatedBy: username,
        usedBy: []  // Initialize an empty array
    }).then(() => {
        // Save coupon to user's G-coupon
        userRef.child('G-coupon').set(coupon)
            .then(() => {
                addNotification('success', `تم حفظ الكوبون: ${coupon}`, '.popupContainer');
                setTimeout(clearErrors, 3000);

                // Store the coupon in localStorage
                const userData = JSON.parse(localStorage.getItem('userData'));
                userData['G-coupon'] = coupon;
                localStorage.setItem('userData', JSON.stringify(userData));

                // Redirect after 3 seconds
                setTimeout(() => {
                    window.location.href = '/coupon';
                }, 3000);
            })
            .catch(error => {
                console.error('Error saving coupon to user data:', error);
                addNotification('error', 'حدث خطأ اثناء حفظ الكوبون.', '.popupContainer');
                setTimeout(clearErrors, 3000);
            });
    }).catch(error => {
        console.error('Error saving coupon to the database:', error);
        addNotification('error', 'حدث خطأ اثناء حفظ الكوبون.', '.popupContainer');
        setTimeout(clearErrors, 3000);
    });
}

// Update user details and password on form submission
updateUserData.addEventListener('click', (event) => {
    event.preventDefault();
    const currentPasswordValue = currentPass.value;
    const newPasswordValue = newPass.value;
    const confirmPasswordValue = confirmPass.value;

    if (newPasswordValue) {
        if (!currentPasswordValue && !confirmPasswordValue) {
            addNotification('error', 'كلمة المرور الحالية وتأكيدها كلاهما مطلوب.', '.popupContainer');
            setTimeout(clearErrors, 3000);
            return;
        } else if (!confirmPasswordValue) {
            addNotification('error', 'تأكيد كلمة المرور مطلوب.', '.popupContainer');
            setTimeout(clearErrors, 3000);
            return;
        } else if (!currentPasswordValue) {
            addNotification('error', 'كلمة المرور الحالية مطلوبة.', '.popupContainer');
            setTimeout(clearErrors, 3000);
            return;
        }

        if (newPasswordValue !== confirmPasswordValue) {
            addNotification('error', 'كلمة المرور الجديدة وتأكيدها ليسا متتطابقتان.', '.popupContainer');
            setTimeout(clearErrors, 3000);
            return;
        }

        if (newPasswordValue === currentPasswordValue) {
            addNotification('error', "لا يمكن أن تكون كلمة المرور الجديدة هي كلمة المرور الحالية.", '.popupContainer');
            setTimeout(clearErrors, 3000);
            return;
        }

        const user = firebase.auth().currentUser;
        const credential = firebase.auth.EmailAuthProvider.credential(user.email, currentPasswordValue);

        user.reauthenticateWithCredential(credential).then(() => {
            return user.updatePassword(newPasswordValue);
        }).then(() => {
            addNotification('success', 'تم تحديث كلمة المرور بنجاح.', '.popupContainer');
            setTimeout(clearErrors, 3000);
        }).catch(error => {
            if (error.code === 'auth/wrong-password') {
                addNotification('error', 'كلمة المرور الحالية غير صحيحة.', '.popupContainer');
            } else {
                addNotification('error', error.message, '.popupContainer');
            }
            setTimeout(clearErrors, 3000);
        });
    } else if (currentPasswordValue) {
        if (!newPasswordValue && !confirmPasswordValue) {
            addNotification('error', 'كلمة المرور الجديدة وتأكيدها كلاهما مطلوب.', '.popupContainer');
            setTimeout(clearErrors, 3000);
        } else if (!confirmPasswordValue) {
            addNotification('error', 'تأكيد كلمة المرور مطلوب.', '.popupContainer');
            setTimeout(clearErrors, 3000);
        } else if (!newPasswordValue) {
            addNotification('error', 'كلمة المرور الجديدة مطلوبة.', '.popupContainer');
            setTimeout(clearErrors, 3000);
        }

    } else if(confirmPasswordValue) {
        if (!newPasswordValue && !currentPasswordValue) {
            addNotification('error', 'كلمة المرور الجديدة والحالية كلاهما مطلوب.', '.popupContainer');
            setTimeout(clearErrors, 3000);
        } else if (!currentPasswordValue) {
            addNotification('error', 'كلمة المرور الحالية مطلوبة.', '.popupContainer');
            setTimeout(clearErrors, 3000);
        } else if (!newPasswordValue) {
            addNotification('error', 'كلمة المرور الجديدة مطلوبة.', '.popupContainer');
            setTimeout(clearErrors, 3000);
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {
    userUpdate();
    window.addEventListener('storage', () => {
        userUpdate();
    });
});

document.querySelector('.signOut').addEventListener('click', () => {
    firebase.auth().signOut().then(() => {
        localStorage.removeItem('userData');
        userUpdate();
        addNotification('success', 'تم تسجيل الخروج', '.popupContainer');
        setTimeout(clearErrors, 3000);
        setTimeout(window.location.href = 'auth', 10000)
    }).catch(error => {
        console.error('Sign out error:', error);
        addNotification('error', 'حدث خطأ أثناء تسجيل الخروج', '.popupContainer');
        setTimeout(clearErrors, 3000);
    });
});

firebase.auth().onAuthStateChanged(user => {
    if (user) {
        // Dispatch an event if you want other parts of your app to know about the change
        window.dispatchEvent(new Event('storage'));
    } else {
        // Remove the user data from localStorage when the user signs out
        localStorage.removeItem('userData');
        window.dispatchEvent(new Event('storage'));
    }
});