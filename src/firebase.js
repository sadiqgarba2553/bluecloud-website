import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDSbtIAs60AfdMoXinT2YVes2mRI0ETCFg",
  authDomain: "flappy-bird-b7e7c.firebaseapp.com",
  projectId: "flappy-bird-b7e7c",
  storageBucket: "flappy-bird-b7e7c.firebasestorage.app",
  messagingSenderId: "910946174532",
  appId: "1:910946174532:web:a769ad4f5bb05fe6fcde11"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { auth, db, googleProvider };
