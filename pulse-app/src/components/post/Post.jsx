import React from 'react'
import styles from './Post.module.css'
import image from '../../assets/avatar.png'

const Post = ({post}) => {
  return (
    <div className={styles.post_con}>
        <div className={styles.user}>
          <img src={image} alt="" />
          <span className={styles.username}>{post.userName}</span>
        </div>
        <p className={styles.text}>
            {post.content}
        </p>
    </div>
  )
}

export default Post