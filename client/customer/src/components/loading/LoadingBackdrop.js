import React from 'react'
import classes from './LoadingBackdrop.module.css';
import Loading from '../ui/Loading';

function LoadingBackdrop() {
  return (
    <div className={classes.loading}>
      <Loading className={classes.color} />
    </div>
  )
}

export default LoadingBackdrop