import React, { useState, useContext, useEffect, useCallback } from 'react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';



import classes from './Voucher.module.css';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import VoucherList from './VoucherList';
import useInput from '../../hooks/use-input';
import StatusContext from '../../context/status-context';
import Api from '../../service/api';



function Voucher({ onCloseVoucherHandler }) {
  const statusCtx = useContext(StatusContext);

  const [selectValue, setSelectValue] = useState(0);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [listIsChange, setListIsChange] = useState(false);

  useEffect(() => {
  }, [listIsChange])

  const {
    value: enteredCaptcha,
    hasError: captchaError,
    valueChangeHandler: captchaChangedHandler,
    reset: resetCaptchaInput
  } = useInput(value => value.trim().length >= 5);
  const {
    value: enteredSale,
    hasError: saleError,
    valueChangeHandler: saleChangedHandler,
    reset: resetSaleInput
  } = useInput(value => isNaN(value) !== true);


  const onSubmitHandler = (event) => {
    event.preventDefault();
    if (captchaError) {
      return statusCtx.setValue('error', 'Captcha is invalid!');
    }
    if (selectValue.toString() === '0') {
      return statusCtx.setValue('error', 'Type is invalid!');
    }
    if (saleError) {
      return statusCtx.setValue('error', 'Sale is invalid!');
    }
    if (fromDate === null || toDate === null) {
      return statusCtx.setValue('error', 'Date is invalid!');
    }
    let percent = 0;
    let vnd = 0;
    if (selectValue.toString() === '1') {
      percent = Number(enteredSale);
    } else if (selectValue.toString() === '2') {
      vnd = Number(enteredSale);
    }
    const voucher = {
      captcha: enteredCaptcha,
      percent,
      vnd,
      fromDate: moment(fromDate).format(),
      toDate: moment(toDate).format()
    }
    // console.log(voucher);
    Api.admin.addVoucher(voucher)
      .then(result => {
        if (result.status === 201) {
          statusCtx.setValue('success', 'Voucher is created successfully');
          resetCaptchaInput();
          resetSaleInput();
          setSelectValue(0);
          setListIsChange(!listIsChange);
        }
      })
      .catch(err => {
        console.log(err);
        if (err.status === 409) {
          statusCtx.setValue('error', 'Captcha is existed.');
        } else {
          statusCtx.setValue('error', 'Can not create voucher!');
        }
      });
  }

  const toggleHandler = value => {
    setListIsChange(value);
  }
  const onChangeSelect = event => {
    setSelectValue(event.target.value);
  };
  const fromDateChangeHandler = event => {
    setFromDate(event);
  };
  const toDateChangeHandler = event => {
    setToDate(event);
  };
  return (
    <Modal className={classes.modal} onClose={onCloseVoucherHandler}>
      <div className={classes.voucher_container}>
        <div className={classes.voucher}>
          <form className={classes.form} onSubmit={onSubmitHandler}>
            <Input title='Captcha'
              className={classes.captcha_input}
              value={enteredCaptcha}
              onChange={captchaChangedHandler}
            />
            <div className={classes.sale}>

              <Select
                title='Type'
                className={classes.select}
                onChange={onChangeSelect}
                values={[{ _id: 1, value: '1', title: '%' }, { _id: 2, value: '2', title: 'VND' }]}
                value={selectValue}
              />
              <Input title='Sale (%,Vnd)'
                className={classes.sale_input}
                value={enteredSale}
                onChange={saleChangedHandler}
              />
            </div>
            <div className={classes.date_container}>
              <div className={classes.date}>
                <label htmlFor='date_from'>From:</label>
                <DatePicker
                  id='date_from'
                  className={classes.datePicker_input}
                  onChange={fromDateChangeHandler}
                  selected={fromDate}
                />
              </div>
              <div className={classes.date}>
                <label htmlFor='date_to'>To:</label>
                <DatePicker
                  id='date_to'
                  className={classes.datePicker_input}
                  onChange={toDateChangeHandler}
                  selected={toDate}

                />
              </div>
            </div>
            <Button className={classes.btn} type='submit'>Add</Button>
          </form>
          <VoucherList listIsChange={listIsChange} toggleHandler={toggleHandler} />
          <div className={classes.cancel} >
            <Button className={classes.cancel_btn} state='cancel' onClick={onCloseVoucherHandler}>Close</Button>
          </div>
        </div>
      </div>
    </Modal >
  )
}

export default Voucher