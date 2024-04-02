import React, { useEffect } from 'react';
import { useReducer } from 'react';
import { DBConfig } from '../service/IndexDBConfig';
import { initDB } from 'react-indexed-db';
import { useIndexedDB } from 'react-indexed-db';

import Api from '../service/api';

initDB(DBConfig);



const CartContext = React.createContext({
  items: [],
  totalPrice: 0,
  totalAmount: 0,
  initCart: (cart) => { },
  addItem: (item) => { },
  removeItem: (id, size) => { },
  clearItem: (id, size) => { },
  clearCart: () => { },
  showCart: () => { },
})

const defaultCartState = {
  items: [],//{_id,title,price,amount,size}
  totalPrice: 0,
  totalAmount: 0,
};


const cartReducer = (state, action) => {

  if (action.type === 'INIT') {
    // console.log(action.cart);
    const cart = action.cart.cart;
    return {
      items: cart.items,
      totalPrice: cart.totalPrice,
      totalAmount: cart.totalAmount
    }
  }
  if (action.type === 'ADD') {
    // console.log(action.item.amount);
    const updatedTotalAmount = state.totalAmount + Number(action.item.amount);
    const updatedTotalPrice =
      state.totalPrice + action.item.price * action.item.amount;

    const existingCartItemIndex = state.items.findIndex(
      (item) => {
        return (item.id.toString() === action.item.id.toString() && item.size === action.item.size)
      }
    );
    const existingCartItem = state.items[existingCartItemIndex];
    let updatedItems;

    if (existingCartItem) {
      const updatedItem = {
        ...existingCartItem,
        amount: existingCartItem.amount + action.item.amount,
      };
      updatedItems = [...state.items];
      updatedItems[existingCartItemIndex] = updatedItem;
    } else {
      updatedItems = state.items.concat(action.item);
    }


    return {
      items: updatedItems,
      totalPrice: updatedTotalPrice,
      totalAmount: updatedTotalAmount
    };
  }
  if (action.type === 'REMOVE') {
    const updatedTotalAmount = state.totalAmount - 1;
    const existingCartItemIndex = state.items.findIndex(
      (item) => (item.id.toString() === action.id.toString() && item.size === action.size)
    );
    const existingItem = state.items[existingCartItemIndex];

    const updatedTotalPrice = state.totalPrice - existingItem.price;
    let updatedItems;
    if (existingItem.amount === 1) {
      updatedItems = state.items.filter(item => (item.id !== action.id || item.size === action.size));
    } else {
      const updatedItem = { ...existingItem, amount: existingItem.amount - 1 };
      updatedItems = [...state.items];
      updatedItems[existingCartItemIndex] = updatedItem;
    }
    return {
      items: updatedItems,
      totalPrice: updatedTotalPrice,
      totalAmount: updatedTotalAmount
    };
  }
  if (action.type === 'CLEAR_ITEM') {
    // console.log(state.items);

    const existingCartItemIndex = state.items.findIndex(
      (item) => {
        return (item.id.toString() === action.id.toString() && item.size === action.size)
      }
    );
    const existingItem = state.items[existingCartItemIndex];

    const updatedTotalAmount = state.totalAmount - existingItem.amount;
    const updatedTotalPrice = state.totalPrice - existingItem.amount * existingItem.price;
    const updatedItems = state.items.filter(item => {
      return (item.id !== action.id || item.size !== action.size)
    });
    return {
      items: updatedItems,
      totalPrice: updatedTotalPrice,
      totalAmount: updatedTotalAmount
    };
  }
  if (action.type === 'CLEAR') {
    return defaultCartState;
  }
  if (action.type === 'SHOWCART') {
    const items = state.items;
    const totalPrice = state.totalPrice;
    return {
      items: items,
      totalPrice: totalPrice
    }
  }
  return defaultCartState;
};

export const CartContextProvider = (props) => {
  const [cartState, dispatchCartAction] = useReducer(
    cartReducer,
    defaultCartState
  );
  const { clear, update } = useIndexedDB('cart');

  useEffect(() => {
    // console.log(cartState);
    if (cartState !== defaultCartState) {
      clear().then(() => {

        update({ cart: cartState }).then(() => {
          // console.log(cartState);
          const newFormatItems = cartState.items.map(item => {
            return {
              product: item.id,
              amount: item.amount,
              currentSize: item.size,
            }
          })
          const newCartFormat = {
            items: newFormatItems,
            totalPrice: cartState.totalPrice,
            totalAmount: cartState.totalAmount
          };
          Api.user.updateCart({ cart: newCartFormat })
            .then(result => {
              // console.log(result);
              return result.json();
            })
            .then(data => {
              // console.log('data');
              // navigate('/error');
            })
            .catch(err => { })
        })
      })
    } else {
      clear().then(() => {
        Api.user.updateCart({ cart: {} })
          .then(result => { return result.json(); })
          .then(data => {
            // console.log(data);
          })
          .catch(err => {
            // navigate('/error');
          })
      })
    }
  }, [cartState]);
  const initCartHandler = (cart) => {
    dispatchCartAction({ type: 'INIT', cart: cart });
  }
  const addItemToCartHandler = (item) => {
    dispatchCartAction({ type: 'ADD', item: item });
  };

  const removeItemFromCartHandler = (id, size) => {
    dispatchCartAction({ type: 'REMOVE', id: id, size: size });
  };

  const clearItemHandler = (id, size) => {
    dispatchCartAction({ type: 'CLEAR_ITEM', id: id, size: size })
  };

  const clearCartHandler = () => {
    dispatchCartAction({ type: 'CLEAR' })
  };

  const showCart = () => {
    dispatchCartAction({ type: 'SHOWCART' })
  }

  const cartContext = {
    items: cartState.items,
    totalPrice: cartState.totalPrice,
    totalAmount: cartState.totalAmount,
    cartIsShown: cartState.cartIsShown,
    initCart: initCartHandler,
    addItem: addItemToCartHandler,
    removeItem: removeItemFromCartHandler,
    clearItem: clearItemHandler,
    clearCart: clearCartHandler,
    showCart: showCart
  };

  return (
    <CartContext.Provider value={cartContext}>
      {props.children}
    </CartContext.Provider>
  );
};

export default CartContext;