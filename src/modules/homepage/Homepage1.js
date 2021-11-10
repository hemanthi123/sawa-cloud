import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { useHistory } from "react-router";
import "./Homepage.css";
import { auth, db, logout } from "../../firebase";

/**paste from bkp */

import logo from '../../assets/logo.PNG';
import adv from '../../assets/adv_1.PNG';
import './index.css';
import modules from '../../modules';
import posts from '../../posts_categories';
import firebase from '../../firebase';

  
 

  let myItems = [];

  db.collection("post-campaign")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((item) => {
        myItems.push(item.data());
      });                           
  });

/** end of paste from bkp */

function Homepage() {
  const [currentTab, setCurrentTab] = useState('homepage');

  const [user, loading, error] = useAuthState(auth);
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const history = useHistory();

  const fetchUserName = async () => {
    try {
      const query = await db.collection("users").where("uid", "==", user.uid).get();
      const data = await query.docs[0].data();
      console.log(data);
      setName(data.name);
      setEmail(data.email);
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching user data");
    }
  };
  useEffect(() => {
    if (loading) return;
    if (!user) return history.replace("/");
    fetchUserName();
  }, [user, loading]);
  return (
    <div className="dashboard">


<header className="App-header">

<div className="div-logo-menue">
<div className="div-logo">
<img src={logo} className="App-logo" alt="logo" />
</div>
<div className="div-menue">
</div>
</div>
</header>      



    
      <div className="home-content">

<div className="div-categories" >
            <ul className="list-categories">            
              {posts.map(post => ( // with a name, and routes , view aexcept signup
                  <li key={post.name} >
                    <Link to={post.routeProps.path} >{post.name}</Link>
                  </li>
              ))}
            </ul>
            </div>

   <div className="">{email}<button className="dashboard__btn" onClick={logout}>Logout</button>
   </div>
    
     <h4 className="home-su-welcome">Welcome to your social awareness network</h4> 
     
     <div class=" posts-start">

    <div className="posts-bu">
    <div className="sp-pro-pic"><img className="post-pro-pic" src={logo} alt="Los Angeles" width="20%" height="20%"/> <button className="button-sp">Strat a post</button></div>
    </div>
    </div>

    {myItems.map((entity, index) => {
        return (
    <div class="posts-home">
      <div className="post">
      <div><img className="post-pro-pic" src={logo} alt="Los Angeles" width="20%" height="20%"/></div>
      <div className="post-desc"><p>{entity.description_post}</p></div>
    </div>
    </div>
        );
      })}


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