
 
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
  import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword  } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
  import { getFirestore,collection, addDoc,doc, setDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";
  
  
  const firebaseConfig = {
    apiKey: "AIzaSyAsSTcbkHHbXnnsbFv2GIfp1Q9JrN-bPmY",
    authDomain: "chat-app-772e5.firebaseapp.com",
    projectId: "chat-app-772e5",
    storageBucket: "chat-app-772e5.appspot.com",
    messagingSenderId: "594972580748",
    appId: "1:594972580748:web:e6c53f4e1009d9106994a9",
    measurementId: "G-D44KEDY6EX"
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
         swal({
          title: "Opps",
          text: e,
         
        });
           }
     })
         .catch((error) => {
       
           const errorMessage = error.message;
           swal({
            title: "Opps",
            text: error.message,
           
          });
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
    swal({
      title: "Opps",
      text: error.message,
     
    });
  });



})








































// })

  