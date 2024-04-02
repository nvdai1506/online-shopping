import React from 'react'

import classes from './Card.module.css';

function Card(props) {
  return (
    <div className={classes.main}>{props.children}</div>
  )
}

export default Card