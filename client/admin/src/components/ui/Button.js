import React from 'react'

import classes from './Button.module.css';

function Button(props) {
    const state = props.state;
    let classname;
    if (state === 'cancel') {
        classname = classes.cancel;
    } else if (state === 'delete') {
        classname = classes.delete;
    }
    return (
        <button
            type={props.type || 'button'}
            className={`${classes.btn} ${classname} ${props.className} `}
            onClick={props.onClick}
            disabled={props.disabled}
        >
            {props.children}
        </button>
    )
}

export default Button