import { writeMessage,getMessagesLive,addChatroom,getAvailableChatrooms } from "./db.js";

const usernameForm=document.querySelector(".username-form");
const username=document.querySelector(".username-input");
const messageForm=document.querySelector(".message-form");
const messageInput=document.querySelector(".message-input");
const container=document.querySelector(".container");
let createChatroomButton;
const chatrooms=document.querySelector(".chatrooms");
const enterance=document.querySelector(".enterance");
let chatroomNameInput;
let createRoomForm;
const chatroomListul=document.querySelector(".chatroomlist");
let user;
let message;
let chatroomName;


function setAvailableChatroomList() {
  getAvailableChatrooms().then(
    chatroomList=>{
      for(let i=0;i<chatroomList.length;i++)
      {
        chatroomListul.innerHTML=`
        <div class="button-container">
                    <label for="${chatroomList[i].id}">${chatroomList[i].id}</label>
                    <input type="button" id="${chatroomList[i].id}" value="join">
                </div>`+chatroomListul.innerHTML;
        
      }
      createChatroomButton=document.querySelector("#createRoom");
      createRoomForm=document.querySelector(".new-room-form");
      chatroomNameInput=document.querySelector("#chatroom-name")
      callEventListeners();
    });
}

setAvailableChatroomList();



function callEventListeners() {
  messageForm.addEventListener("submit",e=>{
    e.preventDefault();
    message=messageInput.value;
    messageInput.value="";
    console.log(user,message);
    writeMessage(user,message,chatroomName);
  })
  
  usernameForm.addEventListener("submit",e=>{
    e.preventDefault();
    container.classList.remove("display");
    usernameForm.classList.add("display");
    user=username.value;
    getMessagesLive(Date.now(),chatroomName);
  })
  createRoomForm.addEventListener("submit",e=>{
    e.preventDefault();
    createChatroomHelper();
  })
  createChatroomButton.addEventListener("click", e=>{
    e.preventDefault();
      createChatroomHelper();
      }
    );
}


function createChatroomHelper() {
  
  addChatroom(chatroomNameInput.value).then(
    para=>{
      if(para)
      {
        enterance.innerHTML=`<h3 style="position: absolute;
        left:50%;
        top: 30%;
        transform: translate(-50%, -30%);
       ">Chatroom ${chatroomNameInput.value} is created.</h3>`+enterance.innerHTML;
        chatroomName=chatroomNameInput.value;
        enterance.classList.remove("display");
        chatrooms.classList.add("display");
      }
      else
      {
         //alert("This chatroom name can not be used. Please try a different one.");
         let alert=document.createElement("div");
         let text=document.createElement("p");
         text.innerText="This chatroom name can not be used. Please try a different one.";
         text.classList.add("alertButton");
         alert.appendChild(text);
         let button=document.createElement("button");
         button.classList.add();
         alert.appendChild(button);
         alert.classList.add("displayAlert");
         document.querySelector("body").appendChild(alert);
      }
       


        
      });
        
}

  

export {user};