import "./LeftSideBar.css";
import assets from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import {
  collection,
  where,
  query,
  getDocs,
  doc,
  setDoc,
  serverTimestamp,
  updateDoc,
  arrayUnion,
  getDoc,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { useContext, useState } from "react";
import { AppContext } from "../../context/appcontext";
import { toast } from "react-toastify";

const LeftSideBar = () => {
  const navigate = useNavigate();

  // Destructuring the context data
  const { userData, chatData, setChatUser, setMessagesId, messagesId } = useContext(AppContext);
  const [user, setUser] = useState(null);
  const [showSearch, setShowSearch] = useState(false);

  // Handle the input for searching users
  const inputHandler = async (e) => {
    try {
      const input = e.target.value;
      if (input) {
        setShowSearch(true);
        const userRef = collection(db, "users");
        const q = query(userRef, where("username", "==", input.toLowerCase()));
        const querySnap = await getDocs(q);
        if (!querySnap.empty && querySnap.docs[0].data().id !== userData.id) {
          let userExist = false;
          chatData.forEach((user) => {
            if (user.rId === querySnap.docs[0].data().id) {
              userExist = true;
            }
          });
          if (!userExist) {
            setUser(querySnap.docs[0].data());
          }
        } else {
          setUser(null);
        }
      } else {
        setShowSearch(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Function to add chat
  const addChat = async () => {
    const messageRef = collection(db, "messages");
    const chatsRef = collection(db, "chats");
    try {
      const newMessageRef = doc(messageRef);
      await setDoc(newMessageRef, {
        createAt: serverTimestamp(),
        messages: [],
      });

      // Add to both user's chatData
      await updateDoc(doc(chatsRef, user.id), {
        chatsData: arrayUnion({
          messageId: newMessageRef.id,
          lastMessage: "",
          rId: userData.id,
          updatedAt: Date.now(),
          messageSeen: true,
        }),
      });

      await updateDoc(doc(chatsRef, userData.id), {
        chatsData: arrayUnion({
          messageId: newMessageRef.id,
          lastMessage: "",
          rId: user.id,
          updatedAt: Date.now(),
          messageSeen: true,
        }),
      });
    } catch (error) {
      toast.error(error.message);
      console.error(error);
    }
  };

  // Function to set the current chat
  const setChat = async (item) => {
    try {
      setMessagesId(item.messageId);
      setChatUser(item);
  
      const userChatRef = doc(db, 'chats', userData.id);
      const userChatSnapShot = await getDoc(userChatRef);
  
      if (userChatSnapShot.exists()) {
        const userChatData = userChatSnapShot.data();
  
        // Check if chatData exists and is an array
        if (Array.isArray(userChatData.chatData)) {
          const chatIndex = userChatData.chatData.findIndex(
            (c) => c.messageId === item.messageId
          );
  
          // Ensure the chat was found before updating
          if (chatIndex !== -1) {
            userChatData.chatData[chatIndex].messageSeen = true;
  
            await updateDoc(userChatRef, {
              chatData: userChatData.chatData,
            });
          } else {
            console.error("Chat not found in chatData");
          }
        } else {
          console.error("chatData is not defined or not an array");
        }
      } else {
        console.error("User chat data not found");
      }
    } catch (error) {
      console.error("Error setting chat:", error.message);
    }
  };

  // Filter chatData to remove duplicates based on unique user IDs
  const uniqueChatData = chatData.filter(
    (item, index, self) =>
      index === self.findIndex((t) => t.userData.id === item.userData.id)
  );

  return (
    <div className="ls">
      <div className="ls-top">
        <div className="ls-nav">
          <img src={assets.logo} alt="" className="logo" />
          <div className="menu">
            <img src={assets.menu_icon} alt="" />
            <div className="sub-menu">
              <p onClick={() => navigate("/profile")}>Edit Profile</p>
              <hr />
              <p onClick={() => navigate("/")}>Logout</p>
            </div>
          </div>
        </div>
        <div className="ls-search">
          <img src={assets.search_icon} alt="" />
          <input
            onChange={inputHandler}
            type="text"
            placeholder="search here..."
          />
        </div>
      </div>
      <div className="ls-list">
        {showSearch && user ? (
          <div onClick={addChat} className="friends add-user">
            <img src={user.avatar} alt="" />
            <p>{user.name}</p>
          </div>
        ) : (
          uniqueChatData.map((item, index) => (
            <div onClick={() => setChat(item)} key={index} className="friends">
              <img src={item.userData.avatar} alt="" />
              <div>
                <p>{item.userData.name}</p>
                <span>{item.lastMessage}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LeftSideBar;
