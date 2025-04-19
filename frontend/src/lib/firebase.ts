import { initializeApp, FirebaseOptions } from "firebase/app";
import { Analytics, getAnalytics, isSupported } from "firebase/analytics";
import { getAuth, setPersistence, browserLocalPersistence, Auth } from "firebase/auth";
import { 
    getFirestore, 
    Firestore,
    enableIndexedDbPersistence 
} from "firebase/firestore";
 
// Load Firebase config from environment variables
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MSG_SENDER_ID",
  appId: "YOUR_APP_ID",
};

let analytics: Analytics | null = null;
let auth: Auth;
let db: Firestore;

try {
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  // Initialize Analytics conditionally
  isSupported().then(yes => yes && (analytics = getAnalytics(app)))
    .catch(err => console.error('Analytics error:', err));

  // Initialize Auth with persistence
  auth = getAuth(app);
  setPersistence(auth, browserLocalPersistence)
    .catch((error) => {
      console.error("Auth persistence error:", error.message);
    });

  // Initialize Firestore with persistence
  db = getFirestore(app);
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Firestore persistence failed: Multiple tabs open');
    } else if (err.code === 'unimplemented') {
      console.warn('Firestore persistence not supported by browser');
    } else {
      console.error('Firestore persistence error:', err);
    }
  });

} catch (error) {
  console.error('Firebase initialization error:', error);
  throw error;
}

export { analytics, auth, db };