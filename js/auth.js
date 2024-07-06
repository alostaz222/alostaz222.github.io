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

signupBtn.addEventListener('click', async (event) => {
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

    try {
        const usernameExists = await database.ref('usernames/' + username).once('value');
        if (usernameExists.exists()) {
            alert('Username is already taken. Please choose another one.');
            return;
        }

        const fullPhoneNumber = phoneInput.getNumber(); // Get the full phone number with the country code

        const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password1);
        const userId = userCredential.user.uid;

        // Save user data under 'users/${username}'
        await database.ref(`users/${username}`).set({
            email: email,
            phone: fullPhoneNumber,
            userId: userId,
        });

        // Also save username to 'usernames/${username}'
        await database.ref(`usernames/${username}`).set(userId);

        console.log('User data added to database');
    } catch (error) {
        console.error('Signup error:', error);
        alert('Signup failed. Please try again.');
    }
});


signInBtn.addEventListener('click', async (event) => {
    event.preventDefault();
    const authenticator = document.getElementById('authenticator').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!authenticator || !password) {
        alert('All fields are required.');
        return;
    }

    try {
        let signInPromise;
        if (validateEmail(authenticator)) {
            // Signing in with email
            signInPromise = firebase.auth().signInWithEmailAndPassword(authenticator, password);
        } else {
            // Signing in with username
            const username = authenticator;
            const userIdSnapshot = await database.ref('usernames/' + username).once('value');
            const userId = userIdSnapshot.val();
            
            if (!userId) {
                throw new Error('Username not found or incorrect.');
            }

            const userSnapshot = await database.ref('users/' + username).once('value');
            const userEmail = userSnapshot.val().email;

            signInPromise = firebase.auth().signInWithEmailAndPassword(userEmail, password);
        }

        const userCredential = await signInPromise;
        console.log('User signed in:', userCredential.user);
        // Redirect or handle authentication success
    } catch (error) {
        console.error('Signin error:', error.message);
        alert('Signin failed. Please check your credentials and try again.');
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