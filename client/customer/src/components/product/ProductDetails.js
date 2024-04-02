import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { IoStar, IoStarHalf, IoStarOutline } from 'react-icons/io5';
import { BsTelephoneInbound, BsTruck, BsClock } from 'react-icons/bs';

import classes from './ProductDetails.module.css';
import SizeList from './SizeList';

import Api from '../../service/api';
import CartContext from '../../context/cart-context';
import StatusContext from '../../context/status-context';
import RateDetails from './rate/RateDetails';
import LoaddingBackdrop from '../loading/LoadingBackdrop';
function ProductDetails() {
    const location = useLocation();
    const navigate = useNavigate();
    const { productId } = useParams();
    const cartCtx = useContext(CartContext);
    const statusCtx = useContext(StatusContext);
    const [loading, setLoading] = useState(true);
    const [product, setProduct] = useState({});
    const [rateData, setRateData] = useState({});
    const [average, setAverage] = useState(0);
    const [total, setTotal] = useState(0);
    const [amount, setAmount] = useState(1);
    const [currentSize, setcurrentSize] = useState(null);
    const salePrice = product.price - product.price * product.sale / 100;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await Api.shop.getProduct(productId);
                const data = await result.json();
                setProduct(data.product);
                setAverage(data.product.rate.average);
                setTotal(data.product.rate.total);
                const rateId = data.product.rate._id;
                const rate_result = await Api.shop.getRate(rateId);
                const rate_data = await rate_result.json();
                setRateData(rate_data);
                setLoading(false);
            } catch (error) {
                navigate('/error')
            }
        }
        fetchData();
        window.scrollTo(0, 0);
    }, [location.pathname]);

    if (loading) {
        return <LoaddingBackdrop />
    }
    const receiveCurrentSize = size => {
        setcurrentSize(size);
    }
    const onAmountChangeHandler = event => {
        setAmount(event.target.value);
    }
    const onMinus = event => {
        if (amount > 1) {
            setAmount(amount - 1);
        }
    }
    const onPlus = event => {
        setAmount(amount + 1);
    }
    const onClickAddToCart = () => {
        if (currentSize) {
            cartCtx.addItem({
                id: product._id,
                title: product.title,
                imageUrl: product.imageUrl,
                price: product.price,
                size: currentSize,
                amount: Number(amount)
            });
            statusCtx.setValue('success', 'Thêm sản phẩm vào giỏ hàng thành công.')

        } else {
            statusCtx.setValue('info', 'Vui lòng chọn Size trước khi thêm vào giỏ hàng!')
        }
    }

    const first_star = (average < 0.3) ? <IoStarOutline className={classes.star_icon} />
        : average < 0.7 ? <IoStarHalf className={classes.star_icon} />
            : <IoStar className={classes.star_icon} />
    const second_star = (
        (average < 1.3) ? <IoStarOutline className={classes.star_icon} />
            : average < 1.7 ? <IoStarHalf className={classes.star_icon} />
                : <IoStar className={classes.star_icon} />
    );
    const third_star = (
        (average < 2.3) ? <IoStarOutline className={classes.star_icon} />
            : average < 2.7 ? <IoStarHalf className={classes.star_icon} />
                : <IoStar className={classes.star_icon} />
    );
    const fourth_star = (
        (average < 3.3) ? <IoStarOutline className={classes.star_icon} />
            : average < 3.7 ? <IoStarHalf className={classes.star_icon} />
                : <IoStar className={classes.star_icon} />
    );
    const fifth_star = (
        (average < 4.3) ? <IoStarOutline className={classes.star_icon} />
            : average < 4.7 ? <IoStarHalf className={classes.star_icon} />
                : <IoStar className={classes.star_icon} />
    );
    return (
        <>
            <div className={`${classes.product_detail_container}`}>
                <div className={classes.image}>
                    <img crossOrigin='true' src={`${process.env.REACT_APP_DOMAIN}/${product.imageUrl}`} alt={product.title} />
                </div>
                <div className={classes.info}>
                    <h1 className={classes.title}>{product.title}</h1>
                    <div className={classes.evaluation}>

                        {first_star}
                        {second_star}
                        {third_star}
                        {fourth_star}
                        {fifth_star}

                        <span className={classes.number_star}>({total})</span>
                        <span className={classes.product_sold}>Đã bán: {product.totalSoldProducts}</span>
                    </div>
                    <div className={classes.price_box}>
                        {product.sale === 0 &&
                            <ins className={classes.normalPrice}>{product.price.toLocaleString()}đ</ins>
                        }
                        {product.sale !== 0 && <>
                            <ins className={classes.salePrice}>{salePrice.toLocaleString()}đ</ins>
                            <del className={classes.price}>{product.price.toLocaleString()}đ</del>
                            <span className={classes.percent}>-{product.sale}%</span>
                        </>
                        }
                    </div>
                    <>
                        <label className={classes.size_label}>Chọn Kích thước: </label>
                        <div className={classes.size}>
                            <SizeList sizes={product.size} receiveCurrentSize={receiveCurrentSize} />
                        </div>
                    </>
                    <div className={`grid grid--3-cols ${classes.actions}`}>
                        <div className={classes.amount_action}>
                            <span className={classes.minus} onClick={onMinus}>-</span>
                            <input className={classes.amount} type='number' min='1' value={amount} onChange={onAmountChangeHandler} />
                            <span className={classes.plus} onClick={onPlus}>+</span>
                        </div>
                        <button className={classes.add_to_cart} onClick={onClickAddToCart}>Thêm Vào Giỏ Hàng</button>
                    </div>
                    <hr />
                    <div className={`grid grid--3-cols ${classes.services}`}>
                        <div className={classes.service}>
                            <div className={classes.icon}>
                                <BsTruck />
                            </div>
                            <div className={classes.text}>
                                <span>Miễn phí vận chuyển <br />cho đơn hàng trên 300.000đ </span>
                            </div>
                        </div>
                        <div className={classes.service}>
                            <div className={classes.icon}>
                                <BsTelephoneInbound />
                            </div>
                            <div className={classes.text}>
                                <span>Hotline: 1900.10.10.10</span>
                            </div>
                        </div>
                        <div className={classes.service}>
                            <div className={classes.icon}>
                                <BsClock />
                            </div>
                            <div className={classes.text}>
                                <span>Giao hàng nhanh toàn quốc </span>
                            </div>
                        </div>
                    </div>
                    <hr />
                    <div className={classes.description}>
                        <h3 className={classes.hightligh}>Đặc điểm nổi bật </h3>
                        <ul className={classes.hightligh_list}>
                            {product.description && product.description.split('-').map(item => {
                                return (item !== '' ? <li key={product._id + Math.random()}>{item}</li> : '');
                            })}
                        </ul>
                    </div>

                </div>
            </div>
            <hr />
            <RateDetails rateData={rateData.rate} />

        </>
    )
}

export default ProductDetails