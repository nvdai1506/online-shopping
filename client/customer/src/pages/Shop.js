import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';

import Api from '../service/api';
import ListProduct from '../components/product/ListProduct';
import classes from './Shop.module.css';
import Filter from '../components/filter/Filter';
import Pagination from '../components/pagination/Pagination';
import FilterSelection from '../components/filter/FilterSelection';

const PageSize = 15;
function Shop({ endpoint, title }) {
  const [search] = useSearchParams();
  const filterValue = search.get('filter') ? search.get('filter') : '1';
  const pageValue = search.get('page') ? search.get('page') : '1';

  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPageData, setCurrentPageData] = useState([]);
  useEffect(() => {
    // console.log('get data');
    Api.shop.getProductByType(endpoint)
      .then(result => { return result.json() })
      .then(data => {
        setProducts(data.product);
        // console.log(data.product);
      })
      .catch(err => {
        navigate('/error');
      })

    window.scrollTo(0, 0);
  }, [endpoint]);

  useEffect(() => {
    window.scrollTo(0, 0);
    switch (filterValue) {
      case '1':
        setFilteredProducts(products);
        break;
      case '2':
        setFilteredProducts([...products].sort((a, b) => ((b.totalSoldProducts ? b.totalSoldProducts : 0) - (a.totalSoldProducts ? a.totalSoldProducts : 0))));
        break;
      case '3':
        setFilteredProducts([...products].sort((a, b) => (b.price - a.price)));
        break;
      case '4':
        setFilteredProducts([...products].sort((a, b) => (a.price - b.price)));
        break;
      default:
        setFilteredProducts(products);
        break;
    }

  }, [products, filterValue]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const firstPageIndex = (pageValue - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    setCurrentPageData(filteredProducts.slice(firstPageIndex, lastPageIndex));
  }, [pageValue, filteredProducts]);

  return (
    <div className={classes.shop}>
      <Filter />
      <FilterSelection />
      <hr />
      <h1 className={classes.title}>{title}</h1>
      {currentPageData.length === 0 && <div className={classes.no_product_container}><p className={classes.no_product}>Mặt hàng chưa được bày bán...</p></div>}
      <ListProduct listProduct={currentPageData} numCols={5} />
      <div className={classes.pagination}>

        <Pagination
          currentPage={pageValue}
          totalCount={filteredProducts.length}
          pageSize={PageSize}
        />
      </div>
    </div>
  )
}

export default React.memo(Shop)