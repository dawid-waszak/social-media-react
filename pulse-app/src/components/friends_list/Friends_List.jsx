import React from 'react'
import styles from './Friends_List.module.css'
import image from '../../assets/avatar.png'

const Friends_List = ({friends}) => {
  return (
    <div className={styles.friends_con}>
        <h1>Friends list</h1>
        {friends.length > 0 && friends.map( (friend, index) => 
            <div key={index} className={styles.friend}>
                <img src={image} alt="" />
                {friend.fullname}
            </div>
        )}
    </div>
  )
}

export default Friends_List