import React,  { useState } from 'react';
import { Button} from '@mui/material';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { storage, db } from './firebase';

function ImageUpload({ username }) {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleChange = (event) => {
    if (event.target.files[0]) {
      setImage(event.target.files[0]);
    }
  };


  const handleUpload = () => {
    if (!image) {
      alert("Please select an image to upload.");
      return;
    }
  
    // Reference to the storage location
    const storageRef = ref(storage, `images/${image.name}`);
  
    // Start the upload task
    const uploadTask = uploadBytesResumable(storageRef, image);
  
    // Monitor the progress of the upload
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const currProgress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(currProgress);
      },
      (error) => {
        console.error(error);
        alert(error.message);
      },
      async () => {
        // Get the download URL once the upload is complete
        try {
          const url = await getDownloadURL(storageRef);
  
          // Add post data to Firestore
          await addDoc(collection(db, 'posts'), {
            timestamp: serverTimestamp(),
            caption: caption,
            imageUrl: url,
            username: username,
          });
  
          // Reset the form state
          setProgress(0);
          setCaption('');
          setImage(null);
        } catch (error) {
          console.error('Error adding document:', error);
          alert('Failed to save post.');
        }
      }
    );
  };


  return (
    <div className="imageupload">
      <progress className="imageupload__progress" value={progress} max="100" />
      {/* caption input */}
      <input
          type="text"
          placeholder="Write a caption..."
          onChange={(event) => setCaption(event.target.value)}
          value={caption}
      />
      {/* file picker */}
      <input type="file" onChange={handleChange} />

      {/* post button */}
      <Button className="imageupload__button" onClick={handleUpload}>
          Upload
      </Button>
      </div>
  )
}

export default ImageUpload;