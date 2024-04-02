import React, { useState } from 'react'
import { IoStar } from 'react-icons/io5';
import classes from './RateDetails.module.css';
import RateItem from './RateItem';
const defaultNumberOfItemToLoad = 2;
function RateDetails({ rateData }) {
  // console.log(rateData);
  const [data, setData] = useState(rateData.rate);
  const [filteredRates, setFilteredRates] = useState(rateData.rate);
  const [starValue, setStarValue] = useState(0);
  const [currentItems, setCurrentItems] = useState(defaultNumberOfItemToLoad);

  const onClickStarHandler = event => {
    const star = event.target.value;
    if (Number(star) === 0) {
      setFilteredRates(rateData.rate);
    } else {
      setStarValue(star);
      const tmpArr = data.filter(r => {
        return r.star.toString() === star.toString();
      });
      setFilteredRates(tmpArr);
    }
  }
  const onClickMoreHandler = () => {
    if (currentItems >= filteredRates.length) {
      setCurrentItems(defaultNumberOfItemToLoad);
    } else {

      setCurrentItems(currentItems + defaultNumberOfItemToLoad);
    }
  }
  return (
    <div className={classes.rate_details}>
      <div className={classes.rate_details_head}>
        <span className={classes.reviews_count}>{rateData.total} Đánh giá</span>
        <div className={classes.ratings}>
          <span className={classes.reviews_ratings}>
            {rateData.average.toFixed(1)}/5
          </span>
          <IoStar className={classes.star_icon} />
        </div>
      </div>
      <hr />
      <div className={classes.filter}>
        <button className={classes.btn} value={0} onClick={onClickStarHandler}>Tất cả <IoStar className={classes.star_btn} /></button>
        <button className={classes.btn} value={1} onClick={onClickStarHandler}>1 <IoStar className={classes.star_btn} /></button>
        <button className={classes.btn} value={2} onClick={onClickStarHandler}>2 <IoStar className={classes.star_btn} /></button>
        <button className={classes.btn} value={3} onClick={onClickStarHandler}>3 <IoStar className={classes.star_btn} /></button>
        <button className={classes.btn} value={4} onClick={onClickStarHandler}>4 <IoStar className={classes.star_btn} /></button>
        <button className={classes.btn} value={5} onClick={onClickStarHandler}>5 <IoStar className={classes.star_btn} /></button>
      </div>
      <hr />
      <div className={classes.rate_details_comments}>
        {filteredRates.length === 0 && <p className={classes.no_rate}>Không có đánh giá nào {starValue} sao...</p>}
        {filteredRates.length !== 0 && filteredRates.slice(0, currentItems).map(r => { return <RateItem key={r._id} rate={r} /> })}
      </div>
      <div className={classes.btn_container}>
        {filteredRates.length > defaultNumberOfItemToLoad &&
          <button className={classes.btn + ' ' + classes.more_btn} onClick={onClickMoreHandler}>
            {currentItems < filteredRates.length ? 'Xem thêm' : 'Thu gọn'}
          </button>
        }

      </div>
    </div>
  )
}

export default RateDetails