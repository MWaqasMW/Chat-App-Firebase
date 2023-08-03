import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import { getFirestore, collection, addDoc, doc, setDoc, getDoc, updateDoc, getDocs, where } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";
import { getStorage, ref, uploadBytesResumable, getDownloadURL, } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-storage.js";

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

const storage = getStorage();







let UsersSec = document.getElementById("Users-sec")



let showLoaderUsers = () => {
  let spinerUsers = document.getElementById("spinerUsers")
  spinerUsers.style.display = "block"

}
let hideloderLoaderUsers = () => {
  let spinerUsers = document.getElementById("spinerUsers")
  spinerUsers.style.display = "none"

}

let img = "images/user.png"

let getAllUsers = async (email) => {

  const querySnapshot = await getDocs(collection(db, "users"), where("email", "!=", email));
  showLoaderUsers() || await querySnapshot.forEach((doc) => {
    hideloderLoaderUsers()

    const { fullName, email, picture } = doc.data()
    UsersSec.innerHTML += `
    <li onclick="getUserOne('${fullName}' ,'${email}','${picture}')">
    <div>
      <img src="${picture || img}" alt="" width="50px">
      <div >
        <div class="name">${ fullName || "Unknown"}</div>
        <div>${email}</div>
      </div>
    </div>
    <div>
      <div class="time">12:00Am</div>
      <div class="notify">
        <!-- <div class=" badge rounded-pill bg-danger">
          99+

        </div> -->
      </div>
    </div>
  </li>

    `


  });


}
getAllUsers()




let uProfile_img = document.getElementById("uProfile_img")



let getUser = async (uid) => {
  let uName = document.getElementById("uName");
  let uEmail = document.getElementById("uEmail");

  const docRef = await doc(db, "users", uid);
  const docSnap = await getDoc(docRef);

  uName.innerHTML = docSnap.data().user
  uEmail.innerHTML = docSnap.data().email

  if(docSnap.data().picture)
  uProfile_img.src = uProfile_img.src ? docSnap.data().picture : img


}

onAuthStateChanged(auth, async (user) => {
  const uid = localStorage.getItem("uid")
  if (user && uid) {

    await getAllUsers(user.email)
    await getUser(user.uid)


  } else {
    uProfile_img.src = uProfile_img.src
  }
});



let getUserOne = (fullName, email, picture) => {

  let selectUser = document.getElementById("select-user");
  let selectEmail = document.getElementById("select-email");
  let selectImg = document.getElementById("select-img");


  selectEmail.innerHTML = email;

  if (picture == "undefined") {
    if (email == "undefined") {
      selectEmail.innerHTML = "@...";
    }
    if (fullName == "undefined") {
      selectUser.innerHTML = "Unknown"
    }

    selectImg.src = "images/user.png"

  }
  else {

    selectImg.src = picture;
    selectUser.innerHTML = fullName;
    selectEmail.innerHTML = email;
  }



  // console.log(fullName,email,picture)
}
window.getUserOne = getUserOne;


