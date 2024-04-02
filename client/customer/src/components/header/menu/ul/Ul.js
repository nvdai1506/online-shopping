import React from 'react'
import { Link } from 'react-router-dom';
import classes from './Ul.module.css';

function Ul({ parent, childList, onClickItemHandler }) {
  return (
    <ul className={classes.nav_column}>
      <li className={`li--big-text ${classes.nav_column__parentItem}`} onClick={onClickItemHandler}>
        <Link to={parent.link}>{parent.text}</Link>
      </li>
      {
        childList.map(child => {
          return (
            <li key={child.key} className={`li--small-text ${classes.nav_column__childItem}`} onClick={onClickItemHandler}>
              <Link to={child.link}>{child.text}</Link>
            </li>
          )
        })
      }
    </ul>
  )
}

export default Ul