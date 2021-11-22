

import "./App.css";
import { BrowserRouter as Router, Route, Switch ,Link} from "react-router-dom";
import Login from "./modules/login/Login";
import Register from "./modules/register/Register";
import Reset from "./modules/reset/Reset";
import Homepage from "./modules/homepage/Homepage";
import PostsApproval from "./modules/posts_approval/PostsApproval";
import AdvertisementsApproval from "./modules/advertisements_approval/AdvertisementsApproval";
import YourRecentPosts from "./modules/your_recent_posts/YourRecentPosts";
import YourRecentAdvertisements from "./modules/your_recent_advertisements/YourRecentAdvertisements";






import Hem from './modules/hem/Hem';
import Header from './modules/header/Header';

import React, { Component }  from 'react';

function App() {
  return (
    <div className="app">
      <Router>
        <Switch>
          <Route exact path="/" component={Login} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/reset" component={Reset} />
          <Route exact path="/homepage" component={Homepage} />          
          <Route exact path="/posts_approval" component={PostsApproval} />        
          <Route exact path="/advertisements_approval" component={AdvertisementsApproval} />       
          <Route exact path="/your_recent_posts" component={YourRecentPosts} />      
          <Route exact path="/your_recent_advertisements" component={YourRecentAdvertisements} />
          <Route exact path="/hem" component={Hem} />
          <Route exact path="/header" component={Header} />
        </Switch>
      </Router>
    </div>
  );
}
export default App;

