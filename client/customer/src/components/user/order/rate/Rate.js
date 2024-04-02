import React, { useContext, useEffect, useState } from 'react'
import { GrStar } from 'react-icons/gr';

import classes from './Rate.module.css';
import Backdrop from '../../../ui/Backdrop';
import Api from '../../../../service/api';
import StatusContext from '../../../../context/status-context';
import OrderHistoryContext from '../../../../context/order-history-context';

function Rate(props) {
  const statusCtx = useContext(StatusContext);
  const orderCtx = useContext(OrderHistoryContext);
  const { id, title, imageUrl, rate } = props.item;
  const orderId = props.orderId;
  // console.log(orderId);
  const [starValue, setStarValue] = useState(0);
  const [comment, setComment] = useState('');
  const reviewMode = (rate !== undefined);

  const onClickProdcutHandler = () => {
    window.open(`/product/${id}`, '_blank');
  }
  const onClickStarHandler = event => {
    setStarValue(event.target.getAttribute('value'));
  }
  const onChangeCommentHandler = event => {
    setComment(event.target.value);
  }
  useEffect(() => {
    if (reviewMode) {
      Api.user.getRate(rate, orderId)
        .then(result => { return result.json() })
        .then(data => {
          // console.log(data);
          setStarValue(data.rate.star);
          setComment(data.rate.comment);
        })
        .catch(error => {
          statusCtx.setValue('error', 'Tải dữ liệu thất bại.');
        })
    }
  }, []);
  const onSubmitHandler = () => {
    if (reviewMode) {
      Api.user.updateRate(rate, { star: starValue, comment, orderId })
        .then(result => { return result.json() })
        .then(data => {
          statusCtx.setValue('success', 'Cập nhật dữ liệu thành công.')
          orderCtx.toggle();
        })
        .catch(error => {
          statusCtx.setValue('error', 'Cập nhật dữ liệu thất bại.')
        })
    } else {
      Api.user.rate({
        star: starValue,
        productId: id,
        comment: comment,
        orderId: orderId
      })
        .then(result => {
          if (result.status === 208) {
            return result.status;
          } else {
            return result.json()
          }
        })
        .then(data => {
          if (data === 208) {
            statusCtx.setValue('success', 'Sản phẩm này đã được đánh giá.');
          } else {
            statusCtx.setValue('success', 'Đánh giá thành công.');
          }
          orderCtx.toggle();
        })
        .catch(err => {
          statusCtx.setValue('error', 'Đánh giá thất bại!');

        })
    }
  }
  return (
    <Backdrop onClose={props.onClose}>
      <div className={classes.rate_container}>
        <h1 className={classes.title}>Đánh giá sản phẩm </h1>
        <div className={classes.product}>
          <div className={classes.image} onClick={onClickProdcutHandler}>
            <img crossOrigin='true' src={`${process.env.REACT_APP_DOMAIN}/${imageUrl}`} />
          </div>
          <h2 className={classes.product_title} onClick={onClickProdcutHandler}>{title}</h2>
        </div>
        <div className={classes.product_quality}>
          <h3>Chất lượng sản phẩm</h3>
          <div className={classes.star_container}>
            <div value={1} onClick={onClickStarHandler} className={classes.star}>
              <GrStar className={starValue >= 1 ? classes.star_icon + ' ' + classes.star_icon_fill : classes.star_icon} />
            </div>
            <div value={2} onClick={onClickStarHandler} className={classes.star}>
              <GrStar className={starValue >= 2 ? classes.star_icon + ' ' + classes.star_icon_fill : classes.star_icon} />
            </div>
            <div value={3} onClick={onClickStarHandler} className={classes.star}>
              <GrStar className={starValue >= 3 ? classes.star_icon + ' ' + classes.star_icon_fill : classes.star_icon} />
            </div>
            <div value={4} onClick={onClickStarHandler} className={classes.star}>
              <GrStar className={starValue >= 4 ? classes.star_icon + ' ' + classes.star_icon_fill : classes.star_icon} />
            </div>
            <div value={5} onClick={onClickStarHandler} className={classes.star}>
              <GrStar className={starValue >= 5 ? classes.star_icon + ' ' + classes.star_icon_fill : classes.star_icon} />
            </div>
          </div>
        </div>
        <div className={classes.comment_container}>
          <h3>Hãy để lại ý kiến của bạn</h3>
          <textarea className={classes.comment} value={comment} onChange={onChangeCommentHandler}></textarea>
        </div>
        <div className={classes.btn_container}>
          <button className={classes.btn_cancel} onClick={props.onClose}>Đóng</button>
          <button className={classes.btn_submit} onClick={onSubmitHandler}>{reviewMode ? 'Cập nhật' : 'Gửi đánh giá'}</button>
        </div>
      </div>
    </Backdrop>
  )
}

export default Rate