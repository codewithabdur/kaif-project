// Imimport { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getFirestore } from 'firebase/firestore'
import { getStorage } from "firebase/storage"
import {getMessaging} from "firebase/messaging"
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyApilBhdncedg4FwN7sq8fmsivmiR4QLR4",
  authDomain: "kaif-4b397.firebaseapp.com",
  databaseURL:
    "https://kaif-4b397-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "kaif-4b397",
  storageBucket: "kaif-4b397.appspot.com",
  messagingSenderId: "418092845545",
  appId: "1:418092845545:web:c4a71837d1bc1ddac6e378",
  measurementId: "G-H01ZVLP02D",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
 const db = getFirestore(app);
 const auth = getAuth(app);
 const storage = getStorage(app);

 export const messaging = getMessaging(app);
export const analytics = getAnalytics(app);

export { db, auth, storage,  };



