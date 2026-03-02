import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCRvJpHlUcOLv6_K-JMkanKoIHWhrFESD0",
  authDomain: "medsedan-24dbf.firebaseapp.com",
  databaseURL: "https://medsedan-24dbf-default-rtdb.firebaseio.com",
  projectId: "medsedan-24dbf",
  storageBucket: "medsedan-24dbf.firebasestorage.appspot.com",
  messagingSenderId: "277004126129",
  appId: "1:277004126129:web:0b5138dbc57cd1560b1f90",
  measurementId: "G-82HPBR6WE9"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const realtimeDB = getDatabase(app);
