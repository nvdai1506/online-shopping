import React, { useEffect, useState } from 'react'
import Size from './Size';

function SizeList({ sizes, receiveCurrentSize }) {
  const sizesList = sizes.split(' ');
  const [currentSize, setcurrentSize] = useState('');

  const onClickSizeHandler = size => {
    setcurrentSize(size);
    receiveCurrentSize(size);
  }

  useEffect(() => {
  }, [currentSize]);
  return (
    <>
      {sizesList.map(size => {
        return <Size key={size} size={size}
          onClickFromProductDetail={onClickSizeHandler}
          mode='product_detail'
          activeElement={currentSize}
        />;
      })}
    </>
  )
}

export default SizeList