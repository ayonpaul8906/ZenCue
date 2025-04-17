// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDY_9sUtjdlor8xiGy-Cf4p8sXgxQtAaiE",
    authDomain: "neuroaid-2790b.firebaseapp.com",
    projectId: "neuroaid-2790b",
    storageBucket: "neuroaid-2790b.firebasestorage.app",
    messagingSenderId: "740770372159",
    appId: "1:740770372159:web:f1b63273389d4e733b768a",
    measurementId: "G-80LZKKWQMD"
  };
  
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);

