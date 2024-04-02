import React, { useState, useCallback, useEffect, useContext } from 'react';
import Api, { setToken } from '../service/api';
import CartContext from './cart-context';
const AuthContext = React.createContext({
  accessToken: '',
  refreshToken: '',
  isLoggedIn: false,
  login: (data) => { },
  logout: () => { },
});


export const AuthContextProvider = (props) => {


  const [accessToken, setAccessToken] = useState(localStorage.getItem('x-access-token'));
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('x-refreshToken'));
  const cartCtx = useContext(CartContext);

  useEffect(() => {
    setToken(accessToken);
  }, [accessToken]);

  const userIsLoggedIn = (!!accessToken);

  const logoutHandler = useCallback(() => {
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem('x-access-token');
    localStorage.removeItem('x-refreshToken');
  }, []);

  const loginHandler = (data) => {
    // console.log(data);
    setAccessToken(data.accessToken);
    setRefreshToken(data.refreshToken);

    // console.log(data.accessToken);
    localStorage.setItem('x-access-token', data.accessToken);
    localStorage.setItem('x-refreshToken', data.refreshToken);
    // send request to get cart of user
    if (userIsLoggedIn) {
      Api.user.getCart()
        .then((result) => {
          return result.json();
        })
        .then(data => {
          const cart = data.cart;
          console.log(cart);
          if (cart.totalPrice === 0) {
            const newFormatItems = cartCtx.items.map(item => {
              return {
                product: item.id,
                amount: item.amount,
                currentSize: item.size
              }
            })
            const newCartFormat = {
              items: newFormatItems,
              totalPrice: cartCtx.totalPrice,
              totalAmount: cartCtx.totalAmount
            };
            Api.user.updateCart({ cart: newCartFormat })
              .then(result => { return result.json(); })
              .then(data => {
                console.log(data);
              })
              .catch(err => { console.log(err); })
          } else {
            const newFormatItems = cart.items.map(item => {
              const p = item.product;
              return {
                id: p._id,
                title: p.title,
                price: p.price,
                imageUrl: p.imageUrl,
                size: item.currentSize,
                amount: item.amount
              }
            })
            // console.log('newFormatItems: ', newFormatItems);
            const newCartFormat = {
              items: newFormatItems,
              totalPrice: cart.totalPrice,
              totalAmount: cart.totalAmount
            };
            cartCtx.initCart({ cart: newCartFormat });
          }
        })
        .catch(err => { console.log(err); })
    }

  };

  const contextValue = {
    accessToken,
    refreshToken,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};


export default AuthContext;