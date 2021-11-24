import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { useHistory } from "react-router";
import ShowMoreText from "react-show-more-text";
import { auth, db, storeDB, logout} from "../../firebase";

import { Timestamp , serverTimestamp  } from "firebase/firestore"; 
import { deleteObject } from "firebase/storage";

import * as Scroll from 'react-scroll';
import { /*Link, */Button, Element, Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll'

import Popup from "reactjs-popup";

import "./AdvertisePopup.css";

function AdvertisePopup(prop) {

 //console.log(prop.value);

  const [user, loading, error] = useAuthState(auth); 
  const [uid, setId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profilePicURL, setImageUrl]= useState("");
  const [file,  setFile] = useState(null);
  const [fileObj,  setFileObject] = useState("");
  const [fileType,  setFileType] = useState("");
  const [url, setURL] = useState("");
  const [uref, setUref] = useState("");
  const [pref, setPref] = useState("");
  const [popupWHeader, setPopupHeader] = useState("Create an Advertisement");
  //const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [imagePath, setImagePath] = useState("");
  const [videoShowingStyle, setVideoDisplayStyle] = useState("uploaded_video");
  const [imageShowingStyle, setImageDisplayStyle] = useState("uploaded_image");
  const [docRef, setDocRef] = useState("");
  const [fileChanged, setFileChanged] = useState(1);


  
    
  const fetchUserName = async () => {
    try {
      //alert('fetchUserName');
      const query = await db.collection("users").where("uid", "==", user.uid).get();
      const data = await query.docs[0].data();
      //console.log(data);
      setId(data.uid);
      setName(data.name);
      setEmail(data.email);
      let id=query.docs[0].id;  
      setUref(id);

      let pathUP= "";
      storeDB.ref('/users/'+id+'/profile.PNG').getDownloadURL()
        .then((url) => {
          pathUP= url;
          setImageUrl(pathUP);
      }) 
      .catch((err) => {
        storeDB.ref('/users/common_profile.PNG').getDownloadURL()
          .then((url) => {
            pathUP= url;
            setImageUrl(pathUP);
        }) 
      }) 
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching user data");
    }
  };



  const submitPost = (e) => {
    e.preventDefault();
   // let topic = document.getElementById('textTopic').value;
    let description = document.getElementById('textContent').value
   // alert("submitted"+document.getElementById('textContent').value);
   //alert(file.name);
   
  // alert(uref);
  if(popupWHeader=="Edit the advertisement")
  {
    alert("update");
    console.error( db.collection("/users/"+uref+"/advertiesments").doc(docRef).update({"description": description, "approved_status": 0, "time_updated":Timestamp.fromDate(new Date())  }));
    if(fileChanged==1){
      
    let ref =storeDB.ref("/users/"+uref+"/advertiesments/"+docRef+"/"+`${file.name}`);  
    const uploadTask = ref.put(file);
    uploadTask.on("state_changed", console.log, console.error, () => {
      ref.getDownloadURL().then((url) => { 
            

          if(fileType=="video"){
            let coll ="/users/"+uref+"/advertiesments/"+docRef+"/videos";
            let coll2 ="/users/"+uref+"/advertiesments/"+docRef+"/images";
            db.collection(coll).get().then(querySnapshot => {
                try{querySnapshot.docs[0].ref.delete();} catch (err){/**/ }            
            }).then(()=>{db.collection(coll2).get().then(querySnapshot1 => {
            try{querySnapshot1.docs[0].ref.delete();} catch (err){/**/ }            
            })})
            .then(()=>{db.collection(coll).add({video_url: url,})})
          }
          else{ 
            let coll ="/users/"+uref+"/advertiesments/"+docRef+"/videos";
            let coll2 ="/users/"+uref+"/advertiesments/"+docRef+"/images";
            db.collection(coll).get().then(querySnapshot => {
              try{querySnapshot.docs[0].ref.delete();} catch (err){/**/ }            
            }).then(()=>{db.collection(coll2).get().then(querySnapshot1 => {
              try{querySnapshot1.docs[0].ref.delete();} catch (err){/**/ }            
            })})
            .then(()=>{db.collection(coll2).add({
                image_url: url,})})
          }
          
          setFile(null);
          setURL(url);
        });
      });
    }
  }
  else{ 
   
   let doc= db.collection("/users/"+uref+"/advertiesments").add({ 
    time_added :Timestamp.fromDate(new Date()),
    description: description,
    approved_status:0,
  }).then(function(docRef) {
    setPref(docRef.id);
   //alert("/users/"+uref+"/posts/"+docRef.id+"/"+`${file.name}`)
    let ref =storeDB.ref("/users/"+uref+"/advertiesments/"+docRef.id+"/"+`${file.name}`);  
    const uploadTask = ref.put(file);
    uploadTask.on("state_changed", console.log, console.error, () => {
      ref.getDownloadURL().then((url) => {
        alert(url);
          if(fileType=="video"){
            
            let coll ="/users/"+uref+"/advertiesments/"+docRef.id+"/videos";
            db.collection(coll).add({
              video_url: url,})
          }
          else{
            let coll ="/users/"+uref+"/advertiesments/"+docRef.id+"/images";
            db.collection(coll).add({
              image_url: url,})
          }
          
          setFile(null);
          setURL(url);
        }).then(() => {
         /* try { 
            // console.error( db.collection("/users/"+uref+"/post/"+docRef.id+"/images").doc(doc).update({"approved_status": -1  }));
            alert("/users/"+uref+"/post/"+docRef.id+"/images");
            db.collection("/users/"+uref+"/post/"+docRef.id+"/images").add({
              image_url: url,})
          } catch (err) {
            console.error(err);
            alert(err.message);
          }*/
        });
    });
  })
  .then(function() { 
   /* let ref =null;
   if(fileType=="video") {
          ref = storeDB.ref("/users/"+uref+"/posts/"+pref+"/"+`${file.name}`);
    }
    else
    {
      alert("/users/"+uref+"/posts/"+pref+"/"+`${file.name}`);
       ref = storeDB.ref("/users/"+uref+"/posts/"+pref+"/"+`${file.name}`);
    }

    const uploadTask = ref.put(file);
    uploadTask.on("state_changed", console.log, console.error, () => {
      ref
        .getDownloadURL()
        .then((url) => {
          setFile(null);
          setURL(url);
        });
    }); */
  })
  .catch(function(error) {
      console.error("Error adding document: ", error);
  });


   
  }//end of else
    
  }
  

  const loadFile = (e) => { 

   
    setFileObject("")
    setFileChanged(1);
    let type = ((e.target.files[0].type).split("/"))[0]; 
   
    setFileObject(URL.createObjectURL(e.target.files[0]));
    setFile(e.target.files[0]);
   console.log(e.target.files[0]);
    setFileType(type);
    if(type=="video"){
      //alert("vvvv"+type);
      document.getElementById('uploaded_image').style.display='none';
      document.getElementById('uploaded_video').style.display='block';
    }
    else{
      //alert("iii"+type);
      document.getElementById('uploaded_video').style.display='none';
      document.getElementById('uploaded_image').style.display='block';
    }

  }
  

  const loadButton = () => { 
    if(prop.value=="adv_header"){
      setPopupHeader("Create an advertisement");     
      setVideoDisplayStyle('uploaded_video');
      setImageDisplayStyle('uploaded_image1');
        return(
            <button className="btn-menu1" onClick="">Advertise</button>
        )
    }
    else /*if(prop.value=="post_edit")*/{
      setPopupHeader("Edit the advertisement");
     // setTopic(prop.value.topic);
      setDescription(prop.value.description);
      setImageDisplayStyle('uploaded_image1');
      setDocRef(prop.value.post_ref);
      
      if(prop.value.type==1){
        
        //console.log(((prop.value.urls)[0]).image_url);  
       // setFile(((prop.value.urls)[0]).image_url); 
       //let blob =  fetch(((prop.value.urls)[0]).image_url).then(r => r.blob());
       // setFile(blob);
        setFileObject(((prop.value.urls)[0]).image_url);
        setVideoDisplayStyle('uploaded_video');
        setImageDisplayStyle('uploaded_imag1');
      //document.getElementById('uploaded_video').style.display='block';     
      }else if(prop.value.type==2){
        //let blob =  fetch(((prop.value.urls_v_p)[0]).video_url).then(r => r.blob());
        //setFile(blob);
        //console.log(((prop.value.urls_v_p)[0]).video_url);  
       // setFile(((prop.value.urls_v_p)[0]).video_url); 
        setFileObject(((prop.value.urls_v_p)[0]).video_url);
        setVideoDisplayStyle('uploaded_video1');
        setImageDisplayStyle('uploaded_image1');
      //document.getElementById('uploaded_video').style.display='block';     
      }
      else if(prop.value.type==0){
        setVideoDisplayStyle('uploaded_video');
        setImageDisplayStyle('uploaded_image1');
       // setFile(null); 
       // setFileObject(""); 

      }
      else{
        console.log("tt"+prop.value.type+"ttt");
        setImageDisplayStyle('uploaded_image1');
      }

     // alert(imageShowingStyle);

      return(
          <button className="btnEdit" onClick={(evt) => edit(evt)}>Edit</button>
      )
  }
  }

  const popupHeader = () => { 
    if(prop.value=="postHome"){
    return(
        <p>Create an adverisement</p>
    )
    }
    else if(prop.value=="post_header"){
        return(
          <p>Create an advertisement</p>
        )
    }
    else /*if(prop.value=="post_edit")*/{
      return(
        <p>Update the Advertisment</p>
      )
    }
  }

  const edit = (e) => {
    //
  }


  useEffect(() => {
    //alert("useEffect");
    if (loading) return;
    //if (!user) {return history.replace("/")}
    fetchUserName(); 

  }, [user, loading]);

  //console.log(file);
    //
  return (
    
    <Popup  trigger={loadButton} position="center">
    {  
    close => ( 
  <div className="advertise_popup">
    <div className="popup_header">
      <h5>{popupWHeader}
    <a className="close" onClick={close}>
      &times;
    </a></h5>
    </div>
    <div className="popup_profile"><img className="post-pro-pic" src={profilePicURL} alt="Los Angeles" width="20%" height="20%"/> {name}</div>
   <div className="popup_text"><textarea id="textContent" placeholder="What do you want to talk advertise?">{description}</textarea></div>
    <div className="popup_uploaded"> <img className="uploaded_image" className={imageShowingStyle} id="uploaded_image" src={fileObj} width="50%" height="50%"/><video className="uploaded_video" className={videoShowingStyle} id="uploaded_video" src={fileObj} controls></video></div>
    <div className="popup_icons"><input type="file" onChange={(evt) => loadFile(evt)} id="myFile" name="filename"></input></div>
    <div className="popup_submit"><button className="btn-menu" onClick={submitPost}>Submit</button></div>
  </div> 

)}
</Popup>

  )
}
export default AdvertisePopup;