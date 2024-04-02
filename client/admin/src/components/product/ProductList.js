import React from 'react'

import classes from './ProductList.module.css';
import ProductItem from './ProductItem';
function ProductList(props) {
  // console.log(props.products);
  return (
    <div className={classes.main}>
      <table className={classes.table}>
        <tbody>
          <tr className={classes.titles}>
            <th className={classes.titles_title}>Title</th>
            <th className={classes.titles_material}>Material</th>
            <th className={classes.titles_size}>Size</th>
            <th className={classes.titles_price}>Price</th>
            <th className={classes.titles_decription}>Description</th>
            <th className={classes.titles_action}></th>
          </tr>
          {props.products.map(product => <ProductItem
            key={product._id}
            id={product._id}
            title={product.title}
            image={product.imageUrl}
            parentCatalog={product.parentCatalog}
            childCatalog={product.childCatalog}
            material={product.material}
            size={product.size}
            price={product.price}
            description={product.description} />)
          }
        </tbody>
      </table>
    </div>
  )
}

export default ProductList;