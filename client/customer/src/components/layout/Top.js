import React from 'react'
import { BsArrowUpShort } from 'react-icons/bs';
import classes from './Top.module.css';
function Top() {
  return (
    <a href='#' >
      <div className={classes.top}>

        <BsArrowUpShort className={classes.arrow_icon} />
      </div>

    </a>
  )
}

export default Top