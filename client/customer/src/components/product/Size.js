import React, { useContext, useEffect, useState } from 'react'
import CartContext from '../../context/cart-context';

import classes from './Size.module.css';
import StatusContext from '../../context/status-context';

function Size({ size, product, mode, onClickFromProductDetail, activeElement }) {
  const cartCtx = useContext(CartContext);
  const statusCtx = useContext(StatusContext);

  const [classValue, setClassValue] = useState(classes.size_label);

  useEffect(() => {
    if (size === activeElement) {
      setClassValue(`${classes.size_label} ${classes.activeSize}`);
    } else {
      setClassValue(`${classes.size_label}`);
    }
  }, [activeElement]);
  const addToCartHandler = () => {
    if (mode === 'product_detail') {
      onClickFromProductDetail(size);
    } else {
      cartCtx.addItem({
        id: product._id,
        title: product.title,
        imageUrl: product.imageUrl,
        price: product.price,
        size: size,
        amount: 1
      });
      statusCtx.setValue('success', 'Thêm sản phẩm vào giỏ hàng thành công.')
    }
  }
  return (
    <label className={classValue} onClick={addToCartHandler}>
      <span>
        {size}
      </span>
    </label>
  );
}

export default Size