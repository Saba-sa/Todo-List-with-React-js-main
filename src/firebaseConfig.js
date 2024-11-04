import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyAboDN-y_VOW8nQ2p6jRd9-_IYrxXnW19c",
  authDomain: "todolist-6dd90.firebaseapp.com",
  projectId: "todolist-6dd90",
  storageBucket: "todolist-6dd90.firebasestorage.app",
  messagingSenderId: "953810176657",
  appId: "1:953810176657:web:48e349e4f2643701d7cd30"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

const logOut = () => signOut(auth);

export { auth, db, storage, googleProvider, logOut };
