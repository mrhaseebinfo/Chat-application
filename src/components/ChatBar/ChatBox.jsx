import assets from "../../assets/assets";
import "./ChatBox.css";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/appcontext";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { toast } from "react-toastify";
import Upload from "../../lib/Upload";

const ChatBox = () => {
  const { userData, messagesId, chatUser, messages, setMessages } =
    useContext(AppContext);

  const [input, setInput] = useState("");

  const sendMessage = async () => {
    try {
      if (input && messagesId) {
        await updateDoc(doc(db, "messages", messagesId), {
          messages: arrayUnion({
            sId: userData.id,
            text: input,
            createdAt: new Date(),
          }),
        });
        const userIDs = [chatUser.rId, userData.id];

        userIDs.forEach(async (id) => {
          const userChatRef = doc(db, "chats", id);
          const userChatSnapShot = await getDoc(userChatRef);

          if (userChatSnapShot.exists()) {
            const userChatData = userChatSnapShot.data();
            const chatIndex = userChatData.chatsData.findIndex(
              (c) => c.messageId === messagesId
            );
            userChatData.chatsData[chatIndex].lastMessage = input.slice(0, 30);
            userChatData.chatsData[chatIndex].updatedAt = Date.now();

            if (userChatData.chatsData[chatIndex].rId === userData.id) {
              userChatData.chatsData[chatIndex].messageSeen = false;
            }
            await updateDoc(userChatRef, {
              chatsData: userChatData.chatsData,
            });
          }
        });
      }
    } catch (error) {
      toast.error(error.message);
    }
    setInput("");
  };

  const convertTimeStamp =(timeStamp) => {
    let date = timeStamp.toDate();
    const  hour = date.getHours();
    const minute = date.getMinutes();

    if(hour>12){
      return hour-12 + ":" + minute + 'PM';
    }
    else{
      return hour + ":" + minute + 'AM';
    }
  }

  const sendImage = async (e) => {
   try{
      const fileUrl = await Upload(e.target.files[0]);
      if(fileUrl && messagesId){
        await updateDoc(doc(db, "messages", messagesId), {
          messages: arrayUnion({
            sId: userData.id,
            image: fileUrl,
            createdAt: new Date(),
          })
      })
      const userIDs = [chatUser.rId, userData.id];

      userIDs.forEach(async (id) => {
        const userChatRef = doc(db, "chats", id);
        const userChatSnapShot = await getDoc(userChatRef);

        if (userChatSnapShot.exists()) {
          const userChatData = userChatSnapShot.data();
          const chatIndex = userChatData.chatsData.findIndex(
            (c) => c.messageId === messagesId
          );
          userChatData.chatsData[chatIndex].lastMessage = "Image";
          userChatData.chatsData[chatIndex].updatedAt = Date.now();

          if (userChatData.chatsData[chatIndex].rId === userData.id) {
            userChatData.chatsData[chatIndex].messageSeen = false;
          }
          await updateDoc(userChatRef, {
            chatsData: userChatData.chatsData,
          });
        }
      });
    }
   }catch(error){
   toast.error(error.mesage)
   }
  }

  useEffect(() => {
    if (messagesId) {
      const unSub = onSnapshot(doc(db, "messages", messagesId), (res) => {
        setMessages(res.data().messages.reverse());
      });
      return () => {
        unSub();
      };
    }
  }, [messagesId]);

  return chatUser ? (
    <div className="chat-box">
      <div className="chat-user">
        <img src={chatUser.userData.avatar} alt="" />
        <p>
          {chatUser.userData.name}{" "}
          <img src={assets.green_dot} alt="" className="dot" />
        </p>
        <img src={assets.help_icon} className="help" alt="" />
      </div>

      <div className="chat-msg">

        {messages.map((msg, index) => (
          <div key={index} className={msg.sId === userData.id ? "send-message" : "r-message"}>
            {msg ["image"] ? <img src={msg.image} alt="" className="msg-img"/> : <p className="msg">{msg.text}</p>}
            
            <div>
              <img src={msg.sId === userData.id ? userData.avatar : chatUser.userData.avatar} alt="" />
              <p>{convertTimeStamp(msg.createdAt)}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          onChange={(e) => setInput(e.target.value)}
          value={input}
          type="text"
          placeholder="send a message"
        />
        <input onChange={sendImage} type="file" id="image" accept="image/png, image/jpeg" hidden />
        <label htmlFor="image">
          <img src={assets.gallery_icon} alt="" />
        </label>
        <img onClick={sendMessage} src={assets.send_button} alt="" />
      </div>
    </div>
  ) : (
    <div className="chat-welcome">
      <img src={assets.logo_icon} alt="" />
      <p>Chat anytime, anywhere</p>
    </div>
  );
};

export default ChatBox;
