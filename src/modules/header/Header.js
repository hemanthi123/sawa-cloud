import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { auth, signInWithEmailAndPassword, signInWithGoogle } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import logo from '../../assets/logo.PNG'; 
import {  db, storeDB, logout } from "../../firebase";

import "./Header.css";

import AdvertisePopup from "../advertise_popup/AdvertisePopup";
import PostPopup from "../post_popup/PostPopup";



function Header() {
    //
  return (
     <header className="menuu1">
    <div className="div-logo"><img src={logo} className="App-logo" alt="logo" /></div>
      
    <div className="div-logout1"><a href="../homepage"><button className="btn-menu1" >Home</button></a><PostPopup value="post_header"></PostPopup><AdvertisePopup></AdvertisePopup><button className="btn-menu1" onClick={logout}>Logout</button></div>  
    </header>

  );
}
export default Header;