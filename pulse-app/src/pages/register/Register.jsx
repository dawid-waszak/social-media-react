import React, { useContext, useState } from 'react'
import styles from './Register.module.css'
import {Link, useNavigate} from 'react-router-dom'
import MailVerification from '../../functions/MailVerification';
import FetchData from '../../functions/FetchData';
import MinCharVerification from '../../functions/MinCharVerification';
import {UserContext} from '../../context/UserContextProvider';
import ValidateUser from '../../functions/ValidateUser';
import FetchPost from '../../functions/FetchPost';

const Register = () => {

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
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");

    const [mailError, setMailError] = useState("");
    const [passError, setPassError] = useState("");
    const [nameError, setNameError] = useState("");

    var errorMsg = "";
    const queryParams = new URLSearchParams(window.location.search);

    if(queryParams.get('create') == "false"){
        errorMsg = "Mail is already used!";
    }

    const userCtx = useContext(UserContext);
    
    const getUsers = async () => {
        var user = await FetchPost('http://localhost:3000/getUser', JSON.stringify({mail: mail}));
        if(user.userFound == false){
            const newUser = JSON.stringify({
                name: name,
                mail: mail,
                password: password
            });
            var x = await FetchPost("http://localhost:3000/createUser", newUser);
            if(x.success == true){
                navigate('/login');
            }
        }else{
            window.location.href = window.location.pathname+"?"+"create=false";
        }
    }

    const checkData = (e) => {
        e.preventDefault();
        setMailError("");
        setPassError("");
        setNameError("");
        if(MinCharVerification(mail) && MailVerification(mail) && MinCharVerification(password) && MinCharVerification(name)){
            getUsers(e);
        }
        else{
            if(!MailVerification(mail)){
                setMailError("Mail must be in proper form!");
            }
            if(!MinCharVerification(password)){
                setPassError("Password must be longer than 3 characters!");
            }
            if(!MinCharVerification(name)){
                setNameError("Name must be longer than 3 characters!");
            }
        }
    }
    if(loading == false){
  return (
    <div className={styles.login_con}>
        <div className={styles.shadow}>
            <h1>Create your account</h1>
            <form onSubmit={(e) => checkData(e)} className={styles.form} action="">
                <input className={styles.input} onChange={(e) => setMail(e.target.value)} value={mail} type="text" placeholder='E-mail'/>
                <p style={{color: 'red', marginTop: '0.5rem', marginBottom: '0.5rem'}}>{mailError}&nbsp;</p>
                <input className={styles.input} onChange={(e) => setName(e.target.value)} value={name} type="text" placeholder='Full name'/>
                <p style={{color: 'red', marginTop: '0.5rem', marginBottom: '0.5rem'}}>{nameError}&nbsp;</p>
                <input className={styles.input} onChange={(e) => setPassword(e.target.value)} value={password} type="password" placeholder='Password'/>
                <p style={{color: 'red', marginTop: '0.5rem', marginBottom: '0.5rem'}}>{passError}&nbsp;</p>
                <input type='submit' className={styles.btn} value='Create account'/>
            </form>
            <span style={{color: 'red', display: 'block', marginTop: '-2rem', marginBottom: '-2rem'}}>{errorMsg}</span>
            <p>You have account already? <Link to='/login'>Go to login page</Link></p>
        </div>
    </div>
  )
    }
}

export default Register