// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBI6J1KbV_dpKV8nWlG7kBH9KEkXe7ZGAM",
  authDomain: "worklog-c7071.firebaseapp.com",
  projectId: "worklog-c7071",
  storageBucket: "worklog-c7071.firebasestorage.app",
  messagingSenderId: "458227646638",
  appId: "1:458227646638:web:fba033b0cabda86001ed3f",
  measurementId: "G-D3W9J9J946"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);