import { initializeApp} from "firebase/app";
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
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

let analytics: Analytics | null = null;
let auth: Auth;
let db: Firestore;
const app = initializeApp(firebaseConfig);

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

export { analytics, auth, db, app };