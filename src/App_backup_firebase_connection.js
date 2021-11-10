import React, { useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import firebase from "firebase/compat/app";   // Import firebase client library
import "firebase/compat/firestore";

function App() {
  useEffect(() => {
    firebase.initializeApp({
      apiKey: "AIzaSyAOGxaETGgi4hfWDTpxVxwMqWV92qeVdKc",
      authDomain: "acs-sawa.firebaseapp.com",
      projectId: "acs-sawa",
      storageBucket: "acs-sawa.appspot.com",
      messagingSenderId: "454479955690",
      appId: "1:454479955690:web:be674586655568daa1f993"
    });
    let db = firebase.firestore();
    db.collection("gender")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          console.log(doc.data());
        });                          // retrieve all documents from "testcol"
      });
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;