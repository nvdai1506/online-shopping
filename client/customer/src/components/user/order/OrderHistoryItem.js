import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import classes from '../../cart/CartItem.module.css';
import order_classes from './OrderHistoryItem.module.css';
import Rate from './rate/Rate';

function OrderHistoryItem({ item, orderId, order_status, shippingStatus }) {
  const navigate = useNavigate();
  const { id, title, imageUrl, size, price, amount, rate } = item;

  const [isRateOpen, setIsRateOpen] = useState(false);

  const onClickTitleHandler = () => {
    navigate(`/product/${id}`)
  }
  const onClickRateHandler = () => {
    setIsRateOpen(true);
  }
  const onCloseHandler = () => {
    setIsRateOpen(false);
  }
  return (
    <div className={classes.cart_item_container}>
      <div className={`grid grid--4-cols ${classes.cart_item}`}>
        <div className={classes.image + ` ${order_classes.image}`}>
          <img crossOrigin='true' src={`${process.env.REACT_APP_DOMAIN}/${imageUrl}`} alt={title} />
        </div>
        <div className={classes.textbox}>
          <h1 className={classes.title + ` ${order_classes.title}`} onClick={onClickTitleHandler}>{title}</h1>
          <p className={classes.size + ` ${order_classes.size}`}>{size}</p>
          <p className={classes.price + ` ${order_classes.price}`}>Price: <strong>{price.toLocaleString()} đ</strong></p>
          <p className={classes.amount + ` ${order_classes.amount}`}>&times;<strong>{amount}</strong></p>
        </div>
        <div className={classes.total_item + ` ${order_classes.total_item}`} >{(price * amount).toLocaleString()} đ</div>
      </div>
      <div className={order_classes.actions}>
        {order_status === 1 && shippingStatus === 1 &&
          <button className={order_classes.btn} onClick={onClickRateHandler}>{rate !== undefined ? 'Xem đánh giá' : 'Đánh Giá'}</button>
        }
        {order_status !== 0 && shippingStatus !== 0 &&
          <button className={order_classes.btn} onClick={onClickTitleHandler}>Mua lại</button>
        }

      </div>
      {isRateOpen && <Rate onClose={onCloseHandler} item={item} orderId={orderId} />}
    </div>
  )
}

export default OrderHistoryItem