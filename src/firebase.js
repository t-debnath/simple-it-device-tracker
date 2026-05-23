import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB0b33-54pSyhUeRqmPJvym6rrdOyKDsB8",
  authDomain: "simple-it-device-tracker.firebaseapp.com",
  projectId: "simple-it-device-tracker",
  storageBucket: "simple-it-device-tracker.firebasestorage.app",
  messagingSenderId: "585079626349",
  appId: "1:585079626349:web:fb316306821ec54e0ebd64"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);