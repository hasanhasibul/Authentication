import React, { useState } from 'react';
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebaseConfig';
firebase.initializeApp(firebaseConfig);

function App() {
  const [user , setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    photo: ''
    

  })

  const provider = new firebase.auth.GoogleAuthProvider();
  const signInhandler = () =>{
  firebase.auth().signInWithPopup(provider).then(result =>{ 

    const{displayName,email,photoURL} = result.user;
    const signedInUser ={
      isSignedIn: true,
      name: displayName,
      email: email,
      photo: photoURL
    }
    setUser(signedInUser);
    console.log(displayName)
   
  })
  .catch(error =>{
    console.log(error);
    console.log(error.message)
  })
 }
 const signOuthandler = ()=>{
   firebase.auth().signOut().then(result =>{
   const signOutUser ={
     isSignedIn : false,
     name: '',
     email: '',
     password:'',
     photo: '',
     error: '',
     existingUser:false,
     isValid :false
   }
   setUser(signOutUser);
   })
   .catch(error =>{
     console.log(error);
   })
 }

 const isValidEmail = email =>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

 const onChange = (event)=>{
  const newUserInfo = {
    ...user,
    
  }
  
  let isValid = true;
    if(event.target.name==='email'){
      isValid = (isValidEmail(event.target.value))
    }
    if (event.target.name ==='password'){
      isValid = event.target.value.length >8;
    }
    newUserInfo[event.target.name] = event.target.value;
    newUserInfo.isValid = isValid;
    setUser(newUserInfo);
    console.log(newUserInfo)
 }

 const creatAccount = (event)=>{
   if( user.isValid === true){
    firebase.auth().createUserWithEmailAndPassword(user.email,user.password).then(res=>{
      console.log(res);
      const creatNewUser = {...user};
      creatNewUser.error='';
      creatNewUser.isSignedIn=true;
      setUser(creatNewUser);
    })
    .catch(error=>{
      console.log(error);
      const creatNewUser = {...user};
      creatNewUser.isSignedIn=false;
      creatNewUser.error=error.message;
      setUser(creatNewUser);
    })
   }
   else{
     console.log("Form is not valid",user.email,user.password);
   }
  event.preventDefault();
  event.target.reset();
 } 
 const singInUser=(event)=>{
  if( user.isValid === true){
    firebase.auth().signInWithEmailAndPassword(user.email,user.password).then(res=>{
      console.log(res);
      const creatNewUser = {...user};
      creatNewUser.error='';
      creatNewUser.isSignedIn=true;
      setUser(creatNewUser);
    })
    .catch(error=>{
      console.log(error);
      const creatNewUser = {...user};
      creatNewUser.isSignedIn=false;
      creatNewUser.error=error.message;
      setUser(creatNewUser);
    })
   }
   else{
     console.log("Form is not valid",user.email,user.password);
   }
  event.preventDefault();
  event.target.reset();
 }

 const switchForm =(event)=>{
  const creatNewUser = {...user};
  creatNewUser.existingUser=event.target.checked;
  setUser(creatNewUser);
 }
  return (
    <div className="App " >
      <br/>
       <h1>Sign In with Google  </h1>
       <br/>
       { user.isSignedIn ? <button className="button" onClick={signOuthandler}>Sign Out</button> : <button className="button" onClick={signInhandler}>Sign In</button>}

       {
         user.isSignedIn && <div className="result" >
           <h3>Welcome , {user.name}</h3>
           <h3>Email : {user.email} </h3>
           <img src={user.photo} alt=""/>
         </div>
       }
       <div>
         <br/>
         <h1>Or </h1>
         <br/>
         <h1> Create An Account</h1>
          <input type="checkbox" name="switchForm"  onChange={switchForm} id="switchForm" />
           <label  htmlFor="switchForm"> I Have an Account</label>

         <form className="Control" style={{display:user.existingUser ? 'block':'none'}} onSubmit={singInUser}>
            <input onBlur={onChange} type="text" name="email" placeholder="Your email" required/>
            <br/>
            <input onBlur={onChange} type="password" name ="password" placeholder="Your Password" required />
            <br/>
            <input type="submit" value="sign In"/>
        </form>

        <form className="Control" style={{display:user.existingUser ? 'none':'block'}} onSubmit={creatAccount}>
            <input onBlur={onChange} type="text" name="name" placeholder="Your Name" required/>
            <br/>
            <input onBlur={onChange} type="text" name="email" placeholder="Your email" required/>
            <br/>
            <input onBlur={onChange} type="password" name ="password" placeholder="Your Password" required />
            <br/>
            <input type="submit" value="Creat Account"/>
        </form>
        {
          user.error && <h1>{user.error}</h1>
        }
       </div>
      
    </div>
  );
}

export default App;
