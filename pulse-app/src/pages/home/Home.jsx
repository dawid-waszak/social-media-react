import React, { useState } from 'react'
import image from '../../assets/Home_img.jpg'
import styles from './Home.module.css'
import {Link, useNavigate} from 'react-router-dom'
import ButtonLink from '../../components/buttonLink/ButtonLink'
import ValidateUser from '../../functions/ValidateUser'

const Home = () => {
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    (async () => {
        var data = await ValidateUser();
        if(data.isLogged == false){
        setLoading(false);
        }else{
        navigate('/welcome');
        }
    })()

  const btnClick = (route) => {
    navigate(route);
  }

  if(loading == false){
  return (
    <div className={styles.home_con}>
        <div className={styles.left}>
            <h1>Join <i>Pulse</i> Today</h1>
            <p>
            Be part of a community where your voice matters. 
            Sign up now and start experiencing the best of social networking.
            </p>
            <div className={styles.buttons}>
              <ButtonLink route={'/login'} title={'Login'}/>
              or
              <ButtonLink route={'/register'} title={'Create account'}/>
            </div>
        </div>
        <div className={styles.right}>
            <img src={image} alt="" />
        </div>
    </div>
  )
  }
}

export default Home