    //bu importlari browser modules olarak aldik cunku kullanimi kolay direkt browserda calisir
    //ancak productiona giderken module bundlerlar kullanilir webpack rollup gibi cunku optimizasyon saglar
    //oyle olunca direkt bilgisayara firebase kurup(npm install firebase) libraryden cekmemiz gerekir.
    import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js";
    import {getDoc,where,query, onSnapshot,getFirestore,collection, addDoc,getDocs,setDoc,doc } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-firestore.js";
    import { user} from "./app.js";



    const ul=document.querySelector(".chat-ul");
    const chatBox=document.querySelector(".chat");

    const firebaseConfig = {
      apiKey: "AIzaSyCsWlIzayw72OGAmPEns8cuCMyxwx2gZAQ",
      authDomain: "js-chatapp-6011a.firebaseapp.com",
      projectId: "js-chatapp-6011a",
      storageBucket: "js-chatapp-6011a.appspot.com",
      messagingSenderId: "1019381494776",
      appId: "1:1019381494776:web:0020c68754d13bc1b49c0d",
      measurementId: "G-MFN66C0SNH"
    };
    initializeApp(firebaseConfig);
    const db = getFirestore();
    

    async function writeMessage(user,message,roomName){
        await addDoc(collection(db,"chatbox"), {
        username:user,
        message:message,
        chatroomName:roomName,
        time: Date.now()
      });
    };

    async function addChatroom(chatroomName) {
      const docSnap=await getDoc(doc(db,"chatrooms","chatroomName"));
      if(!docSnap.exists())
        return false;
      console.log(chatroomName);
      await setDoc(doc(db,"chatrooms",chatroomName), {
        time: Date.now()
      });
      return true;
      
    }

    async function getAvailableChatrooms() {
      const docRef=await getDocs(collection(db,"chatrooms"));
      let chatroomList=new Array();
      docRef.docs.forEach(e=>{
        chatroomList.push({id:e.id,data:e.data()})
      });
      chatroomList=bubbleSort(chatroomList);
      return chatroomList;
    }
    


    async function getMessagesLive(date,roomName){
      const q = query(collection(db, "chatbox"), where("time", ">", date),where("chatroomName","==",roomName));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
              const newHtml=`
              <li class=${change.doc.data().username==user?"sent":"incoming"}>${change.doc.data().username==user?"me":change.doc.data().username}: ${change.doc.data().message}</li>
            `;
            ul.innerHTML+=newHtml; 
            chatBox.scrollTop=chatBox.scrollHeight;
          }
        });
      });
          return unsubscribe;
    }

    //getAvailableChatrooms();


    // //overwrite bu şekilde yapilir, once overwrite etmek istedigimiz documenti ref olarak aliriz
    // //eger overwrite edilecek documentin olup olmadigindan emin olunmazsa
    // //3. parametre olarak merge:true eklenir.(tum documentleri overwrite etmesini onlemen icin)
    // await setDoc(doc(db,"cities","LA"),{capital:"yes"},{merge:true});
    
    // //tum documenti overwrite etmedne sadece bir fieldi update etmek icin
    // await updateDoc(ref,{});

    // //data direkt bir classin objesi olarak  da yollanip alinabilir
    
    function bubbleSort(arr) {
      for(let j=0;j<arr.length-1;j++) {
          for(let i = 0; i < arr.length-1; i++) {
          
              if(arr[i].data.time<arr[i+1].data.time) {
                  var temp = arr[i];
                  arr[i] = arr[i+1];
                  arr[i+1] = temp;
              }
          }
      }      
      return arr;
  }
  
export {writeMessage,getMessagesLive,addChatroom,getAvailableChatrooms};


