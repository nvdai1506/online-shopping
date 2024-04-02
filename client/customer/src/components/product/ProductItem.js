import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import classes from './ProductItem.module.css';
import Size from './Size';
import { GrStar } from 'react-icons/gr';
function ProductItem({ product }) {
    const { rate } = product;
    const { total, average } = rate;
    const navigate = useNavigate();

    const onClickTextBoxHandler = () => {
        navigate(`/product/${product._id}`);
    }
    const salePrice = product.price - product.price * product.sale / 100;
    return (
        <div className={classes.product_item}>
            <div className={classes.img_box}>
                <Link to={`/product/${product._id}`}>
                    <img crossOrigin='true' src={`${process.env.REACT_APP_DOMAIN}/${product.imageUrl}`} alt={product.title} />
                </Link>
                <div className={classes.size_container}>
                    {product.size.split(' ').map(size => {
                        return <Size key={size} size={size} product={product} />;
                    })}
                </div>
                {total !== 0 &&
                    <div className={classes.evaluation}>
                        <span className={classes.start_number}>
                            {average.toFixed(1)}
                        </span>
                        <GrStar className={classes.start_icon} />
                        <span className={classes.number_evaluation}>({total})</span>
                    </div>
                }
                {product.sale !== 0 &&

                    <div className={classes.sale}>
                        <span className={classes.sale_box}>Sale</span>
                    </div>
                }
            </div>
            <div className={classes.textbox} onClick={onClickTextBoxHandler}>
                <h2 className={classes.title}>{product.title}</h2>
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
            </div>

        </div>
    )
}

export default ProductItem