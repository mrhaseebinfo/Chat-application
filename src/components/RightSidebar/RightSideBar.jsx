import { useContext, useEffect, useState } from "react";
import assets from "../../assets/assets";
import { logout } from "../../config/firebase";
import "./RightSideBar.css";
import { AppContext } from "../../context/appcontext";

const RightSideBar = () => {
  const { chatUser, messages } = useContext(AppContext);
  const [msgImage, setMsgImage] = useState([]);

  useEffect(() => {
     let tempvar =[];
     messages.map((msg) => {
      if(msg.image) {
        tempvar.push(msg.image);
      }
     })
     setMsgImage(tempvar);
  },[messages])

  return chatUser ? (
    <div className="right-side">
      <div className="rs-profile">
        <img src={chatUser.userData.avatar} alt="" />
        <h3>
          {chatUser.userData.name} {Date.now()- chatUser.userData.lastSeen <= 70000 ? <img src={assets.green_dot} alt="" className="dot" /> : null} 
        </h3>
        <p>{chatUser.userData.bio}</p>
      </div>
      <hr />
      <div className="rs-media">
        <p>Media</p>
        <div>
          {msgImage.map((url,index)=>(<img onClick={()=>window.open(url)} key={index} src={url} alt=""/>))}
          {/* <img src={assets.pic1} alt="" />
          <img src={assets.pic2} alt="" />
          <img src={assets.pic3} alt="" />
          <img src={assets.pic4} alt="" />
          <img src={assets.pic1} alt="" /> */}
        </div>
      </div>
      <button onClick={() => logout()}>Logout</button>
    </div>
  ) : (
    <div className="right-side">
      <button onClick={() => logout()}>Logout</button>
    </div>
  );
};

export default RightSideBar;
