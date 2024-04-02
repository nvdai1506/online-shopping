import React from 'react'
import { useNavigate } from 'react-router-dom';
import classes from './SearchItem.module.css';
function SearchItem({ id, imageUrl, title, price, onCloseSearch }) {
  const navigate = useNavigate();
  const onClickTitleHandler = () => {
    onCloseSearch();
    navigate(`/product/${id}`);
  }
  return (
    <div className={`grid grid--3-cols ` + classes.search_item}>
      <div className={classes.image}>
        <img crossOrigin='true' src={`${process.env.REACT_APP_DOMAIN}/${imageUrl}`} alt={title} />
      </div>
      <div className={classes.textbox}>
        <h1 className={classes.title} onClick={onClickTitleHandler}>{title}</h1>
        <span className={classes.price}>{price.toLocaleString()}đ</span>
      </div>

    </div>
  )
}

export default SearchItem