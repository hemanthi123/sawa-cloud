import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useHistory } from "react-router-dom";
import {  auth,   registerWithEmailAndPassword,   signInWithGoogle,} from "../../firebase";

import logo from '../../assets/logo.PNG';
import "./Register.css";


function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const history = useHistory();
  const register = () => {
    if (!name || !password || !email) {
      alert("Please enter name, email and password");
    }
    else{
      registerWithEmailAndPassword(name, email, password);
    }
  };

  
  useEffect(() => {
   // if (loading) {alert("loading");return};
    if (user) history.replace("/");
  }, [user, loading]);
  
  
  return (
    <div className="login-cont">

    <div className="div-content-login">  

<div className="login-header">
    <div className="logo-welcome"><img src={logo} className="login-logo" alt="logo" /></div>
    <h1 className="login-su-welcome">Welcome to Social Followers</h1> 
</div>


<div className="register-marketing" >
    
<div class="container register-div"> <h5>Register</h5>
   <div className="register__container-div">
        <input
          type="text"
          className="register__textBox"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full Name"
        />
        <input
          type="text"
          className="register__textBox"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail Address"
        />
        <input
          type="password"
          className="register__textBox"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button className="register__btn" onClick={register}>
          Register
        </button>
        <button
          className="register__btn register__google"
          onClick={signInWithGoogle}
        >
          Register with Google
        </button>
        <div>
          Already have an account? <Link to="/">Login</Link> now.
        </div>
      </div> 
      </div>    
                 
    <div className="div-home-direction">
<ul className="home-direction">
<li>Advertise your small business here</li>
<li>View all trending posts</li>
<li>Share your ideas</li>
</ul>
</div>


            </div>
            <div className="div-content-image"> 
<div className="image-right">
</div>
</div>

            </div>   
            </div>

  );
}
export default Register;