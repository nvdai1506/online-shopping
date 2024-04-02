import React from 'react'
import classes from './Input.module.css';

function Input(props) {
    return (
        <div className={`${classes['input-container']} ${props.className}`}>
            <input type={props.type} value={props.value} onChange={props.onChange} onClick={props.onClick}>{props.children}</input>
            <label>{props.title}</label>
        </div>
    )
}

export default Input;