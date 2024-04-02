import React, { useState } from 'react'
import classes from './Filter.module.css';

import Button from '../ui/Button';
import { useLocation, useNavigate } from 'react-router-dom';
function Filter() {
  const navigate = useNavigate();
  const location = useLocation();
  let searchParams = new URLSearchParams(location.search);

  const [btnValue, setBtnValue] = useState('1');
  const onClickHandler = (event) => {
    setBtnValue(event.target.value);
    searchParams.set('filter', event.target.value)
    searchParams.set('page', 1);
    navigate({
      pathname: location.pathname,
      search: searchParams.toString()
    })
  }
  return (
    <div className={classes.filter}>
      <h1>Sản phẩm</h1>
      <div className={`grid grid--4-cols ` + classes.btn_containter}>

        <Button className={classes.btn + ` ${btnValue === '1' ? classes.btn_active : ''}`} onClick={onClickHandler} value="1">Mới nhất</Button>
        <Button className={classes.btn + ` ${btnValue === '2' ? classes.btn_active : ''}`} onClick={onClickHandler} value="2">Bán chạy</Button>
        <Button className={classes.btn + ` ${btnValue === '3' ? classes.btn_active : ''}`} onClick={onClickHandler} value="3">Giá từ cao đến thấp</Button>
        <Button className={classes.btn + ` ${btnValue === '4' ? classes.btn_active : ''}`} onClick={onClickHandler} value="4">Giá từ thấp đến cao</Button>
      </div>
    </div>
  )
}

export default Filter