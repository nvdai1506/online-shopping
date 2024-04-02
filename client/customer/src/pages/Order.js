import React from 'react'

import classes from './Order.module.css';
import OrderList from '../components/order/OrderList';
function Order() {

    return (
        <div className={classes.main}>
           <OrderList />
        </div>
    )
}

export default Order