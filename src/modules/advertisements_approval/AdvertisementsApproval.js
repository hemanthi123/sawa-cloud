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
import './AdvertisementsApproval.css'; 


import Header from "../header/Header";
import Profile from "../profile/Profile";

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

  
  /*******load all advertiesments****** */
  db.collection('/users/'+doc.id+'/advertiesments').where('approved_status', '==', 0).get().then((querySnapshot) => {
    querySnapshot.docs.forEach((doc2) => {
      
    let item=[]; 
    let urls =[];
    let urls_v =[];
        
    item = doc2.data();         
    item.name = name;    
    item.post_path = '/users/'+doc.id+'/advertiesments/'+doc2.id;
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

      
 

 
function AdvertisementsApproval() {

   
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
          db.collection('/users/'+doc.id+'/post').get().then((querySnapshot) => {
          querySnapshot.docs.forEach((doc1) => {
          let item=doc1.data(); 
          item.name = name;
                  
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
  
  const approve = (e) => {   
      
      let i = (e.target.id).lastIndexOf("/")
      let col= (e.target.id).substr(0,i);
      let doc = (e.target.id).substr(i+1);
     // console.log(doc); 
      try {
        alert("Approved");
         // db.ref('/users/7sG6slUIOzgqCxg4BUYY/post').child('lz4sJPjFUr1KGlyawK0n').set({'approved_status':1})
         console.error( db.collection(col).doc(doc).update({"approved_status": 1  }));
        
      } catch (err) {
        console.error(err);
        alert(err.message);
      }
    }
    const reject = (e) => {
      
      
      let i = (e.target.id).lastIndexOf("/")
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
      }
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

  }, [user, loading, ads1]);  

  return (
    
<div className="dashboard">

<div><Header></Header></div>  

  
<div className="home-content">
  
<div className="home-su-welcome1"><h4>Approve Pending Advertisements</h4> </div>


<Profile></Profile>

  
   
    
  

<div className="second_col_parent_app_adv">
  <div className="center-col">
    
    <div class="posts-home_approve_p">
    {ads1.map((entity1, index) => {  console.log(entity1);
        return ( 
          <div className="div-advertiesments"> <p>{entity1.description} Advertised By: {entity1.name}</p>
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
 
 <div className="div-appr-button"><button id={entity1.post_path} onClick={(evt) => approve(evt)} className="btnApprove">Approve</button> <button id={entity1.post_path} onClick={(evt) => reject(evt)} className="btnApprove">Reject</button></div> 
    </div> 
            
        );
      })}  


    

</div>
  </div>
</div>

 


    </div>

    <div id='overlay'><img src="./../../assets/waiting.png"></img></div>
      
    </div>
  );
}
export default AdvertisementsApproval;