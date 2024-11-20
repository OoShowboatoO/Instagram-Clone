import React,  { useState, useEffect } from 'react';
import './Post.css';
import Avatar from '@mui/material/Avatar';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

function Post({postId, user, username, caption, imageUrl}) {

  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");


  useEffect(() => {
    let unsubscribe;
    if (postId) {
      const commentsRef = collection(db, "posts", postId, "comments");
      const commentsQuery = query(commentsRef, orderBy("timestamp", "desc"));
  
      unsubscribe = onSnapshot(commentsQuery, (snapshot) => {
        setComments(snapshot.docs.map((doc) => doc.data()));
      });
    }
  
    return () => {
      if (unsubscribe) {
        unsubscribe(); 
      }
    };
  }, [postId]);


  const postComment = async (event) => {
    event.preventDefault();
  
    if (postId && comment.trim()) {
      const commentsRef = collection(db, "posts", postId, "comments");
      await addDoc(commentsRef, {
        text: comment,
        username: user.displayName,
        timestamp: serverTimestamp(),
      });
      // Clear comment input after posting
      setComment(""); 
    }
  };


  return (
    <div className="post">
      {/* header -> avatar + username */}
      <div className='post__header'>
        <Avatar 
          className='post__avatar'
          alt='Mengxuan'
          src='/yellow_duck.jpg'
        />
        <h3>{username}</h3>
      </div>

      
      {/* image */}
      <img className="post__image" src={imageUrl} alt="" />
      {/* username + caption */}
      <h4 className="post__text"> <strong>{username}</strong>: {caption}</h4>

      <div className="post__comments">
        {comments.map((comment) => (
          <p>
            <strong>{comment.username}</strong> {comment.text}
          </p>
        ))}
      </div>

      {user && (
        <form className="post__commentBox">
          <input
            className="post__input"
            type="text"
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            className="post__button"
            disabled={!comment}
            type="submit"
            onClick={postComment}
          >
            Post
          </button>
        </form>
      )}
    </div>
  )
}

export default Post