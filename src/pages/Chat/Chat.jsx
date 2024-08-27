import { useContext, useEffect, useState } from "react";
import ChatBox from "../../components/ChatBar/ChatBox";
import LeftSideBar from "../../components/LeftSidebar/LeftSideBar";
import RightSideBar from "../../components/RightSidebar/RightSideBar";
import "./Chat.css";
import { AppContext } from "../../context/appcontext";

const Chat = () => {
  const { chatData, userData } = useContext(AppContext);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if(chatData && userData){
      setLoading(false);
    }
  },[chatData,userData])

  return (
    
    <div className="chats">
    <div className="chat">
      {loading ? (
        <p className="loading">Loading...</p>
      ) : (
        <div className="chat-container chats">
          <LeftSideBar />
          <ChatBox />
          <RightSideBar />
        </div>
      )}
    </div>
    </div>
    
  );
};

export default Chat;
