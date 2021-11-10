import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { useHistory } from "react-router";
import ShowMoreText from "react-show-more-text";
import { auth, db, storeDB, logout } from "../../firebase";
import * as Scroll from 'react-scroll';
import { /*Link, */Button, Element, Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll'


/**paste from bkp */

import logo from '../../assets/logo.PNG';
import home from '../../assets/home.PNG';
import './YourRecentAdvertisements.css'; 

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
  let postUid = doc.data().uid;
  let pathAUP = doc.data().profile_url;
  /*******load all posts****** */
  //db.collection('/users/'+doc.id+'/post').where("approved_status", "==", 0).get().then((querySnapshot) => {
    db.collection('/users/'+doc.id+'/advertiesments').where("approved_status", "!=", -2).get().then((querySnapshot) => {
  querySnapshot.docs.forEach((doc1) => {
    
   
      
    let item_p=[]; 
    let urls_p =[];
    let urls_v_p =[];
    let files =[];

    
    item_p=doc1.data(); 
    item_p.name = name;    
    item_p.postUid = postUid;
    item_p.post_path = '/users/'+doc.id+'/advertiesments/'+doc1.id;
    item_p.post_ref= doc1.id; 
    item_p.path1 = pathAUP; 
    item_p.type=0;
    item_p.url="";
    item_p.url_v="";
    item_p.urls=[];
    item_p.urls_v=[];
   // alert('/users/'+doc.id+'/posts/'+doc1.id+"/images");
    
    db.collection('/users/'+doc.id+'/advertiesments/'+doc1.id+"/images").get().then((querySnapshot1) => {
      querySnapshot1.docs.forEach((doc3) => {    
       // alert(doc3.id);
        let images_urls_p= doc3.data(); 
        urls_p.push(images_urls_p);      
        item_p.type=1;
       
      })
    })     
    item_p.urls=urls_p; 
   // console.log(urls);
    
    db.collection('/users/'+doc.id+'/advertiesments/'+doc1.id+"/videos").get().then((querySnapshot2) => {
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


}) }) 

      


 
function YourRecentAdvertisements() {

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
  

  

  const history = useHistory();

  const [readMore,setReadMore]=useState(false);
  
  const linkName=readMore?'Read Less << ':'Read More >> ';

  const [activeIndex, setActiveIndex] = useState(null);


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

  const fetchPostData = async () => {
   try {
      //alert(1);
      let pathAUP= "";
      let myItems = [];
      let picPath = []; 
      
      
      db.collection('users').get().then((snippetsSnapshot) =>{
        snippetsSnapshot.docs.forEach((doc) => {   
      
          let name = doc.data().name;
          let postUid = doc.data().uid;
          db.collection('/users/'+doc.id+'/post').get().then((querySnapshot) => {
          querySnapshot.docs.forEach((doc1) => {
          let item=doc1.data(); 
          item.name = name;
          item.postUid = postUid;
                  
            storeDB.ref('/users/'+doc.id+'/profile.PNG').getDownloadURL().then((url) => {
            pathAUP= url; 
            item.path1=pathAUP;
            //alert(pathAUP);
            //picPath.push(pathAUP); 
            })    
            .catch((err) => {
              storeDB.ref('/users/common_profile.PNG').getDownloadURL().then((url2) => {
                    pathAUP= url2;
                    item.path1=pathAUP;
                    //alert(pathAUP);
                  picPath.push(pathAUP); 
                })
            })  
                  
            myItems.push(item); 
            myItems.sort(function (a, b) {
              return b.time_added - a.time_added;
            });

            setPosts(myItems);
                          
            })                           
          })
        }) 
      })
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching user data");
    }
  }
  
const deleteFn = (e) => {  
    
  let i = (e.target.id).lastIndexOf("/")
  let col= (e.target.id).substr(0,i);
  let doc = (e.target.id).substr(i+1);

  document.getElementById(e.target.id).parentNode.parentNode.style.display="none";
 // console.log(doc); 
  try {
    alert("Deleted");
     // db.ref('/users/7sG6slUIOzgqCxg4BUYY/post').child('lz4sJPjFUr1KGlyawK0n').set({'approved_status':1})
     console.error( db.collection(col).doc(doc).update({"approved_status": -2  }));
    
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
}
 
  const edit = (e) => {
    
   /* document.getElementById(e.target.id).parentElement.style.display='none';
    let i = (e.target.id).lastIndexOf("/");
    let col= (e.target.id).substr(0,i);
    let doc = (e.target.id).substr(i+1);
   // console.log(doc); 
    try {
      alert("Rejected");
       // db.ref('/users/7sG6slUIOzgqCxg4BUYY/post').child('lz4sJPjFUr1KGlyawK0n').set({'approved_status':1})
       console.error( db.collection(col).doc(doc).update({"approved_status": -1  }));
      
    } catch (err) {
      console.error(err);
      alert(err.message);
    } */
  }


  useEffect(() => {
    //alert("useEffect");
    if (loading) return;
    if (!user) {return history.replace("/")}
    //else{return history.replace("/homepage")};
    
   // fetchPostData();
    fetchUserName();
    /**************************************** */
    /*const fetchImages = async () => {

      let ads=[];
      let adsImgs=[];
      
      db.collectionGroup('advertiesments').get().then((querySnapshot) => {
        querySnapshot.docs.forEach((doc1) => {
          let item=doc1.data();  
          //console.log(item); 
         // ads.push(item);   
        }) 
        //setAddDesc(ads);
        //console.log(ads);
      })
      .then(() => { 
        for(var i=0; i<ads.length; i++){ 
          //let result = storeDB.ref().child(ads[i]).listAll();
          //let result = storeDB.ref(ads[i]).listAll();
          //console.log(ads);
          //console.log(result);
        }
      }) 
      //return Promise.all(adsImgs);
    };

    const loadImages = async () => {
      const urls = await fetchImages();
      setFiles(urls);
      //console.log(advURLS);
    };
  //  loadImages(); */
    /************************************ */

  }, [user, loading]);  

  return (
    
<div className="dashboard">

  <Header></Header>  

  
<div className="home-content">
  
 

<div className="home-su-welcome1"><h4>Your Recent Advertisements</h4> </div>


<Profile></Profile>
  
   
    
  

<div className="second_col_parent_my_adv">
  <div className="center-col">
    
    <div class="posts-home_approve_p">
    {myItems.filter(filterItems => filterItems.postUid===uid).map((entity, index) => {  
    let status_ap="";
    if(entity.approved_status==0)
    status_ap="Pending";
    else if(entity.approved_status==1)
    status_ap="Approved";
    else if(entity.approved_status==-1)
    status_ap="Rejected";
    else if(entity.approved_status==-2)
    status_ap="Deleted";
        return (       
    
      <div className="post">
      <div><img className="post-pro-pic" src={entity.path1} alt="" width="20%" height="20%"/>  <span className="postuname">{entity.name}- {new Date(entity.time_added * 1000).toLocaleDateString("en-us")} {new Date(entity.time_added * 1000).toLocaleTimeString("en-us")}</span></div>       
      <div className="post-desc"  key={index}>
        <h6>{status_ap}</h6>
        {(entity.urls).map((entity2, index) => {  //console.log(entity);
            return (
            <img src={entity2.image_url} className="App-adv" alt="logo" />
            )  }) }
            
            {(entity.urls_v_p).map((entity3, index) => {  //console.log(entity);
            return (
            <video className="App-adv-video" src={entity3.video_url} controls>
              Your browser does not support the video tag.
            </video>
             )  }) }
        <p><ReadMore>{entity.description}</ReadMore></p>
      </div> 
      <div className="div-appr-button"><PostPopup value={entity}></PostPopup>  <button id={entity.post_path} onClick={(evt) => deleteFn(evt)} className="btnDelete">Delete</button> </div> 
    </div> 
        );
      })}


    

</div>
  </div>
</div>

 


    </div>


      
    </div>
  );
}
export default YourRecentAdvertisements;