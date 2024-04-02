import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { usePagination, DOTS } from '../../hooks/usePagination';
import classes from './Pagination.module.css';

export const Pagination = (props) => {
  const {
    totalCount,
    siblingCount = 1,
    currentPage,
    pageSize
  } = props;
  const location = useLocation();
  const navigate = useNavigate();
  let searchParams = new URLSearchParams(location.search);



  const [newestCurrentPage, setNewestCurrentPage] = useState(currentPage);
  useEffect(() => {
    // console.log('currentpage in pagination: ', currentPage);
    setNewestCurrentPage(currentPage);
  }, [currentPage]);

  const paginationRange = usePagination({
    newestCurrentPage,
    totalCount,
    siblingCount,
    pageSize
  });

  // If there are less than 2 times in pagination range we shall not render the component
  if (newestCurrentPage === 0 || paginationRange.length < 2) {
    return null;
  }

  const onNext = () => {
    searchParams.set('page', newestCurrentPage + 1);
    navigate({
      pathname: location.pathname,
      search: searchParams.toString()
    })
  };

  const onPrevious = () => {
    searchParams.set('page', newestCurrentPage - 1);
    navigate({
      pathname: location.pathname,
      search: searchParams.toString()
    })
  };
  const onClickPage = (event) => {
    const pageNumber = event.target.value;
    searchParams.set('page', pageNumber);
    navigate({
      pathname: location.pathname,
      search: searchParams.toString()
    })
  }
  // console.log('newestCurrentPage: ', newestCurrentPage);

  let lastPage = paginationRange[paginationRange.length - 1];
  return (
    <ul
      className={classes['pagination-container']}
    >
      {/* Left navigation arrow */}
      <li
        className={Number(newestCurrentPage) === 1 ? `${classes['pagination-item']} ${classes.disabled}` : classes['pagination-item']}
        onClick={onPrevious}
      >
        <div className={`${classes.arrow} ${classes.arrow_left}`} />
      </li>
      {
        paginationRange.map(pageNumber => {

          // If the pageItem is a DOT, render the DOTS unicode character
          if (pageNumber.toString() === DOTS) {
            return <li className={classes["pagination-item dots"]}>&#8230;</li>;
          }

          // Render our Page Pills
          return (
            <li key={pageNumber}
              className={pageNumber.toString() === newestCurrentPage.toString() ? `${classes['pagination-item']}  ${classes.selected}` : `${classes['pagination-item']}`}
              value={pageNumber}
              onClick={onClickPage}
            >
              {pageNumber}
            </li>
          );
        })
      }
      {/*  Right Navigation arrow */}
      <li
        className={newestCurrentPage.toString() === lastPage.toString() ? `${classes['pagination-item']} ${classes['disabled']}` : classes['pagination-item']}
        onClick={onNext}
      >
        <div className={`${classes.arrow} ${classes.arrow_right}`} />
      </li>
    </ul >
  );
}
export default Pagination