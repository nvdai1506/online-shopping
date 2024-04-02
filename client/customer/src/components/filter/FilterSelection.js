import React, { useState } from 'react'
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import classes from './FilterSelection.module.css';

function FilterSelection() {
  const navigate = useNavigate();
  const location = useLocation();
  let searchParams = new URLSearchParams(location.search);
  const [search] = useSearchParams();
  const filterValueFromUrl = search.get('filter') ? search.get('filter') : '1';
  const [listClass, setListClass] = useState(classes.list);
  const [filterValue, setFilterValue] = useState(filterValueFromUrl);

  const onClickItemHandler = event => {
    setListClass(classes.list + ' ' + classes.list_disable);
    const details = document.getElementById('filter-selection-nvd');
    details.removeAttribute('open');
    const label = event.target;
    const value = label.getAttribute('for');
    setFilterValue(value);
    searchParams.set('filter', value);
    searchParams.set('page', 1);
    navigate({
      pathname: location.pathname,
      search: searchParams.toString()
    })
  }
  const enableClass = (event) => {
    setListClass(classes.list + ' ' + classes.list_enable);
  }
  return (
    <div className={classes.filter_select_container}>
      <h1>Sản Phẩm</h1>
      <details className={classes["custom-select"]} id='filter-selection-nvd'>
        <summary className={classes.summary} onClick={enableClass}>
          {filterValue === '1' ? 'Mới nhất' :
            filterValue === '2' ? 'Bán chạy' :
              filterValue === '3' ? 'Cao tới thấp' :
                filterValue === '4' ? 'Thấp đến cao' : 'Mới nhất'}
        </summary>
        <ul className={listClass}>
          <li className={classes.list_item} onClick={onClickItemHandler}>
            <label htmlFor="1">
              Mới nhất
            </label>
          </li>
          <li className={classes.list_item} onClick={onClickItemHandler}>

            <label htmlFor="2">Bán chạy</label>
          </li>
          <li className={classes.list_item} onClick={onClickItemHandler}>

            <label htmlFor="3">Giá: cao &rarr; thấp</label>
          </li>
          <li className={classes.list_item} onClick={onClickItemHandler}>

            <label htmlFor="4">Giá: thấp &rarr; cao</label>
          </li>
        </ul>
      </details>
    </div>


  )
}

export default FilterSelection