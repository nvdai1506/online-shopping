import React, { useEffect, useState } from 'react'

import Api from '../../service/api';
import OrderItem from './OrderItem';
import classes from './OrderList.module.css';

function OrderList() {

    const [orders, setOrders] = useState([]);
    useEffect(() => {
        Api.user.getOrders()
            .then(result => { return result.json() })
            .then(data => {
                setOrders(data.orders);
            })
            .catch(err => { console.log(err) });
    }, []);

    return (
        <div className={classes.order_list}>
            {orders.map(order => { return <OrderItem key={order._id} receive={order.updatedAt} cart={order.cart}/>})}
        </div>
    )
}

export default OrderList