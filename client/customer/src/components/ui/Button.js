import React from 'react'
import classes from './Button.module.css';

function Button(props) {
  return (
    <button className={classes.btn + ` ${props.className}`}
      onClick={props.onClick}
      value={props.value}
    >{props.children}</button>
  )
}

export default Button