import React, { useState } from 'react'
import { TbTruckDelivery } from 'react-icons/tb';

import classes from './Payments.module.css';
import logomomo from '../../images/logo-momo.jpg';
import vnpay from '../../images/vnpay.png';

function Payments({ onSubmitOrderHandler, onReceiveCheckValue }) {
  const [check, setCheck] = useState('1');

  const onClickRadioHandler = event => {
    const value = event.target.getAttribute('value');
    setCheck(value);
    onReceiveCheckValue(value);
  }
  return (
    <div className={`${classes.payments}`}>
      <h1 className={`${classes.title} ${classes.title_bottom}`}>Hình thức thanh toán</h1>
      <div className={classes.payment_option + ` ${check === '1' ? classes.payment_option_active : ''}`} value='1' onClick={onClickRadioHandler}>
        <input className={classes.radio} type='radio' name='payment'
          checked={check === '1' ? true : false} value='1' readOnly />
        <TbTruckDelivery className={classes.delivery_icon} />
        <span className={classes.delivery_text}>Thanh toán khi nhận hàng</span>
      </div>
      <div className={classes.payment_option + ` ${check === '2' ? classes.payment_option_active : ''}`} value='2' onClick={onClickRadioHandler}>
        <input className={classes.radio} type='radio' name='payment'
          checked={check === '2' ? true : false} value='2' readOnly />
        <div className={classes.logo}>
          <img src={logomomo} alt='Logo momo' />
        </div>
        <span className={classes.delivery_text}>Thanh toán MoMo</span>
      </div>
      <div className={classes.payment_option + ` ${check === '3' ? classes.payment_option_active : ''}`} value='3' onClick={onClickRadioHandler}>
        <input className={classes.radio} type='radio' name='payment'
          checked={check === '3' ? true : false} value='3' readOnly />
        <div className={classes.logo}>
          <img src={vnpay} alt='Logo vnpay' />
        </div>
        <span className={classes.delivery_text}>Thanh toán ATM/Internet banking</span>
      </div>
      <button className={classes.payment_btn} onClick={onSubmitOrderHandler}>Thanh Toán</button>
    </div>
  )
}

export default Payments