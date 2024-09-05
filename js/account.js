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
const phoneInputField = document.querySelector("#phone");
const phoneInput = window.intlTelInput(phoneInputField, {
    initialCountry: "eg",
    utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js"
});

function clearErrors() {
    document.querySelectorAll('.message').forEach(message => message.remove());
    updateCounters();
}

const email = document.getElementById('email');
const phone = document.getElementById('phone');
const currentPass = document.getElementById('oldPass');
const newPass = document.getElementById('newPass');
const confirmPass = document.getElementById('confirmPass');
const updateUserData = document.getElementById('updateUserData');

function userUpdate() {
    const user = JSON.parse(localStorage.getItem('userData'));
    if (user) {
        document.getElementById('userDetails').innerHTML = `اهلًا ${user.username}`;
        email.value = user.email;
        phone.value = user.phone;
    } else {
        document.getElementById('userDetails').innerText = '';
        document.getElementById('userDetails').innerText = 'No user is logged in.';
        email.value = '';
        phone.value = '';
    }
}

document.getElementById('useMyCoupon').addEventListener('click', generateCoupon);

function generateCoupon() {
    const user = JSON.parse(localStorage.getItem('userData'));
    const username = user.username;

    if (!username) {
        addNotification('error', 'Please enter your username', '.popupContainer');
        setTimeout(clearErrors, 3000);
        return;
    }

    const userRef = database.ref('users/' + username);

    // Check if the user already has a generated coupon
    userRef.child('G-coupon').get().then(snapshot => {
        if (snapshot.exists()) {
            addNotification('error', 'You have already generated a coupon.', '.popupContainer');
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
        addNotification('error', 'An error occurred while checking existing coupons.', '.popupContainer');
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
        addNotification('error', 'An error occurred while checking the coupon.', '.popupContainer');
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
                addNotification('success', `Coupon saved: ${coupon}`, '.popupContainer');
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
                addNotification('error', 'An error occurred while saving the coupon.', '.popupContainer');
                setTimeout(clearErrors, 3000);
            });
    }).catch(error => {
        console.error('Error saving coupon to the database:', error);
        addNotification('error', 'An error occurred while saving the coupon.', '.popupContainer');
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
            addNotification('error', 'Current and Confirmation passwords are required.', '.popupContainer');
            setTimeout(clearErrors, 3000);
            return;
        } else if (!confirmPasswordValue) {
            addNotification('error', 'Confirmation password is required.', '.popupContainer');
            setTimeout(clearErrors, 3000);
            return;
        } else if (!currentPasswordValue) {
            addNotification('error', 'Current password is required.', '.popupContainer');
            setTimeout(clearErrors, 3000);
            return;
        }

        if (newPasswordValue !== confirmPasswordValue) {
            addNotification('error', 'New password and confirmation do not match.', '.popupContainer');
            setTimeout(clearErrors, 3000);
            return;
        }

        if (newPasswordValue === currentPasswordValue) {
            addNotification('error', "New password couldn't be the current password.", '.popupContainer');
            setTimeout(clearErrors, 3000);
            return;
        }

        const user = firebase.auth().currentUser;
        const credential = firebase.auth.EmailAuthProvider.credential(user.email, currentPasswordValue);

        user.reauthenticateWithCredential(credential).then(() => {
            return user.updatePassword(newPasswordValue);
        }).then(() => {
            addNotification('success', 'Password updated successfully.', '.popupContainer');
            setTimeout(clearErrors, 3000);
        }).catch(error => {
            if (error.code === 'auth/wrong-password') {
                addNotification('error', 'The current password is incorrect.', '.popupContainer');
            } else {
                addNotification('error', error.message, '.popupContainer');
            }
            setTimeout(clearErrors, 3000);
        });
    } else if (currentPasswordValue) {
        if (!newPasswordValue && !confirmPasswordValue) {
            addNotification('error', 'New password and Confirmation are required.', '.popupContainer');
            setTimeout(clearErrors, 3000);
        } else if (!confirmPasswordValue) {
            addNotification('error', 'Confirmation password is required.', '.popupContainer');
            setTimeout(clearErrors, 3000);
        } else if (!newPasswordValue) {
            addNotification('error', 'New password is required.', '.popupContainer');
            setTimeout(clearErrors, 3000);
        }

    } else if(confirmPasswordValue) {
        if (!newPasswordValue && !currentPasswordValue) {
            addNotification('error', 'New and Current passwords are required.', '.popupContainer');
            setTimeout(clearErrors, 3000);
        } else if (!currentPasswordValue) {
            addNotification('error', 'Current password is required.', '.popupContainer');
            setTimeout(clearErrors, 3000);
        } else if (!newPasswordValue) {
            addNotification('error', 'New password is required.', '.popupContainer');
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
        addNotification('success', 'Signed Out', '.popupContainer');
        setTimeout(clearErrors, 3000);
    }).catch(error => {
        console.error('Sign out error:', error);
        addNotification('error', 'Sign out error', '.popupContainer');
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