import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { useHistory } from "react-router";
import ShowMoreText from "react-show-more-text";
import { auth, db, storeDB, logout } from "../../firebase";
import * as Scroll from 'react-scroll';
import { /*Link, */Button, Element, Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll'

import Popup from "reactjs-popup";

import "./AdvertisePopup.css";

function AdvertisePopup() {

  const [user, loading, error] = useAuthState(auth); 
  const [uid, setId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profilePicURL, setImageUrl]= useState("");
  const [file,  setFile] = useState("");

  const fetchUserName = async () => {
    try {
      //alert('fetchUserName');
      const query = await db.collection("users").where("uid", "==", user.uid).get();
      const data = await query.docs[0].data();
      //console.log(data);
      setId(data.uid);
      setName(data.name);
      setEmail(data.email);
      let id=query.docs[0].id;  

      let pathUP= "";
      storeDB.ref('/users/'+id+'/profile.PNG').getDownloadURL()
        .then((url) => {
          pathUP= url;
          setImageUrl(pathUP);
      }) 
      .catch((err) => {
        storeDB.ref('/users/common_profile.PNG').getDownloadURL()
          .then((url) => {
            pathUP= url;
            setImageUrl(pathUP);
        }) 
      }) 
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching user data");
    }
  };



  const submitPost = () => {
    
    alert("submitted");
  }
  

  const loadFile = (e) => { 
    let type = ((e.target.files[0].type).split("/"))[0];
   
    setFile(URL.createObjectURL(e.target.files[0]))
    if(type=="video"){
      //alert("vvvv"+type);
      document.getElementById('uploaded_image').style.display='none';
      document.getElementById('uploaded_video').style.display='block';
    }
    else{
      //alert("iii"+type);
      document.getElementById('uploaded_video').style.display='none';
      document.getElementById('uploaded_image').style.display='block';
    }

  }


  useEffect(() => {
    //alert("useEffect");
    if (loading) return;
    //if (!user) {return history.replace("/")}
    fetchUserName(); 

  }, [user, loading]);
    //
  return (
    
    <Popup  trigger={<button className="btn-menu1" onClick="">Advertise</button>} position="center">
    { 
    close => ( 
  
  <div className="advertise_popup">
    <div className="popup_header">
      <h5>Create an Advertisement
    <a className="close" onClick={close}>
      &times;
    </a></h5>
    </div>
    <div className="popup_profile"><img className="post-pro-pic" src={profilePicURL} alt="Los Angeles" width="20%" height="20%"/> {name}</div>
    <div className="popup_text"><textarea placeholder="What do you want to advertise?"></textarea></div>
    <div className="popup_uploaded"> <img className="uploaded_image" id="uploaded_image" src={file}/><video className="uploaded_video" id="uploaded_video" src={file} controls></video></div>
    <div className="popup_icons"><input type="file" onChange={(evt) => loadFile(evt)} id="myFile" name="filename"></input></div>
    <div className="popup_submit"><button className="btn-menu" onClick={submitPost}>Post</button></div>
  </div>

)}
</Popup>

  )
}
export default AdvertisePopup;