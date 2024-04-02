import React from 'react'
import { IoStar, IoStarHalf, IoStarOutline } from 'react-icons/io5';

import classes from './RateItem.module.css';

function RateItem({ rate }) {
  // console.log(rate);
  const name = rate.user.name;
  const createdDate = rate.create.split('T')[0];
  const { star, comment } = rate;
  const first_star = (star >= 1) ? <IoStar className={classes.star_icon} />
    : <IoStarOutline className={classes.star_icon} />
  const second_star = (star >= 2) ? <IoStar className={classes.star_icon} />
    : <IoStarOutline className={classes.star_icon} />
  const third_star = (star >= 3) ? <IoStar className={classes.star_icon} />
    : <IoStarOutline className={classes.star_icon} />
  const fourth_star = (star >= 4) ? <IoStar className={classes.star_icon} />
    : <IoStarOutline className={classes.star_icon} />
  const fifth_star = (star >= 5) ? <IoStar className={classes.star_icon} />
    : <IoStarOutline className={classes.star_icon} />
  return (
    <div className={classes.rate_item}>
      <div className={classes.star}>
        {first_star}
        {second_star}
        {third_star}
        {fourth_star}
        {fifth_star}
      </div>
      <div className={classes.text_box}>
        <h3>{name}</h3>
        <p>{comment}</p>
        <span>{createdDate}</span>
      </div>
    </div>
  )
}

export default RateItem