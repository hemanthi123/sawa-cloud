import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { useHistory } from "react-router";
import ShowMoreText from "react-show-more-text";
import { auth, db, storeDB, logout } from "../../firebase";
import * as Scroll from 'react-scroll';
import { /*Link, */Button, Element, Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll'

import Popup from "reactjs-popup";

import "./Profile.css";

function Profile() {

  const [user, loading, error] = useAuthState(auth); 
  const [uid, setId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profilePicURL, setImageUrl]= useState("");
  const [userType, setUserType]= useState(2);
  const [admin_display, setAdminDisplay]= useState("admin_panel");
  const [admin_desc, setUserTypeDesc]= useState(""); 
  

  const fetchUserName = async () => {
    try {
      //alert('fetchUserName');
      const query = await db.collection("users").where("uid", "==", user.uid).get();
      const data = await query.docs[0].data();
      //console.log(data);
      setId(data.uid);
      setName(data.name);
      setEmail(data.email);
      setUserType(data.user_type);
      if(data.user_type==1){
      setAdminDisplay("admin_panel1");
      setUserTypeDesc("(Admin)");
      }
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

  useEffect(() => {
    //alert("useEffect");
    if (loading) return;
    //if (!user) {return history.replace("/")}
    fetchUserName(); 

  }, [user, loading]);
    //
  return (
    <div className="first_col_parent1 mainClos">
    <div className="div-categories1" >
      <div className="div-categories-img1"><img className="post-pro-pic-user" src={profilePicURL}/></div>
      <div className="prof-desc1" >
        
        <p className="user_name">{admin_desc} <br></br> {name}</p>
        <div class="user_panel"><p><a href="../hem">Edit my profile</a></p>
        <p><a href="../your_recent_posts">View, edit or delete my campaigns</a></p>
        <p><a href="../your_recent_advertisements">View, edit or delete my adveriesments</a></p>
        </div>
        <div class="admin_panel" className={admin_display}><p><a href="../posts_approval">Approve Campaigns</a></p>
        <p><a href="../advertisements_approval">Approve advertisements</a></p> 
        </div>
      </div>
    </div>
  </div>

  );
}
export default Profile;