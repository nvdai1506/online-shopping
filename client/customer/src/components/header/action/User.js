import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

import classes from './User.module.css';
import { AiOutlineUser } from 'react-icons/ai';
import AuthContext from '../../../context/auth-context';

function User() {
  const navigate = useNavigate();
  const [hide_ul_classes, setHide_ul_classes] = useState(classes.hide_ul_container);

  const authCtx = useContext(AuthContext);
  const isLoggedIn = authCtx.isLoggedIn;
  const [clickIcon, setClickIcon] = useState(false);

  useEffect(() => {
    if (clickIcon) {
      setHide_ul_classes(`${classes.hide_ul_container} ${classes.enable_hide_ul_container}`);
    } else {
      setHide_ul_classes(`${classes.hide_ul_container} ${classes.disable_hide_ul_container}`);
    }
  }, [clickIcon]);

  const logoutHandler = () => {
    authCtx.logout();
    setHide_ul_classes(`${classes.hide_ul_container} ${classes.disable_hide_ul_container}`);
    navigate('/login');
  }
  const onClickUserIconHandler = () => {
    // navigate('/user/');
    setClickIcon(!clickIcon);
    setHide_ul_classes(`${classes.hide_ul_container} ${classes.enable_hide_ul_container}`);
  }
  const onClickItem = () => {
    setClickIcon(false);
    setHide_ul_classes(`${classes.hide_ul_container} ${classes.disable_hide_ul_container}`);

  }
  return (
    <div className={` ${classes.user_container}`} >
      <div className={'action_item ' + classes.user} onClick={onClickUserIconHandler}>
        <AiOutlineUser className='icon' />
      </div>
      <div className={hide_ul_classes}>
        <ul className={classes.ul}>
          {isLoggedIn && <li onClick={onClickItem}>
            <Link to='/user/profile'>Hồ sơ</Link>
          </li>}
          {isLoggedIn && <li onClick={onClickItem}>
            <Link to='/user/password'>Đổi mật khẩu</Link>
          </li>}
          {isLoggedIn && <li onClick={onClickItem}>
            <Link to='/user/order-history'>Lịch sử mua hàng</Link>
          </li>}
          {isLoggedIn && <li onClick={logoutHandler}>
            <Link >Thoát</Link>
          </li>}
          {!isLoggedIn && <li onClick={onClickItem}>
            <Link to='/login'>Đăng Nhập</Link>
          </li>}
        </ul>
      </div>
    </div>
  )
}

export default User