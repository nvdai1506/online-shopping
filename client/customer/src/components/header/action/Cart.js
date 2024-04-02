import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { HiOutlineShoppingBag } from 'react-icons/hi';
import CartContext from '../../../context/cart-context';
import classes from './Cart.module.css';
import CartItem from './CartItem';
function Cart() {
  const navigate = useNavigate();
  const cartCtx = useContext(CartContext);
  const { totalAmount } = cartCtx;
  const [bump, setBump] = useState(false);
  const amountClass = `${classes.amount} ${bump ? classes.bump : ''}`;
  const [hidden_cart_container, setHidden_cart_container] = useState(classes.hidden_cart_container);

  useEffect(() => {
    if (totalAmount === 0) {
      return;
    }
    setBump(true);
    const timer = setTimeout(() => {
      setBump(false);
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [totalAmount]);
  const onCartClicked = () => {
    navigate('/cart');
    setHidden_cart_container(`${classes.hidden_cart_container} ${classes.disable_hidden_cart_container}`);
  }
  return (
    <div className={classes.cart_container}>
      <div className={`action_item ${classes.cart}`} onClick={onCartClicked}>
        <HiOutlineShoppingBag className='icon' />
      </div>
      <span className={amountClass}>{totalAmount}</span>
      <div className={hidden_cart_container}>
        <div className={classes.hidden_cart}>
          {cartCtx.items.length === 0 && <span>Hiện chưa có sản phẩm nào</span>}
          {cartCtx.items.length !== 0 &&
            <div className={classes.cart_list}>
              {cartCtx.items.map(item => { return <CartItem key={`${item.id} ${item.size}`} item={item} /> })}
            </div>
          }
        </div>
      </div>
    </div>
  )
}

export default Cart