import React from 'react';
import { useState } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import logo from './assets/logo.PNG';
import './App.css';

import posts from './posts_categories';
import modules from './modules'; // All the parent knows is that it has modules ...

import firebase from './firebase';



function App() {

  
  const [currentTab, setCurrentTab] = useState('homepage');
  //var db = firebase.firestore();
  
const db = firebase.firestore();

  /*const citiesCol = db.collection('gender'); 
  const cityList = citiesCol.map(citiesCol => citiesCol.name);
  console.log(cityList);*/
  
  console.log("fffff");


  return (
      <Router>
        <div className="App">

          <header className="App-header">

            <div className="div-logo-menue">
            <div className="div-logo">
            <img src={logo} className="App-logo" alt="logo" />
            </div>
            <div className="div-menue">
            <ul className="App-nav">
              {modules.map(module => ( // with a name, and routes , view aexcept signup
                  <li key={module.name} className={currentTab === module.name ? 'active' : ''}>
                    <Link to={module.routeProps.path} onClick={() => setCurrentTab(module.name)}>{module.name}</Link>
                  </li>              ))}
            </ul>
            </div>
            </div>
            </header>

            
             <div className="div-categories-content-adver">

               

          <div className="App-content">
            {modules.map(module => (
              <Route {...module.routeProps} key={module.name} />
            ))}


              {posts.map(post => (
              <Route {...post.routeProps} key={post.name} />
            ))}  

          </div>

           
          
           
            </div>     

        </div>

      

      </Router>
  );
}


export default App;