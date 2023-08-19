import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getFirestore  } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-auth.js";


const firebaseConfig = {
    apiKey: "AIzaSyAsSTcbkHHbXnnsbFv2GIfp1Q9JrN-bPmY",
    authDomain: "chat-app-772e5.firebaseapp.com",
    projectId: "chat-app-772e5",
    storageBucket: "chat-app-772e5.appspot.com",
    messagingSenderId: "594972580748",
    appId: "1:594972580748:web:e6c53f4e1009d9106994a9",
    measurementId: "G-D44KEDY6EX"
  };
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const auth = getAuth(app);

export {app,db,firebaseConfig,auth}