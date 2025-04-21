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
    apiKey: "AIzaSyAbu8BtPG8cJo61NUmY0iBzxY_UBq_0gsU",
    authDomain: "zencue-e92d0.firebaseapp.com",
    projectId: "zencue-e92d0",
    storageBucket: "zencue-e92d0.firebasestorage.app",
    messagingSenderId: "499355593595",
    appId: "1:499355593595:web:eee29e58eb36e182d9abde"
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