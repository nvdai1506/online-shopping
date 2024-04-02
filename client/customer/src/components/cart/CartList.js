import React, { useContext, useEffect, useRef, useState } from 'react'
import moment from 'moment/moment';
import classes from './CartList.module.css';
import CartItem from './CartItem';

import CartContext from '../../context/cart-context';
import StatusContext from '../../context/status-context';
import OrderContext from '../../context/order-context';
import Api from '../../service/api';

function CartList() {
  const statusCtx = useContext(StatusContext);
  const cartCtx = useContext(CartContext);
  const orderCtx = useContext(OrderContext);
  const { data, setData } = orderCtx;
  const { totalPrice } = cartCtx;
  // orderCtx.setData({ percent: 0, vnd: 0, total: cartCtx.totalPrice });
  const voucherInput = useRef('');
  const [captcha, setCaptcha] = useState({ percent: 0, vnd: 0, total: cartCtx.totalPrice });

  let classValue = classes.cart_list_container;
  if (cartCtx.items.length === 0) {
    classValue += ` ${classes.no_cart_list_container}`
  }

  useEffect(() => {
    setData({ ...data, total: totalPrice });
  }, [totalPrice, setData]);

  const onBlurVoucherInputHanlder = event => {
    const captcha = voucherInput.current.value;
    if (captcha === '') {
      return;
    } else {
      Api.shop.checkVoucher({ captcha })
        .then(result => {
          // console.log('rel: ', result);
          if (result.status === 204) {
            throw { status: result.status };
          } else {
            return result.json();
          }
        })
        .then(data => {
          let total = cartCtx.totalPrice;
          if (data.percent !== 0) {
            total -= cartCtx.totalPrice * data.percent / 100;
          }
          if (data.vnd !== 0) {
            total -= data.vnd;
          }
          setCaptcha({ ...data, total: total });
          orderCtx.setData({ ...data, total: total });
        })
        .catch(error => {
          // console.log(error);
          if (error.status === 204) {
            statusCtx.setValue('error', 'Mã giảm giá không tồn tại.');
          } else if (error.status === 406) {
            error.json().then(err => {
              const newDate = moment(err.message).format('DD-MM-YYYY');
              statusCtx.setValue('error', `Mã giảm giá này sử dụng từ ngày ${newDate} .`);
            })
          } else if (error.status === 410) {
            statusCtx.setValue('error', 'Mã giảm giá đã hết hạn.')
          } else {
            statusCtx.setValue('error', 'Có lỗi xảy ra.')
          }
          setCaptcha({ percent: 0, vnd: 0, total: cartCtx.totalPrice });
          orderCtx.setData({ percent: 0, vnd: 0, total: cartCtx.totalPrice });

        })
    }

  }
  return (
    <div className={classes.container}>
      <div className={classValue}>
        {cartCtx.items.length === 0 && <p className={classes.no_product}>Hiện tại bạn chưa có sản phẩm nào trong giỏ hàng.</p>}
        {cartCtx.items.map(item => <CartItem key={`${item.id}${item.size}`} item={item} />)}

      </div>


      {cartCtx.totalPrice !== 0 &&
        <>
          <div className={classes.voucher}>
            <hr className={classes.separate} /><br />
            <div className={classes.voucher_form}>
              <label htmlFor='voucher_input'>Mã giảm giá: </label>
              <input type='text' id='voucher_input'
                className={classes.voucher_input} onBlur={onBlurVoucherInputHanlder}
                ref={voucherInput}
              ></input>
            </div>
          </div>
          <div className={classes.list_fees}>
            <div className={classes.list_fees_item}>
              <label>Tạm tính</label>
              <span>{cartCtx.totalPrice.toLocaleString()} đ</span>
            </div>
            <div className={classes.list_fees_item}>
              <label>Giảm giá</label>
              {captcha.percent !== 0 &&
                <span>- {captcha.percent}%</span>
              }
              {captcha.vnd !== 0 &&
                <span>- {captcha.vnd.toLocaleString()}đ</span>
              }
              {captcha.vnd === 0 && captcha.percent === 0 &&
                <span>0</span>
              }
            </div>
            <div className={classes.list_fees_item}>
              <label>Phí vận chuyển</label>
              <span>Miễn phí</span>
            </div>
          </div>
          <div className={classes.totalPrice}>
            <hr className={classes.separate} /><br />
            <label className={classes.label_total}>Tổng tiền:</label>
            <span className={classes.totalPrice_span}>
              {captcha.total.toLocaleString()} đ
            </span>
          </div>
        </>

      }

    </div>
  )
}

export default CartList