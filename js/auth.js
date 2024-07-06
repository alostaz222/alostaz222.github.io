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

signupBtn.addEventListener('click', (event) => {
    event.preventDefault();
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const password1 = document.getElementById('password1').value.trim();
    const password2 = document.getElementById('password2').value.trim();

    if (!username || !email || !phone || !password1 || !password2) {
        alert('All fields are required.');
        return;
    }

    if (!validateEmail(email)) {
        alert('Please enter a valid email address.');
        return;
    }

    if (!validatePhone(phone)) {
        alert('Please enter a valid 10-digit phone number.');
        return;
    }

    if (password1 !== password2) {
        alert('Passwords do not match.');
        return;
    }

    // Check if username is already taken
    database.ref('usernames/' + username).once('value')
        .then((snapshot) => {
            if (snapshot.exists()) {
                alert('Username is already taken. Please choose another one.');
            } else {
                const fullPhoneNumber = phoneInput.getNumber(); // Get the full phone number with the country code

                firebase.auth().createUserWithEmailAndPassword(email, password1)
                    .then((userCredential) => {
                        const user = userCredential.user;
                        const userId = user.uid;

                        // Save username to usernames list
                        database.ref('usernames/' + username).set(userId);

                        // Save user data
                        database.ref(`users/${userId}`).set({
                            username: username,
                            email: email,
                            phone: fullPhoneNumber, // Store the full phone number
                        })
                        .then(() => {
                            console.log('User data added to database');
                        })
                        .catch((error) => {
                            console.error('Database error:', error);
                        });

                    })
                    .catch((error) => {
                        console.error('Signup error:', error);
                    });
            }
        })
        .catch((error) => {
            console.error('Database error:', error);
        });
});

signInBtn.addEventListener('click', (event) => {
    event.preventDefault();
    const authenticator = document.getElementById('authenticator').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!authenticator || !password) {
        alert('All fields are required.');
        return;
    }

    // Determine if authenticator is email or username
    let signInPromise;
    if (validateEmail(authenticator)) {
        signInPromise = firebase.auth().signInWithEmailAndPassword(authenticator, password);
    } else {
        // Look up the username to get the corresponding email
        database.ref('usernames/' + authenticator).once('value')
            .then((snapshot) => {
                const userId = snapshot.val();
                if (userId) {
                    return database.ref('users/' + userId).once('value');
                } else {
                    throw new Error('Username not found.');
                }
            })
            .then((userSnapshot) => {
                const userEmail = userSnapshot.val().email;
                return firebase.auth().signInWithEmailAndPassword(userEmail, password);
            })
            .then((userCredential) => {
                console.log('User signed in:', userCredential.user);
                // Redirect to protected area, etc.
            })
            .catch((error) => {
                console.error('Signin error:', error);
            });

        return;
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