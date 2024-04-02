import React, { useContext, useEffect, useState } from 'react'

import classes from './Profile.module.css';
import Api from '../../../service/api';
import useInput from '../../../hooks/use-input';
import { useNavigate } from 'react-router-dom';
import StatusContext from '../../../context/status-context';
function Profile() {
  const statusCtx = useContext(StatusContext);
  const navigate = useNavigate();
  const [clickForm, setClickForm] = useState(false);

  const {
    value: enteredName,
    valueChangeHandler: nameInputChangeHandler,
    setValue: setEnteredName,
    hasError: nameInputHasError
  } = useInput(value => value.trim() !== '');
  const {
    value: enteredEmail,
    setValue: setEnteredEmail,
  } = useInput(() => { });

  const {
    value: enteredPhone,
    valueChangeHandler: phoneInputChangeHandler,
    setValue: setEnteredPhone,
    hasError: phoneInputHasError
  } = useInput(value => value.trim() !== '');

  const {
    value: enteredAddress,
    valueChangeHandler: addressInputChangeHandler,
    setValue: setEnteredAddress,
    hasError: addressInputHasError
  } = useInput(value => value.trim() !== '');


  useEffect(() => {
    Api.user.getUser()
      .then(result => { return result.json() })
      .then(data => {
        const user = data.user;
        setEnteredName(user.name);
        setEnteredEmail(user.email);
        setEnteredPhone(user.phone);
        setEnteredAddress(user.address);
      })
      .catch(err => {
        navigate('/error');
      })
  }, []);

  const onSubmitHandler = (event) => {
    event.preventDefault();
    if (nameInputHasError || phoneInputHasError || addressInputHasError) {
      statusCtx.setValue('error', 'Thông tin cập nhập không hợp lệ.');
      setClickForm(true);
      return;
    }
    Api.user.updateUser({
      name: enteredName,
      phone: enteredPhone,
      address: enteredAddress
    })
      .then(result => { return result.json() })
      .then(data => {
        statusCtx.setValue('success', 'Cập nhật thành công.');
        const user = data.user;
        setEnteredName(user.name);
        setEnteredPhone(user.phone);
        setEnteredAddress(user.address);
      })
      .catch(err => {
        navigate('/error');
      })
  }
  return (
    <div className={classes.profile}>
      <h1 className={classes.title}>Thông tin tài khoản</h1>
      <form className={`grid grid--3-cols ${classes.form_info}`} onSubmit={onSubmitHandler}>
        <label htmlFor='name' className={classes.form_info_label}>Họ Tên</label>
        <input id='name' type='text' value={enteredName} onChange={nameInputChangeHandler}
          className={`${(nameInputHasError && clickForm) ? `${classes.form_info_input_not_valid} ${classes.form_info_input}` : classes.form_info_input}`} />

        <label htmlFor='email' className={classes.form_info_label}>Email</label>
        <input id='email' type='text' value={enteredEmail} readOnly
          className={`${classes.form_info_input} ${classes.email_field}`} />

        <label htmlFor='phone' className={classes.form_info_label}>Số điện thoại</label>
        <input id='phone' type='text' value={enteredPhone} onChange={phoneInputChangeHandler}
          className={`${(phoneInputHasError && clickForm) ? `${classes.form_info_input_not_valid} ${classes.form_info_input}` : classes.form_info_input}`} />

        <label htmlFor='address' className={classes.form_info_label}>Địa chỉ</label>
        <input id='address' type='text' value={enteredAddress} onChange={addressInputChangeHandler}
          className={`${(addressInputHasError && clickForm) ? `${classes.form_info_input_not_valid} ${classes.form_info_input}` : classes.form_info_input}`} />

        <div className={classes.btn_container}>
          <button className={`${classes.btn} ${classes.update}`} >Cập nhật thông tin</button>
          {/* <button className={`${classes.btn} ${classes.cancel}`}>Huỷ bỏ</button> */}
        </div>
      </form>
    </div>
  )
}

export default Profile