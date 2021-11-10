import React from 'react';
import { useState } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import logo from './assets/logo.PNG';
import adv from './assets/adv_1.PNG';
import './App.css';



import posts from './posts_categories';
import modules from './modules'; // All the parent knows is that it has modules ...

function App() {
  const [currentTab, setCurrentTab] = useState('homepage');

  return (
      <Router>
        <div className="App">

            
             <div className="div-categories-content-adver">     
            <div className="div-categories" >
            <ul className="list-categories">            
              {posts.map(post => ( // with a name, and routes , view aexcept signup
                  <li key={post.name} className={currentTab === post.name ? 'active' : ''}>
                    {post.name==='Signup' ? '' : <Link to={post.routeProps.path} onClick={() => setCurrentTab(post.name)}>{post.name}</Link>
                    } 
                    </li>
              ))}
            </ul>
            </div>            
          </div>

          <div className="App-content">
            {modules.map(module => (
              <Route {...module.routeProps} key={module.name} />
            ))}


              {posts.map(post => (
              <Route {...post.routeProps} key={post.name} />
            ))}  

          </div>

              

        </div>

      

      </Router>
  );
}


export default App;