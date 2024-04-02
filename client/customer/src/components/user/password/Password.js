import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';

import classes from '../profile/Profile.module.css';
import StatusContext from '../../../context/status-context';

import useInput from '../../../hooks/use-input';
import Api from '../../../service/api';

function Password() {

  const statusCtx = useContext(StatusContext);
  const navigate = useNavigate();


  const [clickForm, setClickForm] = useState(false);

  const {
    value: enteredOldPassword,
    valueChangeHandler: oldPasswordInputChangeHandler,
    setValue: setEnteredOldPassword,
    hasError: oldPasswordInputHasError
  } = useInput(value => value.trim().length >= 6);
  const {
    value: enteredNewPassword,
    valueChangeHandler: newPasswordInputChangeHandler,
    setValue: setEnteredNewPassword,
    hasError: newPasswordInputHasError
  } = useInput(value => (value.trim() !== enteredOldPassword.trim()) && (value.trim().length >= 6));

  const {
    value: enteredConfirmNewPassword,
    valueChangeHandler: confirmNewPasswordInputChangeHandler,
    setValue: setEnteredConfirmNewPassword,
    hasError: confirmNewPasswordInputHasError
  } = useInput(value => (value.trim() === enteredNewPassword.trim()) && (value.trim().length >= 6));

  const onSubmitHandler = event => {
    event.preventDefault();
    if (oldPasswordInputHasError) {
      statusCtx.setValue('error', 'Mật khẩu cũ không hợp lệ.');
      setClickForm(true);
      return;
    }
    if (newPasswordInputHasError) {
      statusCtx.setValue('error', 'Mật khẩu cũ và mật khẩu mới trùng nhau.');
      setClickForm(true);
      return;
    }
    if (confirmNewPasswordInputHasError) {
      statusCtx.setValue('error', 'Mật khẩu nhập lại không khớp mật khẩu mới.');
      setClickForm(true);
      return;
    }
    Api.user.changePassword({ oldPassword: enteredOldPassword, newPassword: enteredNewPassword, confirmNewPassword: enteredConfirmNewPassword })
      .then(result => {
        console.log(result);
        if (result.status === 200) {
          statusCtx.setValue('success', 'Cập nhập mật khẩu thành công.');
          setClickForm(false);
          setEnteredOldPassword('');
          setEnteredNewPassword('');
          setEnteredConfirmNewPassword('');
        } else if (result.status === 401) {
          statusCtx.setValue('error', 'Mật khẩu cũ không đúng!');
        }
      })
      .catch(error => {
        navigate('/error');
      })
  }
  return (
    <div className={classes.profile}>
      <h1 className={classes.title}>Đổi Mật Khẩu</h1>
      <form className={`grid grid--3-cols ${classes.form_info}`} onSubmit={onSubmitHandler}>

        <label htmlFor='oldPassword' className={classes.form_info_label}>Mật khẩu cũ</label>
        <input id='oldPassword' type='password' value={enteredOldPassword} onChange={oldPasswordInputChangeHandler}
          className={`${(oldPasswordInputHasError && clickForm) ? `${classes.form_info_input_not_valid} ${classes.form_info_input}` : classes.form_info_input}`} />

        <label htmlFor='newPassword' className={classes.form_info_label}>Mật khẩu mới</label>
        <input id='newPassword' type='password' value={enteredNewPassword} onChange={newPasswordInputChangeHandler}
          className={`${(newPasswordInputHasError && clickForm) ? `${classes.form_info_input_not_valid} ${classes.form_info_input}` : classes.form_info_input}`} />

        <label htmlFor='confirmNewPassword' className={classes.form_info_label + ' ' + classes.confirmNewPassword}>Nhập lại mật khẩu mới</label>
        <input id='confirmNewPassword' type='password' value={enteredConfirmNewPassword} onChange={confirmNewPasswordInputChangeHandler}
          className={`${(confirmNewPasswordInputHasError && clickForm) ? `${classes.form_info_input_not_valid} ${classes.form_info_input}` : classes.form_info_input}`} />

        <div className={classes.btn_container}>
          <button className={`${classes.btn} ${classes.update}`} >Thay đổi mật khẩu</button>
        </div>
      </form>
    </div>
  )
}

export default Password