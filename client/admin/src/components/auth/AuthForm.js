import { useState, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';


import classes from './AuthForm.module.css';
import AuthContext from '../../context/auth-context';
import Api from '../../service/api';
import Loading from '../ui/Loading';

function AuthForm() {
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);

    const emailInputRef = useRef();
    const passwordInputRef = useRef();

    const authCtx = useContext(AuthContext);


    const submitHandler = (event) => {
        event.preventDefault();
        setError(false);
        setIsLoading(true);
        const enteredEmail = emailInputRef.current.value;
        const enteredPassword = passwordInputRef.current.value;
        Api.admin.login({
            email: enteredEmail,
            password: enteredPassword
        }).then(result => {
            return result.json();
        }).then(data => {
            // console.log(data);
            authCtx.login(data);
            setIsLoading(false);
            setError(false);
            navigate('/');
        }).catch(err => {
            console.log(err);
            setError(true);
            setIsLoading(false);
        }
        );

    }
    const onClickHandler = () => {
        setError(false);
        setIsLoading(false);
    }
    return (
        <form onSubmit={submitHandler} className={classes.form}>
            <h1>Login</h1>
            <div className={classes.status}>
                {isLoading && <div><span><Loading className={classes.loading} /></span></div>}
                {error && <div><span><p className={classes.loginFail}>Login Failed!</p></span></div>}
            </div>

            <div className={classes.info}>
                <label>Email: </label>
                <input type='email' id='email' ref={emailInputRef} onClick={onClickHandler}></input>
            </div>
            <div className={classes.info}>
                <label>Password: </label>
                <input type='password' id='password' ref={passwordInputRef}></input>
            </div>

            <button type='submit'>Login</button>
        </form>
    )
}

export default AuthForm