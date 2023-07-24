
 
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
  import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword  } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
  import { getFirestore,collection, addDoc,doc, setDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";
  
  
  const firebaseConfig = {
    apiKey: "AIzaSyCD03uh2aQWGYB1IsZh1o7zjV0DxLrCSMw",
    authDomain: "login-signup-9fca4.firebaseapp.com",
    projectId: "login-signup-9fca4",
    storageBucket: "login-signup-9fca4.appspot.com",
    messagingSenderId: "485276283878",
    appId: "1:485276283878:web:8ae6c7c7de45b8cfda9c27"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);





   let signupBtn = document.getElementById("signUp");
  signupBtn &&  signupBtn.addEventListener ("click", async(e)=>{
   let  email = document.getElementById("user-email")
   let  password = document.getElementById("password")
   let  phone = document.getElementById("user-number")
  let  user = document.getElementById("user-name")


   let userData ={
   user:user.value,
  phone: phone.value,
   email :  email.value ,
  password:password.value,
   }

createUserWithEmailAndPassword(auth, userData.email, userData.password)
  .then( async(userCredential) => {
    // Signed in 
    const user = userCredential.user;

    try {
         await setDoc(doc(db, "users", user.uid), {
        ...userData,
        uid:user.uid
           
          
         });
    
         localStorage.setItem("userId",user.uid ,)
         location.href="index.html"
         // console.log("Document written with ID: ", docRef.id);
         console.log("added")
       } catch (e) {
         console.error("Error adding document: ", e);
           }
     })
         .catch((error) => {
       
           const errorMessage = error.message;
         console.log("errorMessage",errorMessage );
         })

        })



 let loginBtn = document.getElementById("loginBtn")
  loginBtn.addEventListener("click", ()=>{
   let  email = document.getElementById("user-email")
   let  password = document.getElementById("password")

   
signInWithEmailAndPassword(auth, email.value, password.value)
  .then((userCredential) => {
  
    const user = userCredential.user;
  try {
console.log("welcome to my website")
  localStorage.setItem("uid", user.uid)
   location.href = "profile.html"
} catch (err) {   console.log(err)
}
  })
  .catch((error) => {

    console.log("error.message",error.message)
  });



})








































// })

  