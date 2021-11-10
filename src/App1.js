import React from 'react';
import { useState } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import logo from './assets/logo.PNG';
import adv from './assets/adv_1.PNG';
import './App.css';

import modules from './modules'; // All the parent knows is that it has modules ...

function App() {
  const [currentTab, setCurrentTab] = useState('homepage');

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
              {modules.map(module => ( // with a name, and routes
                  <li key={module.name} className={currentTab === module.name ? 'active' : ''}>
                    <Link to={module.routeProps.path} onClick={() => setCurrentTab(module.name)}>{module.name}</Link>
                  </li>
              ))}
            </ul>
            </div>
            </div>

            </header>

             <div className="div-categories-content-adver">     
            <div className="div-categories" >
            <ul className="list-categories">
              <li><a href="#Health">Health</a></li>
              <li><a href="#Covid">Covid</a></li>
              <li><a href="#Child Abuse">Child Abuse</a></li>
              <li><a href="#Aged Care">Aged Care</a></li>
              <li><a href="#Bulling">Bulling</a></li>
              <li><a href="#Harrasment">Harrasment</a></li>

          </ul>
            </div>

            <div className="div-advertiesments">
            <img src={adv} className="App-adv" alt="logo" />
            <img src={adv} className="App-adv" alt="logo" />
            <img src={adv} className="App-adv" alt="logo" />
            </div>

          

          <div className="App-content">
            {modules.map(module => (
              <Route {...module.routeProps} key={module.name} />
            ))}
          </div>
          </div>
        </div>
      </Router>
  );
}


export default App;