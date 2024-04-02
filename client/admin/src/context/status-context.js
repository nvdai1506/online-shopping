import React, { useState } from 'react';

const StatusContext = React.createContext({
  state: '',
  mess: '',
  click: false,
  setValue: (state, mess) => { },
  clear: () => { },
});


export const StatusContextProvider = (props) => {

  // console.log('statte');
  const [state, setState] = useState('');
  const [mess, setMess] = useState('');
  const [click, setClick] = useState(false);
  const clear = () => {
    setState('');
    setMess('');
  }
  const setValue = (state, mess) => {
    setClick(!click);
    setState(state);
    setMess(mess);
  };

  const contextValue = {
    state: state,
    mess: mess,
    click: click,
    clear: clear,
    setValue: setValue
  };

  return (
    <StatusContext.Provider value={contextValue}>
      {props.children}
    </StatusContext.Provider>
  );
};


export default StatusContext;