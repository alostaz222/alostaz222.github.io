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
    const re = /^[0-9]{10}$/;
    return re.test(String(phone));
}

// Initialize the intl-tel-input plugin
const phoneInputField = document.querySelector("#phone");
const phoneInput = window.intlTelInput(phoneInputField, {
    initialCountry: "us",
    utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js"
});

function clearErrors() {
    document.querySelectorAll('.error-message').forEach(span => span.textContent = '');
}

signupBtn.addEventListener('click', (event) => {
    event.preventDefault();
    clearErrors();
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const password1 = document.getElementById('password1').value.trim();
    const password2 = document.getElementById('password2').value.trim();

    let hasError = false;

    if (!username || !email || !phone || !password1 || !password2) {
        if (!username) document.getElementById('usernameError').textContent = 'Username is required.';
        if (!email) document.getElementById('emailError').textContent = 'Email is required.';
        if (!phone) document.getElementById('phoneError').textContent = 'Phone is required.';
        if (!password1) document.getElementById('password1Error').textContent = 'Password is required.';
        if (!password2) document.getElementById('password2Error').textContent = 'Confirm Password is required.';
        hasError = true;
    }

    if (!validateEmail(email)) {
        document.getElementById('emailError').textContent = 'Please enter a valid email address.';
        hasError = true;
    }

    if (!validatePhone(phone)) {
        document.getElementById('phoneError').textContent = 'Please enter a valid 10-digit phone number.';
        hasError = true;
    }

    if (password1 !== password2) {
        document.getElementById('password2Error').textContent = 'Passwords do not match.';
        hasError = true;
    }

    if (password1.length < 6) { // Minimum password length validation
        document.getElementById('password1Error').textContent = 'Password must be at least 6 characters long.';
        hasError = true;
    }

    if (hasError) return;

    const fullPhoneNumber = phoneInput.getNumber(); // Get the full phone number with the country code

    // Check if username already exists
    database.ref(`users/${username}`).once('value')
        .then((snapshot) => {
            if (snapshot.exists()) {
                document.getElementById('usernameError').textContent = 'Username already taken. Please choose another one.';
            } else {
                // Create user
                firebase.auth().createUserWithEmailAndPassword(email, password1)
                    .then((userCredential) => {
                        const user = userCredential.user;

                        database.ref(`users/${username}`).set({
                            userId: user.uid,
                            username: username,
                            email: email,
                            phone: fullPhoneNumber, // Store the full phone number
                        })
                            .then(() => {
                                console.log('User data added to database');
                            })
                            .catch((error) => {
                                console.error('Database error:', error);
                                document.getElementById('usernameError').textContent = 'Database error. Please try again.';
                            });

                    })
                    .catch((error) => {
                        console.error('Signup error:', error);
                        if (error.code === 'auth/email-already-in-use') {
                            document.getElementById('emailError').textContent = 'Email is already in use. Please use a different email.';
                        } else {
                            document.getElementById('emailError').textContent = 'Signup error. Please try again.';
                        }
                    });
            }
        })
        .catch((error) => {
            console.error('Error checking username:', error);
            document.getElementById('usernameError').textContent = 'Error checking username. Please try again.';
        });
});

signInBtn.addEventListener('click', (event) => {
    event.preventDefault();
    clearErrors();
    const authenticator = document.getElementById('authenticator').value.trim();
    const password = document.getElementById('password').value.trim();

    let hasError = false;

    if (!authenticator || !password) {
        if (!authenticator) document.getElementById('authenticatorError').textContent = 'Username or Email is required.';
        if (!password) document.getElementById('passwordError').textContent = 'Password is required.';
        hasError = true;
    }

    if (hasError) return;

    // Determine if authenticator is an email or username
    if (validateEmail(authenticator)) {
        firebase.auth().signInWithEmailAndPassword(authenticator, password)
            .then((userCredential) => {
                console.log('User signed in:', userCredential.user);
                // Redirect to protected area, etc.
            })
            .catch((error) => {
                console.error('Signin error:', error);
                document.getElementById('authenticatorError').textContent = 'Signin error. Please try again.';
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
                            console.log('User signed in:', userCredential.user);
                            // Redirect to protected area, etc.
                        })
                        .catch((error) => {
                            console.error('Signin error:', error);
                            document.getElementById('authenticatorError').textContent = 'Signin error. Please try again.';
                        });
                } else {
                    document.getElementById('authenticatorError').textContent = 'Invalid username or email.';
                }
            })
            .catch((error) => {
                console.error('Error checking username:', error);
                document.getElementById('authenticatorError').textContent = 'Error checking username. Please try again.';
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
    signInForm.style.display = 'none';
    signUpForm.style.display = 'flex';
});
