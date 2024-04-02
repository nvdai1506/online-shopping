import React from 'react'
import { Link } from 'react-router-dom';
import { CiFacebook, CiInstagram, CiTwitter } from 'react-icons/ci';
// import { FiTwitter } from 'react-icons/fi';

import NVD_logo from '../../images/NVD-192.png';
import classes from './Footer.module.css';

function Footer() {
  return (
    <footer className={`container grid ` + classes.footer}>
      <div className={classes.logo_container}>
        <div className={classes.logo}>
          <Link className={classes.footer_link} to='/'>
            <img src={NVD_logo} alt='NVD logo' />
          </Link>
        </div>

        <p className={classes.copyright}>
          Copyright &copy; <span>2022</span> by NVD, Inc.
          All rights reserved.
        </p>
      </div>
      <div className={classes.second_row}>
        <div className={'grid ' + classes.contact_container}>
          <h1 className={classes.footer_title}>Liên hệ</h1>
          <div className={classes.social}>
            <ul className={'grid grid--3-cols ' + classes.social_links}>
              <li>
                <Link className={classes.footer_link} href="#">
                  <CiFacebook className={classes.social_icon} />
                </Link>
              </li>
              <li>
                <Link className={classes.footer_link} href="#">
                  <CiTwitter className={classes.social_icon} />
                </Link>
              </li>
              <li>
                <Link className={classes.footer_link} href="#"
                >
                  <CiInstagram className={classes.social_icon} />
                </Link>
              </li>
            </ul>
          </div>
          <address className={'grid ' + classes.contacts}>

            <p>
              <Link className={classes.footer_link} href="tel:028-000-1111">028-000-1111 </Link>
              <br />
              <Link className={classes.footer_link} href="mailto:nvd@admin.com"
              >nvd@admin.com</Link>
            </p>
          </address>
        </div>
        <div className={classes.account}>
          <div className={classes.title_container}>
            <h1 className={classes.footer_title}>Tài Khoản</h1>
          </div>
          <div className={classes.items}>
            <Link to='/signup' className={classes.footer_link}>Đăng ký tài khoản</Link>
            <br />
            <Link to='/login' className={classes.footer_link}>Đăng nhập</Link>
            <br />
            <Link className={classes.footer_link}>iOS App</Link>
            <br />
            <Link className={classes.footer_link}>Android App</Link>
          </div>
        </div>
        <div className={classes.company}>
          <div className={classes.title_container}>
            <h1 className={classes.footer_title}>Công ty</h1>
          </div>
          <div className={classes.items}>
            <Link className={classes.footer_link}>Câu chuyện về Nvd</Link>
            <br />
            <Link className={classes.footer_link}>Thành lập</Link>
            <br />
            <Link className={classes.footer_link}>Nhà Máy</Link>
            <br />
            <Link className={classes.footer_link}>Tuyển dụng</Link>
          </div>
        </div>
        <div className={classes.resources}>
          <div className={classes.title_container}>
            <h1 className={classes.footer_title}>FQA</h1>
          </div>
          <div className={classes.items}>
            <Link className={classes.footer_link}>Vận chuyển</Link>
            <br />
            <Link className={classes.footer_link}>Chính sách đổi trả</Link>
            <br />
            <Link className={classes.footer_link}>Chính sách bảo hành</Link>
            <br />
            <Link className={classes.footer_link}>Hợp tác</Link>
          </div>
        </div>
      </div>
      <address className={classes.address}>
        Địa chỉ: <em>1103/34/13 nguyễn duy trinh, phường Long Trường, quận 9, TP HCM.</em>
      </address>
    </footer >
  );

}


export default Footer