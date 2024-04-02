import React, { useContext } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import classes from './UserMenu.module.css';
import AuthContext from '../../context/auth-context';

function UserMenu() {
  const location = useLocation();
  const endpoint = location.pathname;
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);
  const onLogoutHandler = () => {
    authCtx.logout();
    navigate('/login');
  }
  return (
    <ul className={classes.menu}>
      <li className={`${classes.menu_item} ` + `${(endpoint === '/user/' || endpoint === '/user/profile') ? classes.menu_item_active : ''} `}>
        <Link to='/user/profile'>Thông tin cá nhân</Link>
      </li>
      <li className={`${classes.menu_item} ` + `${(endpoint === '/user/password') ? classes.menu_item_active : ''} `}>
        <Link to='/user/password'>Đổi Mật khẩu</Link>
      </li>
      <li className={`${classes.menu_item} ` + `${(endpoint === '/user/order-history') ? classes.menu_item_active : ''} `}>
        <Link to='/user/order-history'>Lịch sử mua hàng</Link>
      </li>
      <li className={classes.menu_item}>
        <Link onClick={onLogoutHandler}>Đăng xuất</Link>
      </li>
    </ul>
  )
}

export default UserMenu