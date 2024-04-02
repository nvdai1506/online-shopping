import React, { useState, useCallback, useContext } from 'react'
import { useLocation } from 'react-router-dom';
import classes from './Dashboard.module.css';
import OverviewChart from './OverviewChart';
import LeftMenu from './LeftMenu';
import DetailsChart from './DetailsChart';
import HistoryChart from './HistoryChart';


import AddAccount from './AddAccount';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


import AuthContext from '../../context/auth-context';

function Dashboard() {
  // console.log('dashboard');
  let location = useLocation();
  const authCtx = useContext(AuthContext);
  // console.log(authCtx.role);
  const path = location.pathname;

  const [dateRange, setDateRange] = useState([new Date(), new Date()]);
  const [startDate, endDate] = dateRange;

  const onChangeHandler = useCallback(update => {
    setDateRange(update);
  }, []);


  return (
    <div className={classes.main}>
      <div className={classes.menu}>
        <LeftMenu role={authCtx.role} />
      </div>
      <div className={classes.overview}>
        <div className={classes.datePicker}>
          {path !== '/history' &&
            <DatePicker
              className={classes.datePicker_input}
              selectsRange={true}
              startDate={startDate}
              endDate={endDate}
              onChange={onChangeHandler}
            />}
        </div>
        <div className={classes.chart}>
          {(path === '/account' && Number(authCtx.role) === 1) && <AddAccount />}
          {path === '/details' && <DetailsChart date={dateRange} />}
          {path === '/history' && <HistoryChart />}
          {(path === '/dashboard' || path === '/') && <OverviewChart date={dateRange} />}
        </div>
      </div>
    </div>
  )
}

export default React.memo(Dashboard);