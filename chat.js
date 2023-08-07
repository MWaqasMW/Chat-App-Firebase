import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import { getFirestore, collection, addDoc, doc, setDoc, getDoc, updateDoc, getDocs, where, query, onSnapshot, serverTimestamp,orderBy,deleteDoc, deleteField } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";
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

  const q = query(collection(db, "users"), where("email", "!=", email));

  const querySnapshot = await getDocs(q);
  showLoaderUsers() || querySnapshot.forEach((doc) => {

    hideloderLoaderUsers()

    const { fullName, email, picture, uid } = doc.data()
    UsersSec.innerHTML += `
    <li onclick="getUserOne('${fullName}','${email}','${picture}','${uid}')">
    <div>
      <img src="${picture || img}" alt="" width="50px">
      <div >
        <div class="name">${fullName || "Unknown"}</div>
        <div >${email}</div>
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





let uProfile_img = document.getElementById("uProfile_img")



let getUser = async (uid) => {
  let uName = document.getElementById("uName");
  let uEmail = document.getElementById("uEmail");

  const docRef = await doc(db, "users", uid);
  const docSnap = await getDoc(docRef);

  uName.innerHTML = docSnap.data().user
  uEmail.innerHTML = docSnap.data().email

  if (docSnap.data().picture)
    uProfile_img.src = uProfile_img.src ? docSnap.data().picture : img


}

onAuthStateChanged(auth, async (user) => {
  const uid = localStorage.getItem("uid")
  if (user && uid) {

    getUser(user.uid)
    getAllUsers(user.email)


  } else {
    uProfile_img.src = uProfile_img.src
  }
});

let SelectedId;

let getUserOne = (fullName, email, picture, userSelectdId) => {

  let selectUser = document.getElementById("select-user");
  let selectEmail = document.getElementById("select-email");
  let selectImg = document.getElementById("select-img");
  

  let currentUid = localStorage.getItem('uid')
  let chatId;
  if (currentUid > SelectedId) {
    chatId = SelectedId + currentUid
  } else {
    chatId = currentUid + SelectedId
  }
  
  SelectedId = userSelectdId



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
  getAllMessages(chatId)
  rightUserContainor()
 

}
window.getUserOne = getUserOne;

let rightUserContainor=()=>{

  let rightContainor=document.getElementById("right-containor");
 rightContainor.style.display="block"


}


let messageSend = document.getElementById("message-send");


messageSend.addEventListener("keydown", async (e) => {
  if (e.keyCode === 13) {

    let currentUid = localStorage.getItem('uid')
    console.log(messageSend.value.trim())
    let chatId;
    if (currentUid > SelectedId) {
      chatId = SelectedId + currentUid
    } else {
      chatId = currentUid + SelectedId
    }
   
    const docRef =  addDoc(collection(db, "messages",), {
      message: messageSend.value,
      chatId: chatId,
      senderId: currentUid,
      receiverId: SelectedId,
      timestamp: serverTimestamp(),
   
      
    });

    
    messageSend.value ="";
  }
});
let rec ;
let getAllMessages =(chatId) => {
  
  let chatContainor = document.getElementById("chatContainor");
  let currentUid = localStorage.getItem('uid');
  const q = query(collection(db, "messages"),orderBy("timestamp","desc"), where("chatId", "==", chatId));
  const unsubscribe = onSnapshot(q, async(querySnapshot) => {
    const messages = [];
  
    querySnapshot.forEach( async(doc) => {
      
      messages.push(doc.data());
      
      
    chatContainor.innerHTML ="";
    for (var i = 0; i < messages.length; i++) {
      let time =messages[i].timestamp ? moment( messages[i].timestamp.toDate ( )).fromNow(): moment().fromNow()
      if (currentUid === messages[i].senderId) {
        
        
        chatContainor.innerHTML += `
        <div class="message-box left-message" id= "receiver-msg">
        <div class="msg" >
        ${ messages[i].message }
        <br>
        <span>${time}</span>
        </div>
     
        <span class="badge bg-danger"onclick="deletMsg('${doc.id}' , '${ messages[i].message }')"  >Delet</span>
        <span class="badge bg-secondary ">DeletforEveryone</span>
        
        </div>
     `
    }
  else{
    chatContainor.innerHTML +=`
    <div class="message-box right-message">
    <div class="msg1" >
    ${messages[i].message}
    <br>
    <span>${time}</span>
    </div>
    <div class="badge-box">
    <span class="badge bg-danger"  onclick="deletMsg('${doc.id}' , '${ messages[i].message }')">Delet</span>
    <span class="badge bg-secondary ">DeletforEveryone</span>
    </div>
    </div>
    
    `
    
      }
      
    }
    

  })
});
  
  

  
  
  
}


let deletMsg= async(messageId , messages)=> {

  console.log(messageId)
    
  try {
    const messageRef = doc(db, "messages", messageId);
    await deleteDoc(messageRef);
    console.log("Message deleted successfully");
   let recieveMsg = messages;
   recieveMsg  -="";
  } catch (error) {
      console.error("Error deleting message: ", error);
    }
  


  
  












  

}
    
  window.deletMsg= deletMsg;
  







