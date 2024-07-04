// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get references to the auth service
const auth = firebase.auth();




/////////////////////////




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
