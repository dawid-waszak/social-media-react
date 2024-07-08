import React, { useEffect, useState } from 'react'
import ValidateUser from '../../functions/ValidateUser'
import { useNavigate } from 'react-router-dom';
import styles from './Welcome.module.css'
import Create_Post from '../../components/create_post/Create_Post';
import FetchData from '../../functions/FetchData';
import Post from '../../components/post/Post';
import Friends_Request from '../../components/friends_request/Friends_Request';
import Friends_List from '../../components/friends_list/Friends_List';

const Welcome = () => {
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [posts, setPosts] = useState([]);
  const [friendsProposition, setFriendsProposition] = useState([]);
  const [friendsRequests, setFriendsRequests] = useState([]);
  const [friendsList, setFriendsList] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      var data = await ValidateUser();
      if(data.isLogged == true){
        setName(data.data.fullname);
  
        var postsTemp = await FetchData('http://localhost:3000/getPosts');
        setPosts(postsTemp);

        var friendsReqTemp = [];
        friendsReqTemp = await FetchData('http://localhost:3000/friendsRequests');
        if(friendsReqTemp.success){
          setFriendsRequests(friendsReqTemp.friendsReq);
        }

        var friendsTemp = await FetchData('http://localhost:3000/friendsProposition');
        if(friendsTemp.success){
          setFriendsProposition(friendsTemp.friends);
        }

        var friendsListTemp = await FetchData('http://localhost:3000/friendsList');
        if(friendsListTemp.success){
          setFriendsList(friendsListTemp.friends);
        }

        setLoading(false);
      }else{
        navigate('/login');
      }
    })()
  }, [])

  const LogOutFunction = async () => {
    var x = await FetchData("http://localhost:3000/deleteSession");
    if(x.success){
      location.reload();
    }
  }
  if(loading == false){

  return (
    <div className={styles.welcome_con}>
      <div className={styles.top_bar}>
        <h1>Welcome {name}</h1>
        <button onClick={() => LogOutFunction()} className={styles.btn_logout}>Log out</button>
      </div>
      <div className={styles.main_con}>
        <div className={styles.left_con}>
          <Friends_Request friends={friendsProposition || []} requests={friendsRequests || []}/>
        </div>
        <div className={styles.middle_con}>
          <Create_Post/>
          {posts.map( (post, index) => 
            <Post key={index} post={post}/>
          )}
        </div>
        <div className={styles.right_con}> 
          <Friends_List friends={friendsList}/>
        </div>
      </div>
    </div>
  )
  }
}

export default Welcome