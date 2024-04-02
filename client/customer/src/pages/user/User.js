import React from 'react'
import UserMenu from '../../components/user/UserMenu';
import UserDisplay from '../../components/user/UserDisplay';
import classes from './User.module.css';

function User() {

  return (
    <div className={`grid grid--3-cols ${classes.profile_container}`}>
      <UserMenu />
      <UserDisplay />
    </div>
  )
}

export default User