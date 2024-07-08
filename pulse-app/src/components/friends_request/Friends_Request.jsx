import { useState } from 'react'
import styles from './Friends_Request.module.css'
import image from '../../assets/avatar.png'
import ValidateUser from '../../functions/ValidateUser'
import { useNavigate } from 'react-router-dom'
import FetchPost from '../../functions/FetchPost'

const Friends_Request = ({friends, requests}) => {

    const navigate = useNavigate();

    const inviteFriend = async (id) => {
        var data = await ValidateUser();
        if(data.isLogged == true){
            var x = await FetchPost('http://localhost:3000/sendFriendRequest', JSON.stringify({userId: id}));
            if(x.success){
                alert("Request send!");
                location.reload();
            }else{
                alert("Failed to send a request!");
            }
        }else{
            navigate('/login');
        }
    }

    const handleFriend = async (id, state) => {
        var data = await ValidateUser();
        if(data.isLogged == true){
            const body = JSON.stringify({
                state: state,
                friendId: id
            });
            console.log(id);
            var x = await FetchPost('http://localhost:3000/handleFriendRequest', body);
            if(x.success){
                alert("Request send!");
                location.reload();
            }else{
                alert("Failed to send a request!");
            }
        }else{
            navigate('/login');
        }
    }


  return (
    <div className={styles.request_con}>
        <h1>Friends request</h1>
        {requests.length > 0 && requests.map( (item, index) => 
            <div key={index} className={styles.friend}>
                <img src={image} alt="" />
                <p>{item.fullname}</p>
                <button onClick={() => handleFriend(item._id, true)} className='btn'>Accept</button>
                <button onClick={() => handleFriend(item._id, false)} className='btn'>Decline</button>
            </div>
        )}
        {friends.length > 0 && friends.map( (friend, index) => 
            <div key={index} className={styles.friend}>
                <img src={image} alt="" />
                <p>{friend.fullname}</p>
                <button onClick={() => inviteFriend(friend._id)} className='btn'>Invite</button>
            </div>
        )}
    </div>
  )
}

export default Friends_Request