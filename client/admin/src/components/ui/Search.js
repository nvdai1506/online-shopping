import React from 'react'

import classes from './Search.module.css';
function Search(props) {
  return (
    <input className={`${classes.search} ${props.className}`} placeholder='Search...' onChange={props.onChange}>{props.children}</input>
  )
}

export default Search