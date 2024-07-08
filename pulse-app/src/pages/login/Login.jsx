import React, { useState } from 'react'
import styles from './Login.module.css'
import {Link, useNavigate, useSearchParams} from 'react-router-dom'
import MailVerification from '../../functions/MailVerification';
import MinCharVerification from '../../functions/MinCharVerification';
import ValidateUser from '../../functions/ValidateUser';
import FetchPost from '../../functions/FetchPost';

const Login = () => {
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

    const [mail, setMail] = useState("");
    const [password, setPassword] = useState("");
    const [mailError, setMailError] = useState("");
    const [passError, setPassError] = useState("");
    var errorMsg = "";
    const queryParams = new URLSearchParams(window.location.search);

    if(queryParams.get('login') == "false"){
        errorMsg = "Wrong mail or password";
    }

    const getUsers = async (e) => {
        try{
            var user = await FetchPost('http://localhost:3000/login', JSON.stringify({mail: mail, password: password}));
            if(user.userFound){
                window.location.href = window.location.pathname+"?"+"login=false";
            }
            if(password == user.password){
                navigate('/welcome');
            }
            else{
                window.location.href = window.location.pathname+"?"+"login=false";
            }
        }catch{
            console.log("Connection to user failed");
        }
    }

    const checkData = (e) => {
        e.preventDefault();
        if(MinCharVerification(mail) && MailVerification(mail) && MinCharVerification(password)){
            getUsers(e);
        }
        else{
            setMailError("");
            setPassError("");
            if(!MailVerification(mail)){
                setMailError("Mail must be in proper form!");
            }
            if(!MinCharVerification(password)){
                setPassError("Password must be longer than 3 characters!");
            }
        }
    }
    if(loading == false){
  return (
    <div className={styles.login_con}>

        <div className={styles.shadow}>
            <h1>We are glad you are with us!</h1>
            <form onSubmit={(e) => checkData(e)} className={styles.form} id='login'>
                <input className={styles.input} onChange={(e) => setMail(e.target.value)} value={mail} type="text" placeholder='E-mail'/>
                <p style={{color: 'red', marginTop: '0.5rem', marginBottom: '0.5rem'}}>{mailError}&nbsp;</p>
                <input className={styles.input} onChange={(e) => setPassword(e.target.value)} value={password} type="password" placeholder='Password'/>
                <p style={{color: 'red', marginTop: '0.5rem', marginBottom: '0.5rem'}}>{passError}&nbsp;</p>
                <input type="submit" className={styles.btn} value='Login'/>
            </form>
            <span style={{color: 'red', display: 'block', marginTop: '-2rem', marginBottom: '-2rem'}}>{errorMsg}</span>
            <p>Don't have account yet? <Link to='/register'>Create account</Link></p>
        </div>
    </div>
  )
    }
}

export default Login