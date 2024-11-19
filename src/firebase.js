import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyAjgfp37poDFHLDmpolI8MXjWBd6Bv2In8",
    authDomain: "instagram-clone-react-a5b03.firebaseapp.com",
    databaseURL: "https://instagram-clone-react-a5b03-default-rtdb.firebaseio.com",
    projectId: "instagram-clone-react-a5b03",
    storageBucket: "instagram-clone-react-a5b03.firebasestorage.app",
    messagingSenderId: "536158497750",
    appId: "1:536158497750:web:82f5e654897f9ba3e25277"
  };

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Initialize services
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);
const storage = getStorage(firebaseApp);

export { db, auth, storage };