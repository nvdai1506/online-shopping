import React, { useEffect, useState } from 'react'
import { HiOutlineSearch } from 'react-icons/hi';
import { AiOutlineClose } from 'react-icons/ai';
import Api from '../../../service/api';

import classes from './Search.module.css';
import { useNavigate } from 'react-router-dom';
import SearchItem from '../search/SearchItem';
function Search() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [classValue, setClassValue] = useState(classes.search_container)
  const [productClass, setProductClass] = useState(classes.products_container)

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [inputValue, setInputValue] = useState('');

  const onSearchHanlder = event => {
    setIsOpen(true);
  };
  const onCloseSearch = event => {
    setIsOpen(false);
    setInputValue('');
    setProductClass(classes.products_container);
  };
  useEffect(() => {
    const classValue1 = isOpen ? `${classes.search_container} ${classes.search_container_enable}` : `${classes.search_container}`;
    setClassValue(classValue1);

    if (isOpen) {

      Api.shop.getProducts()
        .then(result => { return result.json() })
        .then(data => {
          setProducts(data.products);
        })
        .catch(err => {
          navigate('/error');
        })
    }
  }, [isOpen]);

  const inputChangeHandler = event => {
    setInputValue(event.target.value);
  }
  useEffect(() => {
    if (inputValue !== '') {
      // const classValue2 = isOpen ? `${classes.products_container} ${classes.products_container_enable}` : `${classes.products_container}`;
      setProductClass(`${classes.products_container} ${classes.products_container_enable}`);
      setFilteredProducts(products.filter(product => product.title.toLowerCase().includes(inputValue.toLowerCase())));
    }
  }, [inputValue]);
  return (
    <>
      <div className={`action_item`} onClick={onSearchHanlder} >
        <HiOutlineSearch className='icon' />
      </div>
      <div className={`box-center ${classValue}`}>
        <form className={classes.search_form}>
          <input className={classes.form_input} type='text'
            placeholder='Nhập Sản Phẩm Cần Tìm...'
            value={inputValue}
            onChange={inputChangeHandler}
          />
          <div className={productClass}>
            {
              filteredProducts.slice(0, 5).map(product => {
                return <SearchItem
                  key={`${product._id}`} imageUrl={product.imageUrl} id={product._id}
                  title={product.title} price={product.price}
                  onCloseSearch={onCloseSearch}
                />
              })
            }
          </div>
        </form>
        <AiOutlineClose className={classes.close_icon} onClick={onCloseSearch} />
      </div>
    </>
  )
}

export default Search