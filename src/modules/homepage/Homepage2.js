import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { useHistory } from "react-router";
import ShowMoreText from "react-show-more-text";
import "./Homepage.css";
import { auth, db, storeDB, logout } from "../../firebase";
import * as Scroll from 'react-scroll';
import { /*Link, */Button, Element, Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll'


/**paste from bkp */

import logo from '../../assets/logo.PNG';
import adv from '../../assets/adv_1.PNG';
import './Homepage.css'; 



 



 

/****************************************** */
let pathAUP= "";
let myItems = [];
let picPath = [];

db.collection('users').get().then((snippetsSnapshot) =>{
  snippetsSnapshot.docs.forEach((doc) => {   

      db.collection('/users/'+doc.id+'/post').get().then((querySnapshot) => {
          querySnapshot.docs.forEach((doc1) => {
            let item=doc1.data();
            
           storeDB.ref('/users/'+doc.id+'/profile.PNG').getDownloadURL().then((url) => {
           pathAUP= url; 
           item.path1=pathAUP;
           //myItems.push(item); 
           })    
           .catch((err) => {
             storeDB.ref('/users/common_profile.PNG').getDownloadURL().then((url2) => {
                   pathAUP= url2;
                   item.path1=pathAUP;
                  // myItems.push(item); 
               })
           }) 
           /****************** */
          
            myItems.push(item); 
            alert(1);  
            console.log(item);
            
          })                           
      })
  }) 
})

//console.log(myItems);
/***************************** */
  
/*db.collectionGroup('post').get().then((querySnapshot) => {
  querySnapshot.forEach((item) => {  
    myItems.push(item.data()); 
  });                           
});*/
 
/*
  let myItems = [];

  db.collection("post-campaign")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((item) => {
        myItems.push(item.data());
        //console.log("dddsdd"+item.data());
      });                           
  });*/

  
   
/** end of paste from bkp */
  



function Homepage() {
  alert(2);
 // alert("yyyyyy");
  const [currentTab, setCurrentTab] = useState('homepage');

  const [user, loading, error] = useAuthState(auth); 
  
  const [uid, setId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profilePicURL, setImageUrl]= useState("");
  const [profileImgPath, setProfPic] = useState("");

  

  const history = useHistory();

  const [readMore,setReadMore]=useState(false);
  
  const linkName=readMore?'Read Less << ':'Read More >> ';

  const [activeIndex, setActiveIndex] = useState(null);


  const ReadMore = ({ children }) => {
    const text = children;
    const [isReadMore, setIsReadMore] = useState(true);
    const toggleReadMore = () => {
      setIsReadMore(!isReadMore);
    };
    return (
      <p className="text">
        {isReadMore ? text.slice(0, 100) : text}
        <span onClick={toggleReadMore} className="read-or-hide"><br></br>
          <span className="read-more-link">{isReadMore ? "...see more" : " ...show less"}</span>
        </span>
      </p>
    );
  };

  const fetchUserName = async () => {
    try {
      alert("ok");
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

  const fetchPostData = async () => {
   // alert("gggg");
  }

  useEffect(() => {
    if (loading) return;
    if (!user) return history.replace("/");
    fetchUserName();
    fetchPostData();
  }, [user, loading]); 



  return (
<div className="dashboard">

  <header className="App-header">
  <div className="div-logo-menue">
  <div className="div-logo"><img src={logo} className="App-logo" alt="logo" /></div>
  <div className="div-menue"></div>
  </div>
  </header>      

  <div className="home-content">

  <div className="div-categories" >
    <div className="div-categories-img"><img className="post-pro-pic-user" src={profilePicURL}/></div>
    <div className="prof-desc">
      <p>{name}</p>
      <p><a href="">Edit your profile</a></p>
      <p><a href="">View your recent posts</a></p> 
    </div>
  </div>

  <div className="div-logout">{email}  <button className="btn-logout" onClick={logout}>Logout</button></div>
   
    
  <h4 className="home-su-welcome">Welcome to your social awareness network</h4> 


  <div className="center-col">
    <div class=" posts-start">
      <div className="posts-bu">
        <div className="sp-pro-pic"><img className="post-pro-pic" src={logo} alt="Los Angeles" width="20%" height="20%"/> <button className="button-sp">Strat a post</button></div>
      </div>
    </div>
    {myItems.map((entity, index) => {//console.log(entity);  
        return (       
    <div class="posts-home">
      <div className="post">
      <div><img className="post-pro-pic" src={entity.path1} alt="" width="20%" height="20%"/></div>       
      <div className="post-desc"  key={index}>
        <h5>{entity.topic}</h5>
        <p><ReadMore>{entity.description_post}</ReadMore></p>
      </div> 
    </div>
    </div>
        );
      })}
  </div>


    <div className="adv-container">
          <div className="div-advertiesments">
            <img src={adv} className="App-adv" alt="logo" />
            <img src={adv} className="App-adv" alt="logo" />
            <img src={adv} className="App-adv" alt="logo" />
        </div>    
    </div>


    </div>      
    </div>
  );
}
export default Homepage;