import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { auth, signInWithEmailAndPassword, signInWithGoogle } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import logo from '../../assets/logo.PNG';

import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const history = useHistory();
  useEffect(() => {
    if (loading) {
      // maybe trigger a loading screen
      return;
    }
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
    <div class="container login-div"><h5>Login</h5> 
<div className="login__container-div">
  <input
    type="text"
    className="login__textBox"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    placeholder="E-mail Address"
  />
  <input
    type="password"
    className="login__textBox"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    placeholder="Password"
  />
  <button
    className="login__btn"
    onClick={() => signInWithEmailAndPassword(email, password)}
  >
    Login
  </button>
  <button className="login__btn login__google" onClick={signInWithGoogle}>
    Login with Google
  </button>
  <div>
    <Link to="/reset">Forgot Password</Link>
  </div>
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
export default Login;