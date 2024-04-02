import React, { useState, useEffect } from 'react'
import { FaBars } from 'react-icons/fa';

import classes from './Menu.module.css';
import Ul from './ul/Ul';

function Menu() {
  const [hideClass, setHideClass] = useState(classes.disable_menu_hide);

  const [clickIcon, setClickIcon] = useState(false);

  useEffect(() => {
    if (clickIcon) {
      setHideClass(`${classes.enable_menu_hide}`);
    } else {
      setHideClass(`${classes.disable_menu_hide}`);
    }
  }, [clickIcon]);

  const onClickMenuIconHandler = () => {
    // navigate('/user/');
    setClickIcon(!clickIcon);
    setHideClass(`${classes.enable_menu_hide}`);
  }
  const onClickItemHandler = () => {
    setClickIcon(false);
    setHideClass(`${classes.disable_menu_hide}`);
  }
  return (
    <div className={classes.menu_item}>
      <div className={'action_item '} onClick={onClickMenuIconHandler}>
        <FaBars className={classes.menu_icon} />
      </div>
      <div className={hideClass + ' ' + classes.menu_hide}>
        <div className={classes.menu_hide_container}>
          <nav className={`grid grid--big-gap ${classes.nav}`}>
            <Ul parent={{ link: '/shop/ao', text: 'Áo' }}
              childList={
                [
                  { key: 'a1', link: '/shop/ao-thun', text: 'Áo Thun' },
                  { key: 'a2', link: '/shop/ao-khoac', text: 'Áo Khoác' },
                  { key: 'a3', link: '/shop/ao-so-mi', text: 'Áo Sơ Mi' },
                  { key: 'a4', link: '/shop/ao-ba-lo', text: 'Áo Ba Lỗ' },

                ]
              } onClickItemHandler={onClickItemHandler} />
            <Ul parent={{ link: '/shop/quan', text: 'Quần' }}
              childList={
                [
                  { key: 'q1', link: '/shop/quan-tay', text: 'Quần Tây' },
                  { key: 'q2', link: '/shop/quan-jean', text: 'Quần Jean' },
                  { key: 'q3', link: '/shop/quan-short', text: 'Quần Short' },
                  { key: 'q4', link: '/shop/quan-jogger', text: 'Quần Jogger' },


                ]
              } onClickItemHandler={onClickItemHandler} />
            <Ul parent={{ link: '/shop/phu-kien', text: 'Phụ Kiện' }}
              childList={
                [
                  { key: 'pk1', link: '/shop/non', text: 'Nón' },
                  { key: 'pk2', link: '/shop/that-lung', text: 'Thắt Lưng' },
                  { key: 'pk3', link: '/shop/bao-lo-tui', text: 'Bao lô - Túi' },

                ]
              } onClickItemHandler={onClickItemHandler} />
            <Ul parent={{ link: '/shop/giay-dep', text: 'Giày-Dép' }}
              childList={
                [
                  { key: 'gd1', link: '/shop/sandals', text: 'Sandals' },
                  { key: 'gd2', link: '/shop/giay-tay', text: 'Giày Tây' },
                  { key: 'gd3', link: '/shop/giay-the-thao', text: 'Giày Thể thao' },


                ]
              } onClickItemHandler={onClickItemHandler} />
          </nav>
        </div>
      </div>
    </div>

  )
}

export default Menu