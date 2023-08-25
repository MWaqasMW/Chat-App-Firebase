import {  createUserWithEmailAndPassword, signInWithEmailAndPassword,onAuthStateChanged,signOut } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import {  doc, setDoc, getDoc, updateDoc,  } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";
import { getStorage, ref,uploadBytesResumable,getDownloadURL, } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-storage.js";
import {db,auth} from './firebase.js'

// import {createUserWithEmailAndPassword, signInWithEmailAndPassword,onAuthStateChanged,signOut,doc, setDoc, getDoc, updateDoc,  getStorage, ref,uploadBytesResumable,getDownloadURL, db,auth } from './firebase.js'
// Initialize Firebase


const storage = getStorage();



const profile_img=document.getElementById("profile-img")


const uploadFiles=(file)=>{

return new Promise((resolve, reject) => {
  
  const storageRef = ref(storage, `images/${file.name}`);
  const uploadTask = uploadBytesResumable(storageRef, file);


  uploadTask.on('state_changed', 
    (snapshot) => {


      switch (snapshot.state) {
        case 'paused':
          hideloder()
          break;
        case 'running':
          showloder()
          break;
      }
    }, 
    (error) => {
      hideloder()
    reject(error)
    }, 
   async () => {
      hideloder()
    await  getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        resolve (downloadURL);
       
 
      });
    },

  );



})




}

const fileInput = document.getElementById("file-inp");

fileInput && fileInput.addEventListener("change", () => {
    console.log(fileInput.files[0])
    profile_img.src =  URL.createObjectURL(fileInput.files[0])
})
const updateProfile = document.getElementById("update-profile");

updateProfile && updateProfile.addEventListener("click", async () => {
  showloder()
    let uid = localStorage.getItem("uid")
    let fullName = document.getElementById("fullName")
    let phone = document.getElementById("phone")
    const imageUrl = await uploadFiles(fileInput.files[0])
    console.log(imageUrl)
    const firestoreRef = doc(db, "users", uid);
    await updateDoc(firestoreRef, {
     
        picture: imageUrl
    });
    hideloder()

console.log("done")
})
  




let loader = document.getElementById("loader")

let showloder = () => {
  loader.style.display = "block";
}

let hideloder = () => {
  loader.style.display = "none";
}



let signupBtn = document.getElementById("signUp");
signupBtn && signupBtn.addEventListener("click",async () => {

  let email = document.getElementById("user-email")
  let password = document.getElementById("password")
  let phone = document.getElementById("user-number")
  let user = document.getElementById("user-name")


  let userData = {
    user: user.value,
    phone: phone.value,
    email: email.value,
    password: password.value,
  
  }



  showloder() || createUserWithEmailAndPassword(auth, userData.email, userData.password)

    .then(async (userCredential) => {

      const user = userCredential.user;

      try {
        await setDoc(doc(db, "users", user.uid), {
          ...userData,
          uid: user.uid,
          


        });

        //  localStorage.setItem("userId",user.uid ,)
        location.href = "index.html"
        // console.log("Document written with ID: ", docRef.id);
        console.log("added")
      } catch (e) {
        console.error("Error adding document: ", e);
        sweetAlert("Oops...", error.message, "error");
      }
      hideloder()
    })
    .catch((error) => {
      hideloder()
      const errorMessage = error.message;
      sweetAlert("Oops...", error.message, "error");
    })

})


let loginBtn = document.getElementById("loginBtn")
loginBtn && loginBtn.addEventListener("click", () => {
  let email = document.getElementById("user-email")
  let password = document.getElementById("password")


  showloder() || signInWithEmailAndPassword(auth, email.value, password.value)
    .then((userCredential) => {

      const user = userCredential.user;
    
      try {
        console.log("welcome to my website")
        localStorage.setItem("uid", user.uid)
        console.log(user.uid)
        location.href = "profile.html"
      } catch (err) {
        console.log(err)

      }
     
        // getUser(user.uid)
      hideloder()


    })
    .catch((error) => {
      hideloder()
      console.log("error.message", error.message)
      sweetAlert("Oops...", error.message, "error");
    });

})


const defaultImg =`images/user.png`



let getUser =  async(uid) => {
  let fullName = document.getElementById("fullName");
    let phone = document.getElementById("phone");
    let email = document.getElementById("email");

  const docRef =await doc(db, "users", uid);
  const docSnap = await getDoc(docRef);

  if (  docSnap.exists()) {
   
    console.log("Document data:", docSnap.data().email);
  
   fullName.value = docSnap.data().user
email.value = docSnap.data().email

phone.value = docSnap.data().phone
if( docSnap.data().picture){

   profile_img.src =  docSnap.data().picture 
}
else{
  profile_img.src =  defaultImg
}

    }
 
   else {
    // docSnap.data() will be undefined in this case
    console.log("No such document!");
  }
 
}


onAuthStateChanged(auth, (user) => {
  const uid = localStorage.getItem("uid")
  if (user && uid) {
      
      getUser(user.uid)
      if (location.pathname !== '/profile.html'&& location.pathname !== '/chat.html') {
          location.href = "profile.html"
      }
  } else {
      if (location.pathname !== '/index.html' && location.pathname !== '/signup.html' ) {
          location.href = "index.html"
      }
  }
});


const logoutBtn = document.getElementById("logout-btn")

logoutBtn && logoutBtn.addEventListener('click', () => {
    signOut(auth).then(() => {
        localStorage.clear()
        location.href = "index.html"
    }).catch((error) => {
        // An error happened.
    });

})
