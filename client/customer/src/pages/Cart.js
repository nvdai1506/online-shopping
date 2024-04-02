import React, { useEffect } from 'react'

import classes from './Cart.module.css';
import CartList from '../components/cart/CartList';
import OrderForm from '../components/order/OrderForm';
import { OrderContextProvider } from '../context/order-context';
function Cart() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <OrderContextProvider>
      <div className={'container ' + classes.cart} >
        <div className={`grid grid--2-cols ${classes.cart_container}`}>
          <OrderForm />
          <CartList />
        </div>
      </div>
    </OrderContextProvider>
  )
}

export default Cart