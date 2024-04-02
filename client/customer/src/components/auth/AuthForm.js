import React, { useRef, useState, useContext, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useGoogleLogin } from 'react-google-login';
import { loadGapiInsideDOM } from "gapi-script";
import FacebookLogin from '@greatsumini/react-facebook-login';
// import { FacebookLoginClient } from '@greatsumini/react-facebook-login';



import classes from './AuthForm.module.css';
import Api from '../../service/api';
import AuthContext from '../../context/auth-context';
import Loading from '../ui/Loading';
import StatusContext from '../../context/status-context';
import GG from '../../images/google_icon.png';
import FB_Icon from '../../images/facebook_icon.png';

function AuthForm({ loginMode }) {

  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);
  const statusCtx = useContext(StatusContext);
  const [isLoading, setIsLoading] = useState(false);

  const location = useLocation();
  const [previousPath, setPreviousPath] = useState(null);

  let searchParams = new URLSearchParams(location.search);

  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const confirmPasswordInputRef = useRef();

  // google
  useEffect(() => {
    window.scrollTo(0, 0);
    (async () => {
      await loadGapiInsideDOM();
    })();
  }, []);
  // facebook
  // const appId = process.env.REACT_APP_Facebook_APP_ID;
  // useEffect(() => {
  //   FacebookLoginClient.init({ appId: '488211450087339' });
  // }, []);

  // 
  useEffect(() => {
    if (authCtx.isLoggedIn) {
      navigate('/');
    }
  }, []);
  const onClickToLink = event => {
    console.log(location.pathname);
    if (location.pathname === '/signup') {
      setPreviousPath('/signup');
    }
  }
  const submitHandler = (event) => {
    event.preventDefault();
    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;


    if (loginMode) {
      setIsLoading(true);
      Api.user.login({
        email: enteredEmail,
        password: enteredPassword
      }).then(result => {
        return result.json();
      }).then(data => {
        // console.log(data);
        authCtx.login(data);
        setIsLoading(false);
        if (previousPath) {
          // console.log(previousPath);
          setPreviousPath(null);
          navigate('/');
        } else {
          navigate(-1);
        }
      })
        .catch(err => {
          err.json().then(error => {
            statusCtx.setValue('error', error.message);
            setIsLoading(false);
          });
        });
    } else {
      setIsLoading(true);
      const enteredConfirmPassword = confirmPasswordInputRef.current.value;
      Api.user.signup({
        email: enteredEmail,
        password: enteredPassword,
        confirmPassword: enteredConfirmPassword
      }).then(result => {
        return result.json();
      }).then(data => {
        setPreviousPath('signup');
        setIsLoading(false);
        statusCtx.setValue('success', 'Đăng ký thành công.');
        navigate('/login');
      })
        .catch(err => {
          err.json().then(error => {
            statusCtx.setValue('error', error.message);
            setIsLoading(false);
          });
        })

    }
  }
  const externalLogin = (email, name) => {
    Api.user.google_login({ email: email })
      .then(result => {
        return result.json();
      })
      .then(data => {
        authCtx.login(data);
        navigate('/');
      })
      .catch(error => {
        console.log(error);
        if (error.status === 401) {
          searchParams.set('email', email);
          searchParams.set('name', name);
          navigate({
            pathname: '/create-password',
            search: searchParams.toString()
          })
        } else {
          navigate('/error');
        }
      })
  }
  const { signIn: googleLogin } = useGoogleLogin({
    clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
    onSuccess: (response) => {
      // console.log(response);
      const email = response.profileObj.email;
      const name = response.profileObj.name;
      externalLogin(email, name);
    }
  });

  // const facebookLogin = () => {
  //   FacebookLoginClient.login(console.log, {
  //     scope: 'public_profile, email',
  //   });
  // };
  const facebookLogin = (response) => {
    // console.log(response);
    // when success, use the email address and name to sign up my services
    const email = response.email;
    const name = response.name;
    externalLogin(email, name);
  }
  return (
    <div className={classes.main}>
      <form className={classes.authform} onSubmit={submitHandler}>
        <h3>{loginMode ? 'Đăng Nhập' : 'Đăng Ký'}</h3>
        <div className={classes.form_input}>
          <label htmlFor="username">Username</label>
          <input ref={emailInputRef} type="text" placeholder="Email" id="username" />
        </div>
        <div className={classes.form_input}>
          <label htmlFor="password">Password</label>
          <input ref={passwordInputRef} type="password" placeholder="Password" id="password" />
        </div>

        {(!loginMode) && <div className={classes.form_input}>
          <label htmlFor="password">Confirm Password</label>
          <input ref={confirmPasswordInputRef} type="password" placeholder="Confirm Password" id="confirmPassword" />
        </div>}
        <div className={classes.loading_div}>
          {isLoading && <Loading />}
        </div>
        <button type='submit'>{loginMode ? 'Đăng nhập' : 'Đăng Ký'}</button>
        <div className={classes.signup}>
          <Link to={loginMode ? '/signup' : '/login'} onClick={onClickToLink}>{loginMode ? 'Đăng ký' : 'Đăng nhập'}</Link>
        </div>
        <div className={classes["social"]} >
          <div className={classes.social_item} onClick={googleLogin}>
            <div className={classes.social_image}>
              <img src={GG} alt='google icon' />
            </div>
            <span>Google</span>
          </div>
          {/* <div className={classes.social_item} onClick={facebookLogin}>
            <div className={classes.social_image}>
              <img src={FB_Icon} alt='facebook icon' />
            </div>
            <span>Facebook</span>
          </div> */}
          <FacebookLogin
            appId="488211450087339"
            onSuccess={(response) => {
              console.log('Login success: ', response);
            }}
            onFail={(error) => {
              console.log('Login Failed!', error);
            }}
            onProfileSuccess={facebookLogin}
            render={({ onClick }) => (
              <div className={classes.social_item} onClick={onClick}>
                <div className={classes.social_image}>
                  <img src={FB_Icon} alt='facebook icon' />
                </div>
                <span>Facebook</span>
              </div>
            )}
          />

        </div>
      </form >
    </div >

  );
}

export default React.memo(AuthForm);