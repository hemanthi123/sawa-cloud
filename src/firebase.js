import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';


/*const firebaseConfig = {
  apiKey: "AIzaSyAOGxaETGgi4hfWDTpxVxwMqWV92qeVdKc",
  authDomain: "acs-sawa.firebaseapp.com",
  projectId: "acs-sawa",
  storageBucket: "acs-sawa.appspot.com",
  messagingSenderId: "454479955690",
  appId: "1:454479955690:web:be674586655568daa1f993"
  };*/

  const firebaseConfig = {
    apiKey: "AIzaSyAOGxaETGgi4hfWDTpxVxwMqWV92qeVdKc",
    authDomain: "acs-sawa.firebaseapp.com",
    databaseURL: "https://acs-sawa-default-rtdb.firebaseio.com",
    projectId: "acs-sawa",
    storageBucket: "acs-sawa.appspot.com",
    messagingSenderId: "454479955690",
    appId: "1:454479955690:web:be674586655568daa1f993"
  };
  
  const app = firebase.initializeApp(firebaseConfig);
  const auth = app.auth();
  const db = app.firestore();
  const storeDB = app.storage();
  const googleProvider = new firebase.auth.GoogleAuthProvider();
  
  const signInWithGoogle = async () => {
    try {
      const res = await auth.signInWithPopup(googleProvider);
      const user = res.user;
      const query = await db.collection("users").where("uid", "==", user.uid).get();
      if (query.docs.length === 0) {
        await db.collection("users").add({
          uid: user.uid,
          name: user.displayName,
          authProvider: "google",
          email: user.email,
          user_type: 1,
        });
      }
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };
  const signInWithEmailAndPassword = async (email, password) => {
    try {
      await auth.signInWithEmailAndPassword(email, password);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };
  const registerWithEmailAndPassword = async (name, email, password) => {
    try {
      const res = await auth.createUserWithEmailAndPassword(email, password);
      const user = res.user;
      await db.collection("users").add({
        uid: user.uid,
        name:name,
        authProvider: "local",
        email:email,
        userType:1,
      });
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };
  const sendPasswordResetEmail = async (email) => {
    try {
      await auth.sendPasswordResetEmail(email);
      alert("Password reset link sent!");
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const logout = () => {
    auth.signOut();
    
  };
  export {
    auth,
    db,
    storeDB,
    signInWithGoogle,
    signInWithEmailAndPassword,
    registerWithEmailAndPassword,
    sendPasswordResetEmail,
    logout, 
  };