import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { 
    getFirestore, 
    initializeFirestore,
    CACHE_SIZE_UNLIMITED,
    enableIndexedDbPersistence 
} from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY", // 🔑 Public API key (safe to expose on frontend)
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com", // 🌐 Auth domain
  projectId: "YOUR_PROJECT_ID", // 🏗️ Project ID
  storageBucket: "YOUR_PROJECT_ID.appspot.com", // 🗂️ Storage
  messagingSenderId: "YOUR_SENDER_ID", // 📩 Messaging sender ID
  appId: "YOUR_APP_ID" // 📱 App ID
};
  
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Auth with persistence
const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence)
    .catch((error) => {
        console.error("Auth persistence error:", error);
    });

// Initialize Firestore with persistence
const db = getFirestore(app);
enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
        console.log('Persistence failed: Multiple tabs open');
    } else if (err.code === 'unimplemented') {
        console.log('Persistence not supported by browser');
    }
});

export { auth, db };