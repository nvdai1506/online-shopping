import React from 'react'
import classes from './Backdrop.module.css';

function Backdrop(props) {
  return (
    <>
      <div className={classes.backdrop} onClick={props.onClose}></div>
      <div className={classes.overlays}>
        {props.children}
      </div>
    </>
  )
}

export default Backdrop