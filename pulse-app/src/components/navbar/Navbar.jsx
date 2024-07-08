import React, { useState } from 'react'
import styles from './Navbar.module.css'
import Logo from '../logo/Logo'
import ValidateUser from '../../functions/ValidateUser';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isLogged, setIsLogged] = useState(false);

  const navigate = useNavigate();

  (async () => {
      var data = await ValidateUser();
      if(data.isLogged == false){
        setIsLogged(false);
      }else{
        setIsLogged(true);
      }
  })()
  if(isLogged == false){
    return (
      <nav>
          <Logo/>
      </nav>
    )
  }else{
    return (
      <nav>
        <Logo/>
        <div className="navbar">
          
        </div>
      </nav>
    )
  }
  
}

export default Navbar