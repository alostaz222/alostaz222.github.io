import { addNotification, updateCounters } from './notification.js';

document.addEventListener('DOMContentLoaded', updateCounters);

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

const signupBtn = document.getElementById('sign-up');
const signInBtn = document.getElementById('sign-in');

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

// Set the input placeholder to show the selected country code
phoneInputField.value = `+${phoneInput.getSelectedCountryData().dialCode}`;

// Update placeholder on country change
phoneInputField.addEventListener('countrychange', function () {
    phoneInputField.placeholder = phoneInput.getSelectedCountryData().dialCode;
});


function clearErrors() {
    document.querySelectorAll('.message').forEach(message => message.remove());
    updateCounters()
}

signupBtn.addEventListener('click', (event) => {
    event.preventDefault();
    clearErrors();
    let SInputs = document.getElementsByClassName('SInput');
    const username = document.getElementById('username').value.trim();
    const stage = document.getElementById('stage').value;
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const password1 = document.getElementById('password1').value.trim();
    const password2 = document.getElementById('password2').value.trim();

    let hasError = false;

    if (!username || !email || !phone || !password1 || !password2 || !stage) {
        if (!username) {
            addNotification('error', 'Username is required.', '.popupContainer');
            setTimeout(clearErrors, 3000);
        }
        if (!stage) {
            addNotification('error', 'Your stage is required.', '.popupContainer');
            setTimeout(clearErrors, 3000);
        }
        if (!email) {
            addNotification('error', 'Email is required.', '.popupContainer');
            setTimeout(clearErrors, 3000);
        }
        if (!phone) {
            addNotification('error', 'Phone is required.', '.popupContainer');
            setTimeout(clearErrors, 3000);
        }
        if (!password1) {
            addNotification('error', 'Password is required.', '.popupContainer');
            setTimeout(clearErrors, 3000);
        }
        if (!password2) {
            addNotification('error', 'Confirm Password is required.', '.popupContainer');
            setTimeout(clearErrors, 3000);
        }
        hasError = true;
    }

    if (!validateEmail(email)) {
        addNotification('error', 'Please enter a valid email address.', '.popupContainer');
        setTimeout(clearErrors, 3000);
        hasError = true;
    }

    if (!validatePhone(phone)) {
        addNotification('error', 'Please enter a valid phone number.', '.popupContainer');
        setTimeout(clearErrors, 3000);
        hasError = true;
    }

    if (password1 !== password2) {
        addNotification('error', 'Passwords do not match.', '.popupContainer');
        setTimeout(clearErrors, 3000);
        hasError = true;
    }

    if (password1.length < 6) { // Minimum password length validation
        addNotification('error', 'Password must be at least 6 characters long.', '.popupContainer');
        setTimeout(clearErrors, 3000);
        hasError = true;
    }

    if (hasError) return;

    const fullPhoneNumber = phoneInput.getNumber(); // Get the full phone number with the country code

    // Check if username already exists
    database.ref(`users/${username}`).once('value')
        .then((snapshot) => {
            if (snapshot.exists()) {
                addNotification('error', 'Username already taken. Please choose another one.', '.popupContainer');
                setTimeout(clearErrors, 3000);
            } else {
                // Create user
                firebase.auth().createUserWithEmailAndPassword(email, password1)
                    .then((userCredential) => {
                        const user = userCredential.user;

                        const userData = {
                            userId: user.uid,
                            username: username,
                            stage: stage,
                            email: email,
                            phone: fullPhoneNumber,
                            'G-coupon': null,
                            'U-coupon': null
                        };

                        database.ref(`users/${username}`).set(userData)
                            .then(() => {
                                console.log('User data added to database');
                                localStorage.setItem('userData', JSON.stringify(userData));
                                addNotification('success', 'User data added to database.', '.popupContainer');
                                setTimeout(clearErrors, 3000);
                                for (let i = 0; i < SInputs.length; i++) {
                                    SInputs[i].value = '';
                                }
                            })
                            .catch((error) => {
                                console.error('Database error:', error);
                                addNotification('error', 'Database error. Please try again.', '.popupContainer');
                                setTimeout(clearErrors, 3000);
                            });

                    })
                    .catch((error) => {
                        console.error('Signup error:', error);
                        if (error.code === 'auth/email-already-in-use') {
                            addNotification('error', 'Email is already in use. Please use a different email.', '.popupContainer');
                            setTimeout(clearErrors, 3000);
                        } else {
                            addNotification('error', 'Signup error. Please try again.', '.popupContainer');
                            setTimeout(clearErrors, 3000);
                        }
                    });
            }
        })
        .catch((error) => {
            console.error('Error checking username:', error);
            addNotification('error', 'Error checking username. Please try again.', '.popupContainer');
            setTimeout(clearErrors, 3000);
        });
});

