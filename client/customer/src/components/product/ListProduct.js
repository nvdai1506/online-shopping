import React from 'react'
import classes from './ListProduct.module.css';
import ProductItem from './ProductItem';

function ListProduct({ listProduct, numCols }) {
    // console.log(listProduct);
    return (
        <div className={`grid grid--${numCols}-cols grid--big-gap ${classes.list_product}`}>
            {listProduct && listProduct?.map(p => <ProductItem key={p._id + '-' + Math.floor(Math.random() * 10000)} product={p} />)}
        </div>
    )
}

export default ListProduct