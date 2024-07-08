import React, { useState } from 'react'
import styles from './Create_Post.module.css'
import ValidateUser from '../../functions/ValidateUser';
import { useNavigate } from 'react-router-dom';
import FetchPost from '../../functions/FetchPost';

const Create_Post = () => {

    const navigate = useNavigate();

    const [postContent, setPostContent] = useState("");

    const publicPost = async () => {
        var data = await ValidateUser();
        if(data.isLogged == true){
            var x = await FetchPost('http://localhost:3000/createPost', JSON.stringify({content: postContent}));
            setPostContent("");
            if(x.success){
                alert("Post is now public!");
                location.reload();
            }else{
                alert("Failed to post");
            }
        }else{
            navigate('/login');
        }
    }

  return (
    <div className={styles.post_con}>
        <textarea value={postContent} onChange={(e) => setPostContent(e.target.value)} className={styles.post_input} type="text" placeholder='Share something with your friends...' rows='4'/>
        <button onClick={() => publicPost()} className={styles.btn_post}>Post</button>
    </div>
  )
}

export default Create_Post