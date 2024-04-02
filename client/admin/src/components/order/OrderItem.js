import React from 'react'
import Button from '../ui/Button';

import classes from './OrderItem.module.css';
import Api from '../../service/api';
function OrderItem(props) {
    const main = props.main;
    let ordering = false;
    if (main === 'ordering') {
        ordering = true;
    }
    const onMarkDoneHandler = () => {
        Api.admin.updateOrder({ status: 1 }, props.id)
            .then(result => {
                if (result.status === 200) {
                    props.statusChangeHandler(false);
                }
            })
            .catch(err => {
                props.statusChangeHandler(true);
            });
    }
    return (
        <tr className={`${classes[main]}`}>
            <td>{props.id}</td>
            <td>{props.email}</td>
            {ordering &&
                <td>
                    <Button className={classes.btn} onClick={onMarkDoneHandler}>Mark Done</Button>
                </td>
            }

        </tr>
    )
}

export default React.memo(OrderItem);