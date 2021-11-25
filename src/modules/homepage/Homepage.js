import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { useHistory } from "react-router";
import ShowMoreText from "react-show-more-text";
import "./Homepage.css";
import { auth, db, storeDB, logout } from "../../firebase";
import * as Scroll from 'react-scroll';
import { /*Link, */Button, Element, Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll'
import 'react-dropzone-uploader/dist/styles.css'
import Dropzone from 'react-dropzone-uploader'
import { getDroppedOrSelectedFiles } from 'html5-file-selector';

import Popup from "reactjs-popup";

/**paste from bkp */

import logo from '../../assets/logo.PNG';
import home from '../../assets/home.PNG';
import './Homepage.css';  
import Header from "../header/Header";
import Profile from "../profile/Profile";
import PostPopup from "../post_popup/PostPopup"; 

/****************************************** */

//alert(1);
let pathAUP= "";
let myItems = [];
let picPath = []; 
let ads1=[];

/******* load all users.... */
db.collection('users').get().then((snippetsSnapshot) =>{
  snippetsSnapshot.docs.forEach((doc) => {   

  let name = doc.data().name;
  let pathAUP = doc.data().profile_url;
  if(!pathAUP || pathAUP==""){
    /*storeDB.ref('/users/common_profile.PNG').getDownloadURL()
          .then((url) => {
            pathAUP= url; 
        }) */
        pathAUP='https://firebasestorage.googleapis.com/v0/b/acs-sawa.appspot.com/o/users%2Fcommon_profile.PNG?alt=media&token=37d32b69-0801-44cf-bace-42ffe518b59d';
  }
  /*******load all posts****** */
  db.collection('/users/'+doc.id+'/post').where("approved_status", "==", 1).get().then((querySnapshot) => {
  querySnapshot.docs.forEach((doc1) => {
         
    let item_p=[]; 
    let urls_p =[];
    let urls_v_p =[];
        
    item_p=doc1.data(); 
    item_p.name = name;
    item_p.path1 = pathAUP; 
    item_p.type=0;
    item_p.url="";
    item_p.url_v="";
    item_p.urls=[];
    item_p.urls_v=[];
   // alert('/users/'+doc.id+'/posts/'+doc1.id+"/images");
    
    db.collection('/users/'+doc.id+'/post/'+doc1.id+"/images").get().then((querySnapshot1) => {
      querySnapshot1.docs.forEach((doc3) => {    
       // alert(doc3.id);
        let images_urls_p= doc3.data(); 
        urls_p.push(images_urls_p);      
        item_p.type=1;
       
      })
    })     
    item_p.urls=urls_p; 
   // console.log(urls);
    
    db.collection('/users/'+doc.id+'/post/'+doc1.id+"/videos").get().then((querySnapshot2) => {
      querySnapshot2.docs.forEach((doc3) => {    
        let videos_urls_p= doc3.data(); 
        urls_v_p.push(videos_urls_p); 
       item_p.type=2;
       
      })
    }) 
   
    item_p.urls_v_p = urls_v_p;

    myItems.push(item_p); 
  
    myItems.sort(function (a, b) {
      return b.time_added - a.time_added;
    });                        
              
    

            
    }) })
 //console.log(myItems);
  
  /*******load all advertiesments****** */
  db.collection('/users/'+doc.id+'/advertiesments').where('approved_status', '==', 1).get().then((querySnapshot) => {
    querySnapshot.docs.forEach((doc2) => {
      
    let item=[]; 
    let urls =[];
    let urls_v =[];
        
    item = doc2.data();         
    item.name = name;
    item.type=0;
    item.url="";
    item.url_v="";
    item.urls=[];
    item.urls_v=[];

    db.collection('/users/'+doc.id+'/advertiesments/'+doc2.id+"/images").get().then((querySnapshot1) => {
      querySnapshot1.docs.forEach((doc3) => {    
        let images_urls= doc3.data(); 
        urls.push(images_urls);      
       item.type=1;
       
      })
    })     
    item.urls=urls; 
   // console.log(urls);
    
    db.collection('/users/'+doc.id+'/advertiesments/'+doc2.id+"/videos").get().then((querySnapshot1) => {
      querySnapshot1.docs.forEach((doc3) => {    
        let videos_urls= doc3.data(); 
        urls_v.push(videos_urls); 
       item.type=2;
       
      })
    }) 
   
    item.urls_v = urls_v;

    ads1.push(item); 
  
    ads1.sort(function (a, b) {
      return b.time_added - a.time_added;
    });                        
              
    }) }) // end of load all advertisements


}) }) 

      


 
function Homepage() {

  function sayHello() {
    alert('Hello!');
  }

  //alert(2);
  const [currentTab, setCurrentTab] = useState('homepage');

  const [user, loading, error] = useAuthState(auth); 
  
  const [uid, setId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profilePicURL, setImageUrl]= useState("");
  const [profileImgPath, setProfPic] = useState("");
  const [advURLS, setFiles] = useState([]);
  const [advDesc, setAddDesc] = useState([]);
  const [posts, setPosts] = useState([]);
  const [image, setImage] = useState("");
  const [file,  setFile] = useState("");
  

  

  const history = useHistory();

  const [readMore,setReadMore]=useState(false);
  
  const linkName=readMore?'Read Less << ':'Read More >> ';

  const [activeIndex, setActiveIndex] = useState(null);

  const [isOpen, setIsOpen] = useState(false);
 
  const togglePopup = () => {
    setIsOpen(!isOpen);
  }
  


  const ReadMore = ({ children }) => {
    //alert('ReadMore');
    const text = children;
    const [isReadMore, setIsReadMore] = useState(true);
    const toggleReadMore = () => {
      setIsReadMore(!isReadMore);
    };
    return (
      <p className="text">
        {isReadMore ? text.slice(0, 200) : text}
        <span onClick={toggleReadMore} className="read-or-hide"><br></br>
          <span className="read-more-link">{isReadMore ? "...see more" : " ...show less"}</span>
        </span>
      </p>
    );
  }; 

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

  const togglePopup1 = () => {
    alert("yy");
    setIsOpen(!isOpen);
    alert(isOpen);
  }

  const submitPost = () => {
    
    alert("submitted");
  }
  const ac = () => {
    
    alert("ac"); 
  }

  const loadFile = (e) => { 
    let type = ((e.target.files[0].type).split("/"))[0];
   
    setFile(URL.createObjectURL(e.target.files[0]))
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

  
  useEffect(() => {
    //alert("useEffect");
    if (loading) return;
    if (!user) {return history.replace("/")}
    //else{return history.replace("/homepage")};
    
   // fetchPostData();
    fetchUserName();

  }, [user, loading]);  

  return (
    
<div className="dashboard">

<div><Header></Header></div> 
  
<div className="home-content">  
<div className="home-su-welcome1"><h4>Welcome to your social awareness network</h4> </div>
<Profile></Profile>     

<div className="second_col_parent1 mainClos">
  <div className="center-col">
    <div class=" posts-start1">
      <div className="posts-bu1">
        <div className="sp-pro-pic" onClick={togglePopup1}><img className="post-pro-pic" src={profilePicURL} alt="Los Angeles" width="20%" height="20%"/> 
            &nbsp;&nbsp;&nbsp;<PostPopup value="postHome"></PostPopup></div> 
      </div>
    </div>
    <div class="posts-home">
    {myItems.map((entity, index) => {  console.log(entity);
        return (       
    
      <div className="post">
      <div><img className="post-pro-pic" src={entity.path1} alt="" width="20%" height="20%"/>  <span className="postuname">{entity.name}- {new Date(entity.time_added * 1000).toLocaleDateString("en-us")} {new Date(entity.time_added * 1000).toLocaleTimeString("en-us")}</span></div>       
      <div className="post-desc"  key={index}>
        <p><b>{entity.topic}</b></p>
        {(entity.urls).map((entity2, index) => {  //console.log(entity2.image_url);
            return (
            <img src={entity2.image_url} className="App-adv" alt="logo" />
            )  }) }
            
            {(entity.urls_v_p).map((entity3, index) => { // console.log(entity3.video_url);
            return (
            <video className="App-adv-video" src={entity3.video_url} controls>
              Your browser does not support the video tag.
            </video>
             )  }) }
        <p><ReadMore>{entity.description_post}</ReadMore></p>
      </div> 
    </div>
        );
      })}

    

</div>
  </div>
</div>
 
<div className="third_col_parent1 mainClos">
    <div className="adv-container1 container">
    {ads1.map((entity1, index) => {  //console.log(entity1);
        return ( 
          <div className="div-advertiesments1 section"> <p><b>{entity1.description} </b><br></br> <i>Advertised By: {entity1.name}</i></p>
            {(entity1.urls).map((entity2, index) => {  console.log(entity2.image_url);
            return (
            <img src={entity2.image_url} className="App-adv" alt="logo" />
            )  }) }
            
            {(entity1.urls_v).map((entity3, index) => {  //console.log(entity3.video_url);
            return (
            <video className="App-adv-video" src={entity3.video_url} controls>
              Your browser does not support the video tag.
            </video>
             )  }) }

            </div> 
            
        );
      })}   
    </div>
</div>




    </div>

    <div id='overlay'><img src="./../../assets/waiting.png"></img></div>

      
    </div>
  );
}
export default Homepage;