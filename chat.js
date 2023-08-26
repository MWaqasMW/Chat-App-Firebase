// import {db,auth, onAuthStateChanged,getStorage ,collection, addDoc, doc, getDoc, updateDoc, getDocs, where, query, onSnapshot, serverTimestamp, orderBy, deleteDoc  } from "./firebase";
import {onAuthStateChanged  } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import {collection, addDoc, doc, getDoc, updateDoc, getDocs, where, query, onSnapshot, serverTimestamp, orderBy, deleteDoc,increment} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";
import {db,auth} from './firebase.js'




// JavaScript code
const modeToggle = document.getElementById("mode-toggle");
const body = document.body;
const topL= document.querySelector('.top-L')


modeToggle.addEventListener("click", () => {
topL.classList.toggle("top-dark")
  body.classList.toggle("dark-mode");
  body.classList.toggle("light-mode");
});



let backToUser=()=>{
let leftContainor = document.getElementById("leftContainor");
leftContainor.style.display ="block"

let rightContainor = document.getElementById("right-containor");
rightContainor.style.display = "none"
}


window.backToUser= backToUser;








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
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const UsersSec = document.getElementById("Users-sec");
          UsersSec.innerHTML = ""; 
          querySnapshot.forEach((doc) => {
              const { user, email, picture, uid, Active } = doc.data();
              console.log(user);
              UsersSec.innerHTML += `
              <li  onclick="getUserOne('${user}','${email}','${picture}','${uid}')">
                <div>
                <img src="${picture || img}" alt="" width="50px">
                <div >
                <div class="name">${user}</div>
              <span>${email}</span>
              </div>
              </div>
              <div >
              <div class="${Active ? "green" : "red"} p-1"></div>
                </div>
              </li>`;
          });
      });
  }

  
  
  let filterUsers = () => {
    let search = document.getElementById("search");
    let caseValue = search.value.toLowerCase();
    const UsersSec = document.getElementById("Users-sec");
    const userListItems = UsersSec.getElementsByTagName("li");
    
    for (let i = 0; i < userListItems.length; i++) {
      const nameElement = userListItems[i].querySelector(".name");
      if ( nameElement && nameElement.innerText.toLowerCase().includes(caseValue)) {
        userListItems[i].style.display = "flex";

        } else {
          userListItems[i].style.display = "none";
        }
      }
    }
  
window.getAllUsers=getAllUsers
window.filterUsers =filterUsers
    
let search = document.getElementById("search");

search.addEventListener("input",(e)=>{
filterUsers()
})



let uProfile_img = document.getElementById("uProfile_img")



let getUser = async (uid) => {

  let chatContainor = document.getElementById("chatContainor");
  chatContainor.innerHTML = "";
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



let SelectedId = ''; 

let getUserOne = async (fullName, email, picture, userSelectedId) => {

let leftContainor = document.getElementById("leftContainor")
leftContainor.style.display = "none";

let rightContainor = document.getElementById("right-containor");
rightContainor.style.display = "block";

  let beforeContainor = document.getElementById("before-containor");
  beforeContainor.style.display = "none";
  let selectUser = document.getElementById("select-user");
  let selectEmail = document.getElementById("select-email");
  let selectImg = document.getElementById("select-img");

  let currentUid = localStorage.getItem('uid');
  let chatId = (currentUid > userSelectedId) ? (userSelectedId + currentUid) : (currentUid + userSelectedId);
  SelectedId = userSelectedId; // Update SelectedId

  selectUser.innerHTML = fullName;
  selectEmail.innerHTML = email;

  if (picture === "undefined") {   
    selectImg.src = "images/user.png"
  }
  else { 
    selectImg.src = picture;
  }


  getAllMessages(chatId);
};





window.getUserOne = getUserOne;


let onSend=async()=> {

  let currentUid = localStorage.getItem('uid')

  let chatId;
  if (currentUid > SelectedId) {
    chatId = SelectedId + currentUid
  } else {
    chatId = currentUid + SelectedId
  }


  let docRef =await addDoc(collection(db, "messages"), {

    message: messageSend.value,
    chatId: chatId,
    senderId: currentUid,
    receiverId: SelectedId,
    timestamp: serverTimestamp(),


  })
  
    .then((docRef) => {
      let msgId = docRef.id
      let updatesDoc =  (msgId) => {
        const washingtonRef = doc(db, "messages", msgId);
        let messageSend = document.getElementById("message-send");
       updateDoc(washingtonRef, {
          message: messageSend.value,
          chatId: chatId,
          senderId: currentUid,
          receiverId: SelectedId,
          timestamp: serverTimestamp(),
          documentId: msgId,
        });
        messageSend.value = "";
      }
      
      
      updatesDoc(msgId)
    })
    
    .catch((error) => {
      console.error("Error adding document: ", error);
    });




}



let getAllMessages = (chatId) => {
  let chatContainor = document.getElementById("chatContainor");
  let currentUid = localStorage.getItem('uid');
  const q = query(collection(db, "messages"), orderBy("timestamp", "desc"), where("chatId", "==", chatId));
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    let messages = [];

    querySnapshot.forEach((doc) => {
      messages.push(doc.data());
    });

    chatContainor.innerHTML = ""; // Clear the container before adding messages
    messages.forEach((message) => {
      let time = message.timestamp ? moment(message.timestamp.toDate()).fromNow() : moment().fromNow();
      if (currentUid === message.senderId) {
        chatContainor.innerHTML += `
          <div class="message-box left-message" id="receiver-msg">
            <div class="msg">
              ${message.message}
              <br>
              <span>${time}</span>
            </div>
            <div class="badge bg-danger" onclick="deletMsg('${message.documentId}', '${message.message}')">Delete</div>
          </div>
        `;
      } else {
        chatContainor.innerHTML += `
          <div class="message-box right-message">
            <div class="msg1">
              ${message.message}
              <br>
              <span>${time}</span>
            </div>
            <div class="badge-box"></div>
          </div>
        `;
      }
    });
  });
};
















let messageSend = document.getElementById("message-send");
let msgBtn = document.getElementById("msg-btn")

msgBtn && msgBtn.addEventListener  ("click", async (e) => {
 

  onSend()

});

messageSend && messageSend.addEventListener("keydown", (e) => {
 
  if (e.keyCode === 13) {
    onSend()
  }
  
  } )



let statusChek =  (status) => {
  const currentUid = localStorage.getItem("uid")
  const UserRef = doc(db, "users", currentUid);
   updateDoc(UserRef, {
    Active: status
  })
}


window.addEventListener("blur",()=>{
  statusChek(false)
})
window.addEventListener("focus",()=>{
  statusChek(true)
})




let deletMsg =  (messageId, messages) => {


  try {
    const messageRef = doc(db, "messages", messageId);
     deleteDoc(messageRef);
    console.log("Message deleted successfully", messageId);

   
    const deleteLastMsg = document.getElementById("receiver-msg")
    if(deleteLastMsg){
      deleteLastMsg.remove()
    }
  } catch (error) {
    console.error("Error deleting message: ", error);
  }

}

window.deletMsg = deletMsg;


const mediaQuery = window.matchMedia('(max-width: 768px)');

function handleMediaQueryChange(event) {
  if (event.matches) {
      // Media query condition is met (viewport width is <= 768px)
      // Write your code here for smaller screens
  } else {
      // Media query condition is not met (viewport width is > 768px)
      // Write your code here for larger screens
  }
}

// Attach the listener function to the media query
mediaQuery.addListener(handleMediaQueryChange);

// Initially, also call the function to handle the current state
handleMediaQueryChange(mediaQuery);





