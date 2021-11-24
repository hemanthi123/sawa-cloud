import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { auth, sendPasswordResetEmail } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import logo from '../../assets/logo.PNG';

import "./Reset.css";

function Reset() {
  const [email, setEmail] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const history = useHistory();
  useEffect(() => {
    if (loading) return;
    if (user) history.replace("/homepage");
  }, [user, loading]);
  return (
    <div className="login-cont">

    <div className="div-content-login">  

<div className="login-header">
    <div className="logo-welcome"><img src={logo} className="login-logo" alt="logo" /></div>
    <h1 className="login-su-welcome">Welcome to Social Followers</h1> 
</div>

<div className="login-marketing" >
    <div class="container reset-div"> <h5>Reset Password</h5>
    <div className="reset__container">
        <input
          type="text"
          className="reset__textBox"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail Address"
        />
        <button
          className="reset__btn"
          onClick={() => sendPasswordResetEmail(email)}
        >
          Send password reset email
        </button>
        <div>
          Don't have an account? <Link to="/register">Register</Link> now.
        </div>
      </div>
    </div>

    
                 
<div className="div-home-direction">
<ul className="home-direction">
<li>Advertise your small business</li>
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
export default Reset;