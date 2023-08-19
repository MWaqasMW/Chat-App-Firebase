import {onAuthStateChanged  } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import {collection, addDoc, doc, getDoc, updateDoc, getDocs, where, query, onSnapshot, serverTimestamp, orderBy, deleteDoc} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";
import { getStorage} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-storage.js";
import {db,auth} from './firebase.js'






const storage = getStorage();

let UsersSec = document.getElementById("Users-sec")






let  searchUser=(data)=>{
  let search = document.getElementById("search")
let caseValue= search.value.toLowerCase()

let arr=[]
arr.push(data)
let uArr= arr.filter(obj => obj.fullName === caseValue,
  );
  console.log(uArr)

return uArr[0]
}

window.searchUser=searchUser;


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
    const user = searchUser(doc.data());
  
console.log(user)
hideloderLoaderUsers()
if(user){
  const { fullName, email, picture, uid, Active } = user;

      

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
      <div class="${Active ? "green" : "red"}"></div>
      <div class="notify">
      <!-- <div class=" badge rounded-pill bg-danger">
      99+

      </div> -->
      </div>
      </div>
      </li>
      
        `
        
      }
      

      else{
        const { fullName, email, picture, uid, Active } = doc.data()
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
      <div class="${Active ? "green" : "red"}"></div>
      <div class="notify">
      <!-- <div class=" badge rounded-pill bg-danger">
        99+
        
        </div> -->
        </div>
        </div>
        </li>
        
        `
      }
      
    })
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
  let beforeContainor = document.getElementById("before-containor")
  beforeContainor.style.display="none";
  let chatContainor = document.getElementById("chatContainor");

  chatContainor.innerHTML = "";

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
  
  
  getAllMessages(chatId);
  let rightContainor = document.getElementById("right-containor");
  rightContainor.style.display = "block"
}

window.getUserOne = getUserOne;


let onSend=()=> {

  let currentUid = localStorage.getItem('uid')

  let chatId;
  if (currentUid > SelectedId) {
    chatId = SelectedId + currentUid
  } else {
    chatId = currentUid + SelectedId
  }


  var docRef = addDoc(collection(db, "messages"), {

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
          documentId: msgId
        });
        messageSend.value = "";
      }
      updatesDoc(msgId)


    })

    .catch((error) => {
      console.error("Error adding document: ", error);
    });




}






let messageSend = document.getElementById("message-send");
let msgBtn = document.getElementById("msg-btn")

msgBtn.addEventListener  ("click", async (e) => {
 

  onSend()

});

messageSend.addEventListener("keydown", (e) => {
 
  if (e.keyCode === 13) {
    onSend()
  }
  
  } )

let getAllMessages = (chatId) => {

  let chatContainor = document.getElementById("chatContainor");
  let currentUid = localStorage.getItem('uid');
  const q = query(collection(db, "messages"), orderBy("timestamp", "desc"), where("chatId", "==", chatId));
  const unsubscribe = onSnapshot(q,  (querySnapshot) => {
    const messages = [];
    querySnapshot.forEach( (doc) => {
console.log(doc.data())
      messages.push(doc.data());
      for (var i = 0; i < messages.length; i++) {
        chatContainor.innerHTML = "";
        let time = messages[i].timestamp ? moment(messages[i].timestamp.toDate()).fromNow() : moment().fromNow()
        
        if (currentUid === messages[i].senderId) {


          chatContainor.innerHTML += `
          <div class="message-box left-message" id= "receiver-msg">
          <div class="msg" >
          ${messages[i].message}
          <br>
          <span>${time}</span>
          </div>
          
          <span class="badge bg-danger"onclick="deletMsg('${messages[i].documentId}' , '${messages[i].message}')"  >Delet</span>
          <span class="badge bg-secondary ">DeletforEveryone</span>
          
          </div>
          `
        }
        else {
          chatContainor.innerHTML += `
    <div class="message-box right-message">
    <div class="msg1" >
    ${messages[i].message}
    <br>
    <span>${time}</span>
    </div>
    <div class="badge-box">
    <span class="badge bg-danger"  onclick="deletMsg('${messages[i].documentId}' , '${messages[i].message}')">Delet</span>
    <span class="badge bg-secondary ">DeletforEveryone</span>
    </div>
    </div>
    
    `

        }
      }

    })

  }

  )





}

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




let deletMsg = async (messageId, messages) => {


  try {
    const messageRef = doc(db, "messages", messageId);
    await deleteDoc(messageRef);
    console.log("Message deleted successfully", messages);

  } catch (error) {
    console.error("Error deleting message: ", error);
  }




















}

window.deletMsg = deletMsg;








