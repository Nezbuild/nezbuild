// Import the functions you need from the Firebase SDK
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Import getAuth for authentication
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAR9B1e8M3yzKrtM0TcehBSC8olsHO0kCA",
  authDomain: "test-6f1f7.firebaseapp.com",
  projectId: "test-6f1f7",
  storageBucket: "test-6f1f7.firebasestorage.app",
  messagingSenderId: "428828899483",
  appId: "1:428828899483:web:59444f934bebd6ce02ee3e",
  measurementId: "G-DKWS46PJCT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Authentication and export it
export const auth = getAuth(app); // Use this in your SignUp, SignIn, etc.
export default app;