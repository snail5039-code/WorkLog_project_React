// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB3PuOyVGNeTCHezwSLzpu6lEZGz6w1aQ4",
  authDomain: "worklogproject-be971.firebaseapp.com",
  projectId: "worklogproject-be971",
  storageBucket: "worklogproject-be971.firebasestorage.app",
  messagingSenderId: "744764931576",
  appId: "1:744764931576:web:4085b0213c30780c90ea0d",
  measurementId: "G-KTYYSSFEG5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);