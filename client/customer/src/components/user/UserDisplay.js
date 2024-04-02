import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import classes from './UserDisplay.module.css';
import Profile from './profile/Profile';
import Password from './password/Password';
import OrderHistory from './order/OrderHistory';
import { OrderHistoryContextProvider } from '../../context/order-history-context';

function UserDisplay() {
  const location = useLocation();
  const navigate = useNavigate();

  const [componentToRender, setComponentToRender] = useState(<Profile />);

  useEffect(() => {
    // console.log(location.pathname);
    switch (location.pathname) {
      case '/user/':
        setComponentToRender(<Profile />);
        break;
      case '/user/profile':
        setComponentToRender(<Profile />);
        break;
      case '/user/password':
        setComponentToRender(<Password />);
        break;
      case '/user/order-history':
        setComponentToRender(
          <OrderHistoryContextProvider>
            <OrderHistory />
          </OrderHistoryContextProvider>
        );
        break;
      default:
        navigate('/error');
        break
    }
  }, [location.pathname]);



  return (
    <div className={classes.display_container}>
      {componentToRender}
    </div>
  )
}

export default UserDisplay