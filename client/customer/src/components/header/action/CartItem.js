import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import { AiOutlineClose } from 'react-icons/ai';

import classes from './CartItem.module.css';
import CartContext from '../../../context/cart-context';

function CartItem({ item }) {
  const navigate = useNavigate();
  const cartCtx = useContext(CartContext);
  const onClickHandler = event => {
    navigate(`/product/${item.id}`);
  }
  const onClearItemHandler = () => {
    // console.log(item.size);
    cartCtx.clearItem(item.id, item.size);
  }
  return (
    <div className={`grid grid--small-gap ${classes.cart_item}`}>
      <div className={classes.image} onClick={onClickHandler}>
        <img crossOrigin='true' src={`${process.env.REACT_APP_DOMAIN}/${item.imageUrl}`} alt={item.title} />
      </div>
      <div className={classes.textbox} onClick={onClickHandler}>
        <h2 className={classes.title}>{item.title}</h2>
        <span className={classes.size}>Size: {item.size}</span>
        <span className={classes.price}>{item.price.toLocaleString()}đ</span>
        <span className={classes.amount}>x{item.amount}</span>
      </div>
      <AiOutlineClose className={classes.remove_item} onClick={onClearItemHandler} />
    </div >
  )
}

export default CartItem