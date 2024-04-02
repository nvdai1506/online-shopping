import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';

import classes from './Home.module.css';
import Api from '../service/api';
import ListProduct from '../components/product/ListProduct';

function Home() {
  const [clothes, setClothes] = useState([]);
  const [pants, setPants] = useState([]);
  useEffect(() => {
    const getData = async (value) => {
      const result = await Api.shop.getFeaturedProducts(`${value}`);
      const data = await result.json();
      // console.log(data);
      const products = data?.products[0]?.featuredProducts;
      // console.log(products);
      if (products?.length < 8) {
        const result2 = await Api.shop.getProductByType(`${value}?level=1`)
        const data2 = await result2.json();
        for (const e of data2.product) {
          if (e.featuredProduct === 0) {
            products.push(e);
            if (products?.length >= 8) {
              break;
            }
          }
        }
      }
      if (value === 'ao') {

        setClothes(products);
      } else {
        setPants(products);

      }
    }
    getData('ao');
    getData('quan');

  }, []);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [])
  return (
    <div className={classes.home_container}>
      <div className={classes.container}>
        <h1 className={classes.title}>Áo</h1>
        <hr className={classes.seperate} />

        <ListProduct listProduct={clothes} numCols={4} />
        <Link to='/shop/ao' className={classes.more}>Xem thêm sản phẩm</Link>

      </div>
      <div className={classes.container}>
        <h1 className={classes.title}>Quần</h1>
        <hr className={classes.seperate} />

        <ListProduct listProduct={pants} numCols={4} />
        <Link to='/shop/quan' className={classes.more}>Xem thêm sản phẩm</Link>
      </div>
    </div>
  )
}

export default Home