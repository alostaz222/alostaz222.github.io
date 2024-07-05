const firebaseConfig = {
    apiKey: "AIzaSyDAuL-p-lh-QYwEyj1VTFyCCUusOhR5yDk",
    authDomain: "alostaz222-76ef2.firebaseapp.com",
    projectId: "alostaz222-76ef2",
    storageBucket: "alostaz222-76ef2.appspot.com",
    messagingSenderId: "630534237831",
    appId: "1:630534237831:web:c8fb78ad08b069da069222",
    // measurementId: "G-SL0XCW8E4L"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get references to the auth service
const auth = firebase.auth();

// Sign up function
function signup() {
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;

    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed up successfully
            console.log("Signed up successfully:", userCredential.user);
        })
        .catch((error) => {
            // Handle errors
            console.error("Error signing up:", error.message);
        });
}

// Login function
function login() {
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Logged in successfully
            console.log("Logged in successfully:", userCredential.user);
        })
        .catch((error) => {
            // Handle errors
            console.error("Error logging in:", error.message);
        });
}

// Logout function
function logout() {
    auth.signOut()
        .then(() => {
            // Logged out successfully
            console.log("Logged out successfully");
        })
        .catch((error) => {
            // Handle errors
            console.error("Error logging out:", error.message);
        });
}

// Auth state listener
auth.onAuthStateChanged((user) => {
    if (user) {
        // User is signed in
        document.getElementById("login-form").style.display = "none";
        document.getElementById("signup-form").style.display = "none";
        document.getElementById("logout-form").style.display = "block";
    } else {
        // User is signed out
        document.getElementById("login-form").style.display = "block";
        document.getElementById("signup-form").style.display = "block";
        document.getElementById("logout-form").style.display = "none";
    }
});




    // // Import the functions you need from the SDKs you need
    // import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
    // import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-analytics.js";
    // // TODO: Add SDKs for Firebase products that you want to use
    // // https://firebase.google.com/docs/web/setup#available-libraries

    // // Your web app's Firebase configuration
    // // For Firebase JS SDK v7.20.0 and later, measurementId is optional

    // // Initialize Firebase
    // const app = initializeApp(firebaseConfig);
    // const analytics = getAnalytics(app);