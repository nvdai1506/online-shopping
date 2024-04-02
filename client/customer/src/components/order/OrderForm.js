import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import classes from './OrderForm.module.css';
import AuthConText from '../../context/auth-context';
import CartContext from '../../context/cart-context';
import StatusContext from '../../context/status-context';
import OrderContext from '../../context/order-context';
import useInput from '../../hooks/use-input';
import Api from '../../service/api';
import Payments from './Payments';

function OrderForm() {
  const navigate = useNavigate();
  const authCtx = useContext(AuthConText);
  const { isLoggedIn } = authCtx;
  const cartCtx = useContext(CartContext);
  const statusCtx = useContext(StatusContext);
  const orderCtx = useContext(OrderContext);

  const [clickForm, setClickForm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('1');

  const {
    value: enteredName,
    valueChangeHandler: nameInputChangeHandler,
    setValue: setEnteredName,
    hasError: nameInputHasError
  } = useInput(value => value.trim() !== '');
  const {
    value: enteredPhone,
    valueChangeHandler: phoneInputChangeHandler,
    setValue: setEnteredPhone,
    hasError: phoneInputHasError
  } = useInput(value => value.trim() !== '');
  const {
    value: enteredEmail,
    valueChangeHandler: emailInputChangeHandler,
    setValue: setEnteredEmail,
    hasError: emailInputHasError
  } = useInput(value => value.trim() !== '');

  const {
    value: enteredAddress,
    valueChangeHandler: addressInputChangeHandler,
    setValue: setEnteredAddress,
    hasError: addressInputHasError
  } = useInput(value => value.trim() !== '');

  const {
    value: enteredNote,
    valueChangeHandler: noteInputChangeHandler,

  } = useInput(() => { });

  useEffect(() => {
    if (isLoggedIn) {
      Api.user.getUser()
        .then(result => { return result.json() })
        .then(data => {
          setEnteredName(data.user.name);
          setEnteredPhone(data.user.phone);
          setEnteredEmail(data.user.email);
          setEnteredAddress(data.user.address);
        })
        .catch(err => {
          navigate('/error');
        })
    }
  }, []);
  const onReceiveCheckValue = value => {
    setPaymentMethod(value);
  }
  const onSubmitOrderHandler = event => {
    event.preventDefault();
    if (nameInputHasError || phoneInputHasError || addressInputHasError) {
      statusCtx.setValue('validation', 'Thông tin vận chuyển không hợp lệ.');
      setClickForm(true);
      return;
    }
    const shippingInfo = {
      name: enteredName,
      phone: enteredPhone,
      email: enteredEmail,
      address: enteredAddress,
      note: enteredNote,
      paymentMethod: Number(paymentMethod)
    };
    const cart = {
      items: cartCtx.items,
      totalPrice: cartCtx.totalPrice,
      totalAmount: cartCtx.totalAmount
    }
    const { percent, vnd, total } = orderCtx.data;
    const dataToPost = {
      shippingInfo,
      cart,
      percent,
      vnd,
      total: total
    }
    if (paymentMethod === '1') {
      Api.shop.postOrder(dataToPost)
        .then(result => { return result.json() })
        .then(data => {
          statusCtx.setValue('success', 'Bạn đã đặt hàng thành công.');
          cartCtx.clearCart();
        })
        .catch(err => {
          navigate('/error');
        })
    } else if (paymentMethod === '2') {
      return statusCtx.setValue('error', 'Thanh toán bằng Momo hiện đang bảo trì.');
    } else if (paymentMethod === '3') {
      Api.shop.postOrder(dataToPost)
        .then(result => { return result.json() })
        .then(data => {
          const order_id = data.order._id;
          Api.shop.postPayment({
            amount: total,
            bankCode: '',
            orderDescription: `Thanh toan don hang _${order_id}`,
            orderType: 'billpayment',
            language: 'vn',
          })
            .then(result => { return result.json() })
            .then(data => {
              // console.log(data.vnpUrl);
              window.location.href = data.vnpUrl;
            })
            .catch(error => {
              console.log(error);
            })
        })
        .catch(err => {
          navigate('/error');
        })


      // Api.shop.postPayment({
      //   amount: cartCtx.totalPrice,
      //   bankCode: 'NCB',
      //   orderDescription: `Thanh toan don hang _sasas`,
      //   orderType: 'billpayment',
      //   language: 'vn',
      // })
      //   .then(result => { return result.json() })
      //   .then(data => {
      //     console.log(data.vnpUrl);
      //     // window.location.href = data.vnpUrl;
      //   })
      //   .catch(error => {
      //     console.log(error);
      //   })
    }
  }

  return (
    <div className={classes.order_container}>
      <div className={`grid grid--2-cols ${classes.shipping_info}`}>
        <h1 className={classes.title}>Thông tin vận chuyển</h1>
        <div className={classes.login}>
          {!authCtx.isLoggedIn &&
            <>
              <span>Bạn đã có tài khoản?</span>
              <Link className={classes.login_link} to='/login'>Đăng nhập ngay</Link>
            </>
          }
        </div>
        <form className={`grid grid--2-cols ${classes.form}`}>
          <input className={`${(nameInputHasError && clickForm) ? `${classes.form_input_not_valid} ${classes.form_input}` : classes.form_input} ${classes.name}`}
            placeholder='Họ tên' required value={enteredName} onChange={nameInputChangeHandler} />

          <input className={`${(phoneInputHasError && clickForm) ? `${classes.form_input_not_valid} ${classes.form_input}` : classes.form_input} ${classes.phone}`}
            placeholder='Số Điện Thoại' required value={enteredPhone} onChange={phoneInputChangeHandler} />
          {authCtx.isLoggedIn &&
            <input className={`${classes.form_input} ${classes.email_field}`} placeholder='Email' required value={enteredEmail} readOnly />
          }
          {!authCtx.isLoggedIn &&
            <input className={`${(emailInputHasError && clickForm) ? `${classes.form_input_not_valid} ${classes.form_input}` : classes.form_input} ${classes.email}`}
              placeholder='Email' required value={enteredEmail} onChange={emailInputChangeHandler} />
          }
          <input className={`${(addressInputHasError && clickForm) ? `${classes.form_input_not_valid} ${classes.form_input}` : classes.form_input} ${classes.address}`}
            placeholder='Địa chỉ' required value={enteredAddress} onChange={addressInputChangeHandler} />

          <input className={`${classes.form_input} ${classes.note}`} placeholder='Ghi chú thêm' required value={enteredNote} onChange={noteInputChangeHandler} />
        </form>
      </div>
      <Payments onSubmitOrderHandler={onSubmitOrderHandler} onReceiveCheckValue={onReceiveCheckValue} />
    </div>
  )
}

export default OrderForm