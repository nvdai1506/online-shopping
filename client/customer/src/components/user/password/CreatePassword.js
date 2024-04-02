import React, { useState, useContext } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';
import useInput from '../../../hooks/use-input';
import classes from '../profile/Profile.module.css';
import classes2 from './CreatePassword.module.css';

import StatusContext from '../../../context/status-context';
import AuthContext from '../../../context/auth-context';
import Api from '../../../service/api';
import LoadingBackdrop from '../../loading/LoadingBackdrop';

function CreatePassword() {
  // For google login
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const email = search.get('email');
  const name = search.get('name');
  // 
  const statusCtx = useContext(StatusContext);
  const authCtx = useContext(AuthContext);

  const [clickForm, setClickForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    value: enteredNewPassword,
    valueChangeHandler: newPasswordInputChangeHandler,
    hasError: newPasswordInputHasError
  } = useInput(value => (value.trim().length >= 6));

  const {
    value: enteredConfirmNewPassword,
    valueChangeHandler: confirmNewPasswordInputChangeHandler,
    hasError: confirmNewPasswordInputHasError
  } = useInput(value => (value.trim() === enteredNewPassword.trim()) && (value.trim().length >= 6));

  const onSubmitHandler = event => {
    event.preventDefault();
    if (newPasswordInputHasError) {
      statusCtx.setValue('error', 'Mật khẩu không hợp lệ.');
      setClickForm(true);
      return;
    }
    if (confirmNewPasswordInputHasError) {
      statusCtx.setValue('error', 'Mật khẩu nhập lại không khớp.');
      setClickForm(true);
      return;
    }
    setIsLoading(true);
    // sign up
    Api.user.signup({
      email: email,
      password: enteredNewPassword,
      confirmPassword: enteredConfirmNewPassword
    }).then(result => {
      return result.json();
    }).then(data => {
      statusCtx.setValue('success', 'Đăng ký thành công.');
      // login
      Api.user.login({
        email: email,
        password: enteredNewPassword
      }).then(result => {
        return result.json();
      }).then(data => {
        authCtx.login(data);
        // update user
        Api.user.updateUser({
          name: name,
        })
          .then(result => { return result.json() })
          .then(data => {
            setIsLoading(false);
            navigate('/');
          })
          .catch(err => {
            setIsLoading(false);
            navigate('/error');
          })
      })
        .catch(err => {
          err.json().then(error => {
            statusCtx.setValue('error', error.message);
            setIsLoading(false);
          });
        });
    })
      .catch(err => {
        err.json().then(error => {
          statusCtx.setValue('error', error.message);
          setIsLoading(false);
        });
      })

  }


  return (
    <div className={classes2.create_password_form_container}>
      {isLoading && <LoadingBackdrop />}
      <div className={classes2.create_password_form}>
        <h1 className={classes.title}>Tạo mật khẩu</h1>
        <form className={`grid grid--3-cols ${classes.form_info}`} onSubmit={onSubmitHandler}>

          <label htmlFor='newPassword' className={classes.form_info_label}>Mật khẩu</label>
          <input id='newPassword' type='password' value={enteredNewPassword} onChange={newPasswordInputChangeHandler}
            className={`${(newPasswordInputHasError && clickForm) ? `${classes.form_info_input_not_valid} ${classes.form_info_input}` : classes.form_info_input}`} />

          <label htmlFor='confirmNewPassword' className={classes.form_info_label + ' ' + classes.confirmNewPassword}>Nhập lại mật khẩu</label>
          <input id='confirmNewPassword' type='password' value={enteredConfirmNewPassword} onChange={confirmNewPasswordInputChangeHandler}
            className={`${(confirmNewPasswordInputHasError && clickForm) ? `${classes.form_info_input_not_valid} ${classes.form_info_input}` : classes.form_info_input}`} />

          <div className={classes.btn_container}>
            <button className={`${classes.btn} ${classes.update}`} >Tạo mật khẩu</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreatePassword