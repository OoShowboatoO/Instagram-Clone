import React,  { useState, useEffect } from 'react';
import './App.css';
import Post from "./Post";
import ImageUplaod from "./ImageUpload";
import InstagramEmbed from './InstagramEmbed';
import { db, auth } from "./firebase";
import { collection, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged, createUserWithEmailAndPassword, updateProfile, signOut, signInWithEmailAndPassword } from 'firebase/auth';
import { styled } from '@mui/material/styles';
import { Modal, Box, Button, Input } from '@mui/material';


function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const StyledPaper = styled(Box)(({ theme }) => ({
  position: 'absolute',
  width: 400,
  backgroundColor: theme.palette.background.paper,
  border: '2px solid #000',
  boxShadow: theme.shadows[5],
  padding: theme.spacing(2, 4, 3),
}));


function App() {
  const modalStyle = getModalStyle();
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [user, setUser] = useState(null);
  const [openSignIn, setOpenSignIn] = useState(false);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        console.log(authUser);
        setUser(authUser);
      } else {
        setUser(null);
      }
    });

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, [user, username]);

  
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "posts"), (snapshot) => {
      setPosts(snapshot.docs.map(doc => ({ id: doc.id, post: doc.data() })));
    });
    // Cleanup the listener
    return () => unsubscribe(); 
  }, []);

  
  const signUp = async (event) => {
    event.preventDefault();
  
    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  
      // Update the user's profile with a display name
      await updateProfile(userCredential.user, {
        displayName: username,
      });
  
      console.log("User signed up successfully:", userCredential.user);
    } catch (error) {
      alert("Error signing up:", error.message);
    }
  };


  const signIn = async (event) => {
    event.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setOpenSignIn(false);
    } catch (error) {
      alert(error.message);
    }
  };


  return (
    <div className="app">
      
      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        <StyledPaper style={modalStyle}>
          <form className="app__signup">
              <center>
                <img
                  className="app__headerImage"
                  src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png"
                  alt=""
                />
              </center>
              <Input
                type="text"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Input
                placeholder="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                placeholder="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              /> 
              <Button type="submit" onClick={signUp}>Sign Up</Button>           
          </form>
        </StyledPaper>
      </Modal>


      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
      >
        <StyledPaper style={modalStyle}>
          <form className="app__signup">
              <center>
                <img
                  className="app__headerImage"
                  src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png"
                  alt=""
                />
              </center>
              <Input
                placeholder="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                placeholder="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              /> 
              <Button type="submit" onClick={signIn}>Sign In</Button>           
          </form>
        </StyledPaper>
      </Modal>


      <div className="app__header">
        <img
          className="app__headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png"
          alt=""
        />
        {
          user ? (<Button onClick={() => signOut(auth)}>Logout</Button>) :
          (<div className="app__loginContainer">
            <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
            <Button onClick={() => setOpen(true)}>Sign Up</Button>
          </div>)
        }
      </div>

      <div className="app__posts">
        <div className="app__postsLeft"> 
          {
            posts.map(({id, post}) => (
            <Post
              key={id}
              postId={id}
              user={user}
              username={post.username}
              caption={post.caption}
              imageUrl={post.imageUrl}
            />))
          }
        </div>

        <div className="app__postsRight">
          <InstagramEmbed
            url="https://www.instagram.com/p/DCj9NIivVzc/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=="
            maxWidth={320}
            hideCaption={false}
          />
        </div>
      </div>
      
      {user?.displayName ? (
        <ImageUplaod username={user.displayName} />
      ) : (
        <h3>Please login.</h3>
      )}
      
    </div>
  );
}

export default App;
