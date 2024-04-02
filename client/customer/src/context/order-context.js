import React, { useCallback, useState } from 'react';

const OrderContext = React.createContext({
  data: {},
  setData: () => { },
  clearData: () => { }
});

const initialData = {
  percent: 0,
  vnd: 0,
  total: 0
}
export const OrderContextProvider = (props) => {
  const [data, setData] = useState(initialData);

  const DataHandler = useCallback((obj) => {
    setData(obj);
  }, []);
  const ClearDataHandler = () => {
    setData(initialData);
  };
  const contextValue = {
    data: data,
    setData: DataHandler,
    cleaData: ClearDataHandler
  };

  return (
    <OrderContext.Provider value={contextValue}>
      {props.children}
    </OrderContext.Provider>
  );
};


export default OrderContext;