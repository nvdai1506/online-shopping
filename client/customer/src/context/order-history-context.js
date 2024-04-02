import React, { useState } from 'react';

const OrderHistoryContext = React.createContext({
  changeState: false,
  toggle: () => { },
});


export const OrderHistoryContextProvider = (props) => {
  const [changeState, setChangeState] = useState(false);
  const ChangeStateHandler = () => {
    setChangeState(!changeState);
  };

  const contextValue = {
    changeState: changeState,
    toggle: ChangeStateHandler,
  };

  return (
    <OrderHistoryContext.Provider value={contextValue}>
      {props.children}
    </OrderHistoryContext.Provider>
  );
};


export default OrderHistoryContext;