import React, { useCallback, useEffect, useState } from 'react'
import classes from './Order.module.css';

import StatusMess from '../ui/StatusMess';
import OrderingList_ag from './OrderingList_ag';
import OrderedList_ag from './OrderedList_ag';
import OrderDetails from './OrderDetails';

function Order() {
    // console.log('order');
    const [error, setError] = useState(false);
    const [status, setStatus] = useState(false);

    const [view, setView] = useState({});


    const statusChangeHandler = (value) => {
        setStatus(!status);
        setError(value);
    }

    const viewHandler = useCallback((items, total) => {
        setView({ items: items, total: total.toLocaleString() });
    }, []);

    const onCloseModalHandler = () => {
        setView({});
    }
    return (
        <div className={classes.main}>
            {Object.keys(view).length !== 0 && <OrderDetails view={view} onClose={onCloseModalHandler} />}
            <div className={classes.status}>
                {error && <StatusMess state='error'>Something wrong!</StatusMess>}
            </div>
            <div className={classes.show}>
                <div className={classes.ordering}>
                    <h1>Ordering</h1>
                    <OrderingList_ag status={status} statusChangeHandler={statusChangeHandler} viewHandler={viewHandler} />
                    {/* <table>
                        <tbody>
                            <tr>
                                <th className={classes.ordered_titles_orderId}>Id</th>
                                <th className={classes.ordered_titles_email}>Email</th>
                                <th className={classes.ordered_titles_action}></th>
                            </tr>
                            {orderingList.map(order => <OrderItem statusChangeHandler={statusChangeHandler} main='ordering' key={order._id} id={order._id} email={order.email} />)}
                        </tbody>
                    </table> */}
                </div>
                <div className={classes.ordered}>
                    <h1>Ordered</h1>
                    {/* <table>
                        <tbody>
                            <tr>
                                <th className={classes.titles_orderId}>Id</th>
                                <th className={classes.titles_email}>Email</th>
                            </tr>
                            {orderedList.map(order => <OrderItem statusChangeHandler={statusChangeHandler} main='ordered' key={order._id} id={order._id} email={order.email} />)}
                        </tbody>
                    </table> */}
                    <OrderedList_ag status={status} statusChangeHandler={statusChangeHandler} viewHandler={viewHandler} />
                </div>
            </div>
        </div>

    )
}

export default Order