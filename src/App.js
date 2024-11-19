import React,  { useState, useEffect } from 'react';
import './App.css';
import Post from "./Post";
import { db } from "./firebase";
import { collection, onSnapshot } from 'firebase/firestore';
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
  


  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "posts"), (snapshot) => {
      setPosts(snapshot.docs.map(doc => ({ id: doc.id, post: doc.data() })));
    });
  
    return () => unsubscribe(); // Cleanup the listener
  }, []);

  const signUp = (event) => {
    // event.preventDefault();

    // auth
    //   .createUserWithEmailAndPassword(email, password)
    //   .then((authUser) => {
    //     return authUser.user.updateProfile({
    //       displayName: username,
    //     });
    //   })
    //   .catch((error) => error.message);
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
            <Button type="submit" onClick={signIn}>
              Sign In
            </Button>
          </form>
        </StyledPaper>

      </Modal>




      <div className="app__header">
        <img
          className="app__headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png"
          alt=""
        />
      </div>

      <Button onClick={() => setOpen(true)}>
        Sign Up
      </Button>

      <h1> Hello! This is Nino Ding! </h1>
      {
        posts.map(({id, post}) => (
        <Post
          key = {id}
          username={post.username}
          caption={post.caption}
          imageUrl={post.imageUrl}
        />))
      }
      
    </div>
  );
}

export default App;
