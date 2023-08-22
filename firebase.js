import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getFirestore  } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-auth.js";


const firebaseConfig = {
  apiKey: "AIzaSyDCwC0HNkUxF09xaRoxziq0n2udJof6eMM",
    authDomain: "chatapp-bb813.firebaseapp.com",
    projectId: "chatapp-bb813",
    storageBucket: "chatapp-bb813.appspot.com",
    messagingSenderId: "568354336528",
    appId: "1:568354336528:web:12599e7a262a8555e9ff95",
    measurementId: "G-51Z7T1JZ5J"
  };
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const auth = getAuth(app);

export {app,db,firebaseConfig,auth}