signInBtn.addEventListener('click', (event) => {
    event.preventDefault();
    clearErrors();
    const authenticator = document.getElementById('authenticator').value.trim();
    const password = document.getElementById('password').value.trim();

    let hasError = false;

    if (!authenticator || !password) {
        if (!authenticator) {
            addNotification('error', 'Username or Email is required.', '.popupContainer');
            setTimeout(clearErrors, 3000);
        };
        if (!password) {
            addNotification('error', 'Password is required.', '.popupContainer');
            setTimeout(clearErrors, 3000);
        };
        hasError = true;
    }

    if (hasError) return;

    // Determine if authenticator is an email or username
    if (validateEmail(authenticator)) {
        firebase.auth().signInWithEmailAndPassword(authenticator, password)
            .then((userCredential) => {
                const user = userCredential.user;

                // Fetch user data from the database
                database.ref(`users/${authenticator}`).once('value')
                    .then((snapshot) => {
                        if (snapshot.exists()) {
                            const userData = snapshot.val();
                            const fullUserData = {
                                uid: user.uid,
                                email: user.email,
                                username: userData.username,
                                stage: userData.stage,
                                phone: userData.phone,
                                'G-coupon': userData['G-coupon'] ?? null,
                                'U-coupon': userData['U-coupon'] ?? null
                            };

                            // Store the full user data in localStorage
                            localStorage.setItem('userData', JSON.stringify(fullUserData));
                            addNotification('success', 'User signed in successfully.', '.popupContainer');
                            setTimeout(clearErrors, 3000);
                            // Redirect to protected area, etc.
                        } else {
                            addNotification('error', 'User data not found in database.', '.popupContainer');
                            setTimeout(clearErrors, 3000);
                        }
                    })
                    .catch((error) => {
                        console.error('Database error:', error);
                        addNotification('error', 'Database error. Please try again.', '.popupContainer');
                        setTimeout(clearErrors, 3000);
                    });
            })
            .catch((error) => {
                console.error('Signin error:', error);
                addNotification('error', 'Signin error. Please try again.', '.popupContainer');
                setTimeout(clearErrors, 3000);
            });
    } else {
        // Assume authenticator is a username
        database.ref(`users/${authenticator}`).once('value')
            .then((snapshot) => {
                if (snapshot.exists()) {
                    const userData = snapshot.val();
                    const email = userData.email;
                    firebase.auth().signInWithEmailAndPassword(email, password)
                        .then((userCredential) => {
                            const user = userCredential.user;

                            const fullUserData = {
                                uid: user.uid,
                                email: user.email,
                                username: userData.username,
                                stage: userData.stage,
                                phone: userData.phone,
                                'G-coupon': userData['G-coupon'] ?? null,
                                'U-coupon': userData['U-coupon'] ?? null
                            };

                            // Store the full user data in localStorage
                            localStorage.setItem('userData', JSON.stringify(fullUserData));
                            addNotification('success', 'User signed in successfully.', '.popupContainer');
                            setTimeout(clearErrors, 3000);
                            // Redirect to protected area, etc.
                        })
                        .catch((error) => {
                            console.error('Signin error:', error);
                            addNotification('error', 'Signin error. Please try again.', '.popupContainer');
                            setTimeout(clearErrors, 3000);
                        });
                } else {
                    addNotification('error', 'Invalid username or email.', '.popupContainer');
                    setTimeout(clearErrors, 3000);
                }
            })
            .catch((error) => {
                console.error('Error checking username:', error);
                addNotification('error', 'Error checking username. Please try again.', '.popupContainer');
                setTimeout(clearErrors, 3000);
            });
    }
});


let showSignUp = document.getElementById('showSignUp');
let showSignIn = document.getElementById('showSignIn');
let signUpForm = document.getElementById('signUpForm');
let signInForm = document.getElementById('signInForm');
let welcome = document.getElementById('welcome');
let container = document.getElementById('container');
let authContainer = document.getElementById('authContainer');
let switchToLogin = document.getElementById('switchToLogin');
let switchToSignUp = document.getElementById('switchToSignUp');

showSignUp.addEventListener('click', () => {
    signUpForm.style.display = 'flex';
    signInForm.style.display = 'none';
    welcome.style.display = 'none';
    container.style.display = 'none';
    authContainer.style.cssText = `
        background-color: transparent;
        box-shadow: none;
    `;
});

showSignIn.addEventListener('click', () => {
    signInForm.style.display = 'flex';
    signUpForm.style.display = 'none';
    welcome.style.display = 'none';
    container.style.display = 'none';
    authContainer.style.cssText = `
        background-color: transparent;
        box-shadow: none;
    `;
});

switchToLogin.addEventListener('click', () => {
    signInForm.style.display = 'flex';
    signUpForm.style.display = 'none';
});

switchToSignUp.addEventListener('click', () => {
    signUpForm.style.display = 'flex';
    signInForm.style.display = 'none';
});


document.addEventListener('DOMContentLoaded', updateCounters);

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        // Dispatch an event if you want other parts of your app to know about the change
        window.dispatchEvent(new Event('storage'));
    } else {
        // Remove the user data from localStorage when the user signs out
        localStorage.removeItem('userData');
        window.dispatchEvent(new Event('storage'));
        console.log('No user is signed in.');
    }
});