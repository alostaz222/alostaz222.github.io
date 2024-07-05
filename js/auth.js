// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

signupBtn.addEventListener('click', (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // userCredential is available INSIDE this .then() block 

            console.log('User created:', userCredential.user);

            // Now you can safely access userCredential here:
            const user = userCredential.user;
            const userId = user.uid;

            database.ref(`users/${userId}`).set({
                email: user.email,
                // ...other user data
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
});


signInBtn.addEventListener('click', (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Successful signin
            console.log('User signed in:', userCredential.user);
            // ... (redirect to protected area, etc.)
        })
        .catch((error) => {
            console.error('Signin error:', error);
            // Handle signin errors
        });
});